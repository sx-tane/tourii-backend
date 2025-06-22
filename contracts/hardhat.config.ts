import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import 'dotenv/config';

const config: HardhatUserConfig = {
    solidity: {
        version: '0.8.28',
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    networks: {
        // Soneium Testnet
        soneiumTestnet: {
            url: process.env.SONEIUM_TESTNET_RPC_URL || 'https://rpc.testnet.soneium.org',
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 1946, // Soneium testnet chain ID
        },
        // Soneium Mainnet
        soneiumMainnet: {
            url: process.env.SONEIUM_MAINNET_RPC_URL || 'https://rpc.soneium.org',
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 1868, // Soneium mainnet chain ID
        },
        // SKALE Europa Hub Testnet
        skaleTestnet: {
            url:
                process.env.SKALE_TESTNET_RPC_URL ||
                'https://testnet.skalenodes.com/v1/juicy-low-small-testnet',
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 476158412, // SKALE Europa Hub testnet
        },
        // SKALE Europa Hub Mainnet
        skaleMainnet: {
            url:
                process.env.SKALE_MAINNET_RPC_URL ||
                'https://mainnet.skalenodes.com/v1/elated-tan-skat',
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 2046399126, // SKALE Europa Hub mainnet
        },
        // Hardhat local network
        hardhat: {
            chainId: 31337,
        },
        // Localhost
        localhost: {
            url: 'http://127.0.0.1:8545',
            chainId: 31337,
        },
    },
    etherscan: {
        apiKey: {
            soneiumTestnet: process.env.SONEIUM_API_KEY || '',
            soneiumMainnet: process.env.SONEIUM_API_KEY || '',
            skaleTestnet: process.env.SKALE_API_KEY || '',
            skaleMainnet: process.env.SKALE_API_KEY || '',
        },
        customChains: [
            {
                network: 'soneiumTestnet',
                chainId: 1946,
                urls: {
                    apiURL: 'https://api-testnet.soneium.org/api',
                    browserURL: 'https://testnet.soneium.org',
                },
            },
            {
                network: 'soneiumMainnet',
                chainId: 1868,
                urls: {
                    apiURL: 'https://api.soneium.org/api',
                    browserURL: 'https://soneium.org',
                },
            },
            {
                network: 'skaleTestnet',
                chainId: 476158412,
                urls: {
                    apiURL: 'https://testnet-explorer.skalelabs.com/api',
                    browserURL: 'https://testnet-explorer.skalelabs.com',
                },
            },
            {
                network: 'skaleMainnet',
                chainId: 2046399126,
                urls: {
                    apiURL: 'https://explorer.skalelabs.com/api',
                    browserURL: 'https://explorer.skalelabs.com',
                },
            },
        ],
    },
    gasReporter: {
        enabled: process.env.REPORT_GAS === 'true',
        currency: 'USD',
    },
};

export default config;
