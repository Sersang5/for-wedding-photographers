export enum DealStage {
  LEAD = 'lead',
  PROPOSAL = 'proposal',
  NEGOTIATION = 'negotiation',
  BOOKED = 'booked',
}

export enum DealStatus {
  OPEN = 'open',
  WON = 'won',
  LOST = 'lost',
}

export class DealEntity {
  id!: string;
  organizationId!: string;
  contactId!: string;
  title!: string;
  stage!: DealStage;
  status!: DealStatus;
  value!: number;
  currency!: string;
  expectedCloseDate?: Date;
  createdAt!: Date;
  updatedAt!: Date;
}
