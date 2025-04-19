export interface UserBase {
  username: string
  email: string
}

export interface UserCreate extends UserBase {
  password: string
  role: "hr" | "finance" | "employee"
}

export interface UserSignin {
  email: string
  password: string
}

export interface User extends UserBase {
  role: "hr" | "finance" | "employee"
}
