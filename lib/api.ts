import type { User, AuthResponse, Employee, Document, Payslip, AssistantResponse } from "@/types/api"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// Auth API
export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/users/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || "Failed to login")
  }

  return await response.json()
}

export async function signup(
  username: string,
  email: string,
  password: string,
  role: "hr" | "finance" | "employee",
): Promise<User> {
  const response = await fetch(`${API_URL}/users/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password, role }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || "Failed to sign up")
  }

  return await response.json()
}

export async function getCurrentUser(token: string): Promise<User> {
  const response = await fetch(`${API_URL}/users/me/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to get user info")
  }

  return await response.json()
}

// Employees API
export async function getEmployees(token: string): Promise<Employee[]> {
  const response = await fetch(`${API_URL}/employees/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch employees")
  }

  return await response.json()
}

export async function getEmployee(id: string, token: string): Promise<Employee> {
  const response = await fetch(`${API_URL}/employees/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch employee")
  }

  return await response.json()
}

export async function createEmployee(employeeData: Omit<Employee, "id">, token: string): Promise<Employee> {
  const response = await fetch(`${API_URL}/employees/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(employeeData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || "Failed to create employee")
  }

  return await response.json()
}

export async function updateEmployee(
  id: string,
  employeeData: Partial<Omit<Employee, "id">>,
  token: string,
): Promise<Employee> {
  const response = await fetch(`${API_URL}/employees/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(employeeData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || "Failed to update employee")
  }

  return await response.json()
}

export async function deleteEmployee(id: string, token: string): Promise<void> {
  const response = await fetch(`${API_URL}/employees/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to delete employee")
  }
}

export async function uploadEmployeeCV(id: string, file: File, token: string): Promise<Employee> {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch(`${API_URL}/employees/${id}/cv`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || "Failed to upload CV")
  }

  return await response.json()
}

// Documents API
export async function getDocuments(token: string): Promise<Document[]> {
  const response = await fetch(`${API_URL}/documents/list_pdfs/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch documents")
  }

  const data = await response.json()
  return data.pdfs || []
}

export async function uploadDocument(file: File, token: string): Promise<{ file_id: string }> {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch(`${API_URL}/documents/upload_pdf/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || "Failed to upload document")
  }

  return await response.json()
}

export async function deleteDocument(id: string, token: string): Promise<void> {
  const response = await fetch(`${API_URL}/documents/pdfs/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to delete document")
  }
}

export function getDocumentDownloadUrl(id: string): string {
  return `${API_URL}/documents/download_pdf/${id}`
}

// Payslips API
export async function getEmployeePayslip(employeeId: string, token: string): Promise<Payslip> {
  const response = await fetch(`${API_URL}/salary/${employeeId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch payslip")
  }

  return await response.json()
}

// HR Assistant API
export async function askQuestion(question: string, token: string): Promise<AssistantResponse> {
  const response = await fetch(`${API_URL}/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text: question }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || "Failed to get response")
  }

  return await response.json()
}
