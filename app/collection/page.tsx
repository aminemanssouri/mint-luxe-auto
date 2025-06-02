"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Car, Ship, Bike, Search, Filter, Heart, Eye, ArrowLeft, SlidersHorizontal, X } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import LanguageSwitcher from "@/components/language-switcher"

// Mock data for vehicles (same as before)
const vehicles = [
  // Luxury Cars
  {
    id: "phantom-spectre",
    name: "Phantom Spectre",
    brand: "Rolls-Royce",
    type: "car",
    price: 450000,
    year: 2024,
    category: "Ultra Luxury",
    image: "/placeholder.svg?height=300&width=500",
    specs: "V12 Engine • 563 HP • 0-60 in 4.3s",
    location: "Beverly Hills, CA",
    featured: true,
  },
  {
    id: "celestial-gt",
    name: "Celestial GT",
    brand: "Bentley",
    type: "car",
    price: 380000,
    year: 2024,
    category: "Grand Tourer",
    image: "/placeholder.svg?height=300&width=500",
    specs: "V8 Twin-Turbo • 641 HP • 0-60 in 3.1s",
    location: "Monaco",
    featured: true,
  },
  {
    id: "sovereign-wraith",
    name: "Sovereign Wraith",
    brand: "Rolls-Royce",
    type: "car",
    price: 520000,
    year: 2023,
    category: "Ultra Luxury",
    image: "/placeholder.svg?height=300&width=500",
    specs: "V12 Engine • 624 HP • 0-60 in 4.4s",
    location: "London, UK",
    featured: false,
  },
  {
    id: "aventador-svj",
    name: "Aventador SVJ",
    brand: "Lamborghini",
    type: "car",
    price: 650000,
    year: 2024,
    category: "Supercar",
    image: "/placeholder.svg?height=300&width=500",
    specs: "V12 Engine • 770 HP • 0-60 in 2.8s",
    location: "Miami, FL",
    featured: true,
  },
  {
    id: "chiron-pur-sport",
    name: "Chiron Pur Sport",
    brand: "Bugatti",
    type: "car",
    price: 3500000,
    year: 2024,
    category: "Hypercar",
    image: "/placeholder.svg?height=300&width=500",
    specs: "W16 Quad-Turbo • 1479 HP • 0-60 in 2.3s",
    location: "Geneva, Switzerland",
    featured: true,
  },
  {
    id: "db12",
    name: "DB12",
    brand: "Aston Martin",
    type: "car",
    price: 245000,
    year: 2024,
    category: "Grand Tourer",
    image: "/placeholder.svg?height=300&width=500",
    specs: "V8 Twin-Turbo • 671 HP • 0-60 in 3.5s",
    location: "Dubai, UAE",
    featured: false,
  },
  // Luxury Motorcycles
  {
    id: "panigale-v4-sp2",
    name: "Panigale V4 SP2",
    brand: "Ducati",
    type: "motorcycle",
    price: 45000,
    year: 2024,
    category: "Superbike",
    image: "/placeholder.svg?height=300&width=500",
    specs: "V4 Engine • 214 HP • 0-60 in 2.6s",
    location: "Milan, Italy",
    featured: true,
  },
  {
    id: "h2r",
    name: "Ninja H2R",
    brand: "Kawasaki",
    type: "motorcycle",
    price: 55000,
    year: 2024,
    category: "Track Only",
    image: "/placeholder.svg?height=300&width=500",
    specs: "Supercharged I4 • 310 HP • 0-60 in 2.5s",
    location: "Tokyo, Japan",
    featured: true,
  },
  {
    id: "diavel-1260-lamborghini",
    name: "Diavel 1260 Lamborghini",
    brand: "Ducati",
    type: "motorcycle",
    price: 68000,
    year: 2024,
    category: "Limited Edition",
    image: "/placeholder.svg?height=300&width=500",
    specs: "L-Twin • 159 HP • 0-60 in 2.8s",
    location: "Sant'Agata, Italy",
    featured: false,
  },
  // Luxury Boats/Ships
  {
    id: "azimut-grande-35-metri",
    name: "Grande 35 Metri",
    brand: "Azimut",
    type: "boat",
    price: 12500000,
    year: 2024,
    category: "Superyacht",
    image: "/placeholder.svg?height=300&width=500",
    specs: "Twin MTU • 2600 HP • 115 ft",
    location: "Monaco Harbor",
    featured: true,
  },
  {
    id: "riva-88-folgore",
    name: "88' Folgore",
    brand: "Riva",
    type: "boat",
    price: 6800000,
    year: 2024,
    category: "Motor Yacht",
    image: "/placeholder.svg?height=300&width=500",
    specs: "Twin MTU • 2600 HP • 88 ft",
    location: "Portofino, Italy",
    featured: true,
  },
  {
    id: "pershing-140",
    name: "Pershing 140",
    brand: "Pershing",
    type: "boat",
    price: 18500000,
    year: 2024,
    category: "Superyacht",
    image: "/placeholder.svg?height=300&width=500",
    specs: "Triple MTU • 7800 HP • 140 ft",
    location: "French Riviera",
    featured: false,
  },
]

const brands = {
  car: ["Rolls-Royce", "Bentley", "Lamborghini", "Bugatti", "Aston Martin", "Ferrari", "McLaren", "Porsche"],
  motorcycle: ["Ducati", "Kawasaki", "BMW", "MV Agusta", "Aprilia", "KTM"],
  boat: ["Azimut", "Riva", "Pershing", "Ferretti", "Sunseeker", "Princess"],
}

const categories = {
  car: ["Ultra Luxury", "Grand Tourer", "Supercar", "Hypercar", "Classic"],
  motorcycle: ["Superbike", "Track Only", "Limited Edition", "Touring", "Adventure"],
  boat: ["Superyacht", "Motor Yacht", "Sport Yacht", "Explorer", "Sailing Yacht"],
}

export default function CollectionPage() {
  const { t, isRTL } = useLanguage()
  const [selectedType, setSelectedType] = useState<"all" | "car" | "motorcycle" | "boat">("all")
  const [selectedBrand, setSelectedBrand] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [priceRange, setPriceRange] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState<string>("all")
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<string>("featured")
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set())

  // Parse URL parameters on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search)

      const type = urlParams.get("type")
      const search = urlParams.get("search")
      const brand = urlParams.get("brand")
      const location = urlParams.get("location")
      const price = urlParams.get("price")
      const year = urlParams.get("year")

      if (type && ["car", "motorcycle", "boat"].includes(type)) {
        setSelectedType(type as "car" | "motorcycle" | "boat")
      }
      if (search) setSearchQuery(search)
      if (brand) setSelectedBrand(brand)
      if (location) setSelectedLocation(location)
      if (price) setPriceRange(price)
      if (year) setSelectedYear(year)
    }
  }, [])

  const filteredVehicles = useMemo(() => {
    const filtered = vehicles.filter((vehicle) => {
      // Type filter
      if (selectedType !== "all" && vehicle.type !== selectedType) return false

      // Brand filter
      if (selectedBrand !== "all" && vehicle.brand !== selectedBrand) return false

      // Category filter
      if (selectedCategory !== "all" && vehicle.category !== selectedCategory) return false

      // Location filter
      if (selectedLocation !== "all" && vehicle.location !== selectedLocation) return false

      // Year filter
      if (selectedYear !== "all" && vehicle.year.toString() !== selectedYear) return false

      // Price range filter
      if (priceRange !== "all") {
        if (priceRange.includes("-")) {
          const [min, max] = priceRange.split("-").map(Number)
          if (vehicle.price < min || vehicle.price > max) return false
        }
      }

      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          vehicle.name.toLowerCase().includes(query) ||
          vehicle.brand.toLowerCase().includes(query) ||
          vehicle.category.toLowerCase().includes(query)
        )
      }

      return true
    })

    // Sort filtered results
    switch (sortBy) {
      case "featured":
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
        break
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "year":
        filtered.sort((a, b) => b.year - a.year)
        break
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    return filtered
  }, [selectedType, selectedBrand, selectedCategory, priceRange, searchQuery, selectedLocation, selectedYear, sortBy])

  const toggleLike = (id: string) => {
    const newLiked = new Set(likedItems)
    if (newLiked.has(id)) {
      newLiked.delete(id)
    } else {
      newLiked.add(id)
    }
    setLikedItems(newLiked)
  }

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`
    } else if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}K`
    }
    return `$${price.toLocaleString()}`
  }

  const getTypeIcon = (type: string) => {
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

  const clearFilters = () => {
    setSelectedType("all")
    setSelectedBrand("all")
    setSelectedCategory("all")
    setPriceRange("all")
    setSelectedLocation("all")
    setSelectedYear("all")
    setSearchQuery("")

    // Update URL to remove parameters
    if (typeof window !== "undefined") {
      window.history.replaceState({}, "", window.location.pathname)
    }
  }

  // Get unique locations and years from vehicles
  const locations = [...new Set(vehicles.map((v) => v.location))].sort()
  const years = [...new Set(vehicles.map((v) => v.year))].sort((a, b) => b - a)

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className={`flex items-center ${isRTL ? "space-x-reverse space-x-4" : "space-x-4"}`}>
              <Link
                href="/"
                className={`inline-flex items-center text-gold hover:text-gold/80 transition-colors ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <ArrowLeft className={`h-4 w-4 ${isRTL ? "ml-2 rotate-180" : "mr-2"}`} />
                <span>{t.common.backToHome}</span>
              </Link>
              <div className="h-6 w-px bg-zinc-700" />
              <h1 className="text-xl font-bold text-white">Collection</h1>
            </div>
            <div className={`flex items-center ${isRTL ? "space-x-reverse space-x-4" : "space-x-4"}`}>
              <LanguageSwitcher />
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:text-gold md:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="sticky top-24">
              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardContent className="p-6">
                  <div className={`flex items-center justify-between mb-6 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <h2 className="text-lg font-bold text-white flex items-center">
                      <SlidersHorizontal className={`h-5 w-5 text-gold ${isRTL ? "ml-2" : "mr-2"}`} />
                      Filters
                    </h2>
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="text-gold hover:text-gold/80">
                      Clear All
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {/* Search */}
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Search</label>
                      <div className="relative">
                        <Search
                          className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 ${isRTL ? "right-3" : "left-3"}`}
                        />
                        <Input
                          placeholder="Search vehicles..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className={`bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 ${isRTL ? "pr-10" : "pl-10"}`}
                        />
                      </div>
                    </div>

                    {/* Vehicle Type */}
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Vehicle Type</label>
                      <Select value={selectedType} onValueChange={setSelectedType}>
                        <SelectTrigger className="bg-zinc-800/50 border-zinc-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-800 border-zinc-700">
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="car">
                            <div className={`flex items-center ${isRTL ? "space-x-reverse space-x-2" : "space-x-2"}`}>
                              <Car className="h-4 w-4" />
                              <span>Luxury Cars</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="motorcycle">
                            <div className={`flex items-center ${isRTL ? "space-x-reverse space-x-2" : "space-x-2"}`}>
                              <Bike className="h-4 w-4" />
                              <span>Motorcycles</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="boat">
                            <div className={`flex items-center ${isRTL ? "space-x-reverse space-x-2" : "space-x-2"}`}>
                              <Ship className="h-4 w-4" />
                              <span>Yachts & Boats</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Brand */}
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Brand</label>
                      <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                        <SelectTrigger className="bg-zinc-800/50 border-zinc-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-800 border-zinc-700">
                          <SelectItem value="all">All Brands</SelectItem>
                          {selectedType === "all"
                            ? [...brands.car, ...brands.motorcycle, ...brands.boat].sort().map((brand) => (
                                <SelectItem key={brand} value={brand}>
                                  {brand}
                                </SelectItem>
                              ))
                            : brands[selectedType as keyof typeof brands]?.map((brand) => (
                                <SelectItem key={brand} value={brand}>
                                  {brand}
                                </SelectItem>
                              ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Category</label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="bg-zinc-800/50 border-zinc-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-800 border-zinc-700">
                          <SelectItem value="all">All Categories</SelectItem>
                          {selectedType === "all"
                            ? [...categories.car, ...categories.motorcycle, ...categories.boat]
                                .sort()
                                .map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))
                            : categories[selectedType as keyof typeof categories]?.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Location</label>
                      <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                        <SelectTrigger className="bg-zinc-800/50 border-zinc-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-800 border-zinc-700">
                          <SelectItem value="all">All Locations</SelectItem>
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
                      <label className="block text-sm font-medium text-white/80 mb-2">Year</label>
                      <Select value={selectedYear} onValueChange={setSelectedYear}>
                        <SelectTrigger className="bg-zinc-800/50 border-zinc-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-800 border-zinc-700">
                          <SelectItem value="all">All Years</SelectItem>
                          {years.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Price Range */}
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Price Range</label>
                      <Select value={priceRange} onValueChange={setPriceRange}>
                        <SelectTrigger className="bg-zinc-800/50 border-zinc-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-800 border-zinc-700">
                          <SelectItem value="all">All Prices</SelectItem>
                          <SelectItem value="0-100000">Under $100K</SelectItem>
                          <SelectItem value="100000-500000">$100K - $500K</SelectItem>
                          <SelectItem value="500000-1000000">$500K - $1M</SelectItem>
                          <SelectItem value="1000000-5000000">$1M - $5M</SelectItem>
                          <SelectItem value="5000000-999999999">Over $5M</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className={`flex items-center justify-between mb-8 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Luxury Collection
                  {selectedType !== "all" && (
                    <span className="text-gold">
                      {" "}
                      - {selectedType === "car" ? "Cars" : selectedType === "motorcycle" ? "Motorcycles" : "Yachts"}
                    </span>
                  )}
                </h2>
                <p className="text-white/70">{filteredVehicles.length} vehicles available</p>
              </div>
              <div className={`flex items-center ${isRTL ? "space-x-reverse space-x-4" : "space-x-4"}`}>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 bg-zinc-800/50 border-zinc-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="featured">Featured First</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="year">Newest First</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Vehicle Grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedType}-${selectedBrand}-${selectedCategory}-${priceRange}-${searchQuery}-${sortBy}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
              >
                {filteredVehicles.map((vehicle, index) => (
                  <motion.div
                    key={vehicle.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="group overflow-hidden bg-zinc-900/50 border-zinc-800 transition-all duration-300 hover:bg-zinc-900 hover:border-gold/50 hover:shadow-lg hover:shadow-gold/10">
                      <div className="relative">
                        <div className="relative h-48 w-full overflow-hidden">
                          <Image
                            src={vehicle.image || "/placeholder.svg"}
                            alt={vehicle.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        </div>

                        {/* Overlay Actions */}
                        <div
                          className={`absolute top-4 flex ${isRTL ? "space-x-reverse space-x-2" : "space-x-2"} ${isRTL ? "left-4" : "right-4"}`}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70 hover:text-gold"
                            onClick={() => toggleLike(vehicle.id)}
                          >
                            <Heart className={`h-4 w-4 ${likedItems.has(vehicle.id) ? "fill-gold text-gold" : ""}`} />
                          </Button>
                        </div>

                        {/* Vehicle Type Badge */}
                        <div className={`absolute top-4 ${isRTL ? "right-4" : "left-4"}`}>
                          <Badge className="bg-gold/90 hover:bg-gold text-black">
                            <div className={`flex items-center ${isRTL ? "space-x-reverse space-x-1" : "space-x-1"}`}>
                              {getTypeIcon(vehicle.type)}
                              <span className="text-xs font-medium">
                                {vehicle.type === "car" ? "Car" : vehicle.type === "motorcycle" ? "Bike" : "Yacht"}
                              </span>
                            </div>
                          </Badge>
                        </div>

                        {/* Featured Badge */}
                        {vehicle.featured && (
                          <div className={`absolute bottom-4 ${isRTL ? "right-4" : "left-4"}`}>
                            <Badge variant="outline" className="border-gold/50 text-gold bg-black/50">
                              Featured
                            </Badge>
                          </div>
                        )}
                      </div>

                      <CardContent className="p-6">
                        <div className="mb-4">
                          <div className={`flex items-start justify-between mb-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                            <div className={isRTL ? "text-right" : ""}>
                              <h3 className="text-lg font-bold text-white group-hover:text-gold transition-colors">
                                {vehicle.name}
                              </h3>
                              <p className="text-sm text-white/60">
                                {vehicle.brand} • {vehicle.year}
                              </p>
                            </div>
                            <div className={`text-xl font-bold text-gold ${isRTL ? "mr-4" : "ml-4"}`}>
                              {formatPrice(vehicle.price)}
                            </div>
                          </div>
                          <Badge variant="outline" className="border-zinc-600 text-zinc-300 mb-3">
                            {vehicle.category}
                          </Badge>
                          <p className="text-sm text-white/70 mb-2">{vehicle.specs}</p>
                          <p className="text-xs text-white/50">{vehicle.location}</p>
                        </div>

                        <div className={`flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 border-zinc-700 text-white hover:bg-zinc-800"
                            asChild
                          >
                            <Link href={`/cars/${vehicle.id}`}>
                              <Eye className={`h-4 w-4 ${isRTL ? "ml-1" : "mr-1"}`} />
                              {t.common.details}
                            </Link>
                          </Button>
                          <Button size="sm" className="flex-1 bg-gold hover:bg-gold/90 text-black">
                            {t.common.reserve}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* No Results */}
            {filteredVehicles.length === 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
                <div className="mb-6">
                  <div className="h-24 w-24 mx-auto mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
                    <Search className="h-8 w-8 text-zinc-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">No vehicles found</h3>
                  <p className="text-white/70 mb-6">
                    Try adjusting your filters or search terms to find what you're looking for.
                  </p>
                  <Button onClick={clearFilters} className="bg-gold hover:bg-gold/90 text-black">
                    Clear All Filters
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Load More Button (for pagination) */}
            {filteredVehicles.length > 0 && filteredVehicles.length >= 12 && (
              <div className="text-center mt-12">
                <Button variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800">
                  Load More Vehicles
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 lg:hidden"
            onClick={() => setShowFilters(false)}
          >
            <motion.div
              initial={{ x: isRTL ? "100%" : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? "100%" : "-100%" }}
              className={`absolute top-0 h-full w-80 bg-zinc-900 border-zinc-800 ${isRTL ? "right-0 border-l" : "left-0 border-r"}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className={`flex items-center justify-between mb-6 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <h2 className="text-lg font-bold text-white">Filters</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowFilters(false)}
                    className="text-white hover:text-gold"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                {/* Filter content would be the same as desktop sidebar */}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
