"use client"

import { useState } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Play,
  Fuel,
  Gauge,
  Clock,
  Power,
  Zap,
  Heart,
  Share,
  MessageSquare,
  X,
} from "lucide-react"
import ContactOwnerModal from "@/components/contact-owner-modal"
import { useLanguage } from "@/components/language-provider"
import LanguageSwitcher from "@/components/language-switcher"

// Mock data for the car details
const carData = {
  id: "phantom-spectre",
  name: "Phantom Spectre",
  year: 2024,
  price: "$450,000",
  location: "Beverly Hills, CA",
  description:
    "The Phantom Spectre represents the pinnacle of automotive luxury and performance. This limited edition masterpiece combines handcrafted excellence with cutting-edge technology to deliver an unparalleled driving experience. The cabin is adorned with the finest materials, including hand-stitched leather, polished wood veneers, and brushed aluminum accents.\n\nPowered by a magnificent V12 engine that produces 563 horsepower, the Phantom Spectre glides from 0 to 60 mph in just 4.3 seconds, all while maintaining its signature whisper-quiet cabin. The advanced suspension system reads the road ahead, adjusting in real-time to ensure the smoothest possible ride.\n\nThis particular model features a bespoke Celestial Blue exterior with Ivory White interior, a combination exclusive to only five vehicles worldwide. The starlight headliner recreates the night sky with over 1,600 hand-placed fiber optic lights, programmable to your preferred constellation.",
  specifications: {
    engine: "6.75L V12 Twin-Turbo",
    power: "563 hp",
    torque: "664 lb-ft",
    acceleration: "0-60 mph in 4.3s",
    topSpeed: "155 mph (limited)",
    transmission: "8-Speed Automatic",
    drivetrain: "Rear-Wheel Drive",
    fuelEconomy: "12 city / 20 hwy",
    fuelTank: "23.8 gallons",
    range: "476 miles",
    seating: "5 passengers",
    dimensions: '227.2" L x 79.5" W x 65.2" H',
    weight: "5,862 lbs",
    year: "2024",
  },
  features: [
    "Starlight Headliner",
    "Bespoke Audio System",
    "Rear Theater Configuration",
    "Picnic Tables",
    "Champagne Cooler",
    "Umbrella Storage",
    "Self-Closing Doors",
    "Active Cruise Control",
    "Night Vision",
    "Panoramic Sky Lounge",
    "Massage Seats",
    "Lambswool Floor Mats",
  ],
  images: [
    "/placeholder.svg?height=600&width=1000",
    "/placeholder.svg?height=600&width=1000",
    "/placeholder.svg?height=600&width=1000",
    "/placeholder.svg?height=600&width=1000",
    "/placeholder.svg?height=600&width=1000",
  ],
  videoThumbnail: "/placeholder.svg?height=600&width=1000",
  videoUrl: "#",
  owner: {
    name: "Luxury Cars Collection",
    response: "Usually responds within 2 hours",
    rating: 4.9,
    reviews: 24,
  },
}

export default function CarDetailsPage({ params }: { params: { id: string } }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [showVideo, setShowVideo] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [liked, setLiked] = useState(false)
  const { t, isRTL } = useLanguage()

  const { scrollYProgress } = useScroll()
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])
  const headerScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.95])
  const contentOpacity = useTransform(scrollYProgress, [0.1, 0.2], [0, 1])

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev === carData.images.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? carData.images.length - 1 : prev - 1))
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header with back button */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-black/80 to-transparent">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link
              href="/dashboard"
              className={`flex items-center text-white hover:text-gold transition-colors ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <ArrowLeft className={`h-5 w-5 ${isRTL ? "ml-2 rotate-180" : "mr-2"}`} />
              <span>{t.common.back}</span>
            </Link>
            <div className={`flex items-center ${isRTL ? "space-x-reverse space-x-4" : "space-x-4"}`}>
              <LanguageSwitcher />
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-gold"
                onClick={() => setLiked(!liked)}
              >
                <Heart className={`h-5 w-5 ${liked ? "fill-gold text-gold" : ""}`} />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:text-gold">
                <Share className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Main Image */}
      <motion.section
        style={{ opacity: headerOpacity, scale: headerScale }}
        className="relative h-screen w-full overflow-hidden"
      >
        <div className="absolute inset-0">
          <Image
            src={carData.images[activeImageIndex] || "/placeholder.svg"}
            alt={carData.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black" />
        </div>

        {/* Video Play Button */}
        {activeImageIndex === 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center h-20 w-20 rounded-full bg-gold/80 hover:bg-gold transition-colors"
            onClick={() => setShowVideo(true)}
          >
            <Play className="h-8 w-8 text-black" />
          </motion.button>
        )}

        {/* Image Navigation */}
        <div className="absolute bottom-1/2 left-4 right-4 flex justify-between">
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full bg-black/30 text-white hover:bg-black/50"
            onClick={prevImage}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full bg-black/30 text-white hover:bg-black/50"
            onClick={nextImage}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        {/* Car Name and Price */}
        <div className="absolute bottom-32 left-0 right-0 px-4">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-3xl"
            >
              <Badge className="mb-4 bg-gold/80 hover:bg-gold text-black">Featured</Badge>
              <h1 className="mb-2 text-4xl font-bold text-white md:text-6xl">{carData.name}</h1>
              <div className={`flex items-center ${isRTL ? "space-x-reverse space-x-2" : "space-x-2"}`}>
                <span className="text-2xl font-bold text-gold">{carData.price}</span>
                <span className="text-white/70">• {carData.year}</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Thumbnail Navigation */}
        <div className="absolute bottom-8 left-0 right-0 px-4">
          <div className="container mx-auto">
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {carData.images.map((image, index) => (
                <button
                  key={index}
                  className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all ${
                    activeImageIndex === index ? "border-gold" : "border-transparent"
                  }`}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${carData.name} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
              <button
                className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-md border-2 border-transparent"
                onClick={() => setShowVideo(true)}
              >
                <Image
                  src={carData.videoThumbnail || "/placeholder.svg"}
                  alt={`${carData.name} - Video`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Play className="h-6 w-6 text-white" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Main Content */}
      <motion.div style={{ opacity: contentOpacity }} className="relative z-10 bg-black">
        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Left Column - Car Details */}
            <div className="lg:col-span-2">
              {/* Key Specifications */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <h2 className="mb-6 text-2xl font-bold text-white">{t.carDetails.keySpecs}</h2>
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                  <div className="flex flex-col items-center rounded-lg bg-zinc-900/50 p-4 text-center">
                    <Fuel className="mb-2 h-6 w-6 text-gold" />
                    <span className="text-sm text-white/70">{t.carDetails.fuelTank}</span>
                    <span className="text-lg font-medium text-white">{carData.specifications.fuelTank}</span>
                  </div>
                  <div className="flex flex-col items-center rounded-lg bg-zinc-900/50 p-4 text-center">
                    <Gauge className="mb-2 h-6 w-6 text-gold" />
                    <span className="text-sm text-white/70">{t.carDetails.range}</span>
                    <span className="text-lg font-medium text-white">{carData.specifications.range}</span>
                  </div>
                  <div className="flex flex-col items-center rounded-lg bg-zinc-900/50 p-4 text-center">
                    <Clock className="mb-2 h-6 w-6 text-gold" />
                    <span className="text-sm text-white/70">{t.carDetails.acceleration}</span>
                    <span className="text-lg font-medium text-white">{carData.specifications.acceleration}</span>
                  </div>
                  <div className="flex flex-col items-center rounded-lg bg-zinc-900/50 p-4 text-center">
                    <Power className="mb-2 h-6 w-6 text-gold" />
                    <span className="text-sm text-white/70">{t.carDetails.horsepower}</span>
                    <span className="text-lg font-medium text-white">{carData.specifications.power}</span>
                  </div>
                </div>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <h2 className="mb-6 text-2xl font-bold text-white">{t.common.description}</h2>
                <div className="prose prose-invert max-w-none">
                  {carData.description.split("\n\n").map((paragraph, index) => (
                    <p key={index} className="mb-4 text-white/80">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </motion.div>

              {/* Full Specifications */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <h2 className="mb-6 text-2xl font-bold text-white">{t.carDetails.fullSpecs}</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {Object.entries(carData.specifications).map(([key, value]) => (
                    <div
                      key={key}
                      className={`flex rounded-lg bg-zinc-900/30 p-3 ${isRTL ? "justify-start" : "justify-between"}`}
                    >
                      <span className="text-white/70">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                      <span className={`font-medium text-white ${isRTL ? "mr-auto" : ""}`}>{value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <h2 className="mb-6 text-2xl font-bold text-white">{t.common.features}</h2>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                  {carData.features.map((feature, index) => (
                    <div
                      key={index}
                      className={`flex items-center rounded-lg bg-zinc-900/30 p-3 ${isRTL ? "space-x-reverse space-x-3" : "space-x-3"}`}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/10">
                        <Zap className="h-4 w-4 text-gold" />
                      </div>
                      <span className="text-white">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Contact and Actions */}
            <div>
              <div className="sticky top-20">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="mb-8 rounded-lg border border-zinc-800 bg-zinc-900/50 p-6"
                >
                  <h3 className="mb-4 text-xl font-bold text-white">{t.carDetails.contactOwnerTitle}</h3>
                  <div className="mb-6">
                    <p className="font-medium text-white">{carData.owner.name}</p>
                    <p className="text-sm text-white/70">{t.carDetails.usuallyResponds}</p>
                    <div className="mt-2 flex items-center">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(carData.owner.rating) ? "text-gold" : "text-zinc-600"}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className={`text-sm text-white/70 ${isRTL ? "mr-2" : "ml-2"}`}>
                        {carData.owner.rating} ({carData.owner.reviews} {t.carDetails.reviews})
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Button
                      className="w-full bg-gold hover:bg-gold/90 text-black"
                      onClick={() => setShowContactModal(true)}
                    >
                      <MessageSquare className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                      {t.carDetails.messageOwner}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-zinc-700 text-white hover:bg-zinc-800"
                      onClick={() => (window.location.href = "tel:+1234567890")}
                    >
                      {t.carDetails.requestCallback}
                    </Button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6"
                >
                  <h3 className="mb-4 text-xl font-bold text-white">{t.common.location}</h3>
                  <p className="mb-4 text-white/80">{carData.location}</p>
                  <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-zinc-800">
                    <Image
                      src="/placeholder.svg?height=300&width=400"
                      alt="Map location"
                      width={400}
                      height={300}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Similar Cars */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <h2 className="mb-6 text-2xl font-bold text-white">{t.carDetails.similarVehicles}</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="group overflow-hidden rounded-lg bg-zinc-900/50 transition-all duration-300 hover:bg-zinc-900"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={`/placeholder.svg?height=300&width=500`}
                      alt={`Similar Car ${item}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-white">Luxury Vehicle {item}</h3>
                    <p className="text-sm text-white/70">Starting from $350,000</p>
                    <Button
                      variant="link"
                      className="mt-2 p-0 text-gold hover:text-gold/80"
                      onClick={() => (window.location.href = `/cars/similar-${item}`)}
                    >
                      {t.common.details}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          >
            <div className="relative w-full max-w-4xl">
              <Button
                variant="ghost"
                size="icon"
                className="absolute -right-2 -top-12 text-white hover:text-gold"
                onClick={() => setShowVideo(false)}
              >
                <X className="h-6 w-6" />
              </Button>
              <div className="aspect-video w-full overflow-hidden rounded-lg bg-zinc-900">
                <iframe
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title={`${carData.name} Video`}
                  className="h-full w-full"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Modal */}
      <AnimatePresence>
        {showContactModal && <ContactOwnerModal onClose={() => setShowContactModal(false)} carName={carData.name} />}
      </AnimatePresence>
    </div>
  )
}
