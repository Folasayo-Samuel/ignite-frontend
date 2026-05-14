// [admin-login] 2026-05-13 — Separate admin login page, isolated from public /auth/login
"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAdminAuth } from "@/apis/admin-auth"
import { isAdminRole } from "@/lib/admin-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react"

export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") || "/admin/dashboard"

  const { loginAdmin, getCurrentAdmin } = useAdminAuth()
  const { mutateAsync: login, isPending } = loginAdmin

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  // If already logged in as admin, redirect immediately
  const { data: currentUser } = getCurrentAdmin()
  useEffect(() => {
    if (currentUser && isAdminRole(currentUser?.role)) {
      router.replace(redirectTo)
    }
  }, [currentUser, router, redirectTo])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.")
      return
    }

    try {
      // Step 1: Log in via the isolated admin auth endpoint
      const response = await login({ email: email.trim().toLowerCase(), password })
      const user = response.data.user
      const role = user?.role

      if (!isAdminRole(role)) {
        setError("Access denied. This login is for administrators only.")
        return
      }

      // Step 2: Redirect
      router.push(redirectTo)
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Invalid email or password."
      setError(message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1A2E] px-4">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1A1A2E] via-[#16162A] to-[#0F0F1A]" />

      <div className="relative z-10 w-full max-w-md">
        {/* Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-3">
            <Shield className="h-9 w-9 text-orange-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">
              FolaIgnite <span className="text-orange-400 font-normal">Admin</span>
            </h1>
          </div>
          <p className="text-sm text-gray-500">
            Platform administration portal
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-white/10 bg-white/5 backdrop-blur-sm shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-white">Sign in</CardTitle>
            <CardDescription className="text-gray-400">
              Enter your administrator credentials
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error message */}
              {error && (
                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="admin-email" className="text-gray-300 text-sm">
                  Email address
                </Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@folaignite.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  autoFocus
                  disabled={isPending}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-orange-400/50 focus:ring-orange-400/20"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="admin-password" className="text-gray-300 text-sm">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    disabled={isPending}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-orange-400/50 focus:ring-orange-400/20 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  "Sign in to Admin"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center mt-6 text-xs text-gray-600">
          This portal is restricted to authorized personnel.
          <br />
          If you need access, contact the platform administrator.
        </p>
      </div>
    </div>
  )
}
