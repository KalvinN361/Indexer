import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    Index,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

export abstract class BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    createdBy: string;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdDate: Date;

    @Column({ type: 'uuid' })
    updatedBy: string;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedDate: Date;

    @Index()
    @Column()
    archived: boolean;

    @BeforeInsert()
    createId() {
        this.id = uuid();
    }
}
