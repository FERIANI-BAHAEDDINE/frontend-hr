const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function uploadCV(file: File, token: string): Promise<{ message: string; filename: string }> {
  try {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch(`${API_URL}/upload-pdf`, {
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

    return await response.json()
  } catch (error) {
    console.error("Error uploading CV:", error)
    throw error
  }
}

export async function askQuestion(question: string, token: string): Promise<{ answer: string; sources?: string[] }> {
  try {
    const response = await fetch(`${API_URL}/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text: question }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || "Failed to get response")
    }

    return await response.json()
  } catch (error) {
    console.error("Error asking question:", error)
    throw error
  }
}
