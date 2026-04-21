export interface LeadFormData {
  problemDescription: string;
  id?: number;
  name: string;
  phoneNumber: string;
  email?: string | null;
  address?: string | null;
  contactChannel?: string | null;
  source?: string | null;
  title?: string | null;
  contactDate: string;
  observations?: string | null;
}
