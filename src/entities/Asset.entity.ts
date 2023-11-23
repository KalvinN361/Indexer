import { Column, Entity, Index, OneToMany, PrimaryColumn } from "typeorm";
import { AttributeEntity, BaseEntity } from "./index";

@Index("idx_tokenid_contractid", ["contractId", "tokenId"], {
  unique: true,
})
@Entity("Assets", { schema: "public" })
export class AssetEntity extends BaseEntity {
  @Column({ length: 16 })
  tokenId: string;

  @Column({ type: 'uuid' })
  ownerId: string;

  @Column({ type: 'uuid' })
  contractId: string;

  @Column({ length: 64 })
  status: string;

  @Column({ length: 256 })
  name: string;

  @Column()
  description: string;

  @Column({ length: 512 })
  image: string;

  @Column({ length: 512 })
  imageSmall: string;

  @Column({ length: 512 })
  animation: string;

  @Column({ length: 512 })
  animationSmall: string;

  @OneToMany(() => AttributeEntity, (attribute) => attribute['asset'])
  attributes: Array<AttributeEntity>;
}
