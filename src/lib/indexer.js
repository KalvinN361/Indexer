"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexer = void 0;
const ethers_1 = require("ethers");
const entities_1 = require("../entities");
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("./utils");
const process = __importStar(require("process"));
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
const console = __importStar(require("console"));
const ormconfig_1 = __importDefault(require("../../ormconfig"));
dotenv_1.default.config();
const indexer = () => __awaiter(void 0, void 0, void 0, function* () {
    const { CONTRACT_ID } = process.env;
    try {
        let dataSource = new typeorm_1.DataSource(ormconfig_1.default);
        yield dataSource.initialize();
        const dbContract = (yield dataSource
            .createQueryBuilder(entities_1.ContractEntity, 'c')
            .where('c.archived = (:archived) AND c.id = (:id)', {
            archived: false,
            id: CONTRACT_ID,
        })
            .getOne());
        const { address, abi, chainId } = dbContract;
        console.log(`Indexing contract ${address}`);
        if (abi) {
            const isTransferEventDefined = abi.some((item) => {
                return item.type === 'event' && item.name === 'Transfer';
            });
            if (!isTransferEventDefined) {
                console.log('Transfer event not defined in ABI for contract', address);
                return;
            }
        }
        const provider = (0, utils_1.getAlchemyProvider)(chainId);
        const contract = new ethers_1.Contract(address, abi, provider);
        yield contract.on('Transfer', (from, to, id, event) => __awaiter(void 0, void 0, void 0, function* () {
            console.log(`${from} => ${to}: ${id}`);
            if (from === to)
                return;
            try {
                let oldOwner = (yield dataSource
                    .createQueryBuilder(entities_1.OwnerEntity, 'o')
                    .where('o.archived=:archived AND o.walletAddress=:walletAddress', {
                    archived: false,
                    walletAddress: from,
                })
                    .getOne());
                let newOwner = yield dataSource
                    .createQueryBuilder()
                    .insert()
                    .into(entities_1.OwnerEntity)
                    .values({ walletAddress: to })
                    .orUpdate(['walletAddress'], ['walletAddress'], {})
                    .execute()
                    .then((result) => __awaiter(void 0, void 0, void 0, function* () {
                    return (yield dataSource
                        .createQueryBuilder(entities_1.OwnerEntity, 'o')
                        .where('o.archived=:archived AND o.walletAddress=:walletAddress', {
                        archived: false,
                        walletAddress: to,
                    })
                        .getOne());
                }));
                let tokenUri = yield contract.getFunction('tokenURI')(id.toString());
                if (tokenUri.startsWith('ipfs://'))
                    tokenUri = tokenUri.replace('ipfs://', 'https://ipfs.io/ipfs/');
                let tokenMetadata = yield axios_1.default
                    .get(tokenUri)
                    .then((response) => {
                    return response.data;
                });
                let asset = yield dataSource
                    .createQueryBuilder(entities_1.AssetEntity, 'a')
                    .insert()
                    .into(entities_1.AssetEntity)
                    .values({
                    tokenId: id.toString(),
                    contractId: dbContract.id,
                    ownerId: newOwner.id,
                    name: tokenMetadata.name,
                    description: tokenMetadata.description,
                    image: tokenMetadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/'),
                    animation: tokenMetadata.animation,
                    updatedDate: new Date(),
                })
                    .orUpdate(['ownerId'], ['contractId', 'tokenId'], {
                    skipUpdateIfNoValuesChanged: true,
                })
                    .execute();
                console.log(`Updated token ID ${id} to new owner id: ${newOwner.id} for contract ${dbContract.description}`);
            }
            catch (e) {
                console.log(e);
            }
        }));
        console.log('Listening for Transfer events on contract', address);
    }
    catch (error) {
        console.log(error);
    }
});
exports.indexer = indexer;
//# sourceMappingURL=indexer.js.map