"use client"

import type React from "react"

import { useAuth } from "@/context/auth-context"
import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Send, Bot, UserIcon, RefreshCw, Sparkles, Download, Copy } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { motion, AnimatePresence } from "framer-motion"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  sources?: string[]
}

export default function AssistantPage() {
  const { token, user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(true)

  // Redirect if not HR
  useEffect(() => {
    if (user && user.role !== "hr") {
      router.push("/dashboard")
    }
  }, [user, router])

  useEffect(() => {
    // Scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Initialize with a welcome message
  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Bonjour! Je suis votre assistant RH. Comment puis-je vous aider aujourd'hui?",
      },
    ])

    // Hide welcome animation after 3 seconds
    const timer = setTimeout(() => {
      setShowWelcomeAnimation(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token || !input.trim()) return

    const userMessage = input
    setInput("")

    // Generate a unique ID for the message
    const userMessageId = `user-${Date.now()}`
    const assistantMessageId = `assistant-${Date.now()}`

    // Add user message to chat
    setMessages((prev) => [...prev, { id: userMessageId, role: "user", content: userMessage }])

    setIsLoading(true)
    setIsTyping(true)

    try {
      // Direct API call to the backend
      const response = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: userMessage }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      
      // Simulate typing effect
      setTimeout(() => {
        setIsTyping(false)

        // Add assistant message to chat
        setMessages((prev) => [
          ...prev,
          {
            id: assistantMessageId,
            role: "assistant",
            content: data.response.answer,
            sources: data.response.sources,
          },
        ])
      }, 500)
    } catch (error) {
      console.error("Error sending message:", error)
      setIsTyping(false)

      let errorMessage = "Désolé, j'ai rencontré une erreur lors du traitement de votre demande. Veuillez réessayer."

      // Try to get a more specific error message
      if (error instanceof Error) {
        errorMessage = `Erreur: ${error.message}`
      }

      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get response",
      })

      // Add error message to chat
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: errorMessage,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // Add a function to handle the reset button with confirmation
  const handleReset = () => {
    if (messages.length > 1 && !confirm("Are you sure you want to reset the conversation?")) {
      return
    }

    setMessages([
      {
        id: "welcome-reset",
        role: "assistant",
        content: "Bonjour! Je suis votre assistant RH. Comment puis-je vous aider aujourd'hui?",
      },
    ])

    toast({
      title: "Conversation reset",
      description: "The conversation has been reset.",
    })
  }

  // Update the sources display to be more readable and handle long filenames better
  const formatSourceFilename = (source: string) => {
    // Extract just the filename from the path
    const filename = source.split("/").pop() || source

    // If the filename starts with "cv_", remove that prefix
    const cleanedName = filename.startsWith("cv_") ? filename.substring(3) : filename

    // If the filename is too long, truncate it
    return cleanedName.length > 50 ? cleanedName.substring(0, 47) + "..." : cleanedName
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
      duration: 2000,
    })
  }

  return (
    <>
      {/* Welcome animation overlay */}
      <AnimatePresence>
        {showWelcomeAnimation && (
          <motion.div
            className="fixed inset-0 bg-gradient-to-br from-blue-600/90 to-purple-600/90 z-50 flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="inline-block mb-4"
              >
                <Bot className="h-24 w-24 text-white" />
              </motion.div>
              <motion.h1
                className="text-4xl font-bold text-white mb-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                HR Assistant
              </motion.h1>
              <motion.p
                className="text-xl text-white/80"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Your AI-powered HR companion
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6 relative">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -z-10 w-72 h-72 bg-gradient-to-bl from-purple-300/30 to-blue-300/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -z-10 w-72 h-72 bg-gradient-to-tr from-blue-300/30 to-purple-300/30 rounded-full blur-3xl" />

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            HR Assistant
          </h1>
          <p className="text-muted-foreground">AI-powered assistant to help with recruitment and HR questions</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative"
        >
          <Card className="flex flex-col h-[calc(100vh-16rem)] border-none shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-lg pb-6">
              <CardTitle className="flex items-center gap-2 text-white">
                <Bot className="h-5 w-5 text-white" />
                HR Assistant
              </CardTitle>
              <CardDescription className="text-white/80">
                Ask questions about recruitment, HR policies, or employee management
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4 bg-white/50 relative">
              {/* Decorative pattern */}
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fillOpacity='0.4' fillRule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E\")",
                    backgroundSize: "20px 20px",
                  }}
                ></div>
              </div>

              <div className="space-y-4 relative">
                <AnimatePresence initial={false}>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                        duration: 0.4,
                      }}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`flex gap-3 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : ""} group`}>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <Avatar
                            className={`h-8 w-8 ${
                              msg.role === "user"
                                ? "bg-gradient-to-br from-blue-500 to-purple-600 shadow-md"
                                : "bg-gradient-to-br from-indigo-400 to-cyan-400 shadow-md"
                            }`}
                          >
                            <AvatarFallback
                              className={
                                msg.role === "user"
                                  ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
                                  : "bg-gradient-to-br from-indigo-400 to-cyan-400 text-white"
                              }
                            >
                              {msg.role === "user" ? <UserIcon className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                            </AvatarFallback>
                          </Avatar>
                        </motion.div>

                        <div
                          className={`rounded-2xl px-4 py-3 shadow-lg relative ${
                            msg.role === "user"
                              ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
                              : "bg-white border border-gray-100"
                          }`}
                        >
                          {/* Message content */}
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>

                          {/* Sources section with enhanced styling */}
                          {msg.sources && msg.sources.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              transition={{ duration: 0.3, delay: 0.2 }}
                              className="mt-3 text-xs border-t pt-2"
                              style={{
                                borderColor: msg.role === "user" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)",
                              }}
                            >
                              <p className="font-semibold flex items-center gap-1 mb-1">
                                <Sparkles className="h-3 w-3" />
                                Sources:
                              </p>
                              <ul className="space-y-1">
                                {msg.sources.map((source, idx) => (
                                  <li
                                    key={idx}
                                    className="flex items-center gap-1 rounded-md p-1 hover:bg-black/5 transition-colors"
                                  >
                                    <span
                                      className="truncate hover:text-clip hover:whitespace-normal flex-1"
                                      title={source}
                                    >
                                      {formatSourceFilename(source)}
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                                      onClick={() => copyToClipboard(source)}
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                  </li>
                                ))}
                              </ul>
                            </motion.div>
                          )}

                          {/* Message timestamp */}
                          <div
                            className={`absolute -bottom-5 ${
                              msg.role === "user" ? "right-2" : "left-2"
                            } text-[10px] text-gray-400`}
                          >
                            {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex justify-start"
                    >
                      <div className="flex gap-3 max-w-[80%]">
                        <Avatar className="h-8 w-8 bg-gradient-to-br from-indigo-400 to-cyan-400 shadow-md">
                          <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-cyan-400 text-white">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="rounded-2xl px-4 py-3 bg-white border border-gray-100 shadow-lg">
                          <div className="flex space-x-2">
                            <motion.div
                              className="h-2 w-2 rounded-full bg-blue-400"
                              animate={{ scale: [0.5, 1, 0.5] }}
                              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
                            />
                            <motion.div
                              className="h-2 w-2 rounded-full bg-purple-400"
                              animate={{ scale: [0.5, 1, 0.5] }}
                              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
                            />
                            <motion.div
                              className="h-2 w-2 rounded-full bg-cyan-400"
                              animate={{ scale: [0.5, 1, 0.5] }}
                              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>
            </CardContent>

            <CardFooter className="border-t p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-b-lg">
              <form onSubmit={handleSendMessage} className="flex w-full gap-2">
                <Textarea
                  placeholder="Posez une question sur le recrutement, les politiques RH, ou la gestion des employés..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 min-h-10 resize-none bg-white/80 border-blue-200 focus-visible:ring-blue-400 rounded-xl shadow-inner"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage(e)
                    }
                  }}
                />
                <div className="flex flex-col gap-2">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      type="submit"
                      size="icon"
                      disabled={isLoading || !input.trim()}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md rounded-xl"
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={handleReset}
                      title="Restart conversation"
                      className="border-blue-200 bg-white hover:bg-blue-50 rounded-xl shadow-sm"
                    >
                      <RefreshCw className="h-4 w-4 text-blue-500" />
                    </Button>
                  </motion.div>
                </div>
              </form>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-end gap-2"
        >
          <Button variant="outline" size="sm" className="gap-1 text-xs">
            <Download className="h-3 w-3" /> Export Chat
          </Button>
        </motion.div>
      </div>
    </>
  )
}
