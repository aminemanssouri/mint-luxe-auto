"use client"

import { useRef, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Search, Car, Bike, Ship, MapPin, Calendar, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/components/language-provider"

const brands = {
  car: [
    "Rolls-Royce",
    "Bentley",
    "Lamborghini",
    "Bugatti",
    "Aston Martin",
    "Ferrari",
    "McLaren",
    "Porsche",
    "Mercedes-AMG",
    "BMW M",
  ],
  motorcycle: ["Ducati", "Kawasaki", "BMW", "MV Agusta", "Aprilia", "KTM", "Harley-Davidson", "Indian"],
  boat: ["Azimut", "Riva", "Pershing", "Ferretti", "Sunseeker", "Princess", "Benetti", "Lurssen"],
}

const locations = [
  "Beverly Hills, CA",
  "Monaco",
  "London, UK",
  "Dubai, UAE",
  "Miami, FL",
  "Geneva, Switzerland",
  "Tokyo, Japan",
  "Paris, France",
  "New York, NY",
  "Singapore",
  "Hong Kong",
  "Sydney, Australia",
]

const priceRanges = [
  { label: "Under $100K", value: "0-100000" },
  { label: "$100K - $500K", value: "100000-500000" },
  { label: "$500K - $1M", value: "500000-1000000" },
  { label: "$1M - $5M", value: "1000000-5000000" },
  { label: "Over $5M", value: "5000000-999999999" },
]

const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i)

// Luxury brand data for the rotating carousel
const luxuryBrands = [
  { name: "Bugatti", icon: "🏎️" },
  { name: "Brabus", icon: "🚗" },
  { name: "Mansory", icon: "✨" },
  { name: "Porsche", icon: "🏁" },
  { name: "Audi", icon: "🔷" },
  { name: "Ferrari", icon: "🐎" },
  { name: "Lamborghini", icon: "🐂" },
  { name: "McLaren", icon: "🧡" },
  { name: "Rolls-Royce", icon: "👑" },
  { name: "Bentley", icon: "🦅" },
  { name: "Aston Martin", icon: "🗡️" },
  { name: "Mercedes-AMG", icon: "⭐" },
]

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const { t, isRTL } = useLanguage()

  // Filter states
  const [vehicleType, setVehicleType] = useState<"car" | "motorcycle" | "boat">("car")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBrand, setSelectedBrand] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [selectedPriceRange, setSelectedPriceRange] = useState("")
  const [selectedYear, setSelectedYear] = useState("")
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.7
    }
  }, [])

  const scrollToNextSection = () => {
    const nextSection = document.getElementById("collection")
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleSearch = () => {
    // Build search parameters
    const params = new URLSearchParams()

    if (vehicleType !== "car") params.set("type", vehicleType)
    if (searchQuery) params.set("search", searchQuery)
    if (selectedBrand) params.set("brand", selectedBrand)
    if (selectedLocation) params.set("location", selectedLocation)
    if (selectedPriceRange) params.set("price", selectedPriceRange)
    if (selectedYear) params.set("year", selectedYear)

    // Navigate to collection page with filters
    window.location.href = `/collection?${params.toString()}`
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedBrand("")
    setSelectedLocation("")
    setSelectedPriceRange("")
    setSelectedYear("")
    setShowAdvancedFilters(false)
  }

  const getVehicleTypeIcon = (type: string) => {
    switch (type) {
      case "car":
        return <Car className="h-4 w-4" />
      case "motorcycle":
        return <Bike className="h-4 w-4" />
      case "boat":
        return <Ship className="h-4 w-4" />
      default:
        return <Car className="h-4 w-4" />
    }
  }

  const getVehicleTypeLabel = (type: string) => {
    switch (type) {
      case "car":
        return "Luxury Cars"
      case "motorcycle":
        return "Motorcycles"
      case "boat":
        return "Yachts & Boats"
      default:
        return "Luxury Cars"
    }
  }

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <video ref={videoRef} autoPlay muted loop playsInline className="h-full w-full object-cover">
          <source src="/Ultimate Supercar Showroom in Dubai - Dourado Luxury Cars!.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Rotating Brand Carousel */}
     
      {/* Content */}
      <div className="relative z-20 flex h-full items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mx-auto max-w-4xl"
          >
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
              {t.home.heroTitle.split("Luxury").map((part, index) => (
                <span key={index}>
                  {part}
                  {index === 0 && <span className="text-gold">Luxury</span>}
                </span>
              ))}
            </h1>
            <p className="mb-8 text-lg text-white/80 md:text-xl max-w-2xl mx-auto">{t.home.heroSubtitle}</p>

            {/* Search Filter Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mx-auto max-w-4xl"
            >
              <Card className="bg-black/30 backdrop-blur-md border-white/20">
                <CardContent className="p-6">
                  {/* Vehicle Type Selector */}
                  <div className="mb-6">
                    <div className={`flex justify-center ${isRTL ? "space-x-reverse space-x-2" : "space-x-2"}`}>
                      {(["car", "motorcycle", "boat"] as const).map((type) => (
                        <Button
                          key={type}
                          variant={vehicleType === type ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            setVehicleType(type)
                            setSelectedBrand("") // Reset brand when changing type
                          }}
                          className={`${
                            vehicleType === type
                              ? "bg-gold hover:bg-gold/90 text-black border-gold"
                              : "border-white/30 text-white hover:bg-white/10 hover:text-white bg-transparent"
                          } transition-all duration-200 font-medium`}
                        >
                          <div className={`flex items-center ${isRTL ? "space-x-reverse space-x-2" : "space-x-2"}`}>
                            {getVehicleTypeIcon(type)}
                            <span className="hidden sm:inline">{getVehicleTypeLabel(type)}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Main Search Row */}
                  <div className="grid gap-4 md:grid-cols-4 mb-4">
                    {/* Search Input */}
                    <div className="relative">
                      <Search
                        className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-white/60 ${isRTL ? "right-3" : "left-3"}`}
                      />
                      <Input
                        placeholder={`Search ${getVehicleTypeLabel(vehicleType).toLowerCase()}...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`bg-white/10 border-white/30 text-white placeholder:text-white/60 ${isRTL ? "pr-10" : "pl-10"}`}
                      />
                    </div>

                    {/* Brand Selector */}
                    <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                      <SelectTrigger className="bg-white/10 border-white/30 text-white">
                        <SelectValue placeholder="Any Brand" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 text-white border-zinc-700">
                        <SelectItem value="any">Any Brand</SelectItem>
                        {brands[vehicleType].map((brand) => (
                          <SelectItem key={brand} value={brand}>
                            {brand}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Price Range */}
                    <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
                      <SelectTrigger className="bg-white/10 border-white/30 text-white">
                        <SelectValue placeholder="Any Price" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 text-white border-zinc-700">
                        <SelectItem value="any">Any Price</SelectItem>
                        {priceRanges.map((range) => (
                          <SelectItem key={range.value} value={range.value}>
                            {range.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Search Button */}
                    <Button
                      onClick={handleSearch}
                      className="bg-gold hover:bg-gold/90 text-black font-medium border-gold"
                    >
                      <Search className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                      <span className="font-semibold">Search</span>
                    </Button>
                  </div>

                  {/* Advanced Filters Toggle */}
                  <div className="flex items-center justify-center mb-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                      className="text-white/90 hover:text-white hover:bg-white/10 font-medium"
                    >
                      <Filter className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                      <span>Advanced Filters</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${showAdvancedFilters ? "rotate-180" : ""} ${isRTL ? "mr-2" : "ml-2"}`}
                      />
                    </Button>
                  </div>

                  {/* Advanced Filters */}
                  <AnimatePresence>
                    {showAdvancedFilters && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-white/20 pt-4"
                      >
                        <div className="grid gap-4 md:grid-cols-3">
                          {/* Location */}
                          <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                              <MapPin className={`inline h-4 w-4 ${isRTL ? "ml-1" : "mr-1"}`} />
                              Location
                            </label>
                            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                              <SelectTrigger className="bg-white/10 border-white/30 text-white">
                                <SelectValue placeholder="Any Location" />
                              </SelectTrigger>
                              <SelectContent className="bg-zinc-900 text-white border-zinc-700">
                                <SelectItem value="any">Any Location</SelectItem>
                                {locations.map((location) => (
                                  <SelectItem key={location} value={location}>
                                    {location}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Year */}
                          <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                              <Calendar className={`inline h-4 w-4 ${isRTL ? "ml-1" : "mr-1"}`} />
                              Year
                            </label>
                            <Select value={selectedYear} onValueChange={setSelectedYear}>
                              <SelectTrigger className="bg-white/10 border-white/30 text-white">
                                <SelectValue placeholder="Any Year" />
                              </SelectTrigger>
                              <SelectContent className="bg-zinc-900 text-white border-zinc-700">
                                <SelectItem value="any">Any Year</SelectItem>
                                {years.map((year) => (
                                  <SelectItem key={year} value={year.toString()}>
                                    {year}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Clear Filters */}
                          <div className="flex items-end">
                            <Button
                              variant="outline"
                              onClick={clearFilters}
                              className="w-full border-white/30 text-white hover:bg-white/10 hover:text-white bg-transparent font-medium"
                            >
                              <X className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                              <span>Clear Filters</span>
                            </Button>
                          </div>
                        </div>

                        {/* Active Filters Display */}
                        {(selectedBrand || selectedLocation || selectedPriceRange || selectedYear || searchQuery) && (
                          <div className="mt-4 pt-4 border-t border-white/20">
                            <div className="flex flex-wrap gap-2">
                              <span className="text-sm text-white/70">Active filters:</span>
                              {searchQuery && (
                                <Badge variant="outline" className="border-gold/50 text-gold bg-gold/10">
                                  Search: {searchQuery}
                                </Badge>
                              )}
                              {selectedBrand && (
                                <Badge variant="outline" className="border-gold/50 text-gold bg-gold/10">
                                  Brand: {selectedBrand}
                                </Badge>
                              )}
                              {selectedPriceRange && (
                                <Badge variant="outline" className="border-gold/50 text-gold bg-gold/10">
                                  Price: {priceRanges.find((r) => r.value === selectedPriceRange)?.label}
                                </Badge>
                              )}
                              {selectedLocation && (
                                <Badge variant="outline" className="border-gold/50 text-gold bg-gold/10">
                                  Location: {selectedLocation}
                                </Badge>
                              )}
                              {selectedYear && (
                                <Badge variant="outline" className="border-gold/50 text-gold bg-gold/10">
                                  Year: {selectedYear}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="mt-8 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 justify-center"
            >
              <Button
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 hover:text-white bg-transparent px-8 py-6 font-medium"
                onClick={() => (window.location.href = "/collection")}
              >
                <span className="font-semibold">{t.home.exploreCollection}</span>
              </Button>
              <Button
                className="bg-gold hover:bg-gold/90 text-black font-medium px-8 py-6 border-gold"
                onClick={() => (window.location.href = "/services/booking")}
              >
                <span className="font-semibold text-black">{t.home.bookTestDrive}</span>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 cursor-pointer"
        onClick={scrollToNextSection}
      >
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}>
          <ChevronDown className="h-10 w-10 text-white/70" />
        </motion.div>
      </motion.div>
    </section>
  )
}
