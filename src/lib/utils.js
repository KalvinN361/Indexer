"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAlchemyProvider = void 0;
const ethers_1 = require("ethers");
const getAlchemyProvider = (chain) => {
    let apiKey = '';
    let network = '';
    switch (chain) {
        case 5:
            apiKey = process.env.ALCHEMY_GOERLI_KEY;
            network = 'goerli';
            break;
        case 137:
            apiKey = process.env.ALCHEMY_POLYGON_KEY;
            network = 'matic';
            break;
        case 80001:
            apiKey = process.env.ALCHEMY_MUMBAI_KEY;
            network = 'matic-mumbai';
            break;
        default:
            apiKey = process.env.ALCHEMY_MAINNET_KEY;
            network = 'homestead';
    }
    return new ethers_1.AlchemyProvider(network, apiKey);
};
exports.getAlchemyProvider = getAlchemyProvider;
//# sourceMappingURL=utils.js.map