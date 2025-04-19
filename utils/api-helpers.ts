/**
 * Helper function to log API request details for debugging
 */
export function logApiRequest(endpoint: string, options: RequestInit, token?: string): void {
  if (process.env.NODE_ENV !== "production") {
    console.group(`API Request: ${endpoint}`)
    console.log("Method:", options.method || "GET")
    console.log("Headers:", options.headers)
    if (options.body) {
      try {
        const body =
          typeof options.body === "string"
            ? JSON.parse(options.body)
            : options.body instanceof FormData
              ? "[FormData]"
              : options.body
        console.log("Body:", body)
      } catch {
        console.log("Body:", options.body)
      }
    }
    if (token) {
      console.log("Token (first 10 chars):", token.substring(0, 10) + "...")
    }
    console.groupEnd()
  }
}

/**
 * Helper function to log API response details for debugging
 */
export async function logApiResponse(endpoint: string, response: Response): Promise<void> {
  if (process.env.NODE_ENV !== "production") {
    console.group(`API Response: ${endpoint}`)
    console.log("Status:", response.status, response.statusText)
    console.log("Headers:", Object.fromEntries([...response.headers.entries()]))

    try {
      // Clone the response to avoid consuming it
      const clonedResponse = response.clone()
      const data = await clonedResponse.text()
      try {
        console.log("Body:", JSON.parse(data))
      } catch {
        console.log("Body:", data)
      }
    } catch (error) {
      console.log("Could not read response body")
    }

    console.groupEnd()
  }
}
