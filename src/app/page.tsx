"use client"

import { useAuth } from '@/components/providers/auth-provider'
import AuthForm from '@/components/auth/auth-form'
import Dashboard from '@/components/dashboard/dashboard'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AuthForm />
  }

  return <Dashboard />
}