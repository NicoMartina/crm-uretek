import type { Lead } from "./Lead";

export interface Customer {
  id: number;
  name?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  contactDate?: string;
  title?: string | null;
  source?: string | null;
  contactChannel?: string | null;
  observations?: string | null;
  consulta?: Lead[];
}
