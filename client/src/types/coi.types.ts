export interface COI {
  id: string;
  certificateNumber: string;
  insuredParty: string;
  insuranceCompany: string;
  effectiveDate: string;
  expirationDate: string;
  status: "active" | "expired" | "pending";
}
