export interface Payslip {
  gross_monthly_salary: number
  net_monthly_salary: number
  monthly_social_security: number
  monthly_total_tax: number
  annual_gross_salary: number
  annual_social_security: number
  annual_taxable_income: number
  annual_total_tax: number
  annual_net_salary: number
  formatted_net_monthly_salary: string
  calculation_date: string
}
