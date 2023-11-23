import { Contract, getAddress } from 'ethers';
import { Alchemy, Network, AlchemySubscription } from 'alchemy-sdk';
import {
    AssetEntity,
    AttributeEntity,
    ContractEntity,
    OwnerEntity,
} from '../entities';

import axios from 'axios';
import { getAlchemyProvider } from './utils';
import * as process from 'process';
import { DataSource, DataSourceOptions } from 'typeorm';
import dotenv from 'dotenv';
import * as console from 'console';
import ormConfig from '../../ormconfig';

dotenv.config();

export const indexer = async () => {
    const { CONTRACT_ID } = process.env;
    try {
        let dataSource = new DataSource(ormConfig as DataSourceOptions);
        await dataSource.initialize();
        const dbContract = (await dataSource
            .createQueryBuilder(ContractEntity, 'c')
            .where('c.archived = (:archived) AND c.id = (:id)', {
                archived: false,
                id: CONTRACT_ID,
            })
            .getOne()) as ContractEntity;
        const { address, abi, chainId } = dbContract;
        const alchemy = new Alchemy(getAlchemySettings(chainId as number));

        console.log(`Indexing contract ${address}`);
        if (abi) {
            const isTransferEventDefined = (
                abi as unknown as Array<{
                    type: string;
                    name: string;
                }>
            ).some((item: any) => {
                return item.type === 'event' && item.name === 'Transfer';
            });
            if (!isTransferEventDefined) {
                console.log(
                    'Transfer event not defined in ABI for contract',
                    address
                );
                return;
            }
        }
        const provider = getAlchemyProvider(chainId as number);
        const contract = new Contract(address, abi, provider);
        console.log('Listening for Transfer events on contract', contract);

        alchemy.ws.on('Transfer', async (from, to, id) => {
            //await contract.on('Transfer', async (from, to, id, event) => {
            console.log(`${from} => ${to}: ${id}`);
            try {
                let oldOwner = (await dataSource
                    .createQueryBuilder(OwnerEntity, 'o')
                    .where(
                        'o.archived=:archived AND o.walletAddress=:walletAddress',
                        {
                            archived: false,
                            walletAddress: from,
                        }
                    )
                    .getOne()) as OwnerEntity;

                let newOwner = await dataSource
                    .createQueryBuilder()
                    .insert()
                    .into(OwnerEntity)
                    .values({
                        walletAddress: getAddress(to),
                        updatedDate: new Date(),
                    })
                    .orUpdate(
                        ['walletAddress', 'updatedDate'],
                        ['walletAddress'],
                        {}
                    )
                    .execute()
                    .then(async (result) => {
                        return (await dataSource
                            .createQueryBuilder(OwnerEntity, 'o')
                            .where(
                                'o.archived=:archived AND o.walletAddress=:walletAddress',
                                {
                                    archived: false,
                                    walletAddress: to,
                                }
                            )
                            .getOne()) as OwnerEntity;
                    });

                let tokenUri = await contract.getFunction('tokenURI')(
                    parseInt(id)
                );
                if (tokenUri.startsWith('ipfs://')) {
                    tokenUri = tokenUri.replace(
                        'ipfs://',
                        'https://ipfs.io/ipfs/'
                    );
                }
                console.log({ tokenUri });
                let tokenMetadata = await axios
                    .get(tokenUri)
                    .then((response) => {
                        return response.data;
                    });
                let attributes = tokenMetadata.attributes;

                let asset = await dataSource
                    .createQueryBuilder(AssetEntity, 'a')
                    .insert()
                    .into(AssetEntity)
                    .values({
                        tokenId: id.toString(),
                        contractId: dbContract.id,
                        ownerId: newOwner.id,
                        name: tokenMetadata.name,
                        description: tokenMetadata.description,
                        image: tokenMetadata.image.replace(
                            'ipfs://',
                            'https://ipfs.io/ipfs/'
                        ),
                        animation: tokenMetadata.animation,
                        updatedDate: new Date(),
                    })
                    .orUpdate(
                        ['ownerId', 'updatedDate'],
                        ['contractId', 'tokenId'],
                        {
                            skipUpdateIfNoValuesChanged: true,
                        }
                    )
                    .execute();
                console.log({ asset });

                if (attributes.length) {
                    let metaAttributes = attributes.map((attribute: any) => {
                        return {
                            assetId: asset.identifiers[0].id,
                            trait_type: attribute.trait_type,
                            value: attribute.value,
                            updatedDate: new Date(),
                        };
                    });
                    await dataSource
                        .createQueryBuilder()
                        .insert()
                        .into(AttributeEntity)
                        .values(metaAttributes)
                        .orUpdate(['value'], ['assetId', 'trait_type'], {})
                        .execute();
                }
                console.log(
                    `Updated token ID ${id} to new owner id: ${newOwner.id} for contract ${dbContract.description}`
                );
            } catch (e) {
                console.log(e);
            }
        });
        await dataSource.destroy();
        console.log('Listening for Transfer events on contract', address);
    } catch (error: any) {
        console.log(error);
    }
};

const getAlchemySettings = (chainId: number) => {
    switch (chainId) {
        case 1:
            return {
                apiKey: process.env.ALCHEMY_MAINNET_KEY,
                network: Network.ETH_MAINNET,
            };
        case 5:
            return {
                apiKey: process.env.ALCHEMY_GOERLI_KEY,
                network: Network.ETH_GOERLI,
            };
        case 137:
            return {
                apiKey: process.env.ALCHEMY_POLYGON_KEY,
                network: Network.MATIC_MAINNET,
            };
        case 80001:
            return {
                apiKey: process.env.ALCHEMY_MUMBAI_KEY,
                network: Network.MATIC_MUMBAI,
            };
    }
};
