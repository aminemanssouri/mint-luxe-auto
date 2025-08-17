"use client"

import { useEffect, useMemo, useRef, useState } from "react"
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

export type Vehicle = {
  id: string
  name: string
  brand: string
  type: "car" | "motorcycle" | "boat"
  price: number
  year: number
  category: string
  image: string
  specs: string
  location: string
  featured: boolean
}

type InitialParams = {
  type?: string
  brand?: string
  category?: string
  location?: string
  year?: string
  search?: string
  sort?: string
  price?: string
  page?: number
  pageSize?: number
}

export default function CollectionClient({
  initialItems,
  initialTotal,
  initialParams,
}: {
  initialItems: Vehicle[]
  initialTotal: number | null
  initialParams: InitialParams
}) {
  const { t, isRTL } = useLanguage()
  const [selectedType, setSelectedType] = useState<"all" | "car" | "motorcycle" | "boat">(
    (initialParams.type as any) || "all"
  )
  const [selectedBrand, setSelectedBrand] = useState<string>(initialParams.brand || "all")
  const [selectedCategory, setSelectedCategory] = useState<string>(initialParams.category || "all")
  const [priceRange, setPriceRange] = useState<string>(initialParams.price || "all")
  const [searchQuery, setSearchQuery] = useState(initialParams.search || "")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [selectedLocation, setSelectedLocation] = useState<string>(initialParams.location || "all")
  const [selectedYear, setSelectedYear] = useState<string>(initialParams.year || "all")
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<string>(() => {
    switch (initialParams.sort) {
      case "price-asc":
        return "price-low"
      case "price-desc":
        return "price-high"
      case "year-desc":
        return "year"
      case "name-asc":
        return "name"
      default:
        return "featured"
    }
  })
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set())
  const [remoteVehicles, setRemoteVehicles] = useState<Vehicle[]>(initialItems)
  const [loading, setLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(initialParams.page || 1)
  const [pageSize, setPageSize] = useState<number>(initialParams.pageSize || 12)
  const [totalCount, setTotalCount] = useState<number | null>(initialTotal)

  const firstRunRef = useRef(true)

  // Debounce search
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 400)
    return () => clearTimeout(id)
  }, [searchQuery])

  // Fetch vehicles when filters change (skip first run because SSR sent initial data)
  useEffect(() => {
    if (firstRunRef.current) {
      firstRunRef.current = false
      return
    }

    let cancelled = false
    const fetchVehicles = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (selectedType !== "all") params.set("type", selectedType)
        if (selectedBrand !== "all") params.set("brand", selectedBrand)
        if (selectedCategory !== "all") params.set("category", selectedCategory)
        if (selectedLocation !== "all") params.set("location", selectedLocation)
        if (selectedYear !== "all") params.set("year", selectedYear)
        if (debouncedSearch) params.set("search", debouncedSearch)
        if (sortBy) params.set("sort", mapSort(sortBy))
        if (priceRange !== "all") {
          if (priceRange.includes("-")) {
            const [min, max] = priceRange.split("-").map(Number)
            if (!Number.isNaN(min)) params.set("priceMin", String(min))
            if (!Number.isNaN(max)) params.set("priceMax", String(max))
          }
        }
        params.set("limit", String(pageSize))
        params.set("offset", String((page - 1) * pageSize))

        const qs = params.toString()
        const res = await fetch(`/api/vehicles${qs ? `?${qs}` : ""}`)
        if (!res.ok) throw new Error(`Failed to load vehicles: ${res.status}`)
        const json = await res.json()
        if (!cancelled && json?.ok && Array.isArray(json.items)) {
          setRemoteVehicles(json.items as Vehicle[])
          if (typeof json.totalCount === "number") setTotalCount(json.totalCount)
        }

        if (typeof window !== "undefined") {
          const url = `${window.location.pathname}${qs ? `?${qs}` : ""}`
          window.history.replaceState({}, "", url)
        }
      } catch (err) {
        console.error(err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchVehicles()
    return () => {
      cancelled = true
    }
  }, [selectedType, selectedBrand, selectedCategory, selectedLocation, selectedYear, debouncedSearch, priceRange, sortBy, page, pageSize])

  function mapSort(val: string) {
    switch (val) {
      case "featured":
        return "featured"
      case "price-low":
        return "price-asc"
      case "price-high":
        return "price-desc"
      case "year":
        return "year-desc"
      case "name":
        return "name-asc"
      default:
        return "featured"
    }
  }

  const dataSource: Vehicle[] = remoteVehicles
  const filteredVehicles = dataSource

  const toggleLike = (id: string) => {
    const newLiked = new Set(likedItems)
    if (newLiked.has(id)) newLiked.delete(id)
    else newLiked.add(id)
    setLikedItems(newLiked)
  }

  const formatPrice = (price: number) => {
    if (price >= 1000000) return `$${(price / 1000000).toFixed(1)}M`
    else if (price >= 1000) return `$${(price / 1000).toFixed(0)}K`
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

  const locations = [...new Set(dataSource.map((v) => v.location))].filter(Boolean).sort()
  const years = [...new Set(dataSource.map((v) => v.year))].sort((a, b) => b - a)
  const allBrands = useMemo(() => [...new Set(dataSource.map((v) => v.brand))].filter(Boolean).sort(), [dataSource])
  const allCategories = useMemo(
    () => [...new Set(dataSource.map((v) => v.category))].filter(Boolean).sort(),
    [dataSource]
  )

  const displayCount = typeof totalCount === "number" ? totalCount : filteredVehicles.length
  const totalPages = Math.max(1, Math.ceil(displayCount / pageSize))

  useEffect(() => {
    setPage(1)
  }, [selectedType, selectedBrand, selectedCategory, selectedLocation, selectedYear, debouncedSearch, priceRange, sortBy])

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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedType("all")
                        setSelectedBrand("all")
                        setSelectedCategory("all")
                        setPriceRange("all")
                        setSelectedLocation("all")
                        setSelectedYear("all")
                        setSearchQuery("")
                        if (typeof window !== "undefined") {
                          window.history.replaceState({}, "", window.location.pathname)
                        }
                      }}
                      className="text-gold hover:text-gold/80"
                    >
                      Clear All
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {/* Search */}
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Search</label>
                      <div className="relative">
                        <Search className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 ${isRTL ? "right-3" : "left-3"}`} />
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
                      <Select value={selectedType} onValueChange={(v) => setSelectedType(v as any)}>
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
                          {allBrands.map((brand: string) => (
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
                          {allCategories.map((category: string) => (
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
                      {" "}- {selectedType === "car" ? "Cars" : selectedType === "motorcycle" ? "Motorcycles" : "Yachts"}
                    </span>
                  )}
                </h2>
                <p className="text-white/70">{displayCount} vehicles available</p>
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
                        <div className={`absolute top-4 flex ${isRTL ? "space-x-reverse space-x-2" : "space-x-2"} ${isRTL ? "left-4" : "right-4"}`}>
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

            {/* Pagination Controls */}
            <div className={`mt-8 flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className={`flex items-center ${isRTL ? "space-x-reverse space-x-2" : "space-x-2"}`}>
                <Button variant="outline" className="border-zinc-700 text-white" disabled={page <= 1 || loading} onClick={() => setPage(1)}>
                  First
                </Button>
                <Button variant="outline" className="border-zinc-700 text-white" disabled={page <= 1 || loading} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                  Previous
                </Button>
                <span className="text-white/80 text-sm">Page {page} of {totalPages}</span>
                <Button variant="outline" className="border-zinc-700 text-white" disabled={page >= totalPages || loading} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                  Next
                </Button>
                <Button variant="outline" className="border-zinc-700 text-white" disabled={page >= totalPages || loading} onClick={() => setPage(totalPages)}>
                  Last
                </Button>
              </div>

              <div className={`flex items-center ${isRTL ? "space-x-reverse space-x-2" : "space-x-2"}`}>
                <span className="text-white/80 text-sm">Per page</span>
                <Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
                  <SelectTrigger className="w-24 bg-zinc-800/50 border-zinc-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="12">12</SelectItem>
                    <SelectItem value="24">24</SelectItem>
                    <SelectItem value="48">48</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

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
                  <Button onClick={() => {
                    setSelectedType("all");
                    setSelectedBrand("all");
                    setSelectedCategory("all");
                    setPriceRange("all");
                    setSelectedLocation("all");
                    setSelectedYear("all");
                    setSearchQuery("");
                    if (typeof window !== "undefined") window.history.replaceState({}, "", window.location.pathname)
                  }} className="bg-gold hover:bg-gold/90 text-black">
                    Clear All Filters
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Load More placeholder (not used) */}
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
                  <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)} className="text-white hover:text-gold">
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                {/* Same filter content as sidebar could be mirrored here if desired */}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
