"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import LanguageSwitcher from "@/components/language-switcher"
import { createClient as createSupabaseBrowserClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { t, isRTL } = useLanguage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const supabase = createSupabaseBrowserClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })
      if (error) throw error
      const params = new URLSearchParams(window.location.search)
      const redirect = params.get("redirect") || "/"
      window.location.href = redirect
    } catch (err: any) {
      setError(err?.message || "Failed to sign in")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleOAuth = async (provider: 'google') => {
    setError(null)
    setLoading(true)
    try {
      const supabase = createSupabaseBrowserClient()
      const params = new URLSearchParams(window.location.search)
      const redirect = params.get("redirect") || "/"
      const origin = window.location.origin
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(redirect)}`,
        },
      })
      if (error) throw error
      // Supabase will redirect the browser; nothing else to do here
    } catch (err: any) {
      setError(err?.message || `Failed to sign in with ${provider}`)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent" />

      {/* Language Switcher - Top Right */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageSwitcher />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="mb-8">
          <Link
            href="/"
            className={`inline-flex items-center text-gold hover:text-gold/80 transition-colors ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <ArrowLeft className={`h-4 w-4 ${isRTL ? "ml-2 rotate-180" : "mr-2"}`} />
            <span>{t.common.backToHome}</span>
          </Link>
        </div>

        <Card className="bg-zinc-900/80 border-zinc-800 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">{t.auth.welcomeBack}</CardTitle>
            <CardDescription className="text-white/70">{t.auth.signInSubtitle}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                  {t.auth.email}
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
                  {t.auth.password}
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={t.auth.password}
                    className={`bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 ${isRTL ? "pl-10" : "pr-10"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white ${isRTL ? "left-3" : "right-3"}`}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className={`flex items-center ${isRTL ? "justify-start" : "justify-between"}`}>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-zinc-700 bg-zinc-800 text-gold focus:ring-gold" />
                  <span className={`text-sm text-white/70 ${isRTL ? "mr-2" : "ml-2"}`}>{t.auth.rememberMe}</span>
                </label>
                <Link
                  href="/auth/forgot-password"
                  className={`text-sm text-gold hover:text-gold/80 ${isRTL ? "mr-auto" : ""}`}
                >
                  {t.auth.forgotPassword}
                </Link>
              </div>

              {error && (
                <div className="text-sm text-red-400">{error}</div>
              )}

              <Button disabled={loading} type="submit" className="w-full bg-gold hover:bg-gold/90 text-black font-medium">
                {t.auth.signIn}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-zinc-900 px-2 text-white/60">{t.auth.orContinueWith}</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3">
                <Button
                  variant="outline"
                  className="border-zinc-700 bg-zinc-800/50 text-white hover:bg-zinc-800"
                  onClick={() => handleOAuth('google')}
                  disabled={loading}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`}
                  >
                    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.651-.389-3.917z"/>
                    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.267 16.108 18.79 14 24 14c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
                    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.197l-6.19-5.238C29.145 35.091 26.715 36 24 36c-5.202 0-9.62-3.317-11.283-7.946l-6.522 5.026C9.505 39.556 16.227 44 24 44z"/>
                    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-3.994 5.565l.003-.002 6.19 5.238C39.051 36.507 44 31.5 44 24c0-1.341-.138-2.651-.389-3.917z"/>
                  </svg>
                  {t.auth.google}
                </Button>
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-white/60">
              {t.auth.dontHaveAccount}{" "}
              <Link href="/auth/signup" className="text-gold hover:text-gold/80">
                {t.nav.signup}
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
