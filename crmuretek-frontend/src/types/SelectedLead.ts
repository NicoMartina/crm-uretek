import type { Lead } from "./Lead";

export interface SelectedLeadCustomer {
  id: number;
  name?: string;
  phoneNumber?: string;
  title?: string | null;
}

export type SelectedLead = Partial<Lead> & {
  consultaId?: number;
  id?: number;
  customerId?: number;
  customer?: SelectedLeadCustomer;
  jobId?: number;
  existingDescription?: string;
  existingMaterial?: number;
};
