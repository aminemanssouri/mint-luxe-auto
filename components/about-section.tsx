"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

export default function AboutSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const { t, isRTL } = useLanguage()

  const features = [
    t.features.exclusiveLimited,
    t.features.personalizedCustomization,
    t.features.whiteGloveDelivery,
    t.features.lifetimeMaintenance,
    t.features.globalConcierge,
    t.features.membersEvents,
  ]

  return (
    <section id="about" ref={ref} className="bg-black py-24 md:py-32">
      <div className="container mx-auto px-4">
        <div className={`grid gap-12 md:grid-cols-2 md:gap-16 items-center ${isRTL ? "md:grid-cols-2" : ""}`}>
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`relative ${isRTL ? "md:order-2" : ""}`}
          >
            <div
              className={`absolute -top-6 h-24 w-24 rounded-full bg-gold/20 md:-top-10 md:h-40 md:w-40 ${isRTL ? "-right-6 md:-right-10" : "-left-6 md:-left-10"}`}
            />
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
              <Image
                src="/images/home/025f45beb086542f4f6a106ec9f9f0e4.webp"
                alt="Luxury Car Experience"
                fill
                className="object-cover"
              />
            </div>
            <div
              className={`absolute -bottom-6 h-24 w-24 rounded-full bg-gold/20 md:-bottom-10 md:h-40 md:w-40 ${isRTL ? "-left-6 md:-left-10" : "-right-6 md:-right-10"}`}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={isRTL ? "md:order-1" : ""}
          >
            <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
              {t.home.aboutTitle.split("Luxury").map((part, index) => (
                <span key={index}>
                  {part}
                  {index === 0 && <span className="text-gold">Luxury</span>}
                </span>
              ))}
            </h2>
            <p className="mb-8 text-white/70">
              {t.home.aboutSubtitle} {t.home.aboutDescription}
            </p>

            <div className="mb-8 grid grid-cols-1 gap-y-4 sm:grid-cols-2">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="flex items-center"
                >
                  <Check className={`h-5 w-5 text-gold ${isRTL ? "ml-2" : "mr-2"}`} />
                  <span className="text-sm text-white/80">{feature}</span>
                </motion.div>
              ))}
            </div>

            <Button className="bg-gold hover:bg-gold/90 text-black">{t.common.learnMore}</Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
