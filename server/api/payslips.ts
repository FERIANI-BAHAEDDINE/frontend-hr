import type { Payslip } from "@/types/payslips"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function getEmployeePayslip(employeeId: string, token: string): Promise<Payslip> {
  try {
    const response = await fetch(`${API_URL}/salary/${employeeId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch payslip")
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching payslip for employee ${employeeId}:`, error)
    throw error
  }
}
