export type Personal = {
  name: string;
  email: string;
  contact_no: string;
}

export type Address = {
  user_id?: number;
  id?: number;
  line_1: string;
  line_2?: string;
  postcode: number;
  city: string;
  district: string;
  state: string;
}