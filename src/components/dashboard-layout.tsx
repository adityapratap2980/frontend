"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  LayoutDashboard,
  Brain,
  History,
  User,
  LogOut,
  Bell,
  Stethoscope,
  Menu,
  Lightbulb,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Link, useNavigate, useLocation } from "react-router-dom"

interface DashboardLayoutProps {
  children: React.ReactNode
}

interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  role: string
  clinicId: string
}

// Simple module-scoped cache to prevent repeated /auth/me calls across tab changes
let cachedUser: User | null = null
let userFetchInFlight: Promise<User | null> | null = null
let userValidatedOnce = false

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "New Prediction", href: "/dashboard/prediction", icon: Brain },
  { name: "Case History", href: "/dashboard/cases", icon: History },
  { name: "AI Suggestions", href: "/dashboard/ai-suggestions", icon: Lightbulb },
  { name: "Profile", href: "/dashboard/profile", icon: User },
]

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      navigate('/login')
      return
    }

    // 1) Immediate hydration: module cache → localStorage → keep loading false to avoid flicker
    if (cachedUser) {
      setUser(cachedUser)
    } else {
      try {
        const stored = localStorage.getItem('auth_user')
        if (stored) {
          const parsed = JSON.parse(stored)
          setUser(parsed)
          cachedUser = parsed
        }
      } catch {
        // ignore
      }
    }
    setLoading(false)

    // 2) Validate only once per app session; guard with in-flight promise
    if (userValidatedOnce) {
      return
    }
    userValidatedOnce = true

    if (!userFetchInFlight) {
      userFetchInFlight = (async () => {
        try {
          const response = await fetch('http://localhost:8000/auth/me/', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          })

          if (!response.ok) {
            localStorage.removeItem('auth_token')
            localStorage.removeItem('auth_user')
            cachedUser = null
            navigate('/login')
            return null
          }

          const userData = await response.json()
          cachedUser = userData
          setUser(userData)
          try {
            localStorage.setItem('auth_user', JSON.stringify(userData))
          } catch {
            // ignore
          }
          return userData
        } catch (error) {
          console.error('Failed to fetch user:', error)
          localStorage.removeItem('auth_token')
          localStorage.removeItem('auth_user')
          cachedUser = null
          navigate('/login')
          return null
        } finally {
          userFetchInFlight = null
        }
      })()
    }

    // Optional: consumers could await userFetchInFlight here if needed
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    cachedUser = null
    userValidatedOnce = false
    userFetchInFlight = null
    navigate('/login')
  }

  const isActivePath = (path: string) => {
    // Ensure only one active tab at a time; Dashboard only on exact match
    if (path === "/dashboard") return location.pathname === "/dashboard"
    return location.pathname === path || location.pathname.startsWith(path + "/")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-3 px-6 border-b border-sidebar-border">
            <div className="bg-sidebar-accent rounded-lg p-2">
              <Stethoscope className="h-6 w-6 text-sidebar-accent-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-sidebar-foreground">VetAnemia AI</h1>
              <p className="text-xs text-muted-foreground">ML Diagnostics</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActivePath(item.href) ? "bg-sidebar-primary text-sidebar-primary-foreground" : undefined,
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User section */}
          <div className="border-t border-sidebar-border p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start gap-3 h-auto p-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/caring-vet.png" />
                    <AvatarFallback>
                      {user ? `${user.firstName[0]}${user.lastName[0]}` : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="text-sm font-medium text-sidebar-foreground">
                      {user ? `${user.firstName} ${user.lastName}` : 'User'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user?.role || 'User'}
                    </p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
          <div className="flex h-16 items-center gap-4 px-6">
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>

            <div className="flex-1" />

            <Button variant="ghost" size="sm">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
