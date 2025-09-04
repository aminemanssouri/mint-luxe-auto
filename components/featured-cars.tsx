"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import Link from "next/link"
type Vehicle = {
  id: string
  name: string
  price: number
  image: string
  specs?: string
}

export default function FeaturedCars() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const { t, isRTL } = useLanguage()
  const [cars, setCars] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        setLoading(true)
        // Fetch a pool of vehicles, then pick 3 at random on the client
        const res = await fetch("/api/vehicles?limit=60&sort=featured")
        if (!res.ok) throw new Error(`Failed to load vehicles: ${res.status}`)
        const json = await res.json()
        const items: any[] = Array.isArray(json?.items) ? json.items : []
        // Map to local type and randomize
        const mapped: Vehicle[] = items.map((v: any) => ({
          id: v.id,
          name: v.name,
          price: Number(v.price) || 0,
          image: v.image || "/placeholder.svg?height=300&width=500",
          specs: v.specs || "",
        }))
        // Shuffle and take 3
        for (let i = mapped.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[mapped[i], mapped[j]] = [mapped[j], mapped[i]]
        }
        if (active) setCars(mapped.slice(0, 3))
      } catch (e) {
        if (active) setCars([])
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [])

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
          {(loading ? [] : cars).map((car) => (
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
                  <span className={`text-lg font-medium text-gold ${isRTL ? "mr-auto" : ""}`}>{
                    car.price >= 1000000
                      ? `$${(car.price / 1000000).toFixed(1)}M`
                      : car.price >= 1000
                        ? `$${(car.price / 1000).toFixed(0)}K`
                        : `$${car.price.toLocaleString()}`
                  }</span>
                </div>
                {car.specs ? (
                  <p className="mb-6 text-sm text-white/60">{car.specs}</p>
                ) : (
                  <p className="mb-6 text-sm text-white/60">&nbsp;</p>
                )}
                <div className={`flex ${isRTL ? "justify-start space-x-reverse space-x-4" : "justify-between"}`}>
                  <Button variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800" asChild>
                    <Link href={`/cars/${car.id}`}>{t.common.details}</Link>
                  </Button>
                  <Button className="bg-gold hover:bg-gold/90 text-black" asChild>
                    <Link href={`/cars/${car.id}/reserve`}>{t.common.reserve}</Link>
                  </Button>
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
          <Button variant="link" className="text-gold group" asChild>
            <Link href="/collection">
              {t.common.viewMore}
              <ChevronRight
                className={`ml-1 h-4 w-4 transition-transform group-hover:translate-x-1 ${isRTL ? "rotate-180" : ""}`}
              />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
