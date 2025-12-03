// InsuranceCertificate types for API requests/responses
export interface InsuranceCertificateResponseDto {
  id: string;
  certificateNumber: string;
  insuredParty: string;
  insuranceCompany: string;
  effectiveDate: Date;
  expirationDate: Date;
  status: string;
  accountId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateInsuranceCertificateDto {
  certificateNumber: string;
  insuredParty: string;
  insuranceCompany: string;
  effectiveDate: string; // ISO date string
  expirationDate: string; // ISO date string
}

export interface UpdateInsuranceCertificateDto {
  certificateNumber?: string;
  insuredParty?: string;
  insuranceCompany?: string;
  effectiveDate?: string; // ISO date string
  expirationDate?: string; // ISO date string
}
