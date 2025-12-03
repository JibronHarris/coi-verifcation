export interface InsuranceCertificate {
  id: string;
  certificateNumber: string;
  insuredParty: string;
  insuranceCompany: string;
  effectiveDate: string;
  expirationDate: string;
  status: "active" | "expired" | "pending";
  accountId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInsuranceCertificateDto {
  certificateNumber: string;
  insuredParty: string;
  insuranceCompany: string;
  effectiveDate: string;
  expirationDate: string;
}

export interface UpdateInsuranceCertificateDto {
  certificateNumber?: string;
  insuredParty?: string;
  insuranceCompany?: string;
  effectiveDate?: string;
  expirationDate?: string;
}
