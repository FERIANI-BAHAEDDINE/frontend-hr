"use client"

import { useAuth } from "@/context/auth-context"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { ArrowRight, Loader2, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"

interface Employee {
  id: string
  name: string
  email: string
  role: string
  salary: string
}

export default function PayslipsPage() {
  const { token, user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchEmployees = async () => {
      if (!token) return

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

        // If user is an employee, filter to only show their own data
        if (user?.role === "employee") {
          const filteredData = data.filter((emp: Employee) => emp.email === user.email)
          setEmployees(filteredData)
        } else {
          setEmployees(data)
        }
      } catch (error) {
        console.error("Error fetching employees:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load employee data. Please try again.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchEmployees()
  }, [token, user, toast])

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payslips</h1>
        <p className="text-muted-foreground">
          {user?.role === "employee" ? "View your payslip information" : "View and manage employee payslips"}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{user?.role === "employee" ? "Your Payslip" : "Employee Payslips"}</CardTitle>
          <CardDescription>
            {user?.role === "employee" ? "Access your salary details" : "View salary details for all employees"}
          </CardDescription>
          {user?.role !== "employee" && (
            <div className="relative mt-2">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">
                {searchQuery ? "No employees found matching your search" : "No employees found"}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Gross Salary</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell>{employee.role}</TableCell>
                      <TableCell>{employee.salary}</TableCell>
                      <TableCell className="text-right">
                        <Button asChild size="sm">
                          <Link href={`/dashboard/payslips/${employee.id}`}>
                            View Payslip
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
