// src/types/Visit.ts
export interface Visit {
  id: number;
  consulta?: {
    id: number;
    problemDescription?: string;
    customer: {
      id: number;
      consulta?: {
        id: number;
        problemDescription?: string;
        requestDate: string;
      };
      name?: string;
      email?: string;
      phoneNumber?: string;
      address?: string;
      contactChannel?: string;
      source?: string;
      contactDate?: string;
      title?: string | null;
      observations?: string | null;
    };
    requestDate: string;
  };
  visitDate?: string; // ISO date string from Java LocalDate
  visited: boolean;
  hasPaidVisitFee?: boolean;
  visitFeeStatus?: "SI" | "NO" | "NO_SE_LE_COBRA" | "CANCELADA";
  visitFeeAmount?: number;
  paymentMethod?: string;
  invoiceNumber?: string;
  status: "SOLICITADA" | "SCHEDULED" | "VISITED" | "COMPLETED" | "CANCELLED";
  observations?: string;
}
