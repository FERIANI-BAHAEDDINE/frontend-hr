"use client"

import { useAuth } from "@/context/auth-context"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, MoreHorizontal, Search, FileUp, Eye, Pencil, Trash2, Download } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { getAllEmployees, deleteEmployee } from "@/server/api/employees"
import { getDocumentDownloadUrl } from "@/server/api/documents"
import type { Employee } from "@/types/employees"

export default function EmployeesPage() {
  const { user, token } = useAuth()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Redirect if not HR
    if (user && user.role !== "hr") {
      router.push("/dashboard")
      return
    }

    const fetchEmployees = async () => {
      if (!token) return

      try {
        const data = await getAllEmployees(token)
        setEmployees(data)
      } catch (error) {
        console.error("Error fetching employees:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load employees. Please try again.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchEmployees()
  }, [token, user, router, toast])

  const handleDeleteEmployee = async (id: string) => {
    if (!token) return

    if (!confirm("Are you sure you want to delete this employee?")) {
      return
    }

    try {
      await deleteEmployee(id, token)
      setEmployees(employees.filter((employee) => employee.id !== id))

      toast({
        title: "Employee deleted",
        description: "The employee has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting employee:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete employee. Please try again.",
      })
    }
  }

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
          <p className="text-muted-foreground">Manage your employees and their information</p>
        </div>
        <Link href="/dashboard/employees/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employee List</CardTitle>
          <CardDescription>View and manage all employees in the system</CardDescription>
          <div className="flex items-center gap-2 mt-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading employees...</p>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">No employees found</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Salary</TableHead>
                    <TableHead>CV</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell>{employee.role}</TableCell>
                      <TableCell>{employee.salary}</TableCell>
                      <TableCell>
                        {employee.document_id ? (
                          <Button variant="outline" size="sm" asChild>
                            <Link href={getDocumentDownloadUrl(employee.document_id)} target="_blank">
                              <Download className="h-4 w-4 mr-1" />
                              CV
                            </Link>
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/dashboard/employees/${employee.id}/upload-cv`}>
                              <FileUp className="h-4 w-4 mr-1" />
                              Upload
                            </Link>
                          </Button>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/employees/${employee.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/employees/${employee.id}/edit`}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/payslips/${employee.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Payslip
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteEmployee(employee.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
