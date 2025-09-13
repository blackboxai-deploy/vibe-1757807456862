"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'sonner'

interface User {
  id: string
  name: string
  email: string
  phone?: string
  emergencyContacts?: EmergencyContact[]
}

interface EmergencyContact {
  id: string
  name: string
  phone: string
  relationship: string
  priority: 'high' | 'medium' | 'low'
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('safety-app-user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Error parsing stored user:', error)
        localStorage.removeItem('safety-app-user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    
    // Simulate API call - Replace with actual authentication
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const mockUser: User = {
      id: 'user-1',
      name: 'Sarah Johnson',
      email,
      phone: '+1-555-123-4567',
      emergencyContacts: [
        {
          id: 'contact-1',
          name: 'Mom',
          phone: '+1-555-987-6543',
          relationship: 'Mother',
          priority: 'high'
        }
      ]
    }
    
    setUser(mockUser)
    localStorage.setItem('safety-app-user', JSON.stringify(mockUser))
    toast.success('Login successful! Welcome to your safety dashboard.')
    setIsLoading(false)
  }

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    
    // Simulate API call - Replace with actual registration
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      emergencyContacts: []
    }
    
    setUser(newUser)
    localStorage.setItem('safety-app-user', JSON.stringify(newUser))
    toast.success('Account created successfully! Welcome to Women Safety AI.')
    setIsLoading(false)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('safety-app-user')
    toast.info('You have been logged out safely.')
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem('safety-app-user', JSON.stringify(updatedUser))
    }
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}