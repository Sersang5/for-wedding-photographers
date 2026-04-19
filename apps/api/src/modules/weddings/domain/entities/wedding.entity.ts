export class WeddingEntity {
  id!: bigint;
  organizationId!: bigint;
  name1!: string;
  lastName1!: string;
  name2!: string;
  lastName2!: string;
  email1!: string;
  email2?: string | null;
  phone1?: string | null;
  phone2?: string | null;
  language?: string | null;
  weddingDate?: Date | null;
  location?: string | null;
  stateId!: bigint;
  state!: {
    id: bigint;
    code: string;
    name: string;
    sortOrder: number;
    isActive: boolean;
  };
  packId?: bigint | null;
  pack?: {
    id: bigint;
    name: string;
    description: string;
    price: number;
  } | null;
}
