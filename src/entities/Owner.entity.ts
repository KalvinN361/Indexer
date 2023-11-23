import { Column, Entity, Index, OneToOne, PrimaryColumn } from 'typeorm';
import { BaseEntity } from './index';

@Index('idx_walletaddress', ['walletAddress'], {
    unique: true,
})
@Entity('Owners', { schema: 'public' })
export class OwnerEntity extends BaseEntity {
    @Column({ nullable: true, length: 64 })
    walletAddress: string;

    @Column({ nullable: true, length: 128 })
    userName: string;

    @Column({ nullable: true, length: 128 })
    firstName: string;

    @Column({ nullable: true, length: 128 })
    lastName: string;

    @Column({ nullable: true, length: 128 })
    email: string;

    @Column({ enum: [1, 5, 137, 8001], default: 1 })
    chainId: number;

    @Column({ nullable: false, length: 32 })
    type: string;

    @Column({ nullable: false, length: 32 })
    role: string;
}
