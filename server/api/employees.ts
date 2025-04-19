import type { Employee, EmployeeCreate, EmployeeUpdate } from "@/types/employees"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function getAllEmployees(token: string): Promise<Employee[]> {
  try {
    const response = await fetch(`${API_URL}/employees/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch employees")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching employees:", error)
    throw error
  }
}

export async function getEmployeeById(id: string, token: string): Promise<Employee> {
  try {
    const response = await fetch(`${API_URL}/employees/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch employee")
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching employee ${id}:`, error)
    throw error
  }
}

export async function createEmployee(employeeData: EmployeeCreate, token: string): Promise<Employee> {
  try {
    const response = await fetch(`${API_URL}/employees/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(employeeData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || "Failed to create employee")
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating employee:", error)
    throw error
  }
}

export async function updateEmployee(id: string, employeeData: EmployeeUpdate, token: string): Promise<Employee> {
  try {
    const response = await fetch(`${API_URL}/employees/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(employeeData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || "Failed to update employee")
    }

    return await response.json()
  } catch (error) {
    console.error(`Error updating employee ${id}:`, error)
    throw error
  }
}

export async function deleteEmployee(id: string, token: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/employees/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to delete employee")
    }

    return true
  } catch (error) {
    console.error(`Error deleting employee ${id}:`, error)
    throw error
  }
}

export async function uploadEmployeeCV(id: string, file: File, token: string): Promise<Employee> {
  try {
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
      const errorData = await response.json()
      throw new Error(errorData.detail || "Failed to upload CV")
    }

    return await response.json()
  } catch (error) {
    console.error(`Error uploading CV for employee ${id}:`, error)
    throw error
  }
}
