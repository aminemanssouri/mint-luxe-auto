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

  const handleOAuth = async (provider: 'google' | 'apple') => {
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
          redirectTo: `${origin}${redirect}`,
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

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="border-zinc-700 bg-zinc-800/50 text-white hover:bg-zinc-800"
                  onClick={() => handleOAuth('google')}
                  disabled={loading}
                >
                  {t.auth.google}
                </Button>
                <Button
                  variant="outline"
                  className="border-zinc-700 bg-zinc-800/50 text-white hover:bg-zinc-800"
                  onClick={() => handleOAuth('apple')}
                  disabled={loading}
                >
                  {t.auth.apple}
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
