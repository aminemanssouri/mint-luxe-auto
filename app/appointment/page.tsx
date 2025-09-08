"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingButton } from "@/components/ui/loading-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import LanguageSwitcher from "@/components/language-switcher"
import { Calendar, Clock, Video, MapPin, DollarSign, User, Mail, Phone, ArrowLeft, CheckCircle, XCircle } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { motion } from "framer-motion"
import { createClient as createSupabaseBrowserClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"

function formatMoney(n: number) {
  if (!Number.isFinite(n)) return "$0"
  return new Intl.NumberFormat('en-US', { 
    style: "currency", 
    currency: "USD" 
  }).format(n)
}

export default function PrivateAppointmentPage() {
  const router = useRouter()
  const [authChecked, setAuthChecked] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [appointmentType, setAppointmentType] = useState<"online" | "physical">("online")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    message: ""
  })
  const [booking, setBooking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<"success" | "error" | null>(null)
  const [modalText, setModalText] = useState<string>("")

  const appointmentPrice = appointmentType === "online" ? 30 : 50

  // Auth guard (client-side)
  useEffect(() => {
    const supabase = createSupabaseBrowserClient()
    supabase.auth.getUser().then(({ data }: { data: { user: SupabaseUser | null } }) => {
      setUser(data.user || null)
      setAuthChecked(true)
      if (!data.user) {
        router.replace(`/auth/login?next=${encodeURIComponent('/appointment')}`)
      }
    })
  }, [router])

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white/80">
        Checking authentication...
      </div>
    )
  }
  if (authChecked && !user) {
    return null
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleBookAppointment = async () => {
    setBooking(true)
    setError(null)
    
    try {
      // Create appointment in database
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appointmentType,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          date: formData.date,
          time: formData.time,
          message: formData.message
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to book appointment')
      }

      // Show success message briefly
      setSuccess(true)
      setModalType('success')
      setModalText('Appointment booked successfully. Redirecting to payment...')
      setModalOpen(true)
      
      // Redirect to checkout with appointment details after short delay
      setTimeout(() => {
        const params = new URLSearchParams({
          type: "appointment",
          appointmentId: data.appointment.id,
          appointmentType,
          amount: appointmentPrice.toString(),
          name: formData.name,
          date: formData.date,
          time: formData.time
        })
        
        router.push(`/checkout/appointment?${params.toString()}`)
      }, 1500)
      
    } catch (error) {
      console.error("Booking failed:", error)
      const msg = error instanceof Error ? error.message : 'Failed to book appointment'
      setError(msg)
      setModalType('error')
      setModalText(msg)
      setModalOpen(true)
    } finally {
      setBooking(false)
    }
  }

  const isFormValid = formData.name && formData.email && formData.phone && formData.date && formData.time

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 sticky top-0 z-40">
        <div className="container mx-auto px-4 pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)]">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="inline-flex items-center text-gold hover:text-gold/80 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span>Back to Home</span>
              </Link>
              <div className="h-6 w-px bg-zinc-700" />
              <h1 className="text-xl font-bold text-white">Book Appointment</h1>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="h-full max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Book Private Appointment
            </h2>
            <p className="text-white/70 text-lg">
              Schedule a personalized consultation with our luxury vehicle experts
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3 min-h-[calc(100vh-16rem)]">
            {/* Appointment Form */}
            <Card className="bg-zinc-900/50 border-zinc-800 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gold" />
                  Appointment Details
                </CardTitle>
                <CardDescription>
                  Choose your preferred meeting type and schedule your consultation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Appointment Type Selection */}
                <div className="space-y-3">
                  <Label className="text-white/80 text-base font-medium">Meeting Type</Label>
                  <RadioGroup
                    value={appointmentType}
                    onValueChange={(value) => setAppointmentType(value as "online" | "physical")}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="online" id="online" className="border-gold text-gold" />
                      <Label htmlFor="online" className="flex-1 cursor-pointer">
                        <Card className="bg-zinc-800/50 border-zinc-700 p-4 hover:border-gold/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <Video className="h-6 w-6 text-gold" />
                            <div>
                              <div className="text-white font-medium">Online Meeting</div>
                              <div className="text-white/60 text-sm">Video consultation via Zoom/Teams</div>
                              <Badge className="bg-gold/20 text-gold mt-2">$30</Badge>
                            </div>
                          </div>
                        </Card>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="physical" id="physical" className="border-gold text-gold" />
                      <Label htmlFor="physical" className="flex-1 cursor-pointer">
                        <Card className="bg-zinc-800/50 border-zinc-700 p-4 hover:border-gold/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <MapPin className="h-6 w-6 text-gold" />
                            <div>
                              <div className="text-white font-medium">In-Person Meeting</div>
                              <div className="text-white/60 text-sm">Visit our showroom location</div>
                              <Badge className="bg-gold/20 text-gold mt-2">$50</Badge>
                            </div>
                          </div>
                        </Card>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Personal Information */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white/80">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="John Doe"
                      className="bg-zinc-900 border-zinc-800 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white/80">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="john@example.com"
                      className="bg-zinc-900 border-zinc-800 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white/80">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="bg-zinc-900 border-zinc-800 text-white"
                  />
                </div>

                {/* Date and Time */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-white/80">Preferred Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange("date", e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="bg-zinc-900 border-zinc-800 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time" className="text-white/80">Preferred Time *</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => handleInputChange("time", e.target.value)}
                      className="bg-zinc-900 border-zinc-800 text-white"
                    />
                  </div>
                </div>

                {/* Additional Message */}
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-white/80">Additional Notes (Optional)</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    placeholder="Tell us about your preferences, specific vehicles you're interested in, or any questions you have..."
                    className="bg-zinc-900 border-zinc-800 text-white min-h-[100px]"
                  />
                </div>

                {error && (
                  <Alert className="bg-red-900/20 border-red-800">
                    <AlertTitle className="text-red-400">Booking Error</AlertTitle>
                    <AlertDescription className="text-red-300">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Success alert removed in favor of animated modal */}

                <Alert className="bg-zinc-900/60 border-zinc-800">
                  <Clock className="h-4 w-4" />
                  <AlertTitle>Appointment Duration</AlertTitle>
                  <AlertDescription>
                    Each consultation session lasts approximately 45-60 minutes. Our experts will provide personalized recommendations based on your needs.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Booking Summary */}
            <Card className="bg-zinc-900/50 border-zinc-800 h-fit">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-gold" />
                  Booking Summary
                </CardTitle>
                <CardDescription>Review your appointment details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg">
                    {appointmentType === "online" ? (
                      <Video className="h-5 w-5 text-gold" />
                    ) : (
                      <MapPin className="h-5 w-5 text-gold" />
                    )}
                    <div>
                      <div className="text-white font-medium">
                        {appointmentType === "online" ? "Online Meeting" : "In-Person Meeting"}
                      </div>
                      <div className="text-white/60 text-sm">
                        {appointmentType === "online" 
                          ? "Video consultation" 
                          : "Showroom visit"
                        }
                      </div>
                    </div>
                  </div>

                  {formData.date && formData.time && (
                    <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg">
                      <Calendar className="h-5 w-5 text-gold" />
                      <div>
                        <div className="text-white font-medium">
                          {new Date(formData.date).toLocaleDateString('en-US')}
                        </div>
                        <div className="text-white/60 text-sm">
                          {formData.time}
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.name && (
                    <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg">
                      <User className="h-5 w-5 text-gold" />
                      <div>
                        <div className="text-white font-medium">{formData.name}</div>
                        <div className="text-white/60 text-sm">Consultant</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-zinc-800 pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-white">Consultation Fee</span>
                    <span className="text-gold font-semibold text-lg">
                      {formatMoney(appointmentPrice)}
                    </span>
                  </div>

                  <LoadingButton
                    className="w-full bg-gold text-black hover:bg-gold/90"
                    onClick={handleBookAppointment}
                    loading={booking}
                    loadingText="Booking appointment..."
                    loadingDelay={400}
                    disabled={!isFormValid}
                  >
                    Book Appointment - {formatMoney(appointmentPrice)}
                  </LoadingButton>

                  <p className="text-white/60 text-xs mt-3 text-center">
                    Payment will be processed securely. You'll receive confirmation details via email.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Animated result modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-zinc-900/90 border-zinc-800 text-white">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="text-center space-y-3"
          >
            {modalType === 'success' ? (
              <CheckCircle className="h-12 w-12 mx-auto text-green-400" />
            ) : (
              <XCircle className="h-12 w-12 mx-auto text-red-400" />
            )}
            <DialogHeader>
              <DialogTitle>{modalType === 'success' ? 'Appointment Booked' : 'Booking Failed'}</DialogTitle>
              <DialogDescription className="text-white/70">{modalText}</DialogDescription>
            </DialogHeader>
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
