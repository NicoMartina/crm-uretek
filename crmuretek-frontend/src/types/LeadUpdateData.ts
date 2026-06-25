export interface LeadUpdateData {
  problemDescription: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  contactChannel: string;
  source: string;
  contactDate: string;
  title: string;
  observations: string;
  customer: {
    id?: number;
  };
}
