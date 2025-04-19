"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "@/types/api"
import { login as apiLogin, signup as apiSignup, getCurrentUser } from "@/lib/api"

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  signup: (username: string, email: string, password: string, role: "hr" | "finance" | "employee") => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const validateToken = async () => {
      const storedToken = localStorage.getItem("token")

      if (storedToken) {
        try {
          // Validate the token by fetching user data
          const userData = await getCurrentUser(storedToken)
          setToken(storedToken)
          setUser(userData)
          // Update stored user data in case it changed
          localStorage.setItem("user", JSON.stringify(userData))
        } catch (error) {
          console.error("Token validation failed:", error)
          // Clear invalid token and user data
          localStorage.removeItem("token")
          localStorage.removeItem("user")
          setToken(null)
          setUser(null)
        }
      }

      setIsLoading(false)
    }

    validateToken()
  }, [])

  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const data = await apiLogin(email, password)

      // Get user info
      const userData = await getCurrentUser(data.access_token)

      // Save to state and localStorage
      setToken(data.access_token)
      setUser(userData)
      localStorage.setItem("token", data.access_token)
      localStorage.setItem("user", JSON.stringify(userData))

      return userData // Return the user data for the component to use
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (
    username: string,
    email: string,
    password: string,
    role: "hr" | "finance" | "employee",
  ) => {
    try {
      setIsLoading(true)
      await apiSignup(username, email, password, role)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login: handleLogin,
        signup: handleSignup,
        logout: handleLogout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
