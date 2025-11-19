export interface JobRole {
  title: string;
  level: string;
  minRal: number;
}

export interface CalculationResult {
  netMonthly: number;
  netAnnual: number;
  grossAnnual: number;
  employeeInps: number;
  irpef: number;
  companyInps: number;
  tfr: number;
  irap: number;
  totalCompanyCost: number;
}