"use client"

import type React from "react"
import { useState, useEffect } from "react"

import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { Loader2, Menu, X } from "lucide-react"
import { Sidebar } from "@/components/layout/sidebar"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [showLoadingAnimation, setShowLoadingAnimation] = useState(true)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }

    // Hide loading animation after 1.5 seconds
    const timer = setTimeout(() => {
      setShowLoadingAnimation(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [user, isLoading, router])

  if (isLoading || showLoadingAnimation) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="text-center"
        >
          <motion.div
            animate={{
              rotate: 360,
              borderRadius: ["50% 50%", "40% 60%", "60% 40%", "50% 50%"],
            }}
            transition={{
              rotate: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
              borderRadius: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
            }}
            className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-4 flex items-center justify-center"
          >
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </motion.div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Loading Dashboard...
          </h3>
        </motion.div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50/50 to-purple-50/50">
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="bg-white/80 backdrop-blur-sm shadow-md border-blue-100 rounded-xl"
          >
            {isSidebarOpen ? <X className="h-5 w-5 text-blue-600" /> : <Menu className="h-5 w-5 text-blue-600" />}
          </Button>
        </motion.div>
      </div>

      {/* Sidebar - hidden on mobile unless toggled */}
      <AnimatePresence>
        {(isSidebarOpen || window.innerWidth >= 768) && (
          <motion.div
            className="fixed inset-0 z-40 md:relative md:z-0 md:w-64"
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div
              className="md:hidden absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsSidebarOpen(false)}
            ></div>
            <div className="relative z-50 h-full w-64 md:w-auto">
              <Sidebar />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <motion.div
        className="flex-1 p-4 md:p-8 pt-16 md:pt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 -z-10 w-64 h-64 bg-gradient-to-bl from-blue-200/20 to-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 -z-10 w-64 h-64 bg-gradient-to-tr from-purple-200/20 to-blue-200/20 rounded-full blur-3xl" />

        {children}
      </motion.div>
    </div>
  )
}
