import { Column, Entity, PrimaryColumn } from 'typeorm';
import { BaseEntity } from './index';

@Entity('Contracts', { schema: 'public' })
export class ContractEntity extends BaseEntity {
    @Column({ nullable: true, length: 256 })
    description: string;

    @Column({ nullable: true, length: 64 })
    symbol?: string;

    @Column({ length: 64 })
    address: string;

    @Column({ enum: ['ERC20', 'ERC721', 'ERC1155'], default: 'ERC721' })
    type: string;

    @Column({ enum: ['custom', 'hypermint', 'aspen'], default: 'hypermint' })
    minter: string;

    @Column({ enum: [1, 5, 137, 8001], default: 1 })
    chainId: number;

    @Column({ length: 512 })
    chainURL: string;

    @Column({ length: 256 })
    chainAPIKey: string;

    @Column({ type: 'uuid' })
    partnerContractId?: string;

    @Column({ type: 'jsonb' })
    abi: string;

    @Column({ length: 512 })
    deployedBlock: string;

    @Column({ default: false })
    burnable: boolean;

    @Column({ length: 64, nullable: true })
    burnNow: string;

    @Column()
    maxSupply: number;
}
