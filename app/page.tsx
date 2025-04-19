"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Background decorative elements */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-bl from-blue-200/20 to-purple-200/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-gradient-to-tr from-purple-200/20 to-blue-200/20 rounded-full blur-3xl -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-200/10 to-purple-200/10 rounded-full blur-3xl -z-10 animate-pulse-slow" />

      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/50 backdrop-blur-sm shadow-sm">
        <Link className="flex items-center justify-center" href="/">
          <motion.span
            className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            HR Management
          </motion.span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Link href="/login">
              <Button variant="ghost" className="hover:bg-white/50 hover:text-blue-600">
                Login
              </Button>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md">
                Sign Up
              </Button>
            </Link>
          </motion.div>
        </nav>
      </header>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative overflow-hidden">
          <div className="container px-4 md:px-6 relative z-10">
            <motion.div
              className="flex flex-col items-center space-y-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-2">
                <motion.h1
                  className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  HR Management System
                </motion.h1>
                <motion.p
                  className="mx-auto max-w-[700px] text-gray-500 md:text-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Streamline your HR operations with our comprehensive management system.
                </motion.p>
              </div>
              <motion.div
                className="space-x-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/login">
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg px-8 py-6 text-lg rounded-xl">
                    Get Started
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Animated background elements */}
          <div className="absolute -bottom-16 left-0 right-0 h-32 bg-gradient-to-t from-white/50 to-transparent backdrop-blur-sm"></div>
          <motion.div
            className="absolute top-1/4 left-10 w-16 h-16 rounded-full bg-blue-400/20 backdrop-blur-sm"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/3 right-10 w-24 h-24 rounded-full bg-purple-400/20 backdrop-blur-sm"
            animate={{ y: [0, -30, 0] }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/4 w-20 h-20 rounded-full bg-green-400/20 backdrop-blur-sm"
            animate={{ y: [0, -25, 0] }}
            transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.5 }}
          />
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-white/70 backdrop-blur-sm">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 items-center">
              {[
                {
                  title: "Employee Management",
                  description: "Easily manage employee records, documents, and performance reviews.",
                  color: "from-blue-500 to-blue-600",
                  delay: 0,
                },
                {
                  title: "Payroll Processing",
                  description: "Streamline payroll processing and ensure accurate and timely payments.",
                  color: "from-purple-500 to-purple-600",
                  delay: 0.1,
                },
                {
                  title: "AI-Powered Assistant",
                  description: "Get instant answers to HR questions with our AI-powered assistant.",
                  color: "from-indigo-500 to-indigo-600",
                  delay: 0.2,
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="space-y-2 bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + item.delay }}
                  whileHover={{ y: -5 }}
                >
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r ${item.color} flex items-center justify-center mb-4 shadow-md`}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="w-6 h-6 rounded-full border-2 border-white/80 border-t-transparent"
                    />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tighter bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    {item.title}
                  </h2>
                  <p className="text-gray-500 leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-white/50 backdrop-blur-sm">
        <motion.p
          className="text-xs text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          © 2023 HR Management System. All rights reserved.
        </motion.p>
      </footer>
    </div>
  )
}
