export enum ActivityType {
  NOTE = 'note',
  TASK = 'task',
  CALL = 'call',
  EMAIL = 'email',
}

export class ActivityEntity {
  id: string;
  organizationId: string;
  userId: string;
  contactId?: string;
  dealId?: string;
  type: ActivityType;
  title: string;
  description?: string;
  dueDate?: Date;
  completed: boolean;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}
