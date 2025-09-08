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

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    subscribeNewsletter: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { t, isRTL } = useLanguage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }
    if (!formData.agreeToTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy")
      return
    }
    setLoading(true)
    try {
      const supabase = createSupabaseBrowserClient()
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            newsletter: formData.subscribeNewsletter,
          },
        },
      })
      if (error) throw error
      const params = new URLSearchParams(window.location.search)
      const redirect = params.get("redirect") || "/"
      window.location.href = redirect
    } catch (err: any) {
      setError(err?.message || "Failed to sign up")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
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
          redirectTo: `${origin}${redirect}`,
        },
      })
      if (error) throw error
      // Supabase will handle browser redirect
    } catch (err: any) {
      setError(err?.message || `Failed to continue with ${provider}`)
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
            <CardTitle className="text-2xl font-bold text-white">{t.auth.createAccount}</CardTitle>
            <CardDescription className="text-white/70">{t.auth.signUpSubtitle}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-white/80 mb-2">
                    {t.auth.firstName}
                  </label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="John"
                    className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-white/80 mb-2">
                    {t.auth.lastName}
                  </label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Doe"
                    className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500"
                  />
                </div>
              </div>

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
                <label htmlFor="phone" className="block text-sm font-medium text-white/80 mb-2">
                  {t.auth.phone}
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
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

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/80 mb-2">
                  {t.auth.confirmPassword}
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder={t.auth.confirmPassword}
                    className={`bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 ${isRTL ? "pl-10" : "pr-10"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white ${isRTL ? "left-3" : "right-3"}`}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    required
                    className="mt-1 rounded border-zinc-700 bg-zinc-800 text-gold focus:ring-gold"
                  />
                  <span className={`text-sm text-white/70 ${isRTL ? "mr-2" : "ml-2"}`}>
                    {t.auth.agreeToTerms.split("Terms of Service").map((part, index) => (
                      <span key={index}>
                        {part}
                        {index === 0 && (
                          <Link href="/terms" className="text-gold hover:text-gold/80">
                            {t.auth.termsOfService}
                          </Link>
                        )}
                        {index === 0 && " and "}
                        {index === 0 && (
                          <Link href="/privacy" className="text-gold hover:text-gold/80">
                            {t.auth.privacyPolicy}
                          </Link>
                        )}
                      </span>
                    ))}
                  </span>
                </label>
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    name="subscribeNewsletter"
                    checked={formData.subscribeNewsletter}
                    onChange={handleInputChange}
                    className="mt-1 rounded border-zinc-700 bg-zinc-800 text-gold focus:ring-gold"
                  />
                  <span className={`text-sm text-white/70 ${isRTL ? "mr-2" : "ml-2"}`}>
                    {t.auth.subscribeNewsletter}
                  </span>
                </label>
              </div>

              {error && (
                <div className="text-sm text-red-400">{error}</div>
              )}

              <Button disabled={loading} type="submit" className="w-full bg-gold hover:bg-gold/90 text-black font-medium">
                {t.auth.signUp}
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
                    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
                    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.267 16.108 18.79 14 24 14c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
                    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.197l-6.19-5.238C29.145 35.091 26.715 36 24 36c-5.202 0-9.62-3.317-11.283-7.946l-6.522 5.026C9.505 39.556 16.227 44 24 44z"/>
                    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-3.994 5.565l.003-.002 6.19 5.238C39.051 36.507 44 31.5 44 24c0-1.341-.138-2.651-.389-3.917z"/>
                  </svg>
                  {t.auth.google}
                </Button>
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-white/60">
              {t.auth.alreadyHaveAccount}{" "}
              <Link href="/auth/login" className="text-gold hover:text-gold/80">
                {t.nav.login}
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
