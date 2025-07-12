// components/RouteGuard.tsx
"use client"
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface RouteGuardProps {
  children: React.ReactNode
  requireAdmin?: boolean
  requireAuth?: boolean
}

const RouteGuard = ({ children, requireAdmin = false, requireAuth = true }: RouteGuardProps) => {
  const { user, isAuthenticated, isLoading, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        router.push('/login')
        return
      }

      if (requireAdmin && !isAdmin()) {
        router.push('/unauthorized')
        return
      }
    }
  }, [isAuthenticated, isLoading, requireAuth, requireAdmin, router, isAdmin])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  if (requireAuth && !isAuthenticated) {
    return null
  }

  if (requireAdmin && !isAdmin()) {
    return null
  }

  return <>{children}</>
}

export default RouteGuard