import type { Document } from "@/types/documents"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function getAllDocuments(token: string): Promise<Document[]> {
  try {
    const response = await fetch(`${API_URL}/documents/list_pdfs/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch documents")
    }

    const data = await response.json()
    return data.pdfs || []
  } catch (error) {
    console.error("Error fetching documents:", error)
    throw error
  }
}

export async function uploadDocument(file: File, token: string): Promise<{ file_id: string }> {
  try {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch(`${API_URL}/documents/upload_pdf/`, {
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

    return await response.json()
  } catch (error) {
    console.error("Error uploading document:", error)
    throw error
  }
}

export async function deleteDocument(id: string, token: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/documents/pdfs/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to delete document")
    }

    return true
  } catch (error) {
    console.error(`Error deleting document ${id}:`, error)
    throw error
  }
}

export function getDocumentDownloadUrl(id: string): string {
  return `${API_URL}/documents/download_pdf/${id}`
}
