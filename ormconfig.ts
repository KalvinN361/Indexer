import dotenv from 'dotenv';
import { DataSourceOptions } from 'typeorm';
import {
    AssetEntity,
    AttributeEntity,
    ContractEntity,
    OwnerEntity,
} from './src/entities';

dotenv.config();

let ormConfig = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: 5432,
    extra: {
        connectionTimeoutMillis: 5000,
        query_timeout: 5000,
        statement_timeout: 5000,
        poolSize: 100,
    },
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: false,
    entities: [ContractEntity, OwnerEntity, AssetEntity, AttributeEntity],
} as DataSourceOptions;

export default ormConfig;
