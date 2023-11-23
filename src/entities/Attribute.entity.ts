import { Column, Entity, Index, ManyToOne } from "typeorm";
import { BaseEntity, AssetEntity } from "./index";

@Index("Attributes_assetId_index", ["assetId"], {unique: true})
@Entity("Attributes", { schema: "public" })
export class AttributeEntity extends BaseEntity {
  @Column({ length: 64 })
  traitType: string;

  @Column()
  value: string;

  @Column({ type: 'uuid' })
  metadataId?: string;

  @Column({ type: 'uuid' })
  assetId: string;

  @ManyToOne(() => AssetEntity, (asset) => asset.attributes)
  asset: AssetEntity;
}
