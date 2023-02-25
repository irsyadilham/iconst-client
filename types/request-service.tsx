import { Address } from './personal';
import { Service } from './service';

export interface ServiceRequest {
  service: Service;
  title: string;
  duration: number;
  description: string;
  location?: Address;
}