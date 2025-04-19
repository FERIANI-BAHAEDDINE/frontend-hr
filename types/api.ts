// User types
export interface User {
  username: string
  email: string
  role: "hr" | "finance" | "employee"
}

export interface AuthResponse {
  access_token: string
  token_type: string
}

// Employee types
export interface Employee {
  id: string
  name: string
  email: string
  role: string
  date_of_birth: string
  salary: string
  address: string
  phone_number: string
  document_id?: string
}

// Document types
export interface Document {
  id: string
  filename: string
}

export interface DocumentsResponse {
  pdfs: Document[]
}

// Payslip types
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

// HR Assistant types
export interface AssistantResponse {
  answer: string
  sources?: string[]
}

export interface CVUploadResponse {
  message: string
  filename: string
}
