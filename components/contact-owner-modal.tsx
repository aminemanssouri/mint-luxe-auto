"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

interface ContactOwnerModalProps {
  onClose: () => void
  carName: string
}

export default function ContactOwnerModal({ onClose, carName }: ContactOwnerModalProps) {
  const { t, isRTL } = useLanguage()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: `I'm interested in the ${carName} and would like more information.`,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Contact form submitted:", formData)
    // Close modal after submission
    onClose()
    // Show success message
    alert("Your message has been sent. The owner will contact you shortly.")
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-900 p-6"
      >
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-4 text-white hover:text-gold ${isRTL ? "left-4" : "right-4"}`}
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>

        <h2 className="mb-6 text-2xl font-bold text-white">{t.carDetails.contactOwnerTitle}</h2>
        <p className="mb-6 text-white/70">
          Send a message to the owner about the <span className="text-gold">{carName}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-1">
              {t.carDetails.yourName}
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1">
              {t.carDetails.emailAddress}
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-white/80 mb-1">
              {t.carDetails.phoneNumber}
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-white/80 mb-1">
              {t.carDetails.message}
            </label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              rows={4}
              className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500"
            />
          </div>

          <div className="flex items-center">
            <input
              id="privacy"
              type="checkbox"
              required
              className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-gold focus:ring-gold"
            />
            <label htmlFor="privacy" className={`text-sm text-white/70 ${isRTL ? "mr-2" : "ml-2"}`}>
              {t.carDetails.agreePrivacy}
            </label>
          </div>

          <Button type="submit" className="w-full bg-gold hover:bg-gold/90 text-black">
            {t.carDetails.sendMessage}
          </Button>
        </form>
      </motion.div>
    </motion.div>
  )
}
