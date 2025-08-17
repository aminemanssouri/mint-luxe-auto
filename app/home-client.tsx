"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
import SplashScreen from "@/components/splash-screen"
import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"

// Lazy load components for better performance
const TrustedBySection = dynamic(() => import("@/components/trusted-by-section"), {
  loading: () => <div className="h-32 animate-pulse bg-gray-800" />
})
const FeaturedCars = dynamic(() => import("@/components/featured-cars"), {
  loading: () => <div className="h-96 animate-pulse bg-gray-800" />
})
const AboutSection = dynamic(() => import("@/components/about-section"), {
  loading: () => <div className="h-64 animate-pulse bg-gray-800" />
})
const ServicesSection = dynamic(() => import("@/components/services-section"), {
  loading: () => <div className="h-96 animate-pulse bg-gray-800" />
})
const TestimonialSection = dynamic(() => import("@/components/testimonial-section"), {
  loading: () => <div className="h-64 animate-pulse bg-gray-800" />
})
const ContactSection = dynamic(() => import("@/components/contact-section"), {
  loading: () => <div className="h-96 animate-pulse bg-gray-800" />
})
const Footer = dynamic(() => import("@/components/footer"), {
  loading: () => <div className="h-32 animate-pulse bg-gray-800" />
})

export default function HomeClient() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Reduced loading time for better performance
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <AnimatePresence mode="wait">
        {loading ? (
          <SplashScreen key="splash" />
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-black text-white"
          >
            <Navbar />
            <HeroSection />
            <TrustedBySection />
            <FeaturedCars />
            <AboutSection />
            <ServicesSection />
            <TestimonialSection />
            <ContactSection />
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
