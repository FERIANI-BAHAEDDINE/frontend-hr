"use client"

import type React from "react"
import { useState, useEffect } from "react"

import { useAuth } from "@/context/auth-context"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, FileText, Users, CreditCard, MessageSquare, LogOut, Settings, User, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeRoute, setActiveRoute] = useState("")

  // Set active route on mount and when pathname changes
  useEffect(() => {
    setActiveRoute(pathname)
  }, [pathname])

  const routes = [
    {
      label: "Dashboard",
      icon: BarChart3,
      href: "/dashboard",
      roles: ["hr", "finance", "employee"],
      color: "from-blue-400 to-blue-600",
    },
    {
      label: "Employees",
      icon: Users,
      href: "/dashboard/employees",
      roles: ["hr"],
      color: "from-green-400 to-green-600",
    },
    {
      label: "Documents",
      icon: FileText,
      href: "/dashboard/documents",
      roles: ["hr", "employee"],
      color: "from-amber-400 to-amber-600",
    },
    {
      label: "Payslips",
      icon: CreditCard,
      href: "/dashboard/payslips",
      roles: ["hr", "finance", "employee"],
      color: "from-purple-400 to-purple-600",
    },
    {
      label: "HR Assistant",
      icon: MessageSquare,
      href: "/dashboard/assistant",
      roles: ["hr"],
      color: "from-indigo-400 to-indigo-600",
    },
    {
      label: "Profile",
      icon: User,
      href: "/dashboard/profile",
      roles: ["hr", "finance", "employee"],
      color: "from-pink-400 to-pink-600",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
      roles: ["hr", "finance", "employee"],
      color: "from-gray-400 to-gray-600",
    },
  ]

  return (
    <div
      className={cn(
        "pb-12 border-r h-full bg-gradient-to-b from-blue-50 to-purple-50 text-sidebar-foreground relative",
        className,
      )}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-200/30 to-purple-200/30 rounded-full blur-2xl -z-10" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-200/30 to-blue-200/30 rounded-full blur-2xl -z-10" />

      <div className="space-y-4 py-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="px-4 py-2"
        >
          <h2 className="mb-2 px-2 text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            HR Management
          </h2>
          <div className="px-2 bg-white/50 backdrop-blur-sm rounded-lg p-2 shadow-sm">
            <p className="text-sm text-sidebar-foreground/70">
              Logged in as <span className="font-medium">{user?.username}</span>
            </p>
            <p className="text-xs text-sidebar-foreground/70 capitalize">Role: {user?.role}</p>
          </div>
        </motion.div>

        {/* Mobile menu toggle */}
        <div className="md:hidden absolute top-4 right-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-sidebar-foreground"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Routes */}
        <div className="px-3">
          <AnimatePresence>
            <motion.div
              className={cn(
                "space-y-1",
                "md:block", // Always show on desktop
                isMobileMenuOpen ? "block" : "hidden", // Toggle on mobile
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {routes.map((route, index) => {
                // Only show routes that the user has access to
                if (!user || !route.roles.includes(user.role)) {
                  return null
                }

                const isActive = pathname === route.href

                return (
                  <motion.div
                    key={route.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Link
                      href={route.href}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all relative overflow-hidden group",
                        isActive ? "text-white shadow-md" : "text-sidebar-foreground hover:bg-white/50 hover:shadow-sm",
                      )}
                      onClick={() => {
                        setActiveRoute(route.href)
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      {/* Background gradient for active item */}
                      {isActive && (
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-r ${route.color} -z-10`}
                          layoutId="activeBackground"
                          initial={false}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}

                      {/* Icon with animation */}
                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                        className={cn(
                          "rounded-lg p-1",
                          isActive ? "text-white" : "text-sidebar-foreground/70 group-hover:text-sidebar-foreground",
                        )}
                      >
                        <route.icon className="h-4 w-4" />
                      </motion.div>

                      {/* Label */}
                      <span>{route.label}</span>

                      {/* Indicator dot for active route */}
                      {isActive && (
                        <motion.div
                          className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white"
                          layoutId="activeDot"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                )
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Logout button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="px-3 absolute bottom-4 w-full pr-8"
      >
        <Button
          variant="outline"
          className="w-full justify-start gap-3 bg-white hover:bg-red-50 text-gray-700 hover:text-red-600 border-gray-200 hover:border-red-200 shadow-sm transition-colors"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </motion.div>
    </div>
  )
}
