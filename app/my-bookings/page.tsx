"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Car, RefreshCw, ArrowLeft } from "lucide-react"

interface BookingItem {
  booking_number?: string | null
  id: string
  service_id: string | null
  vehicle_id: string | null
  preferred_date: string | null
  time_slot_id: string | null
  base_price: number | null
  location_fee: number | null
  total_price: number | null
  status: string
  payment_status: string
  created_at: string
  vehicles?: { id: string; name: string | null; brand: string | null; type: string | null } | null
  services?: { id: string; name: string | null } | null
}

export default function MyBookingsPage() {
  const { isRTL, t } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [bookings, setBookings] = useState<BookingItem[]>([])

  const load = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch("/api/bookings", { cache: "no-store" })
      const json = await res.json()
      if (!res.ok || !json.ok) throw new Error(json.error || "Failed to load bookings")
      setBookings(json.bookings || [])
    } catch (e: any) {
      setError(e?.message || "Unexpected error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={`container mx-auto px-4 pt-28 pb-16 ${isRTL ? "rtl" : ""}`}>
      <div className="mb-4">
        <Link
          href="/"
          className={`inline-flex items-center text-white hover:text-gold transition-colors ${isRTL ? "flex-row-reverse" : ""}`}
        >
          <ArrowLeft className={`h-5 w-5 ${isRTL ? "ml-2 rotate-180" : "mr-2"}`} />
          <span>{(t as any)?.common?.back ?? "Back"}</span>
        </Link>
      </div>
      <motion.h1
        className="text-3xl font-semibold tracking-wide mb-6 text-white"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        My Bookings
      </motion.h1>

      <div className="flex items-center gap-3 mb-6">
        <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" onClick={load}>
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh
        </Button>
      </div>

      {loading && (
        <p className="text-white/70">Loading...</p>
      )}
      {error && (
        <p className="text-red-400">{error}</p>
      )}

      {!loading && !error && bookings.length === 0 && (
        <Card className="bg-black/60 border-white/10">
          <CardContent className="py-10 text-center text-white/70">
            You have no bookings yet.
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {bookings.map((b) => (
          <Card key={b.id} className="bg-black/60 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <CardTitle className="text-white text-lg">
                  {b.vehicles?.name || b.services?.name || "Booking"}
                </CardTitle>
                {b.booking_number && (
                  <span className="text-xs text-white/60 bg-white/5 border border-white/10 rounded px-2 py-0.5">
                    #{b.booking_number}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-gold/20 text-gold border-gold/30 capitalize">
                  {b.status}
                </Badge>
                <Badge variant="outline" className="border-white/20 text-white/80 capitalize">
                  {b.payment_status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-white/80">
              <div className="flex items-center gap-2">
                <Car className="h-4 w-4" />
                <span className="truncate">{b.vehicles?.brand ? `${b.vehicles.brand} - ` : ""}{b.vehicles?.type || "Service"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{b.preferred_date ? new Date(b.preferred_date).toLocaleString() : "Date TBD"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white">Total:</span>
                <span className="font-semibold text-gold">${Number(b.total_price || 0).toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">AI Suggestions for You</CardTitle>
          </CardHeader>
          <CardContent className="text-white/70">
            <p>
              Coming soon: Personalized recommendations based on your bookings and interests. We’ll suggest services,
              vehicles, and add-ons to enhance your experience.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Tips</CardTitle>
          </CardHeader>
          <CardContent className="text-white/70 space-y-2">
            <p>• Book earlier to guarantee preferred time slots.</p>
            <p>• Consider premium detailing packages for luxury finishes.</p>
            <p>• Save favorite vehicles in the collection for quick access.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
