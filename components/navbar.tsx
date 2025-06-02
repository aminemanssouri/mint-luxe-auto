"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import LanguageSwitcher from "@/components/language-switcher"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { t, isRTL } = useLanguage()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header
      className={`fixed top-0 z-40 w-full transition-all duration-300 ${
        isScrolled ? "bg-black/80 backdrop-blur-md" : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="relative h-10 w-32"
          >
            <span className="text-xl font-bold text-gold">LUXURY CARS</span>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden space-x-8 md:flex items-center">
          {[
            { key: "home", href: "#home" },
            { key: "collection", href: "/collection" },
            { key: "about", href: "#about" },
            { key: "services", href: "#services" },
            { key: "contact", href: "#contact" },
          ].map((item, i) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 + i * 0.1 }}
            >
              <Link
                href={item.href}
                className="text-sm font-medium tracking-wider text-white/80 transition-colors hover:text-gold"
              >
                {t.nav[item.key as keyof typeof t.nav]}
              </Link>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 1.0 }}
          >
            <LanguageSwitcher />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 1.1 }}
            className={`flex items-center ${isRTL ? "space-x-reverse space-x-4" : "space-x-4"}`}
          >
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:text-gold hover:bg-white/10"
              onClick={() => (window.location.href = "/auth/login")}
            >
              {t.nav.login}
            </Button>
            <Button
              size="sm"
              className="bg-gold hover:bg-gold/90 text-black"
              onClick={() => (window.location.href = "/auth/signup")}
            >
              {t.nav.signup}
            </Button>
          </motion.div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-4">
          <LanguageSwitcher />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white hover:bg-white/10"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-black/95 md:hidden"
        >
          <div className="container mx-auto px-4 py-6">
            <nav className="flex flex-col space-y-4">
              {[
                { key: "home", href: "#home" },
                { key: "collection", href: "/collection" },
                { key: "about", href: "#about" },
                { key: "services", href: "#services" },
                { key: "contact", href: "#contact" },
              ].map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className="text-lg font-medium tracking-wider text-white/80 transition-colors hover:text-gold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t.nav[item.key as keyof typeof t.nav]}
                </Link>
              ))}
            </nav>
            <div className="mt-6 pt-6 border-t border-white/20">
              <div className="flex flex-col space-y-3">
                <Button
                  variant="ghost"
                  className="text-white hover:text-gold hover:bg-white/10 justify-start"
                  onClick={() => {
                    setIsMenuOpen(false)
                    window.location.href = "/auth/login"
                  }}
                >
                  {t.nav.login}
                </Button>
                <Button
                  className="bg-gold hover:bg-gold/90 text-black justify-start"
                  onClick={() => {
                    setIsMenuOpen(false)
                    window.location.href = "/auth/signup"
                  }}
                >
                  {t.nav.signup}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  )
}
