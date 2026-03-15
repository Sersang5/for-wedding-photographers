export class CoupleEntity {
  id!: bigint;
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
  state?: string | null;
  pack?: string | null;
}
