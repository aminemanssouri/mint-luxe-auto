"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Car, RefreshCw, ArrowLeft, ShoppingCart, FileText, Clock, Wrench } from "lucide-react"

interface BookingItem {
  booking_number?: string | null
  id: string
  type: string
  service_id?: string | null
  vehicle_id?: string | null
  preferred_date: string | null
  time_slot_id?: string | null
  base_price?: number | null
  location_fee?: number | null
  total_price: number | null
  status: string
  payment_status: string
  created_at: string
  vehicles?: { id: string; name: string | null; brand: string | null; type: string | null } | null
  services?: { id: string; name: string | null } | null
  expiry_date?: string | null
  rental_start_date?: string | null
  rental_end_date?: string | null
  purchase_date?: string | null
  appointment_date?: string | null
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
        {bookings.map((b) => {
          const getBookingTypeInfo = (type: string) => {
            switch (type) {
              case 'service_booking':
                return { icon: Wrench, label: 'Service Booking', color: 'text-blue-400' }
              case 'vehicle_reservation':
                return { icon: Clock, label: 'Vehicle Reservation', color: 'text-orange-400' }
              case 'rental_agreement':
                return { icon: Car, label: 'Rental Agreement', color: 'text-green-400' }
              case 'purchase_agreement':
                return { icon: ShoppingCart, label: 'Purchase Agreement', color: 'text-purple-400' }
              case 'appointment':
                return { icon: Calendar, label: 'Appointment', color: 'text-pink-400' }
              default:
                return { icon: FileText, label: 'Booking', color: 'text-gray-400' }
            }
          }

          const typeInfo = getBookingTypeInfo(b.type)
          const TypeIcon = typeInfo.icon

          const getDisplayDate = () => {
            if (b.rental_start_date) return new Date(b.rental_start_date).toLocaleString()
            if (b.purchase_date) return new Date(b.purchase_date).toLocaleString()
            if (b.appointment_date) return new Date(b.appointment_date).toLocaleString()
            if (b.preferred_date) return new Date(b.preferred_date).toLocaleString()
            return "Date TBD"
          }

          const getExpiryInfo = () => {
            if (b.type === 'vehicle_reservation' && b.expiry_date) {
              const expiry = new Date(b.expiry_date)
              const now = new Date()
              const isExpired = expiry < now
              const daysLeft = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
              
              if (isExpired) {
                return <span className="text-red-400 text-xs">Expired</span>
              } else if (daysLeft <= 2) {
                return <span className="text-orange-400 text-xs">Expires in {daysLeft} day{daysLeft !== 1 ? 's' : ''}</span>
              }
            }
            return null
          }

          return (
            <Card key={b.id} className="bg-black/60 border-white/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <TypeIcon className={`h-5 w-5 ${typeInfo.color}`} />
                  <div>
                    <CardTitle className="text-white text-lg">
                      {b.vehicles?.name || b.services?.name || typeInfo.label}
                    </CardTitle>
                    <p className="text-xs text-white/60">{typeInfo.label}</p>
                  </div>
                  {b.booking_number && (
                    <span className="text-xs text-white/60 bg-white/5 border border-white/10 rounded px-2 py-0.5">
                      #{b.booking_number}
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-gold/20 text-gold border-gold/30 capitalize">
                      {b.status}
                    </Badge>
                    <Badge variant="outline" className="border-white/20 text-white/80 capitalize">
                      {b.payment_status}
                    </Badge>
                  </div>
                  {getExpiryInfo()}
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-white/80">
                {b.vehicles && (
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    <span className="truncate">
                      {b.vehicles.brand ? `${b.vehicles.brand} ` : ""}
                      {b.vehicles.name || b.vehicles.type || "Vehicle"}
                    </span>
                  </div>
                )}
                {b.services && (
                  <div className="flex items-center gap-2">
                    <Wrench className="h-4 w-4" />
                    <span className="truncate">{b.services.name}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">{getDisplayDate()}</span>
                </div>
                {b.type === 'rental_agreement' && b.rental_end_date && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">Until: {new Date(b.rental_end_date).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-white">
                    {b.type === 'vehicle_reservation' ? 'Deposit:' : 'Total:'}
                  </span>
                  <span className="font-semibold text-gold">${Number(b.total_price || 0).toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
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
