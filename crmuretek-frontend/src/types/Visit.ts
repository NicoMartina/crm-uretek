// src/types/Visit.ts
export interface Visit {
  id: number;
  customer: {
    id: number;
    name: string;
    phoneNumber: string;
    address?: string;
  };
  visitDate: string; // ISO date string from Java LocalDate
  visited: boolean;
  hasPaidVisitFee: boolean;
  visitFeeAmount: number;
  paymentMethod?: string;
  invoiceNumber?: string;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  observations?: string;
}
