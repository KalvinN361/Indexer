import { AlchemyProvider, ethers } from 'ethers';

export const getAlchemyProvider = (chain: number) => {
    let apiKey = '';
    let network = '';
    switch (chain) {
        case 5:
            apiKey = process.env.ALCHEMY_GOERLI_KEY as string;
            network = 'goerli';
            break;
        case 137:
            apiKey = process.env.ALCHEMY_POLYGON_KEY as string;
            network = 'matic';
            break;
        case 80001:
            apiKey = process.env.ALCHEMY_MUMBAI_KEY as string;
            network = 'matic-mumbai';
            break;
        default:
            apiKey = process.env.ALCHEMY_MAINNET_KEY as string;
            network = 'homestead';
    }
    return new AlchemyProvider(network, apiKey);
};
