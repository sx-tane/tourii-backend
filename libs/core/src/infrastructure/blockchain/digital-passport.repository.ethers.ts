import { DigitalPassportRepository } from '@app/core/domain/passport/digital-passport.repository';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

@Injectable()
export class DigitalPassportRepositoryEthers implements DigitalPassportRepository {
    private readonly logger = new Logger(DigitalPassportRepositoryEthers.name);
    private readonly passportContract: ethers.Contract;
    private readonly wallet: ethers.Wallet;
    private readonly provider: ethers.JsonRpcProvider;

    constructor(private readonly configService: ConfigService) {
        const rpcUrl = this.configService.get<string>('RPC_URL');
        const privateKey = this.configService.get<string>('RELAYER_PRIVATE_KEY');
        const contractAddress = this.configService.get<string>('CONTRACT_ADDRESS');
        if (!rpcUrl || !privateKey || !contractAddress) {
            throw new Error('Missing blockchain configuration');
        }
        this.provider = new ethers.JsonRpcProvider(rpcUrl);
        this.wallet = new ethers.Wallet(privateKey, this.provider);
        this.passportContract = new ethers.Contract(
            contractAddress,
            [
                'function mint(address to, string uri) external returns (uint256)',
                'function nextTokenId() view returns (uint256)',
            ],
            this.wallet,
        );
    }

    async mint(to: string, metadataUrl: string): Promise<{ tokenId: string; txHash: string }> {
        const estimatedGas = await this.passportContract.estimateGas.mint(to, metadataUrl);
        const gasPrice = await this.provider.getGasPrice();
        const estimatedGasCost = estimatedGas.mul(gasPrice);
        const balance = await this.wallet.getBalance();

        if (balance.lt(estimatedGasCost)) {
            throw new Error('Relayer wallet does not have enough ETH to mint passport.');
        }

        const tx = await this.passportContract.mint(to, metadataUrl, {
            gasLimit: estimatedGas.mul(120).div(100),
            gasPrice,
        });
        this.logger.log(`Minting digital passport tx: ${tx.hash}`);
        const receipt = await tx.wait();
        this.logger.log(`Mint confirmed in block ${receipt.blockNumber}`);

        const event = receipt.events?.find((e: any) => e.event === 'PassportMinted');
        const tokenId = event?.args?.tokenId?.toString() ?? '0';
        return { tokenId, txHash: tx.hash };
    }

    async getNextTokenId(): Promise<string> {
        const next: ethers.BigNumberish = await this.passportContract.nextTokenId();
        return next.toString();
    }
}
