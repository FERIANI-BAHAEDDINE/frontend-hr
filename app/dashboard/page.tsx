"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, CreditCard, MessageSquare } from "lucide-react"
import Link from "next/link"
import { getAllEmployees } from "@/server/api/employees"
import { getAllDocuments } from "@/server/api/documents"
import { Loader2 } from "lucide-react"

export default function DashboardPage() {
  const { user, isLoading, token } = useAuth()
  const router = useRouter()
  const [employeeCount, setEmployeeCount] = useState(0)
  const [documentCount, setDocumentCount] = useState(0)
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) return

      try {
        // Fetch employee count
        const employees = await getAllEmployees(token)
        setEmployeeCount(employees.length)

        // Fetch document count
        const documents = await getAllDocuments(token)
        setDocumentCount(documents.length)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setDataLoading(false)
      }
    }

    fetchDashboardData()
  }, [token])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in the useEffect
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.username}!</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dataLoading ? "..." : employeeCount}</div>
            {user?.role === "hr" && (
              <p className="text-xs text-muted-foreground mt-1">
                <Link href="/dashboard/employees" className="text-primary hover:underline">
                  Manage employees
                </Link>
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dataLoading ? "..." : documentCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <Link href="/dashboard/documents" className="text-primary hover:underline">
                View documents
              </Link>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payslips</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">View</div>
            <p className="text-xs text-muted-foreground mt-1">
              <Link href="/dashboard/payslips" className="text-primary hover:underline">
                Access payslips
              </Link>
            </p>
          </CardContent>
        </Card>

        {user?.role === "hr" && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">HR Assistant</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">AI</div>
              <p className="text-xs text-muted-foreground mt-1">
                <Link href="/dashboard/assistant" className="text-primary hover:underline">
                  Open assistant
                </Link>
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you can perform</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            {user?.role === "hr" && (
              <>
                <Link href="/dashboard/employees/new" className="text-sm text-primary hover:underline">
                  Add new employee
                </Link>
                <Link href="/dashboard/documents" className="text-sm text-primary hover:underline">
                  Upload document
                </Link>
                <Link href="/dashboard/assistant" className="text-sm text-primary hover:underline">
                  Analyze CV with AI
                </Link>
              </>
            )}
            {user?.role === "finance" && (
              <>
                <Link href="/dashboard/payslips" className="text-sm text-primary hover:underline">
                  View employee payslips
                </Link>
              </>
            )}
            {user?.role === "employee" && (
              <>
                <Link href="/dashboard/payslips" className="text-sm text-primary hover:underline">
                  View my payslip
                </Link>
                <Link href="/dashboard/documents" className="text-sm text-primary hover:underline">
                  Access my documents
                </Link>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
            <CardDescription>Current system status and information</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">User:</span>
              <span>{user?.username}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Role:</span>
              <span className="capitalize">{user?.role}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Email:</span>
              <span>{user?.email}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Last Login:</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
