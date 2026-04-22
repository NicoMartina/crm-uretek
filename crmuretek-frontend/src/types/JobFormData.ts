export interface JobFormData {
  estimateMaterialKg: number;
  workDate: string;
  observations: string;
  consulta?: {
    id?: number;
  };
}
