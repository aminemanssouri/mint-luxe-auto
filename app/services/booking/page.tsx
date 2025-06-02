"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Clock, Car } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import LanguageSwitcher from "@/components/language-switcher"

const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"]

export default function BookingPage() {
  const [selectedService, setSelectedService] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    carModel: "",
    specialRequests: "",
  })
  const { t, isRTL } = useLanguage()

  const services = [
    {
      id: "maintenance",
      name: t.services.premiumMaintenance,
      price: "From $299",
      duration: "2-4 hours",
      description: t.services.maintenanceDesc,
    },
    {
      id: "customization",
      name: t.services.customPersonalization,
      price: "From $2,999",
      duration: "1-2 weeks",
      description: t.services.personalizationDesc,
    },
    {
      id: "protection",
      name: t.services.conciergeProtection,
      price: "From $199/month",
      duration: "Ongoing",
      description: t.services.protectionDesc,
    },
    {
      id: "delivery",
      name: t.services.whiteGloveDelivery,
      price: "From $499",
      duration: "Same day",
      description: t.services.deliveryDesc,
    },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle booking submission
    console.log("Booking submitted:", {
      service: selectedService,
      date: selectedDate,
      time: selectedTime,
      ...formData,
    })
    // Redirect to confirmation page
    alert("Booking submitted successfully!")
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link
              href="/dashboard"
              className={`inline-flex items-center text-gold hover:text-gold/80 transition-colors ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <ArrowLeft className={`h-4 w-4 ${isRTL ? "ml-2 rotate-180" : "mr-2"}`} />
              <span>{t.common.backToDashboard}</span>
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">{t.services.bookService}</h1>
            <p className="text-white/70">Schedule your luxury car service appointment</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Service Selection */}
                <Card className="bg-zinc-900/50 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="text-white">{t.services.selectService}</CardTitle>
                    <CardDescription className="text-white/70">{t.services.selectServiceDesc}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      {services.map((service) => (
                        <div
                          key={service.id}
                          className={`p-4 rounded-lg border cursor-pointer transition-all ${
                            selectedService === service.id
                              ? "border-gold bg-gold/10"
                              : "border-zinc-700 bg-zinc-800/30 hover:border-zinc-600"
                          }`}
                          onClick={() => setSelectedService(service.id)}
                        >
                          <div className={`flex items-start mb-2 ${isRTL ? "justify-start" : "justify-between"}`}>
                            <h3 className="font-medium text-white">{service.name}</h3>
                            <Badge variant="outline" className={`text-gold border-gold/30 ${isRTL ? "mr-auto" : ""}`}>
                              {service.price}
                            </Badge>
                          </div>
                          <p className="text-sm text-white/70 mb-2">{service.description}</p>
                          <div className="flex items-center text-xs text-white/60">
                            <Clock className={`h-3 w-3 ${isRTL ? "ml-1" : "mr-1"}`} />
                            {service.duration}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Date & Time Selection */}
                <Card className="bg-zinc-900/50 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="text-white">{t.services.selectDateTime}</CardTitle>
                    <CardDescription className="text-white/70">{t.services.selectDateTimeDesc}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">{t.services.preferredDate}</label>
                      <Input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        className="bg-zinc-800/50 border-zinc-700 text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">{t.services.preferredTime}</label>
                      <div className="grid grid-cols-4 gap-2">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            type="button"
                            className={`p-2 text-sm rounded border transition-all ${
                              selectedTime === time
                                ? "border-gold bg-gold/10 text-gold"
                                : "border-zinc-700 bg-zinc-800/30 text-white hover:border-zinc-600"
                            }`}
                            onClick={() => setSelectedTime(time)}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <Card className="bg-zinc-900/50 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="text-white">{t.services.contactInfo}</CardTitle>
                    <CardDescription className="text-white/70">{t.services.contactInfoDesc}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">{t.auth.firstName}</label>
                        <Input
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="John"
                          className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">{t.auth.lastName}</label>
                        <Input
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Doe"
                          className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">{t.auth.email}</label>
                        <Input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="john@example.com"
                          className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">{t.auth.phone}</label>
                        <Input
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+1 (555) 123-4567"
                          className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">{t.services.carModel}</label>
                      <Input
                        name="carModel"
                        value={formData.carModel}
                        onChange={handleInputChange}
                        placeholder="e.g., Phantom Spectre 2024"
                        className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        {t.services.specialRequests}
                      </label>
                      <Textarea
                        name="specialRequests"
                        value={formData.specialRequests}
                        onChange={handleInputChange}
                        placeholder="Any specific requirements or concerns..."
                        rows={3}
                        className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Button
                  type="submit"
                  className="w-full bg-gold hover:bg-gold/90 text-black font-medium py-6"
                  disabled={!selectedService || !selectedDate || !selectedTime}
                >
                  {t.services.confirmBooking}
                </Button>
              </form>
            </div>

            {/* Booking Summary */}
            <div>
              <Card className="bg-zinc-900/50 border-zinc-800 sticky top-8">
                <CardHeader>
                  <CardTitle className="text-white">{t.services.bookingSummary}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedService && (
                    <div className="p-3 rounded-lg bg-zinc-800/30">
                      <div className={`flex items-center mb-2 ${isRTL ? "space-x-reverse space-x-2" : "space-x-2"}`}>
                        <Car className="h-4 w-4 text-gold" />
                        <span className="text-sm font-medium text-white">Service</span>
                      </div>
                      <p className="text-white/70">{services.find((s) => s.id === selectedService)?.name}</p>
                    </div>
                  )}

                  {selectedDate && (
                    <div className="p-3 rounded-lg bg-zinc-800/30">
                      <div className={`flex items-center mb-2 ${isRTL ? "space-x-reverse space-x-2" : "space-x-2"}`}>
                        <Calendar className="h-4 w-4 text-gold" />
                        <span className="text-sm font-medium text-white">Date</span>
                      </div>
                      <p className="text-white/70">{selectedDate}</p>
                    </div>
                  )}

                  {selectedTime && (
                    <div className="p-3 rounded-lg bg-zinc-800/30">
                      <div className={`flex items-center mb-2 ${isRTL ? "space-x-reverse space-x-2" : "space-x-2"}`}>
                        <Clock className="h-4 w-4 text-gold" />
                        <span className="text-sm font-medium text-white">Time</span>
                      </div>
                      <p className="text-white/70">{selectedTime}</p>
                    </div>
                  )}

                  <div className="pt-4 border-t border-zinc-700">
                    <div className={`flex items-center ${isRTL ? "justify-start" : "justify-between"}`}>
                      <span className="text-white font-medium">{t.services.estimatedPrice}</span>
                      <span className={`text-gold font-bold ${isRTL ? "mr-auto" : ""}`}>
                        {selectedService ? services.find((s) => s.id === selectedService)?.price : "Select service"}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-white/60 space-y-1">
                    <p>• Final pricing may vary based on specific requirements</p>
                    <p>• You will receive a confirmation email within 24 hours</p>
                    <p>• Cancellation available up to 48 hours before appointment</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
