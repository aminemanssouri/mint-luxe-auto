"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

const cars = [
  {
    id: 1,
    name: "Phantom Spectre",
    price: "$450,000",
    image: "/placeholder.svg?height=300&width=500",
    specs: "V12 Engine • 563 HP • 0-60 in 4.3s",
  },
  {
    id: 2,
    name: "Celestial GT",
    price: "$380,000",
    image: "/placeholder.svg?height=300&width=500",
    specs: "V8 Twin-Turbo • 641 HP • 0-60 in 3.1s",
  },
  {
    id: 3,
    name: "Sovereign Wraith",
    price: "$520,000",
    image: "/placeholder.svg?height=300&width=500",
    specs: "V12 Engine • 624 HP • 0-60 in 4.4s",
  },
]

export default function FeaturedCars() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const { t, isRTL } = useLanguage()

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  }

  return (
    <section id="collection" className="bg-gradient-to-b from-black to-zinc-900 py-24 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-white md:text-5xl">
            {t.home.featuredTitle.split("Collection").map((part, index) => (
              <span key={index}>
                {part}
                {index === 0 && <span className="text-gold">Collection</span>}
              </span>
            ))}
          </h2>
          <p className="mx-auto max-w-2xl text-white/70">{t.home.featuredSubtitle}</p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {cars.map((car) => (
            <motion.div
              key={car.id}
              variants={itemVariants}
              className="group overflow-hidden rounded-lg bg-zinc-800/50 transition-all duration-300 hover:bg-zinc-800"
            >
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={car.image || "/placeholder.svg"}
                  alt={car.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className={`mb-4 flex items-center ${isRTL ? "justify-start" : "justify-between"}`}>
                  <h3 className="text-xl font-bold text-white">{car.name}</h3>
                  <span className={`text-lg font-medium text-gold ${isRTL ? "mr-auto" : ""}`}>{car.price}</span>
                </div>
                <p className="mb-6 text-sm text-white/60">{car.specs}</p>
                <div className={`flex ${isRTL ? "justify-start space-x-reverse space-x-4" : "justify-between"}`}>
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    {t.common.details}
                  </Button>
                  <Button className="bg-gold hover:bg-gold/90 text-black">{t.common.reserve}</Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <Button variant="link" className="text-gold group">
            {t.common.viewMore}
            <ChevronRight
              className={`ml-1 h-4 w-4 transition-transform group-hover:translate-x-1 ${isRTL ? "rotate-180" : ""}`}
            />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
