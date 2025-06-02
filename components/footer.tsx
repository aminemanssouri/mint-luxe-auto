"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import Link from "next/link"
import { Instagram, Facebook, Twitter, Youtube } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const { t, isRTL } = useLanguage()

  return (
    <footer className="bg-zinc-900 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 md:grid-cols-4">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <span className="text-2xl font-bold text-gold">LUXURY CARS</span>
            </motion.div>
            <p className="mb-6 text-sm text-white/60">{t.footer.description}</p>
            <div className={`flex ${isRTL ? "space-x-reverse space-x-4" : "space-x-4"}`}>
              <Link href="#" className="text-white/60 hover:text-gold transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-white/60 hover:text-gold transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-white/60 hover:text-gold transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-white/60 hover:text-gold transition-colors">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">{t.footer.quickLinks}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-white/60 hover:text-gold transition-colors">
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/60 hover:text-gold transition-colors">
                  {t.nav.collection}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/60 hover:text-gold transition-colors">
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/60 hover:text-gold transition-colors">
                  {t.nav.services}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/60 hover:text-gold transition-colors">
                  {t.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">{t.footer.services}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-white/60 hover:text-gold transition-colors">
                  {t.footer.carSales}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/60 hover:text-gold transition-colors">
                  {t.footer.customOrders}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/60 hover:text-gold transition-colors">
                  {t.footer.financing}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/60 hover:text-gold transition-colors">
                  {t.footer.maintenance}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/60 hover:text-gold transition-colors">
                  {t.footer.concierge}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">{t.footer.newsletter}</h4>
            <p className="mb-4 text-sm text-white/60">{t.footer.newsletterDesc}</p>
            <form className="flex">
              <Input
                type="email"
                placeholder={t.footer.yourEmail}
                className={`border-zinc-700 bg-zinc-800/50 text-white placeholder:text-zinc-500 ${isRTL ? "rounded-l-none" : "rounded-r-none"}`}
              />
              <Button className={`bg-gold hover:bg-gold/90 text-black ${isRTL ? "rounded-r-none" : "rounded-l-none"}`}>
                {t.footer.subscribe}
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-16 border-t border-zinc-800 pt-8">
          <div className="flex flex-col items-center justify-between space-y-4 text-center md:flex-row md:text-left md:space-y-0">
            <p className="text-xs text-white/60">
              &copy; {currentYear} Luxury Cars. {t.footer.allRightsReserved}
            </p>
            <div className={`flex text-xs ${isRTL ? "space-x-reverse space-x-6" : "space-x-6"}`}>
              <Link href="#" className="text-white/60 hover:text-gold transition-colors">
                {t.footer.privacyPolicy}
              </Link>
              <Link href="#" className="text-white/60 hover:text-gold transition-colors">
                {t.footer.termsOfService}
              </Link>
              <Link href="#" className="text-white/60 hover:text-gold transition-colors">
                {t.footer.cookiePolicy}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
