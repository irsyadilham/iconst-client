import type { Personal, Address } from './personal';

export type Register = {
  personalDetails?: Personal;
  address: Address;
  password: string;
}