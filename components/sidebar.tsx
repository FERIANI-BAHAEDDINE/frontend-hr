"use client"

import type React from "react"

import { useAuth } from "@/context/auth-context"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, FileText, Users, CreditCard, MessageSquare, LogOut, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  const routes = [
    {
      label: "Dashboard",
      icon: BarChart3,
      href: "/dashboard",
      roles: ["hr", "finance", "employee"],
    },
    {
      label: "Employees",
      icon: Users,
      href: "/dashboard/employees",
      roles: ["hr"],
    },
    {
      label: "Documents",
      icon: FileText,
      href: "/dashboard/documents",
      roles: ["hr", "employee"],
    },
    {
      label: "Payslips",
      icon: CreditCard,
      href: "/dashboard/payslips",
      roles: ["hr", "finance", "employee"],
    },
    {
      label: "HR Assistant",
      icon: MessageSquare,
      href: "/dashboard/assistant",
      roles: ["hr"],
    },
    {
      label: "Profile",
      icon: User,
      href: "/dashboard/profile",
      roles: ["hr", "finance", "employee"],
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
      roles: ["hr", "finance", "employee"],
    },
  ]

  return (
    <div className={cn("pb-12 border-r h-full", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-xl font-semibold tracking-tight">HR Management</h2>
          <div className="px-2">
            <p className="text-sm text-muted-foreground">
              Logged in as <span className="font-medium">{user?.username}</span>
            </p>
            <p className="text-xs text-muted-foreground capitalize">Role: {user?.role}</p>
          </div>
        </div>
        <div className="px-3">
          <div className="space-y-1">
            {routes.map((route) => {
              // Only show routes that the user has access to
              if (!user || !route.roles.includes(user.role)) {
                return null
              }

              return (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-all",
                    pathname === route.href ? "bg-accent text-accent-foreground" : "transparent",
                  )}
                >
                  <route.icon className="h-4 w-4" />
                  {route.label}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
      <div className="px-3 absolute bottom-4 w-full pr-8">
        <Button variant="outline" className="w-full justify-start gap-3" onClick={logout}>
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}
