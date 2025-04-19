"use client"

import type React from "react"

import { useAuth } from "@/context/auth-context"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

export default function NewEmployeePage() {
  const { token, user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    date_of_birth: "",
    salary: "",
    address: "",
    phone_number: "",
  })

  // Redirect if not HR
  if (user && user.role !== "hr") {
    router.push("/dashboard")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token) return

    setIsLoading(true)

    try {
      const response = await fetch("http://localhost:8000/employees/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to create employee")
      }

      toast({
        title: "Employee created",
        description: "The employee has been created successfully.",
      })

      router.push("/dashboard/employees")
    } catch (error) {
      console.error("Error creating employee:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create employee",
      })
    } finally {
      setIsLoading(false)
    }
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

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Employee</h1>
        <p className="text-muted-foreground">Create a new employee record in the system</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Employee Information</CardTitle>
            <CardDescription>Enter the details of the new employee</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Job Role</Label>
                <Input
                  id="role"
                  name="role"
                  placeholder="Software Developer"
                  value={formData.role}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  name="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary">Salary</Label>
                <Input
                  id="salary"
                  name="salary"
                  placeholder="5000"
                  value={formData.salary}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  placeholder="+1234567890"
                  value={formData.phone_number}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="123 Main St, City, Country"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push("/dashboard/employees")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Employee"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
