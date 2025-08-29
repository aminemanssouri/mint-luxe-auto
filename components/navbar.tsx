"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, LogOut, User, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import LanguageSwitcher from "@/components/language-switcher"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClient as createBrowserSupabase } from "@/lib/supabase/client"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { t, isRTL } = useLanguage()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userInitials, setUserInitials] = useState<string>("?")

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

  // Fetch auth user on mount
  useEffect(() => {
    const supabase = createBrowserSupabase()
    supabase.auth.getUser().then(({ data }) => {
      const email = data.user?.email ?? null
      setUserEmail(email)
      if (email) {
        const initials = email.substring(0, 2).toUpperCase()
        setUserInitials(initials)
      }
    })
  }, [])

  const handleLogout = async () => {
    try {
      const supabase = createBrowserSupabase()
      await supabase.auth.signOut()
      // Simple client redirect
      window.location.href = "/"
    } catch (e) {
      console.error(e)
    }
  }

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
            className="relative h-16 w-64"
          >
            <Image
              src="/Gemini_Generated_Image_1vhj7r1vhj7r1vhj-removebg-preview.png"
              alt="Luxury Cars Logo"
              fill
              className="object-contain"
              priority
            />
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
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
              className="text-sm font-medium tracking-wider text-white/80 transition-colors hover:text-gold"
            >
              {t.nav[item.key as keyof typeof t.nav]}
            </Link>
          ))}
          <LanguageSwitcher />
          <div className={`flex items-center ${isRTL ? "space-x-reverse space-x-4" : "space-x-4"}`}>
            {userEmail ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:bg-white/10">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gold/20 text-gold">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden lg:inline text-sm text-white/80">{userEmail}</span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={isRTL ? "start" : "end"} className="w-56 bg-black border border-white/10 text-white">
                  <DropdownMenuItem className="hover:bg-white/10 focus:bg-white/10 focus:text-white" onClick={() => (window.location.href = "/my-bookings")}> 
                    <Calendar className="mr-2 h-4 w-4" /> My Bookings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-white/10 focus:bg-white/10 focus:text-white" onClick={() => (window.location.href = "/profile")}>
                    <User className="mr-2 h-4 w-4" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem className="text-red-400 hover:bg-white/10 focus:bg-white/10 focus:text-red-400" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
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
              </>
            )}
          </div>
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
                {userEmail ? (
                  <>
                    <Button
                      variant="ghost"
                      className="text-white hover:text-gold hover:bg-white/10 justify-start"
                      onClick={() => {
                        setIsMenuOpen(false)
                        window.location.href = "/my-bookings"
                      }}
                    >
                      <Calendar className="mr-2 h-4 w-4" /> My Bookings
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-white hover:text-gold hover:bg-white/10 justify-start"
                      onClick={() => {
                        setIsMenuOpen(false)
                        window.location.href = "/profile"
                      }}
                    >
                      <User className="mr-2 h-4 w-4" /> Profile
                    </Button>
                    <Button
                      variant="destructive"
                      className="justify-start"
                      onClick={() => {
                        setIsMenuOpen(false)
                        handleLogout()
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" /> Logout
                    </Button>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  )
}

