import { ServiceRequest } from './request-service';

type SupportingDocument = {
  file_url: string;
}

type Status = {
  name: string;
}

export interface Job extends ServiceRequest {
  id: number;
  supporting_documents: SupportingDocument[];
  status: Status;
  date: string;
  expires_in: number;
  billcode: string;
  paid: boolean;
}