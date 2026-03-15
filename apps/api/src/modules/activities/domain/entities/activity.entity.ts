export enum ActivityType {
  NOTE = 'note',
  TASK = 'task',
  CALL = 'call',
  EMAIL = 'email',
}

export class ActivityEntity {
  id!: bigint;
  organizationId!: bigint;
  userId!: bigint;
  contactId?: bigint | null;
  dealId?: bigint | null;
  type!: ActivityType | string;
  title!: string;
  description?: string | null;
  dueDate?: Date | null;
  completed!: boolean;
  metadata?: unknown;
  createdAt!: Date;
  updatedAt!: Date;
}
