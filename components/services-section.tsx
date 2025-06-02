"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wrench, Palette, Shield, Truck, Clock, Star, ArrowRight } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

export default function ServicesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })
  const { t, isRTL } = useLanguage()

  const services = [
    {
      id: 1,
      icon: Wrench,
      title: t.services.premiumMaintenance,
      description: t.services.maintenanceDesc,
      features: ["Regular service intervals", "Diagnostic checks", "Performance optimization", "Warranty protection"],
      price: "From $299",
    },
    {
      id: 2,
      icon: Palette,
      title: t.services.customPersonalization,
      description: t.services.personalizationDesc,
      features: ["Interior customization", "Exterior modifications", "Performance upgrades", "Unique finishes"],
      price: "From $2,999",
    },
    {
      id: 3,
      icon: Shield,
      title: t.services.conciergeProtection,
      description: t.services.protectionDesc,
      features: ["Insurance assistance", "Roadside support", "Security monitoring", "Emergency response"],
      price: "From $199/month",
    },
    {
      id: 4,
      icon: Truck,
      title: t.services.whiteGloveDelivery,
      description: t.services.deliveryDesc,
      features: ["Door-to-door service", "Secure transport", "Real-time tracking", "Professional handling"],
      price: "From $499",
    },
    {
      id: 5,
      icon: Clock,
      title: t.services.expressService,
      description: t.services.expressDesc,
      features: ["Priority scheduling", "Loaner vehicles", "Same-day service", "Mobile technicians"],
      price: "From $399",
    },
    {
      id: 6,
      icon: Star,
      title: t.services.vipMembership,
      description: t.services.vipDesc,
      features: ["Unlimited consultations", "Exclusive events", "Priority booking", "Special discounts"],
      price: "$999/year",
    },
  ]

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
          {services.map((service) => {
            const IconComponent = service.icon
            return (
              <motion.div key={service.id} variants={itemVariants}>
                <Card className="group h-full bg-zinc-800/50 border-zinc-700 transition-all duration-300 hover:bg-zinc-800 hover:border-gold/50">
                  <CardHeader>
                    <div className={`mb-4 flex items-center ${isRTL ? "justify-start" : "justify-between"}`}>
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gold/10">
                        <IconComponent className="h-6 w-6 text-gold" />
                      </div>
                      <span className={`text-lg font-bold text-gold ${isRTL ? "mr-auto" : ""}`}>{service.price}</span>
                    </div>
                    <CardTitle className="text-xl text-white">{service.title}</CardTitle>
                    <CardDescription className="text-white/70">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="mb-6 space-y-2">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-white/80">
                          <div className={`h-1.5 w-1.5 rounded-full bg-gold ${isRTL ? "ml-2" : "mr-2"}`} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full bg-transparent border border-gold text-gold hover:bg-gold hover:text-black transition-all duration-300 group-hover:bg-gold group-hover:text-black"
                      onClick={() => (window.location.href = "/services/booking")}
                    >
                      {t.services.bookService}
                      <ArrowRight className={`h-4 w-4 ${isRTL ? "mr-2 rotate-180" : "ml-2"}`} />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
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
