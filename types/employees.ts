export interface EmployeeBase {
  name: string
  email: string
  role: string
  date_of_birth: string
  salary: string
  address: string
  phone_number: string
  document_id?: string
}

export interface EmployeeCreate extends EmployeeBase {}

export interface EmployeeUpdate {
  name?: string
  email?: string
  role?: string
  date_of_birth?: string
  salary?: string
  address?: string
  phone_number?: string
  document_id?: string
}

export interface Employee extends EmployeeBase {
  id: string
}
