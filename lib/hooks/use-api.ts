"use client"

import { useState, useEffect } from "react"

export function useAPI<T>(url: string, options?: RequestInit) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch(url, options)
        const result = await response.json()

        if (result.success) {
          setData(result.data)
        } else {
          throw new Error(result.error || "API request failed")
        }
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [url])

  return { data, loading, error }
}

export async function apiRequest<T>(
  url: string,
  options?: RequestInit,
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    })

    const result = await response.json()
    return result
  } catch (error) {
    console.error("[v0] API Request Error:", error)
    return { success: false, error: "Network error" }
  }
}
