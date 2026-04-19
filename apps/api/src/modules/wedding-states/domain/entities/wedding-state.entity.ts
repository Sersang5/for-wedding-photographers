export class WeddingStateEntity {
  id!: bigint;
  organizationId!: bigint;
  code!: string;
  name!: string;
  sortOrder!: number;
  isActive!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}
