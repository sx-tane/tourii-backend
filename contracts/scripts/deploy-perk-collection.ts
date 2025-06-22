import { existsSync, readFileSync, writeFileSync } from 'fs';
import { ethers } from 'hardhat';
import { join } from 'path';

async function main() {
    const args = process.argv.slice(2);

    if (args.length < 2) {
        console.log(
            'Usage: npx hardhat run scripts/deploy-perk-collection.ts --network <network> -- <name> <symbol> [category] [maxSupply]',
        );
        console.log(
            "Example: npx hardhat run scripts/deploy-perk-collection.ts --network soneiumTestnet -- 'Harajiri Falls Collection' 'HARAJIRI' 'waterfalls' 1000",
        );
        process.exit(1);
    }

    const [name, symbol, category = '', maxSupplyStr = '0'] = args;
    const maxSupply = parseInt(maxSupplyStr);

    const [deployer] = await ethers.getSigners();
    const network = await ethers.provider.getNetwork();

    console.log(
        `\n🚀 Deploying new TouriiPerk collection on network: ${network.name} (${network.chainId})`,
    );
    console.log(`Collection Name: ${name}`);
    console.log(`Collection Symbol: ${symbol}`);
    console.log(`Category: ${category || 'Not specified'}`);
    console.log(`Max Supply: ${maxSupply === 0 ? 'Unlimited' : maxSupply}`);
    console.log(`Deploying with account: ${deployer.address}`);

    // Deploy TouriiPerk collection
    const TouriiPerk = await ethers.getContractFactory('TouriiPerk');
    const perk = await TouriiPerk.deploy(name, symbol);
    await perk.waitForDeployment();

    const perkAddress = await perk.getAddress();
    console.log(`✅ TouriiPerk collection deployed to: ${perkAddress}`);

    // Set category and max supply if provided
    if (category) {
        console.log(`🏷️  Setting perk category to: ${category}`);
        const setCategoryTx = await perk.setPerkCategory(category);
        await setCategoryTx.wait();
        console.log(`✅ Category set successfully`);
    }

    if (maxSupply > 0) {
        console.log(`📊 Setting max supply to: ${maxSupply}`);
        const setMaxSupplyTx = await perk.setMaxSupply(maxSupply);
        await setMaxSupplyTx.wait();
        console.log(`✅ Max supply set successfully`);
    }

    // Load existing deployments or create new
    const deploymentsPath = join(
        __dirname,
        '..',
        'deployments',
        `${network.name}-${network.chainId}.json`,
    );
    let deploymentInfo: any = {};

    if (existsSync(deploymentsPath)) {
        deploymentInfo = JSON.parse(readFileSync(deploymentsPath, 'utf8'));
    } else {
        deploymentInfo = {
            network: network.name,
            chainId: Number(network.chainId),
            deployer: deployer.address,
            contracts: {},
            perkCollections: {},
            deploymentTimestamp: new Date().toISOString(),
        };
    }

    // Add perk collection to deployments
    const collectionKey = symbol.toLowerCase();
    deploymentInfo.perkCollections = deploymentInfo.perkCollections || {};
    deploymentInfo.perkCollections[collectionKey] = {
        name,
        symbol,
        address: perkAddress,
        category,
        maxSupply,
        deployedAt: new Date().toISOString(),
    };

    // Save updated deployment info
    writeFileSync(deploymentsPath, JSON.stringify(deploymentInfo, null, 2));

    console.log('\n📋 Collection Deployment Summary:');
    console.log(`Network: ${network.name} (${network.chainId})`);
    console.log(`Collection: ${name} (${symbol})`);
    console.log(`Address: ${perkAddress}`);
    console.log(`Category: ${category || 'Not set'}`);
    console.log(`Max Supply: ${maxSupply === 0 ? 'Unlimited' : maxSupply}`);
    console.log(`Deployment info updated in: ${deploymentsPath}`);

    // Verification command
    if (network.chainId !== 31337n) {
        console.log('\n🔍 Verification command:');
        console.log(
            `npx hardhat verify --network ${network.name} ${perkAddress} "${name}" "${symbol}"`,
        );
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
