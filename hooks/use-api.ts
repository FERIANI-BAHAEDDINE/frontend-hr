"use client"

import { useState, useCallback } from "react"

export function useApi<T>(apiFunction: (...args: any[]) => Promise<T>) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const execute = useCallback(
    async (...args: any[]) => {
      try {
        setIsLoading(true)
        setError(null)
        const result = await apiFunction(...args)
        setData(result)
        return result
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        setError(error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [apiFunction],
  )

  return {
    data,
    error,
    isLoading,
    execute,
  }
}
