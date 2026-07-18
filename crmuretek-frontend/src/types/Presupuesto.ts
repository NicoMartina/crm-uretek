export interface Presupuesto {
  presupuestoId: number;
  presupuestoNumber: string;
  consultaId: number;
  customerId: number;
  customerName: string;
  visitId: number;
  visitDate?: string;
  amount: number;
  sent: boolean;
  received: boolean;
  accepted: boolean;
  acceptanceForm?: string;
  observations?: string;
}
