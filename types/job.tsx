import type { ServiceRequest } from './request-service';
import type { Address } from './personal';
import type { Service } from './service';

type SupportingDocument = {
  file_url: string;
}

type Status = {
  name: string;
}

type User = {
  contact_no: string;
}

type Vendor = {
  id: number;
  company_name: string;
  credential_file_url: string;
  address: Address;
  services: Service[];
  user_id: number;
  user: User;
  rating: number;
}

export type JobVendor = {
  id: number;
  approved: boolean;
  quotation_url: string;
  choosen: boolean;
  vendor: Vendor;
  price: string;
}

export interface Job extends ServiceRequest {
  id: number;
  supporting_documents: SupportingDocument[];
  status: Status;
  date: string;
  expires_in: number;
  billcode: string;
  paid: boolean;
  vendors: JobVendor[];
  rating: number;
  is_expired: boolean;
  vendor_completed: boolean;
  client_completed: boolean;
}