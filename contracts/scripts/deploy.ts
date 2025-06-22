import { writeFileSync } from 'fs';
import { ethers } from 'hardhat';
import { join } from 'path';

async function main() {
    const [deployer] = await ethers.getSigners();
    const network = await ethers.provider.getNetwork();

    console.log(`Deploying contracts on network: ${network.name} (${network.chainId})`);
    console.log(`Deploying with account: ${deployer.address}`);
    console.log(
        `Account balance: ${ethers.formatEther(await deployer.provider.getBalance(deployer.address))} ETH`,
    );

    // Deploy TouriiDigitalPassport
    console.log('\n🚀 Deploying TouriiDigitalPassport...');
    const TouriiDigitalPassport = await ethers.getContractFactory('TouriiDigitalPassport');

    // Configure base URI for metadata (should point to your backend API)
    const baseURI =
        process.env.PASSPORT_METADATA_BASE_URI || 'https://api.tourii.com/api/passport/metadata/';
    console.log(`Using base URI: ${baseURI}`);

    const digitalPassport = await TouriiDigitalPassport.deploy(baseURI);
    await digitalPassport.waitForDeployment();
    console.log(`✅ TouriiDigitalPassport deployed to: ${await digitalPassport.getAddress()}`);

    // Deploy TouriiPerk (Goshuin NFT)
    console.log('\n🚀 Deploying TouriiPerk...');
    const TouriiPerk = await ethers.getContractFactory('TouriiPerk');
    const perk = await TouriiPerk.deploy('Tourii Goshuin Collection', 'GOSHUIN');
    await perk.waitForDeployment();
    console.log(`✅ TouriiPerk deployed to: ${await perk.getAddress()}`);

    // Deploy TouriiLog
    console.log('\n🚀 Deploying TouriiLog...');
    const TouriiLog = await ethers.getContractFactory('TouriiLog');
    const log = await TouriiLog.deploy();
    await log.waitForDeployment();
    console.log(`✅ TouriiLog deployed to: ${await log.getAddress()}`);

    // Prepare deployment info
    const deploymentInfo = {
        network: network.name,
        chainId: Number(network.chainId),
        deployer: deployer.address,
        contracts: {
            TouriiDigitalPassport: await digitalPassport.getAddress(),
            TouriiPerk: await perk.getAddress(),
            TouriiLog: await log.getAddress(),
        },
        deploymentTimestamp: new Date().toISOString(),
        blockNumber: await ethers.provider.getBlockNumber(),
        passportBaseURI: baseURI,
    };

    // Save deployment info
    const deploymentPath = join(
        __dirname,
        '..',
        'deployments',
        `${network.name}-${network.chainId}.json`,
    );
    writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));

    console.log('\n📋 Deployment Summary:');
    console.log(`Network: ${deploymentInfo.network} (${deploymentInfo.chainId})`);
    console.log(`Deployer: ${deploymentInfo.deployer}`);
    console.log(`TouriiDigitalPassport: ${deploymentInfo.contracts.TouriiDigitalPassport}`);
    console.log(`TouriiPerk: ${deploymentInfo.contracts.TouriiPerk}`);
    console.log(`TouriiLog: ${deploymentInfo.contracts.TouriiLog}`);
    console.log(`Deployment info saved to: ${deploymentPath}`);

    // Verify contracts on supported networks
    if (network.chainId !== 31337n) {
        // Not hardhat local
        console.log('\n🔍 Verification commands:');
        console.log(
            `npx hardhat verify --network ${network.name} ${deploymentInfo.contracts.TouriiDigitalPassport} "${baseURI}"`,
        );
        console.log(
            `npx hardhat verify --network ${network.name} ${deploymentInfo.contracts.TouriiPerk} "Tourii Goshuin Collection" "GOSHUIN"`,
        );
        console.log(
            `npx hardhat verify --network ${network.name} ${deploymentInfo.contracts.TouriiLog}`,
        );
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
