

export interface LeadUpdateData {
  problemDescription: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  contactChannel: LeadContactEnum;
  source: SourceEnum;
  contactDate: LocalDate;
  title: TitleEnum;
  observations: string;
  customer: {
    id?: number;
  };
}
