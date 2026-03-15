export enum LeadStatus {
  NEW = 'new',
  QUALIFIED = 'qualified',
  WON = 'won',
  LOST = 'lost',
}

export class ContactEntity {
  id!: bigint;
  organizationId!: bigint;
  firstName!: string;
  lastName!: string;
  email!: string;
  phone?: string | null;
  source?: string | null;
  tags!: string[];
  weddingDate?: Date | null;
  leadStatus!: LeadStatus | string;
  ownerUserId?: bigint | null;
  createdAt!: Date;
  updatedAt!: Date;
}
