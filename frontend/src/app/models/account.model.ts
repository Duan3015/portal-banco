import type { Customer } from './customer.model';

export type AccountStatus = 'Active' | 'Inactive';

export interface Account {
  id: string;
  accountNumber: string;
  status: AccountStatus;
  customerId: string;
  customer?: Customer;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAccountRequest {
  documentNumber: string;
  status?: AccountStatus;
}
