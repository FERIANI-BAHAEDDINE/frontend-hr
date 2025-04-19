"use client"

import type React from "react"

import { useAuth } from "@/context/auth-context"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Download, FileUp, Loader2, Search, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Document {
  id: string
  filename: string
}

export default function DocumentsPage() {
  const { token } = useAuth()
  const { toast } = useToast()
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!token) return

      try {
        const response = await fetch("http://localhost:8000/documents/list_pdfs/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch documents")
        }

        const data = await response.json()
        setDocuments(data.pdfs || [])
      } catch (error) {
        console.error("Error fetching documents:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load documents. Please try again.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDocuments()
  }, [token, toast])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token || !file) return

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("http://localhost:8000/documents/upload_pdf/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to upload document")
      }

      const data = await response.json()

      toast({
        title: "Document uploaded",
        description: "The document has been uploaded successfully.",
      })

      // Refresh document list
      const refreshResponse = await fetch("http://localhost:8000/documents/list_pdfs/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json()
        setDocuments(refreshData.pdfs || [])
      }

      setFile(null)
      // Reset the file input
      const fileInput = document.getElementById("document") as HTMLInputElement
      if (fileInput) {
        fileInput.value = ""
      }
    } catch (error) {
      console.error("Error uploading document:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload document",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!token) return

    if (!confirm("Are you sure you want to delete this document?")) {
      return
    }

    try {
      const response = await fetch(`http://localhost:8000/documents/pdfs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete document")
      }

      setDocuments(documents.filter((doc) => doc.id !== id))

      toast({
        title: "Document deleted",
        description: "The document has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting document:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete document. Please try again.",
      })
    }
  }

  const filteredDocuments = documents.filter((doc) => doc.filename.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
        <p className="text-muted-foreground">Manage and view all documents in the system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Upload Document</CardTitle>
            <CardDescription>Upload a new PDF document to the system</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="document">Document (PDF only)</Label>
                <Input id="document" type="file" accept=".pdf" onChange={handleFileChange} required />
                {file && (
                  <p className="text-sm text-muted-foreground">
                    Selected file: {file.name} ({Math.round(file.size / 1024)} KB)
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isUploading || !file}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <FileUp className="mr-2 h-4 w-4" />
                    Upload Document
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Document List</CardTitle>
            <CardDescription>All documents in the system</CardDescription>
            <div className="relative mt-2">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : filteredDocuments.length === 0 ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-muted-foreground">
                  {searchQuery ? "No documents found matching your search" : "No documents found"}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="truncate flex-1">
                      <p className="font-medium truncate">{doc.filename}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={`http://localhost:8000/documents/download_pdf/${doc.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download</span>
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(doc.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
