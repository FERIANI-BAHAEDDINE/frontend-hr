"use client"

import { useAuth } from "@/context/auth-context"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Download, FileUp, Loader2, Pencil } from "lucide-react"
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
  document_id?: string
}

export default function EmployeeDetailPage({ params }: { params: { id: string } }) {
  const { token, user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [employee, setEmployee] = useState<Employee | null>(null)

  // Redirect if not HR
  useEffect(() => {
    if (user && user.role !== "hr") {
      router.push("/dashboard")
    }
  }, [user, router])

  useEffect(() => {
    const fetchEmployee = async () => {
      if (!token) return

      try {
        const response = await fetch(`http://localhost:8000/employees/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch employee")
        }

        const data = await response.json()
        setEmployee(data)
      } catch (error) {
        console.error("Error fetching employee:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load employee data. Please try again.",
        })
        router.push("/dashboard/employees")
      } finally {
        setIsLoading(false)
      }
    }

    fetchEmployee()
  }, [token, params.id, toast, router])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!employee) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Employee not found</p>
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
      <div className="flex items-center">
        <Link href="/dashboard/employees">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Employees
          </Button>
        </Link>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{employee.name}</h1>
          <p className="text-muted-foreground">{employee.role}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/employees/${employee.id}/edit`}>
            <Button variant="outline">
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          {employee.document_id ? (
            <Button asChild>
              <Link href={`http://localhost:8000/documents/download_pdf/${employee.document_id}`} target="_blank">
                <Download className="h-4 w-4 mr-2" />
                Download CV
              </Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href={`/dashboard/employees/${employee.id}/upload-cv`}>
                <FileUp className="h-4 w-4 mr-2" />
                Upload CV
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Basic details about the employee</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                <p>{employee.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p>{employee.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                <p>{formatDate(employee.date_of_birth)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                <p>{employee.phone_number}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Employment Information</CardTitle>
            <CardDescription>Job-related details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Job Role</p>
                <p>{employee.role}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Salary</p>
                <p>{employee.salary}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-muted-foreground">Address</p>
                <p>{employee.address}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-muted-foreground">CV Status</p>
                <p>{employee.document_id ? "CV Uploaded" : "No CV Uploaded"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>Available actions for this employee</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Link href={`/dashboard/payslips/${employee.id}`}>
                <Button variant="outline">View Payslip</Button>
              </Link>
              <Link href={`/dashboard/employees/${employee.id}/edit`}>
                <Button variant="outline">Edit Information</Button>
              </Link>
              {employee.document_id ? (
                <Link href={`http://localhost:8000/documents/download_pdf/${employee.document_id}`} target="_blank">
                  <Button variant="outline">Download CV</Button>
                </Link>
              ) : (
                <Link href={`/dashboard/employees/${employee.id}/upload-cv`}>
                  <Button variant="outline">Upload CV</Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
