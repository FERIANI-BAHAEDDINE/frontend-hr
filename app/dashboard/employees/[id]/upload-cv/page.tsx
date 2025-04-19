"use client"

import type React from "react"

import { useAuth } from "@/context/auth-context"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, FileUp, Loader2 } from "lucide-react"
import Link from "next/link"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function UploadCVPage({ params }: { params: { id: string } }) {
  const { token, user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  // Redirect if not HR
  if (user && user.role !== "hr") {
    router.push("/dashboard")
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token || !file) return

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(`http://localhost:8000/employees/${params.id}/cv`, {
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

      toast({
        title: "CV uploaded",
        description: "The CV has been uploaded successfully.",
      })

      router.push(`/dashboard/employees/${params.id}`)
    } catch (error) {
      console.error("Error uploading CV:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload CV",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link href={`/dashboard/employees/${params.id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Employee
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upload CV</h1>
        <p className="text-muted-foreground">Upload a CV for this employee</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>CV Upload</CardTitle>
            <CardDescription>Upload a PDF file containing the employee's CV</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cv">CV File (PDF only)</Label>
              <Input id="cv" type="file" accept=".pdf" onChange={handleFileChange} required />
              {file && (
                <p className="text-sm text-muted-foreground">
                  Selected file: {file.name} ({Math.round(file.size / 1024)} KB)
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push(`/dashboard/employees/${params.id}`)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading || !file}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <FileUp className="mr-2 h-4 w-4" />
                  Upload CV
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
