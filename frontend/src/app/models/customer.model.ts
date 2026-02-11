import type { Account } from './account.model';

export type DocumentType = 'CC' | 'CE' | 'PAS';

export interface Customer {
  id: string;
  documentType: DocumentType;
  documentNumber: string;
  fullName: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
  account?: Account;
}

export interface CreateCustomerRequest {
  documentType: DocumentType;
  documentNumber: string;
  fullName: string;
  email: string;
}
