export enum LeadStatus {
  NEW = 'new',
  QUALIFIED = 'qualified',
  WON = 'won',
  LOST = 'lost',
}

export class ContactEntity {
  id!: string;
  organizationId!: string;
  firstName!: string;
  lastName!: string;
  email!: string;
  phone?: string;
  source?: string;
  tags!: string[];
  weddingDate?: Date;
  leadStatus!: LeadStatus;
  ownerUserId?: string;
  createdAt!: Date;
  updatedAt!: Date;
}
