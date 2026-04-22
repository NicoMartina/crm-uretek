export interface Job {
  id: number;
  estimateMaterialKg?: number;
  consulta?: {
    id: number;
    problemDescription?: string;
    customer: {
      id: number;
      name?: string;
      email?: string;
      phoneNumber?: string;
      address?: string;
      source?: string;
      contactDate?: string;
      title?: string | null;
      observations?: string | null;
    };
    requestDate?: string | null;
  };
  observations?: string;
  jobStatus: string;
  workDate?: string;
}
