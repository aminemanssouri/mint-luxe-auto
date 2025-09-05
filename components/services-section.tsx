"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wrench, ArrowRight } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { createClient as createSupabaseBrowserClient } from "@/lib/supabase/client"

type Service = {
  id: string
  name: string
  description: string | null
  base_price: string
  currency?: string
}

export default function ServicesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })
  const { t, isRTL } = useLanguage()

  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    let active = true
    // auth state
    const supabase = createSupabaseBrowserClient()
    supabase.auth.getUser().then(({ data }: any) => {
      if (!active) return
      setUser(data.user || null)
      setAuthChecked(true)
    })

    async function load() {
      try {
        setLoading(true)
        const res = await fetch("/api/services")
        const json = await res.json()
        if (!active) return
        if (json?.ok && Array.isArray(json.items)) {
          setServices(json.items)
        } else {
          setError(json?.error || "Failed to load services")
        }
      } catch (e: any) {
        if (active) setError(e?.message || "Failed to load services")
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <section id="services" ref={ref} className="bg-gradient-to-b from-zinc-900 to-black py-24 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-white md:text-5xl">
            {t.home.servicesTitle.split("Services").map((part, index) => (
              <span key={index}>
                {part}
                {index === 0 && <span className="text-gold">Services</span>}
              </span>
            ))}
          </h2>
          <p className="mx-auto max-w-2xl text-white/70">{t.home.servicesSubtitle}</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {loading && (
            <div className="col-span-full text-center text-white/70">Loading services...</div>
          )}
          {error && !loading && (
            <div className="col-span-full text-center text-red-400">{error}</div>
          )}
          {!loading && !error && services.map((service) => (
            <motion.div key={service.id} variants={itemVariants}>
              <Card className="group h-full bg-zinc-800/50 border-zinc-700 transition-all duration-300 hover:bg-zinc-800 hover:border-gold/50">
                <CardHeader>
                  <div className={`mb-4 flex items-center ${isRTL ? "justify-start" : "justify-between"}`}>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gold/10">
                      <Wrench className="h-6 w-6 text-gold" />
                    </div>
                    <span className={`text-lg font-bold text-gold ${isRTL ? "mr-auto" : ""}`}>
                      {service.currency || 'USD'} {service.base_price}
                    </span>
                  </div>
                  <CardTitle className="text-xl text-white">{service.name}</CardTitle>
                  <CardDescription className="text-white/70">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full bg-gold hover:bg-gold/90 text-black"
                    onClick={() => {
                      if (authChecked && user) {
                        window.location.href = "/services/booking"
                      } else {
                        window.location.href = "/auth/login?redirect=/services/booking"
                      }
                    }}
                  >
                    {t.services.bookService}
                    <ArrowRight className={`${isRTL ? "mr-2 rotate-180" : "ml-2"} h-4 w-4`} />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="mx-auto max-w-3xl rounded-lg bg-gradient-to-r from-gold/10 to-gold/5 p-8 border border-gold/20">
            <h3 className="mb-4 text-2xl font-bold text-white">{t.home.needCustomService}</h3>
            <p className="mb-6 text-white/70">{t.home.needCustomServiceDesc}</p>
            <Button className="bg-gold hover:bg-gold/90 text-black" onClick={() => (window.location.href = "/contact")}>
              {t.home.contactSpecialists}
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
