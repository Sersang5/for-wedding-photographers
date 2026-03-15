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
  id!: bigint;
  organizationId!: bigint;
  contactId!: bigint;
  title!: string;
  stage!: DealStage | string;
  status!: DealStatus | string;
  value!: number;
  currency!: string;
  expectedCloseDate?: Date | null;
  createdAt!: Date;
  updatedAt!: Date;
}
