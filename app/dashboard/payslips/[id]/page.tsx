"use client"

import { useAuth } from "@/context/auth-context"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Loader2, Printer } from "lucide-react"
import Link from "next/link"

interface Employee {
  id: string
  name: string
  email: string
  role: string
  date_of_birth: string
  salary: string
  address: string
  phone_number: string
}

interface PayslipData {
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

export default function PayslipDetailPage({ params }: { params: { id: string } }) {
  const { token, user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [payslip, setPayslip] = useState<PayslipData | null>(null)

  useEffect(() => {
    // If user is employee, check if they're viewing their own payslip
    const checkAccess = async () => {
      if (user?.role === "employee") {
        try {
          const response = await fetch("http://localhost:8000/employees/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (!response.ok) {
            throw new Error("Failed to fetch employees")
          }

          const data = await response.json()
          const userEmployee = data.find((emp: Employee) => emp.email === user.email)

          if (!userEmployee || userEmployee.id !== params.id) {
            toast({
              variant: "destructive",
              title: "Access denied",
              description: "You can only view your own payslip.",
            })
            router.push("/dashboard/payslips")
            return false
          }
        } catch (error) {
          console.error("Error checking access:", error)
          return false
        }
      }
      return true
    }

    const fetchData = async () => {
      if (!token) return

      const hasAccess = await checkAccess()
      if (!hasAccess) return

      try {
        // Fetch employee details
        const employeeResponse = await fetch(`http://localhost:8000/employees/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!employeeResponse.ok) {
          throw new Error("Failed to fetch employee")
        }

        const employeeData = await employeeResponse.json()
        setEmployee(employeeData)

        // Fetch payslip data
        const payslipResponse = await fetch(`http://localhost:8000/salary/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!payslipResponse.ok) {
          throw new Error("Failed to fetch payslip")
        }

        const payslipData = await payslipResponse.json()
        setPayslip(payslipData)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load payslip data. Please try again.",
        })
        router.push("/dashboard/payslips")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [token, params.id, toast, router, user])

  const handlePrint = () => {
    window.print()
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!employee || !payslip) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Payslip not found</p>
      </div>
    )
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center print:hidden">
        <Link href="/dashboard/payslips">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Payslips
          </Button>
        </Link>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payslip</h1>
          <p className="text-muted-foreground">Salary details for {employee.name}</p>
        </div>
        <div className="flex gap-2 print:hidden">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      <Card className="print:shadow-none print:border-none">
        <CardHeader className="print:pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">Payslip</CardTitle>
              <CardDescription>Generated on {formatDate(payslip.calculation_date)}</CardDescription>
            </div>
            <div className="text-right">
              <h3 className="font-bold text-lg">HR Management System</h3>
              <p className="text-sm text-muted-foreground">123 Business Street</p>
              <p className="text-sm text-muted-foreground">City, Country</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6">
            <div>
              <h3 className="font-semibold mb-2">Employee Information</h3>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">{employee.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Position:</span>
                  <span>{employee.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span>{employee.email}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Payment Information</h3>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gross Salary:</span>
                  <span>TND {payslip.gross_monthly_salary.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Net Salary:</span>
                  <span className="font-bold">{payslip.formatted_net_monthly_salary}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Date:</span>
                  <span>Last day of month</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Salary Breakdown</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-md p-4">
                  <h4 className="font-medium mb-2">Monthly</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gross Salary:</span>
                      <span>TND {payslip.gross_monthly_salary.toFixed(3)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Social Security:</span>
                      <span className="text-red-500">- TND {payslip.monthly_social_security.toFixed(3)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Income Tax:</span>
                      <span className="text-red-500">- TND {payslip.monthly_total_tax.toFixed(3)}</span>
                    </div>
                    <div className="flex justify-between font-bold border-t pt-2 mt-2">
                      <span>Net Salary:</span>
                      <span>{payslip.formatted_net_monthly_salary}</span>
                    </div>
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <h4 className="font-medium mb-2">Annual</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gross Salary:</span>
                      <span>TND {payslip.annual_gross_salary.toFixed(3)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Social Security:</span>
                      <span className="text-red-500">- TND {payslip.annual_social_security.toFixed(3)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Taxable Income:</span>
                      <span>TND {payslip.annual_taxable_income.toFixed(3)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Income Tax:</span>
                      <span className="text-red-500">- TND {payslip.annual_total_tax.toFixed(3)}</span>
                    </div>
                    <div className="flex justify-between font-bold border-t pt-2 mt-2">
                      <span>Net Annual Salary:</span>
                      <span>TND {payslip.annual_net_salary.toFixed(3)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border rounded-md p-4">
                <h4 className="font-medium mb-2">Notes</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>This payslip is generated automatically by the system.</li>
                  <li>Social security contributions are calculated at 9.18% of gross salary.</li>
                  <li>Income tax is calculated according to the progressive tax brackets.</li>
                  <li>For any questions regarding your payslip, please contact the HR department.</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
