export interface Job {
  id: number;
  customerName: string; // Add this line!
  totalAmount: number;
  balanceAmount: number;
  estimateMaterialKg: number;
  jobStatus: string;
}
