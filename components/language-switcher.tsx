"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Globe, ChevronDown } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import type { Language } from "@/lib/i18n"

const languages = [
  { code: "en" as Language, name: "English", flag: "🇺🇸" },
  { code: "ar" as Language, name: "العربية", flag: "🇸🇦" },
  { code: "fr" as Language, name: "Français", flag: "🇫🇷" },
]

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const currentLanguage = languages.find((lang) => lang.code === language)

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="text-white hover:text-gold hover:bg-white/10 flex items-center space-x-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{currentLanguage?.flag}</span>
        <span className="hidden md:inline">{currentLanguage?.name}</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 z-50 min-w-[160px] rounded-lg border border-zinc-800 bg-zinc-900/95 backdrop-blur-sm shadow-lg"
            >
              <div className="p-1">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-md transition-colors ${
                      language === lang.code ? "bg-gold/10 text-gold" : "text-white hover:bg-white/10"
                    }`}
                    onClick={() => {
                      setLanguage(lang.code)
                      setIsOpen(false)
                    }}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
