"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useLanguage } from "@/components/language-provider"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient as createBrowserSupabase } from "@/lib/supabase/client"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogOut, Save, ArrowLeft } from "lucide-react"

export default function ProfilePage() {
  const { isRTL, t } = useLanguage()
  const [email, setEmail] = useState<string>("")
  const [initials, setInitials] = useState<string>("?")
  const [fullName, setFullName] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const supabase = createBrowserSupabase()
      const { data } = await supabase.auth.getUser()
      const user = data.user
      if (user) {
        const mail = user.email || ""
        setEmail(mail)
        setInitials(mail ? mail.substring(0, 2).toUpperCase() : "?")
        // Optionally load a profile table later
      }
      setLoading(false)
    }
    load()
  }, [])

  const handleLogout = async () => {
    const supabase = createBrowserSupabase()
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  const handleSave = async () => {
    // Placeholder for saving profile fields to a "profiles" table
    setMessage("Profile saved (demo)")
    setTimeout(() => setMessage(null), 2000)
  }

  return (
    <div className={`container mx-auto px-4 pt-28 pb-16 ${isRTL ? "rtl" : ""}`}>
      <div className="mb-4">
        <Link
          href="/"
          className={`inline-flex items-center text-white hover:text-gold transition-colors ${isRTL ? "flex-row-reverse" : ""}`}
        >
          <ArrowLeft className={`h-5 w-5 ${isRTL ? "ml-2 rotate-180" : "mr-2"}`} />
          <span>{(t as any)?.common?.back ?? "Back"}</span>
        </Link>
      </div>
      <motion.h1
        className="text-3xl font-semibold tracking-wide mb-6 text-white"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Profile
      </motion.h1>

      {loading ? (
        <p className="text-white/70">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-black/60 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-gold/20 text-gold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-white">{email || "User"}</p>
                  <p className="text-white/60 text-sm">Authenticated via Supabase</p>
                </div>
              </div>
              <div className="grid gap-2 pt-4">
                <Label htmlFor="fullName" className="text-white/80">Full Name</Label>
                <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} className="bg-black/60 border-white/20 text-white placeholder:text-white/60" placeholder="Your name" />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Button onClick={handleSave} className="bg-gold hover:bg-gold/90 text-black">
                  <Save className="mr-2 h-4 w-4" /> Save
                </Button>
                <Button variant="destructive" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </Button>
              </div>
              {message && <p className="text-green-400 text-sm pt-2">{message}</p>}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 bg-black/60 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">AI Personalization</CardTitle>
            </CardHeader>
            <CardContent className="text-white/70 space-y-3">
              <p>Coming soon: tailor the experience using your preferences and recent activity.</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>Recommended vehicles and services</li>
                <li>Smart reminders for upcoming bookings</li>
                <li>Dynamic offers based on your interests</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
