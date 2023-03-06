import type { Address } from './personal';
import type { Service } from './service';

export type ServiceRequest = {
  service: Service;
  title: string;
  duration: number;
  description: string;
  location?: Address;
}