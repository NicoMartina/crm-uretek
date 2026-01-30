export interface Job {
  customer: any;
  workDate: string;
  id: number;
  customerName: string; // Add this line!
  totalAmount: number;
  balanceAmount: number;
  estimateMaterialKg: number;
  jobStatus: string;
}
