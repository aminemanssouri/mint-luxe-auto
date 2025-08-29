"use client"

import type React from "react"

import { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Car,
  User,
  MapPin,
  CheckCircle,
  Star,
  Shield,
  Truck,
  Settings,
} from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import LanguageSwitcher from "@/components/language-switcher"
import { createClient as createSupabaseBrowserClient } from "@/lib/supabase/client"

type ServiceItem = {
  id: string
  name: string
  description: string | null
  base_price: string
  currency?: string
}

type LocationItem = {
  id: string
  name: string
  location_type?: string | null
  address?: string | null
  city?: string | null
  state?: string | null
  zip_code?: string | null
  country?: string | null
  additional_cost: string
  currency?: string
}

type TimeSlot = {
  id: string
  start_time: string
  end_time: string
  day_of_week: number | null
  specific_date: string | null
  is_available: boolean
  max_booking: number | null
}

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [authChecked, setAuthChecked] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [selectedService, setSelectedService] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [selectedLocation, setSelectedLocation] = useState<string>("")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    carModel: "",
    carYear: "",
    address: "",
    specialRequests: "",
    preferredContact: "email",
    newsletter: false,
  })
  const { t, isRTL } = useLanguage()
  const [services, setServices] = useState<ServiceItem[]>([])
  const [locations, setLocations] = useState<LocationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [slotsError, setSlotsError] = useState<string | null>(null)
  const [selectedTimeSlotId, setSelectedTimeSlotId] = useState<string>("")

  useEffect(() => {
    // Check auth on mount
    const supabase = createSupabaseBrowserClient()
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user || null)
      setAuthChecked(true)
    })
  }, [])

  useEffect(() => {
    let active = true
    async function load() {
      try {
        setLoading(true)
        const [srvRes, locRes] = await Promise.all([
          fetch("/api/services"),
          fetch("/api/service-locations"),
        ])
        const [srvJson, locJson] = await Promise.all([srvRes.json(), locRes.json()])
        if (!active) return
        if (srvJson?.ok) setServices(srvJson.items || [])
        else setError(srvJson?.error || "Failed to load services")
        if (locJson?.ok) setLocations(locJson.items || [])
        else setError((e) => e || locJson?.error || "Failed to load locations")
      } catch (e: any) {
        if (active) setError(e?.message || "Failed to load data")
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [])

  // Load time slots whenever date changes (or initially)
  useEffect(() => {
    let active = true
    async function loadSlots() {
      try {
        setSlotsLoading(true)
        setSlotsError(null)
        const url = selectedDate ? `/api/time-slots?date=${encodeURIComponent(selectedDate)}` : "/api/time-slots"
        const res = await fetch(url)
        const json = await res.json()
        if (!active) return
        if (json?.ok) {
          const items = json.items || []
          // Fallback: if no slots for the chosen date, show default available slots
          if (selectedDate && items.length === 0) {
            const fallbackRes = await fetch("/api/time-slots")
            const fallbackJson = await fallbackRes.json()
            if (!active) return
            if (fallbackJson?.ok) setTimeSlots(fallbackJson.items || [])
            else setSlotsError(fallbackJson?.error || "Failed to load time slots")
          } else {
            setTimeSlots(items)
          }
        } else {
          setSlotsError(json?.error || "Failed to load time slots")
        }
      } catch (e: any) {
        if (active) setSlotsError(e?.message || "Failed to load time slots")
      } finally {
        if (active) setSlotsLoading(false)
      }
    }
    loadSlots()
    return () => {
      active = false
    }
  }, [selectedDate])

  const steps = [
    { id: 1, title: "Select Service", description: "Choose your preferred service" },
    { id: 2, title: "Date & Time", description: "Pick your appointment slot" },
    { id: 3, title: "Contact Info", description: "Provide your details" },
    { id: 4, title: "Review & Confirm", description: "Confirm your booking" },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    })
  }

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getSelectedService = useMemo(() => services.find((s) => s.id === selectedService), [services, selectedService])
  const getSelectedLocation = useMemo(() => locations.find((l) => l.id === selectedLocation), [locations, selectedLocation])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const body = {
        service_id: selectedService || null,
        vehicle_id: null,
        service_location_id: selectedLocation || null,
        preferred_date: selectedDate || null,
        time_slot_id: selectedTimeSlotId || null,
        base_price: getSelectedService?.base_price ?? 0,
        location_fee: getSelectedLocation?.additional_cost ?? 0,
        service_address: formData.address || null,
        special_request: formData.specialRequests || null,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
      }
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (!json?.ok) throw new Error(json?.error || "Failed to create booking")
      alert("Booking submitted successfully!")
    } catch (err: any) {
      alert(err?.message || "Failed to submit booking")
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return selectedService !== ""
      case 2:
        return selectedDate !== "" && selectedTimeSlotId !== "" && selectedLocation !== ""
      case 3:
        return formData.firstName && formData.lastName && formData.email && formData.phone && formData.carModel
      case 4:
        return true
      default:
        return false
    }
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  }

  if (authChecked && !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <Card className="max-w-md w-full bg-zinc-900/60 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Sign in required</CardTitle>
            <CardDescription className="text-white/70">Please log in to book a service.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button className="flex-1 bg-gold hover:bg-gold/90 text-black" onClick={() => (window.location.href = "/auth/login")}>
                Login
              </Button>
              <Button variant="outline" className="flex-1 border-zinc-700 text-white hover:bg-zinc-800" onClick={() => (window.location.href = "/auth/signup")}>
                Sign up
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 sm:h-20 items-center justify-between">
            <Link
              href="/"
              className={`inline-flex items-center text-gold hover:text-gold/80 transition-colors ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <ArrowLeft className={`h-4 w-4 ${isRTL ? "ml-2 rotate-180" : "mr-2"}`} />
              <span className="hidden sm:inline">{t.common.backToHome}</span>
              <span className="sm:hidden">Back</span>
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Book Your Service</h1>
              <p className="text-white/70 text-sm sm:text-base">
                Step {currentStep} of {steps.length}: {steps[currentStep - 1].description}
              </p>
            </div>
            <div className="text-right">
              <div className="text-gold font-medium text-sm sm:text-base">
                {Math.round((currentStep / steps.length) * 100)}% Complete
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <Progress value={(currentStep / steps.length) * 100} className="h-2 mb-4" />

          {/* Step Indicators */}
          <div className="flex  justify-between">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                    currentStep >= step.id ? "bg-gold text-black" : "bg-zinc-800 text-white/60"
                  }`}
                >
                  {currentStep > step.id ? <CheckCircle className="w-4 h-4" /> : step.id}
                </div>
                <div className="text-xs text-white/60 mt-1 text-center hidden sm:block">{step.title}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" custom={currentStep}>
            <motion.div
              key={currentStep}
              custom={currentStep}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
            >
              {/* Step 1: Service Selection */}
              {currentStep === 1 && (
                <Card className="bg-zinc-900/50 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="text-white text-xl sm:text-2xl">Choose Your Service</CardTitle>
                    <CardDescription className="text-white/70">
                      Select the service that best fits your needs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="text-white/70">Loading services...</div>
                    ) : error ? (
                      <div className="text-red-400">{error}</div>
                    ) : (
                      <div className="grid gap-4 sm:gap-6">
                        {services.map((service) => {
                          return (
                            <div
                              key={service.id}
                              className={`p-4 sm:p-6 rounded-lg border cursor-pointer transition-all hover:scale-[1.02] ${
                                selectedService === service.id
                                  ? "border-gold bg-gold/10 shadow-lg shadow-gold/20"
                                  : "border-zinc-700 bg-zinc-800/30 hover:border-zinc-600"
                              }`}
                              onClick={() => setSelectedService(service.id)}
                            >
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                  <div className={`p-2 rounded-lg ${selectedService === service.id ? "bg-gold/20" : "bg-zinc-700"}`}>
                                    <Settings className={`h-5 w-5 ${selectedService === service.id ? "text-gold" : "text-white/70"}`} />
                                  </div>
                                  <div>
                                    <h3 className="font-medium text-white text-sm sm:text-base">{service.name}</h3>
                                    <div className="flex items-center space-x-2 mt-1">
                                      <Badge variant="outline" className="text-gold border-gold/30 text-xs">
                                        {(service.currency || 'USD') + ' ' + service.base_price}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <p className="text-sm text-white/70 mb-2">{service.description}</p>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Date, Time & Location */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  {/* Date & Time */}
                  <Card className="bg-zinc-900/50 border-zinc-800">
                    <CardHeader>
                      <CardTitle className="text-white text-xl sm:text-2xl">Select Date & Time</CardTitle>
                      <CardDescription className="text-white/70">Choose a date and available time slot</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Preferred Date *</label>
                        <Input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => {
                            setSelectedDate(e.target.value)
                            setSelectedTimeSlotId("")
                            setSelectedTime("")
                          }}
                          className="bg-zinc-800/50 border-zinc-700 text-white h-12"
                        />
                      </div>
                      <div>
                        <div className="text-sm text-white/80 mb-2">Available Time Slots</div>
                        {slotsLoading ? (
                          <div className="text-white/70">Loading time slots...</div>
                        ) : slotsError ? (
                          <div className="text-red-400">{slotsError}</div>
                        ) : timeSlots.length === 0 ? (
                          <div className="text-white/70">No time slots available for the selected date.</div>
                        ) : (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                            {timeSlots.map((slot) => {
                              const label = `${slot.start_time} - ${slot.end_time}`
                              const selected = selectedTimeSlotId === slot.id
                              return (
                                <button
                                  key={slot.id}
                                  type="button"
                                  onClick={() => {
                                    setSelectedTimeSlotId(slot.id)
                                    setSelectedTime(label)
                                  }}
                                  className={`px-3 py-2 rounded border text-sm transition ${
                                    selected ? "border-gold bg-gold/10 text-gold" : "border-zinc-700 text-white/80 hover:border-zinc-600"
                                  }`}
                                >
                                  {label}
                                </button>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Location */}
                  <Card className="bg-zinc-900/50 border-zinc-800">
                    <CardHeader>
                      <CardTitle className="text-white text-xl sm:text-2xl">Select Location</CardTitle>
                      <CardDescription className="text-white/70">Where would you like the service performed?</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4">
                        {loading ? (
                          <div className="text-white/70">Loading locations...</div>
                        ) : error ? (
                          <div className="text-red-400">{error}</div>
                        ) : (
                          locations.map((location) => {
                            return (
                              <div
                                key={location.id}
                                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                                  selectedLocation === location.id
                                    ? "border-gold bg-gold/10"
                                    : "border-zinc-700 bg-zinc-800/30 hover:border-zinc-600"
                                }`}
                                onClick={() => setSelectedLocation(location.id)}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <MapPin className={`h-5 w-5 ${selectedLocation === location.id ? "text-gold" : "text-white/70"}`} />
                                    <span className="text-white font-medium">{location.name}</span>
                                  </div>
                                  <Badge
                                    variant="outline"
                                    className={Number(location.additional_cost) > 0 ? "text-gold border-gold/30" : "text-green-400 border-green-400/30"}
                                  >
                                    {Number(location.additional_cost) > 0 ? `+ ${(location.currency || 'USD')} ${location.additional_cost}` : "Free"}
                                  </Badge>
                                </div>
                              </div>
                            )
                          })
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Step 3: Contact Information */}
              {currentStep === 3 && (
                <Card className="bg-zinc-900/50 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="text-white text-xl sm:text-2xl">Contact Information</CardTitle>
                    <CardDescription className="text-white/70">
                      Please provide your details for the appointment
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">First Name *</label>
                        <Input
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="John"
                          className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 h-12"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Last Name *</label>
                        <Input
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Doe"
                          className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 h-12"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Email Address *</label>
                        <Input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="john@example.com"
                          className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 h-12"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Phone Number *</label>
                        <Input
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+1 (555) 123-4567"
                          className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 h-12"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Car Model *</label>
                        <Input
                          name="carModel"
                          value={formData.carModel}
                          onChange={handleInputChange}
                          placeholder="e.g., Phantom Spectre"
                          className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 h-12"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Year</label>
                        <Input
                          name="carYear"
                          value={formData.carYear}
                          onChange={handleInputChange}
                          placeholder="2024"
                          className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 h-12"
                        />
                      </div>
                    </div>

                    {selectedLocation === "home" && (
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Service Address *</label>
                        <Input
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="123 Main Street, City, State, ZIP"
                          className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 h-12"
                          required
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Special Requests</label>
                      <Textarea
                        name="specialRequests"
                        value={formData.specialRequests}
                        onChange={handleInputChange}
                        placeholder="Any specific requirements or concerns..."
                        rows={3}
                        className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500"
                      />
                    </div>

                    <div className="space-y-6">
                      {/* Preferred Contact Method */}
                      <div className="p-4 rounded-lg bg-zinc-800/30 border border-zinc-700">
                        <label className="block text-sm font-medium text-white/80 mb-4">
                          How would you prefer us to contact you?
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <label className="cursor-pointer">
                            <input
                              type="radio"
                              name="preferredContact"
                              value="email"
                              checked={formData.preferredContact === "email"}
                              onChange={handleInputChange}
                              className="sr-only"
                            />
                            <div
                              className={`p-4 rounded-lg border-2 transition-all text-center ${
                                formData.preferredContact === "email"
                                  ? "border-gold bg-gold/10 text-gold"
                                  : "border-zinc-600 bg-zinc-800/50 text-white/70 hover:border-zinc-500"
                              }`}
                            >
                              <div className="flex flex-col items-center space-y-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                  />
                                </svg>
                                <span className="font-medium">Email</span>
                                <span className="text-xs opacity-75">Quick & convenient</span>
                              </div>
                            </div>
                          </label>

                          <label className="cursor-pointer">
                            <input
                              type="radio"
                              name="preferredContact"
                              value="phone"
                              checked={formData.preferredContact === "phone"}
                              onChange={handleInputChange}
                              className="sr-only"
                            />
                            <div
                              className={`p-4 rounded-lg border-2 transition-all text-center ${
                                formData.preferredContact === "phone"
                                  ? "border-gold bg-gold/10 text-gold"
                                  : "border-zinc-600 bg-zinc-800/50 text-white/70 hover:border-zinc-500"
                              }`}
                            >
                              <div className="flex flex-col items-center space-y-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                  />
                                </svg>
                                <span className="font-medium">Phone</span>
                                <span className="text-xs opacity-75">Direct & personal</span>
                              </div>
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* Newsletter Subscription */}
                      <div className="p-4 rounded-lg bg-gradient-to-r from-gold/5 to-gold/10 border border-gold/20">
                        <label className="flex items-start space-x-4 cursor-pointer group">
                          <div className="relative flex-shrink-0 mt-1">
                            <input
                              type="checkbox"
                              name="newsletter"
                              checked={formData.newsletter}
                              onChange={handleInputChange}
                              className="sr-only"
                            />
                            <div
                              className={`w-5 h-5 rounded border-2 transition-all ${
                                formData.newsletter
                                  ? "bg-gold border-gold"
                                  : "border-zinc-500 group-hover:border-gold/50"
                              }`}
                            >
                              {formData.newsletter && (
                                <svg
                                  className="w-3 h-3 text-black absolute top-0.5 left-0.5"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-white font-medium">Stay in the loop</span>
                              <span className="px-2 py-0.5 bg-gold/20 text-gold text-xs rounded-full font-medium">
                                Exclusive
                              </span>
                            </div>
                            <p className="text-white/70 text-sm leading-relaxed">
                              Get exclusive offers, luxury car insights, and be the first to know about our premium
                              services and events.
                            </p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-white/60">
                              <span className="flex items-center space-x-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                  />
                                </svg>
                                <span>Privacy protected</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                  />
                                </svg>
                                <span>Unsubscribe anytime</span>
                              </span>
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 4: Review & Confirm */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <Card className="bg-zinc-900/50 border-zinc-800">
                    <CardHeader>
                      <CardTitle className="text-white text-xl sm:text-2xl">Review Your Booking</CardTitle>
                      <CardDescription className="text-white/70">
                        Please review all details before confirming
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Service Details */}
                      <div className="p-4 rounded-lg bg-zinc-800/30 border border-zinc-700">
                        <div className="flex items-center space-x-3 mb-3">
                          <Car className="h-5 w-5 text-gold" />
                          <h3 className="font-medium text-white">Service Details</h3>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-white/70">Service:</span>
                            <span className="text-white">{getSelectedService?.name}</span>
                          </div>
                          {/* Duration not available from backend; can be added later */}
                          <div className="flex justify-between">
                            <span className="text-white/70">Location:</span>
                            <span className="text-white">{getSelectedLocation?.name}</span>
                          </div>
                        </div>
                      </div>

                      {/* Appointment Details */}
                      <div className="p-4 rounded-lg bg-zinc-800/30 border border-zinc-700">
                        <div className="flex items-center space-x-3 mb-3">
                          <Calendar className="h-5 w-5 text-gold" />
                          <h3 className="font-medium text-white">Appointment</h3>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-white/70">Date:</span>
                            <span className="text-white">{selectedDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/70">Time:</span>
                            <span className="text-white">{selectedTime}</span>
                          </div>
                        </div>
                      </div>

                      {/* Contact Details */}
                      <div className="p-4 rounded-lg bg-zinc-800/30 border border-zinc-700">
                        <div className="flex items-center space-x-3 mb-3">
                          <User className="h-5 w-5 text-gold" />
                          <h3 className="font-medium text-white">Contact Information</h3>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-white/70">Name:</span>
                            <span className="text-white">
                              {formData.firstName} {formData.lastName}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/70">Email:</span>
                            <span className="text-white">{formData.email}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/70">Phone:</span>
                            <span className="text-white">{formData.phone}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/70">Vehicle:</span>
                            <span className="text-white">
                              {formData.carModel} {formData.carYear}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Pricing */}
                      <div className="p-4 rounded-lg bg-gold/10 border border-gold/30">
                        {(() => {
                          const base = Number(getSelectedService?.base_price || 0)
                          const fee = Number(getSelectedLocation?.additional_cost || 0)
                          const currency = getSelectedService?.currency || getSelectedLocation?.currency || 'USD'
                          const total = base + fee
                          return (
                            <>
                              <div className="flex justify-between items-center">
                                <span className="text-white font-medium">Total Estimated Price:</span>
                                <span className="text-gold font-bold text-lg">{currency} {total.toFixed(2)}</span>
                              </div>
                              {fee > 0 && (
                                <div className="flex justify-between items-center mt-2 text-sm">
                                  <span className="text-white/70">Location Fee:</span>
                                  <span className="text-gold">{currency} {fee.toFixed(2)}</span>
                                </div>
                              )}
                            </>
                          )
                        })()}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          {currentStep > 1 ? (
            <Button
              onClick={handlePrevious}
              variant="outline"
              className="border-zinc-700 text-black hover:bg-zinc-800 h-12 px-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
          ) : (
            <div></div>
          )}

          {currentStep < 4 ? (
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="bg-gold hover:bg-gold/90 text-black font-medium disabled:opacity-50 h-12 px-6"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="bg-gold hover:bg-gold/90 text-black font-medium h-12 px-8">
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirm Booking
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
