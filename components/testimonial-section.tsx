"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import { Quote } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

export default function TestimonialSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const { t, isRTL } = useLanguage()

  const testimonials = [
    {
      id: 1,
      name: t.testimonials.client1Name,
      position: t.testimonials.client1Position,
      quote: t.testimonials.testimonial1,
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 2,
      name: t.testimonials.client2Name,
      position: t.testimonials.client2Position,
      quote: t.testimonials.testimonial2,
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 3,
      name: t.testimonials.client3Name,
      position: t.testimonials.client3Position,
      quote: t.testimonials.testimonial3,
      image: "/placeholder.svg?height=80&width=80",
    },
  ]

  return (
    <section ref={ref} className="bg-zinc-900 py-24 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-white md:text-5xl">
            {t.home.testimonialsTitle.split("Testimonials").map((part, index) => (
              <span key={index}>
                {part}
                {index === 0 && <span className="text-gold">Testimonials</span>}
              </span>
            ))}
          </h2>
          <p className="mx-auto max-w-2xl text-white/70">{t.home.testimonialsSubtitle}</p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.2 }}
              className="relative rounded-lg bg-zinc-800/50 p-8"
            >
              <Quote className={`absolute h-12 w-12 text-gold/20 ${isRTL ? "left-8 top-8" : "right-8 top-8"}`} />
              <p className="mb-8 text-white/80 italic">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <div className="relative h-12 w-12 overflow-hidden rounded-full">
                  <Image
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className={isRTL ? "mr-4" : "ml-4"}>
                  <h4 className="text-sm font-bold text-white">{testimonial.name}</h4>
                  <p className="text-xs text-white/60">{testimonial.position}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
