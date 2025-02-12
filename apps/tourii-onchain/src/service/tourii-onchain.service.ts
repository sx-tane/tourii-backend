import { EncryptionRepository } from '@app/core/domain/auth/encryption.repository';
import { JwtRepository } from '@app/core/domain/auth/jwt.repository';
import { SailsCallsRepository } from '@app/core/domain/vara/sails/sails-calls-repository';
import {
  INITIAL_BLOCKS_FOR_VOUCHER,
  INITIAL_VOUCHER_TOKENS,
  VOUCHER_EXPIRATION_BLOCKS,
} from '@app/core/domain/vara/vara-contract-constant';
import { TouriiBackendAppErrorType } from '@app/core/support/exception/tourii-backend-app-error-type';
import { TouriiBackendAppException } from '@app/core/support/exception/tourii-backend-app-exception';
import type { HexString } from '@gear-js/api/types';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { KeyringPair$Json } from '@polkadot/keyring/types';
import { SailsCalls } from 'sailscalls';
import { TouriiOnchainConstants } from '../tourii-onchain.constant';
import { JWTData } from './dto/jwt-dto';

@Injectable()
export class TouriiOnchainService {
  constructor(
    @Inject(TouriiOnchainConstants.SAILS_CALLS_REPOSITORY_TOKEN)
    private readonly sailsCallsRepository: SailsCallsRepository,
    @Inject(TouriiOnchainConstants.JWT_REPOSITORY_TOKEN)
    private readonly jwtRepository: JwtRepository,
    @Inject(TouriiOnchainConstants.ENCRYPTION_REPOSITORY_TOKEN)
    private readonly encryptionRepository: EncryptionRepository,
  ) {}

  private async initSailsCalls() {
    const sailsCalls = await this.sailsCallsRepository.initSailsCalls();
    if (!sailsCalls) {
      throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_003);
    }
    return sailsCalls;
  }

  private async getUserDataFromToken(token: string): Promise<JWTData> {
    return this.jwtRepository.dataFromToken(token);
  }

  private async encryptString(data: string): Promise<string> {
    return this.encryptionRepository.encryptString(data);
  }

  private async handleVoucherBalance(
    sailsCalls: SailsCalls,
    userData: JWTData,
  ) {
    try {
      const voucherBalance = await sailsCalls.voucherBalance(
        userData.keyringVoucherId,
      );
      if (voucherBalance < 1) {
        await sailsCalls.addTokensToVoucher({
          userAddress: userData.keyringAddress,
          voucherId: userData.keyringVoucherId,
          numOfTokens: 1,
        });
      }
    } catch (error) {
      Logger.log(`Error while adding tokens to voucher ${error}`);
      throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_008);
    }
  }

  private async handleVoucherExpiration(
    sailsCalls: SailsCalls,
    userData: JWTData,
  ) {
    try {
      const voucherIsExpired = await sailsCalls.voucherIsExpired(
        userData.keyringAddress,
        userData.keyringVoucherId,
      );
      if (voucherIsExpired) {
        await sailsCalls.renewVoucherAmountOfBlocks({
          userAddress: userData.keyringAddress,
          voucherId: userData.keyringVoucherId,
          numOfBlocks: VOUCHER_EXPIRATION_BLOCKS,
        });
      }
    } catch (error) {
      Logger.log(`Error while renewing voucher: ${JSON.stringify(error)}`);
      throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_009);
    }
  }

  private async unlockKeyringData(sailsCalls: SailsCalls, userData: JWTData) {
    return sailsCalls.unlockKeyringPair(
      userData.lockedKeyringData,
      userData.password,
    );
  }

  async userKeyringAddress(token: string) {
    const sailsCalls = await this.initSailsCalls();
    const data: JWTData = await this.getUserDataFromToken(token);
    const hashedUsername = await this.encryptString(data.username);
    const userKeyringAddress = await this.sailsCallsRepository.sailsCallsQuery(
      sailsCalls,
      {
        serviceName: 'Keyring',
        methodName: 'KeyringAddressFromUserCodedName',
        callArguments: [hashedUsername],
      },
    );
    return userKeyringAddress;
  }

  async loginUser(username: string, password: string) {
    const sailsCalls = await this.initSailsCalls();
    const hashedUsername = await this.encryptString(username);
    const hashedPassword = await this.encryptString(password);
    const userKeyringAddress = await this.sailsCallsRepository.sailsCallsQuery(
      sailsCalls,
      {
        serviceName: 'Keyring',
        methodName: 'KeyringAddressFromUserCodedName',
        callArguments: [hashedUsername],
      },
    );

    if (!userKeyringAddress) {
      throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_004);
    }

    let lockedKeyringData: KeyringPair$Json;
    try {
      lockedKeyringData = sailsCalls.formatContractSignlessData(
        await this.sailsCallsRepository.sailsCallsQuery(sailsCalls, {
          serviceName: 'Keyring',
          methodName: 'KeyringAccountData',
          callArguments: [userKeyringAddress],
        }),
        username,
      );
      sailsCalls.unlockKeyringPair(lockedKeyringData, hashedPassword);
    } catch (_error) {
      throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_005);
    }

    const vouchersId = await sailsCalls.vouchersInContract(userKeyringAddress);
    const token = this.jwtRepository.generateJwtToken(
      {
        username,
        keyringAddress: userKeyringAddress,
        keyringVoucherId: vouchersId[0],
        lockedKeyringData,
        password: hashedPassword,
      },
      { expiresIn: '1h' },
    );

    return token;
  }

  async registerUser(username: string, password: string) {
    const sailsCalls = await this.initSailsCalls();
    const hashedUsername = await this.encryptString(username);
    const hashedPassword = await this.encryptString(password);
    const userKeyringAddress = await this.sailsCallsRepository.sailsCallsQuery(
      sailsCalls,
      {
        serviceName: 'Keyring',
        methodName: 'KeyringAddressFromUserCodedName',
        callArguments: [hashedUsername],
      },
    );

    if (userKeyringAddress) {
      throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_006);
    }

    const newKeyringPair = await sailsCalls.createNewKeyringPair(username);
    const lockedSignlessAccount = await sailsCalls.lockkeyringPair(
      newKeyringPair,
      hashedPassword,
    );
    const formatedLockedSignlessAccount = sailsCalls.modifyPairToContract(
      lockedSignlessAccount,
    );

    let keyringVoucherId: HexString;
    try {
      keyringVoucherId = await sailsCalls.createVoucher({
        userAddress: this.encryptionRepository.decodeAddress(
          newKeyringPair.address,
        ),
        initialExpiredTimeInBlocks: INITIAL_BLOCKS_FOR_VOUCHER,
        initialTokensInVoucher: INITIAL_VOUCHER_TOKENS,
        callbacks: {
          onLoad() {
            Logger.log('Issue voucher to signless account...');
          },
          onSuccess() {
            Logger.log('Voucher created for signless account!');
          },
          onError() {
            Logger.log('Error while issue voucher to signless');
          },
        },
      });
    } catch (e) {
      Logger.log('Error while issue a voucher to a singless account!');
      Logger.log(e);
      throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_007);
    }

    await this.sailsCallsRepository.sailsCallsCommand(sailsCalls, {
      signerData: newKeyringPair,
      voucherId: keyringVoucherId,
      serviceName: 'Keyring',
      methodName: 'BindKeyringDataToUserCodedName',
      callArguments: [hashedUsername, formatedLockedSignlessAccount],
    });

    const token = this.jwtRepository.generateJwtToken(
      {
        username,
        keyringAddress: this.encryptionRepository.decodeAddress(
          newKeyringPair.address,
        ),
        keyringVoucherId,
        lockedKeyringData: lockedSignlessAccount,
        password: hashedPassword,
      },
      { expiresIn: '1h' },
    );

    return token;
  }

  async sendGreen(token: string) {
    const sailsCalls = await this.initSailsCalls();
    const userData: JWTData = await this.getUserDataFromToken(token);

    await this.handleVoucherBalance(sailsCalls, userData);
    await this.handleVoucherExpiration(sailsCalls, userData);

    const unlockKeyringData = await this.unlockKeyringData(
      sailsCalls,
      userData,
    );

    const response = await this.sailsCallsRepository.sailsCallsCommand(
      sailsCalls,
      {
        signerData: unlockKeyringData,
        voucherId: userData.keyringVoucherId,
        serviceName: 'TrafficLight',
        methodName: 'Green',
        callArguments: [await this.encryptString(userData.username)],
      },
    );

    return response;
  }

  async sendYellow(token: string) {
    const sailsCalls = await this.initSailsCalls();
    const userData: JWTData = await this.getUserDataFromToken(token);

    await this.handleVoucherBalance(sailsCalls, userData);
    await this.handleVoucherExpiration(sailsCalls, userData);

    const unlockKeyringData = await this.unlockKeyringData(
      sailsCalls,
      userData,
    );

    const response = await this.sailsCallsRepository.sailsCallsCommand(
      sailsCalls,
      {
        signerData: unlockKeyringData,
        voucherId: userData.keyringVoucherId,
        serviceName: 'TrafficLight',
        methodName: 'Yellow',
        callArguments: [await this.encryptString(userData.username)],
      },
    );

    return response;
  }

  async sendRed(token: string) {
    const sailsCalls = await this.initSailsCalls();
    const userData: JWTData = await this.getUserDataFromToken(token);

    await this.handleVoucherBalance(sailsCalls, userData);
    await this.handleVoucherExpiration(sailsCalls, userData);

    const unlockKeyringData = await this.unlockKeyringData(
      sailsCalls,
      userData,
    );

    const response = await this.sailsCallsRepository.sailsCallsCommand(
      sailsCalls,
      {
        signerData: unlockKeyringData,
        voucherId: userData.keyringVoucherId,
        serviceName: 'TrafficLight',
        methodName: 'Red',
        callArguments: [await this.encryptString(userData.username)],
      },
    );

    return response;
  }

  async readState() {
    const sailsCalls = await this.initSailsCalls();

    const response = await this.sailsCallsRepository.sailsCallsQuery(
      sailsCalls,
      {
        serviceName: 'TrafficLight',
        methodName: 'TrafficLight',
      },
    );
    return response;
  }
}
