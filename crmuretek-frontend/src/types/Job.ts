// src/types/Job.ts
export interface Job {
  customerName: String;
  id: number;
  jobStatus: string;
  totalAmount: number;
  estimateMaterialKg: number;
  downPaymentAmount: number;
  downPaymentMethod: number;
  balanceAmount: number;
}
