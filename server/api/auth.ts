import type { User, UserSignin, UserCreate } from "@/types/users"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function loginUser(credentials: UserSignin): Promise<{ access_token: string; token_type: string }> {
  try {
    const response = await fetch(`${API_URL}/users/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Failed to login")
    }

    return await response.json()
  } catch (error) {
    console.error("Error during login:", error)
    throw error
  }
}

export async function registerUser(userData: UserCreate): Promise<User> {
  try {
    const response = await fetch(`${API_URL}/users/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Failed to sign up")
    }

    return await response.json()
  } catch (error) {
    console.error("Error during registration:", error)
    throw error
  }
}

export async function getCurrentUser(token: string): Promise<User> {
  try {
    const response = await fetch(`${API_URL}/users/me/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to get user info")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching current user:", error)
    throw error
  }
}
