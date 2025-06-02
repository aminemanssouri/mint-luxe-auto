"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import SplashScreen from "@/components/splash-screen"
import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import TrustedBySection from "@/components/trusted-by-section"
import FeaturedCars from "@/components/featured-cars"
import AboutSection from "@/components/about-section"
import ServicesSection from "@/components/services-section"
import TestimonialSection from "@/components/testimonial-section"
import ContactSection from "@/components/contact-section"
import Footer from "@/components/footer"

export default function Home() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time for the splash screen
    const timer = setTimeout(() => {
      setLoading(false)
    }, 3000)

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
