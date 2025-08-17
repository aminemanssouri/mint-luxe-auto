"use client"

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
  const { isRTL } = useLanguage()

  // Limit DOM: render fewer cards and duplicate once per row for marquee
  const list = [...trustedBrands].slice(0, 12)
  const rowA = [...list, ...list]
  const rowB = [...list, ...list].reverse()

  return (
    <section className="bg-zinc-900/50 py-16 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Trusted By <span className="text-gold">Premium Brands</span>
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            We work with the world's most prestigious automotive manufacturers and luxury brands
          </p>
        </div>

        {/* CSS Marquee Rows */}
        <div className="relative select-none">
          {/* Row 1 */}
          <div className="flex mb-8 overflow-hidden">
            <div className={`${isRTL ? "animate-marquee-reverse" : "animate-marquee"} flex gap-8 md:gap-12 whitespace-nowrap`}>
              {rowA.map((brand, index) => (
                <div
                  key={`row1-${index}`}
                  className="inline-flex items-center gap-4 bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg px-6 py-4 min-w-[200px] hover:border-gold/30 transition-colors"
                >
                  <Image
                    src={brand.image}
                    alt={`${brand.name} logo`}
                    width={40}
                    height={40}
                    loading="lazy"
                    className="object-contain flex-shrink-0"
                  />
                  <div className="text-left">
                    <h3 className="text-white font-medium">{brand.name}</h3>
                    <p className="text-white/60 text-sm">Premium Partner</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex overflow-hidden">
            <div className={`${isRTL ? "animate-marquee" : "animate-marquee-reverse"} flex gap-8 md:gap-12 whitespace-nowrap`}>
              {rowB.map((brand, index) => (
                <div
                  key={`row2-${index}`}
                  className="inline-flex items-center gap-4 bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg px-6 py-4 min-w-[200px] hover:border-gold/30 transition-colors"
                >
                  <Image
                    src={brand.image}
                    alt={`${brand.name} logo`}
                    width={40}
                    height={40}
                    loading="lazy"
                    className="object-contain flex-shrink-0"
                  />
                  <div className="text-left">
                    <h3 className="text-white font-medium">{brand.name}</h3>
                    <p className="text-white/60 text-sm">Luxury Partner</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-white/10">
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
        </div>
      </div>
    </section>
  )
}
