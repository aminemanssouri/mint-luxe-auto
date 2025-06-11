"use client"

import type React from "react"

import { useState } from "react"
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

const timeSlots = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
]

const locations = [
  { id: "home", name: "At Your Location", icon: MapPin, price: "+$50" },
  { id: "workshop", name: "Our Premium Workshop", icon: Settings, price: "Free" },
  { id: "pickup", name: "Pickup & Delivery", icon: Truck, price: "+$100" },
]

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedService, setSelectedService] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
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

  const services = [
    {
      id: "maintenance",
      name: t.services.premiumMaintenance,
      price: "From $299",
      duration: "2-4 hours",
      description: t.services.maintenanceDesc,
      icon: Settings,
      features: ["Engine Diagnostics", "Oil Change", "Brake Inspection", "Tire Check"],
    },
    {
      id: "customization",
      name: t.services.customPersonalization,
      price: "From $2,999",
      duration: "1-2 weeks",
      description: t.services.personalizationDesc,
      icon: Star,
      features: ["Interior Customization", "Paint Protection", "Performance Upgrades", "Luxury Accessories"],
    },
    {
      id: "protection",
      name: t.services.conciergeProtection,
      price: "From $199/month",
      duration: "Ongoing",
      description: t.services.protectionDesc,
      icon: Shield,
      features: ["24/7 Monitoring", "Insurance Coverage", "Emergency Response", "Regular Inspections"],
    },
    {
      id: "delivery",
      name: t.services.whiteGloveDelivery,
      price: "From $499",
      duration: "Same day",
      description: t.services.deliveryDesc,
      icon: Truck,
      features: ["White Glove Service", "Professional Driver", "Real-time Tracking", "Premium Insurance"],
    },
  ]

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Booking submitted:", {
      service: selectedService,
      date: selectedDate,
      time: selectedTime,
      location: selectedLocation,
      ...formData,
    })
    alert("Booking submitted successfully!")
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return selectedService !== ""
      case 2:
        return selectedDate !== "" && selectedTime !== "" && selectedLocation !== ""
      case 3:
        return formData.firstName && formData.lastName && formData.email && formData.phone && formData.carModel
      case 4:
        return true
      default:
        return false
    }
  }

  const getSelectedService = () => services.find((s) => s.id === selectedService)
  const getSelectedLocation = () => locations.find((l) => l.id === selectedLocation)

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

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 sm:h-20 items-center justify-between">
            <Link
              href="/dashboard"
              className={`inline-flex items-center text-gold hover:text-gold/80 transition-colors ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <ArrowLeft className={`h-4 w-4 ${isRTL ? "ml-2 rotate-180" : "mr-2"}`} />
              <span className="hidden sm:inline">{t.common.backToDashboard}</span>
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
                    <div className="grid gap-4 sm:gap-6">
                      {services.map((service) => {
                        const Icon = service.icon
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
                                <div
                                  className={`p-2 rounded-lg ${selectedService === service.id ? "bg-gold/20" : "bg-zinc-700"}`}
                                >
                                  <Icon
                                    className={`h-5 w-5 ${selectedService === service.id ? "text-gold" : "text-white/70"}`}
                                  />
                                </div>
                                <div>
                                  <h3 className="font-medium text-white text-sm sm:text-base">{service.name}</h3>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <Badge variant="outline" className="text-gold border-gold/30 text-xs">
                                      {service.price}
                                    </Badge>
                                    <span className="text-xs text-white/60">• {service.duration}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <p className="text-sm text-white/70 mb-4">{service.description}</p>
                            <div className="grid grid-cols-2 gap-2">
                              {service.features.map((feature, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <CheckCircle className="h-3 w-3 text-gold" />
                                  <span className="text-xs text-white/80">{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Date, Time & Location */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <Card className="bg-zinc-900/50 border-zinc-800">
                    <CardHeader>
                      <CardTitle className="text-white text-xl sm:text-2xl">Select Date & Time</CardTitle>
                      <CardDescription className="text-white/70">
                        Choose your preferred appointment slot
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-white/80 mb-2">Preferred Date</label>
                          <Input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            min={new Date().toISOString().split("T")[0]}
                            className="bg-zinc-800/50 border-zinc-700 text-white h-12"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white/80 mb-2">Available Times</label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
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
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-900/50 border-zinc-800">
                    <CardHeader>
                      <CardTitle className="text-white">Service Location</CardTitle>
                      <CardDescription className="text-white/70">
                        Where would you like the service performed?
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4">
                        {locations.map((location) => {
                          const Icon = location.icon
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
                                  <Icon
                                    className={`h-5 w-5 ${selectedLocation === location.id ? "text-gold" : "text-white/70"}`}
                                  />
                                  <span className="text-white font-medium">{location.name}</span>
                                </div>
                                <Badge
                                  variant="outline"
                                  className={`${location.price === "Free" ? "text-green-400 border-green-400/30" : "text-gold border-gold/30"}`}
                                >
                                  {location.price}
                                </Badge>
                              </div>
                            </div>
                          )
                        })}
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
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span>Privacy protected</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                    clipRule="evenodd"
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
                            <span className="text-white">{getSelectedService()?.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/70">Duration:</span>
                            <span className="text-white">{getSelectedService()?.duration}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/70">Location:</span>
                            <span className="text-white">{getSelectedLocation()?.name}</span>
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
                        <div className="flex justify-between items-center">
                          <span className="text-white font-medium">Total Estimated Price:</span>
                          <span className="text-gold font-bold text-lg">{getSelectedService()?.price}</span>
                        </div>
                        {getSelectedLocation()?.price !== "Free" && (
                          <div className="flex justify-between items-center mt-2 text-sm">
                            <span className="text-white/70">Location Fee:</span>
                            <span className="text-gold">{getSelectedLocation()?.price}</span>
                          </div>
                        )}
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
