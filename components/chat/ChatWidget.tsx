'use client'

import { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send, Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'
import ChatMessages from './ChatMessages'
import ChatInput from './ChatInput'

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Load theme preference
    const savedTheme = localStorage.getItem('chat-theme')
    if (savedTheme === 'dark') {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  useEffect(() => {
    // Load chat history if session exists
    if (sessionId && isOpen) {
      loadChatHistory()
    }
  }, [sessionId, isOpen])

  const loadChatHistory = async () => {
    if (!sessionId) return
    
    try {
      const response = await fetch(`/api/chat?sessionId=${sessionId}`)
      const data = await response.json()
      if (data.messages) {
        setMessages(data.messages.map((m: any) => ({
          role: m.role,
          content: m.content
        })))
      }
    } catch (error) {
      console.error('Failed to load chat history:', error)
    }
  }

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    if (newTheme) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('chat-theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('chat-theme', 'light')
    }
  }

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return

    const userMessage = { role: 'user', content: message }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, sessionId })
      })

      const data = await response.json()
      
      if (data.sessionId && !sessionId) {
        setSessionId(data.sessionId)
      }

      if (data.response) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I apologize, but I'm having trouble processing your request. Please try again."
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            "fixed bottom-6 right-6 z-50 flex items-center justify-center",
            "w-14 h-14 rounded-full shadow-lg",
            "bg-blue-600 hover:bg-blue-700 text-white",
            "transition-all duration-300 hover:scale-110",
            "dark:bg-blue-500 dark:hover:bg-blue-600"
          )}
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={cn(
            "fixed bottom-6 right-6 z-50 w-96 h-[600px]",
            "rounded-lg shadow-2xl flex flex-col",
            "bg-white dark:bg-gray-800",
            "border border-gray-200 dark:border-gray-700",
            "transition-all duration-300"
          )}
        >
          {/* Header */}
          <div
            className={cn(
              "flex items-center justify-between p-4",
              "bg-blue-600 dark:bg-blue-700 text-white",
              "rounded-t-lg"
            )}
          >
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <h3 className="font-semibold">Kenmark ITan Solutions</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-1.5 hover:bg-blue-700 dark:hover:bg-blue-600 rounded transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-blue-700 dark:hover:bg-blue-600 rounded transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <ChatMessages messages={messages} isLoading={isLoading} />

          {/* Input */}
          <ChatInput onSend={handleSendMessage} disabled={isLoading} />
        </div>
      )}
    </>
  )
}

