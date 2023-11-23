"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const entities_1 = require("./src/entities");
dotenv_1.default.config();
let ormConfig = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: false,
    entities: [entities_1.ContractEntity, entities_1.OwnerEntity, entities_1.AssetEntity, entities_1.AttributeEntity],
};
exports.default = ormConfig;
//# sourceMappingURL=ormconfig.js.map