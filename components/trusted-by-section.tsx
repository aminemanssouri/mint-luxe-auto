"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/components/language-provider"
import Image from "next/image"

// Trusted by brands data
const trustedBrands = [
  { name: "Bugatti",     image: "https://logo.clearbit.com/bugatti.com" },
  { name: "Ferrari",     image: "https://logo.clearbit.com/ferrari.com" },
  { name: "Lamborghini", image: "https://logo.clearbit.com/lamborghini.com" },
  { name: "McLaren",     image: "https://logo.clearbit.com/mclaren.com" },
  { name: "Porsche",     image: "https://logo.clearbit.com/porsche.com" },
  { name: "Rolls-Royce", image: "https://logo.clearbit.com/rolls-royce.com" },
  { name: "Bentley",     image: "https://logo.clearbit.com/bentleymotors.com" },
  { name: "Aston Martin",image: "https://logo.clearbit.com/astonmartin.com" },
  { name: "Mercedes-AMG",image: "https://logo.clearbit.com/mercedes-benz.com" },
  { name: "BMW M",       image: "https://logo.clearbit.com/bmw.com" },
  { name: "Audi Sport",  image: "https://logo.clearbit.com/audi.com" },
  { name: "Maserati",    image: "https://logo.clearbit.com/maserati.com" },
  { name: "Koenigsegg",  image: "https://logo.clearbit.com/koenigsegg.com" },
  { name: "Pagani",      image: "https://logo.clearbit.com/pagani.com" },
  { name: "Brabus",      image: "https://logo.clearbit.com/brabus.com" },
  { name: "Mansory",     image: "https://logo.clearbit.com/mansory.com" }
]

export default function TrustedBySection() {
  const { t, isRTL } = useLanguage()

  // Duplicate the brands array for seamless loop
  const duplicatedBrands = [...trustedBrands, ...trustedBrands]

  return (
    <section className="bg-zinc-900/50 py-16 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Trusted By <span className="text-gold">Premium Brands</span>
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            We work with the world's most prestigious automotive manufacturers and luxury brands
          </p>
        </motion.div>

        {/* Moving brands container */}
        <div className="relative">
          
          {/* First row - moving right to left */}
          <div className="flex mb-8">
            <motion.div
              className="flex space-x-8 md:space-x-12"
              animate={{
                x: isRTL ? [0, "50%"] : ["0%", "-50%"],
              }}
              transition={{
                duration: 40,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            >
              {duplicatedBrands.map((brand, index) => (
                <motion.div
                  key={`row1-${index}`}
                  className="flex-shrink-0 flex items-center space-x-4 bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg px-6 py-4 min-w-[200px] group hover:border-gold/30 transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <div className="w-10 h-10 relative flex-shrink-0">
                    <Image 
                      src={brand.image} 
                      alt={`${brand.name} logo`} 
                      fill 
                      className="object-contain" 
                      sizes="40px"
                    />
                  </div>
                  <div>
                    <h3 className="text-white font-medium group-hover:text-gold transition-colors">{brand.name}</h3>
                    <p className="text-white/60 text-sm">Premium Partner</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Second row - moving left to right (opposite direction) */}
          <div className="flex">
            <motion.div
              className="flex space-x-8 md:space-x-12"
              animate={{
                x: isRTL ? ["-50%", "0%"] : ["-50%", "0%"],
              }}
              transition={{
                duration: 35,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            >
              {duplicatedBrands
                .slice()
                .reverse()
                .map((brand, index) => (
                  <motion.div
                    key={`row2-${index}`}
                    className="flex-shrink-0 flex items-center space-x-4 bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg px-6 py-4 min-w-[200px] group hover:border-gold/30 transition-all duration-300"
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    <div className="w-10 h-10 relative flex-shrink-0">
                    <Image 
                      src={brand.image} 
                      alt={`${brand.name} logo`} 
                      fill 
                      className="object-contain" 
                      sizes="40px"
                    />
                  </div>
                    <div>
                      <h3 className="text-white font-medium group-hover:text-gold transition-colors">{brand.name}</h3>
                      <p className="text-white/60 text-sm">Luxury Partner</p>
                    </div>
                  </motion.div>
                ))}
            </motion.div>
          </div>
        </div>

        {/* Stats section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-white/10"
        >
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gold mb-2">50+</div>
            <div className="text-white/70">Premium Brands</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gold mb-2">1000+</div>
            <div className="text-white/70">Luxury Vehicles</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gold mb-2">25+</div>
            <div className="text-white/70">Global Locations</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gold mb-2">99%</div>
            <div className="text-white/70">Client Satisfaction</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
