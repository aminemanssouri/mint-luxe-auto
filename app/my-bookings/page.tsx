"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/components/language-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Car, RefreshCw, ArrowLeft, ShoppingCart, FileText, Clock, Wrench, MapPin, DollarSign, User, Phone, Mail } from "lucide-react"
import { createClient as createSupabaseBrowserClient } from "@/lib/supabase/client"

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
  vehicles?: { id: string; name: string | null; brand: string | null; type: string | null; image?: string } | null
  services?: { id: string; name: string | null } | null
  expiry_date?: string | null
  rental_start_date?: string | null
  rental_end_date?: string | null
  purchase_date?: string | null
  appointment_date?: string | null
  notes?: string | null
}

export default function MyBookingsPage() {
  const { isRTL, t } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [bookings, setBookings] = useState<BookingItem[]>([])
  const [user, setUser] = useState<any>(null)

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
    const supabase = createSupabaseBrowserClient()
    supabase.auth.getUser().then(({ data }: { data: { user: any } }) => {
      setUser(data.user)
    })
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 sticky top-0 z-40">
        <div className="container mx-auto px-4 pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)]">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="inline-flex items-center text-gold hover:text-gold/80 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span>Back to Home</span>
              </Link>
              <div className="h-6 w-px bg-zinc-700" />
              <h1 className="text-xl font-bold text-white">My Bookings</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="border-zinc-700 text-white hover:bg-zinc-800" onClick={load}>
                <RefreshCw className="mr-2 h-4 w-4" /> Refresh
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-gold/10 to-gold/5 border border-gold/20 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Welcome back{user?.user_metadata?.first_name ? `, ${user.user_metadata.first_name}` : ''}!
                </h2>
                <p className="text-white/70">
                  Here are all your bookings, reservations, and agreements in one place.
                </p>
              </div>
              <div className="hidden md:block">
                <div className="bg-gold/20 rounded-full p-3">
                  <User className="h-8 w-8 text-gold" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto mb-4"></div>
              <p className="text-white/70">Loading your bookings...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="bg-red-900/20 border-red-500/30">
            <CardContent className="py-6 text-center">
              <p className="text-red-400">{error}</p>
              <Button variant="outline" className="mt-4" onClick={load}>
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!loading && !error && bookings.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-8 max-w-md mx-auto">
              <div className="bg-gold/20 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <Calendar className="h-8 w-8 text-gold" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No bookings yet</h3>
              <p className="text-white/70 mb-6">
                Start exploring our luxury collection and make your first reservation.
              </p>
              <div className="space-y-3">
                <Button asChild className="w-full bg-gold text-black hover:bg-gold/90">
                  <Link href="/collection">Browse Collection</Link>
                </Button>
                <Button variant="outline" asChild className="w-full border-zinc-700 text-white hover:bg-zinc-800">
                  <Link href="/services">Book Services</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Bookings Grid */}
        {!loading && !error && bookings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Your Bookings ({bookings.length})</h3>
              <div className="flex gap-2">
                <Badge variant="outline" className="border-gold/30 text-gold">
                  {bookings.filter(b => b.status === 'active').length} Active
                </Badge>
                <Badge variant="outline" className="border-zinc-600 text-white/70">
                  {bookings.filter(b => b.status === 'completed').length} Completed
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {bookings.map((b) => {
                const getBookingTypeInfo = (type: string) => {
                  switch (type) {
                    case 'service_booking':
                      return { icon: Wrench, label: 'Service Booking', color: 'text-blue-400', bgColor: 'bg-blue-400/10' }
                    case 'vehicle_reservation':
                      return { icon: Clock, label: 'Vehicle Reservation', color: 'text-orange-400', bgColor: 'bg-orange-400/10' }
                    case 'rental_agreement':
                      return { icon: Car, label: 'Rental Agreement', color: 'text-green-400', bgColor: 'bg-green-400/10' }
                    case 'purchase_agreement':
                      return { icon: ShoppingCart, label: 'Purchase Agreement', color: 'text-purple-400', bgColor: 'bg-purple-400/10' }
                    case 'appointment':
                      return { icon: Calendar, label: 'Appointment', color: 'text-pink-400', bgColor: 'bg-pink-400/10' }
                    default:
                      return { icon: FileText, label: 'Booking', color: 'text-gray-400', bgColor: 'bg-gray-400/10' }
                  }
                }

                const typeInfo = getBookingTypeInfo(b.type)
                const TypeIcon = typeInfo.icon

                return (
                  <Card key={b.id} className="bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${typeInfo.bgColor}`}>
                            <TypeIcon className={`h-5 w-5 ${typeInfo.color}`} />
                          </div>
                          <div>
                            <CardTitle className="text-white text-lg leading-tight">
                              {b.vehicles?.name || b.services?.name || typeInfo.label}
                            </CardTitle>
                            <p className="text-xs text-white/60 mt-1">{typeInfo.label}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge 
                            variant={b.status === 'active' ? 'default' : 'secondary'} 
                            className={b.status === 'active' ? 'bg-gold/20 text-gold border-gold/30' : 'bg-zinc-800 text-white/70'}
                          >
                            {b.status}
                          </Badge>
                          {b.booking_number && (
                            <span className="text-xs text-white/50">#{b.booking_number}</span>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-3">
                      {b.vehicles && (
                        <div className="flex items-center gap-2 text-white/80">
                          <Car className="h-4 w-4 text-gold" />
                          <span className="text-sm">
                            {b.vehicles.brand ? `${b.vehicles.brand} ` : ""}
                            {b.vehicles.name || b.vehicles.type || "Vehicle"}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-white/80">
                        <Calendar className="h-4 w-4 text-gold" />
                        <span className="text-sm">
                          {b.rental_start_date ? new Date(b.rental_start_date).toLocaleDateString() :
                           b.purchase_date ? new Date(b.purchase_date).toLocaleDateString() :
                           b.appointment_date ? new Date(b.appointment_date).toLocaleDateString() :
                           b.preferred_date ? new Date(b.preferred_date).toLocaleDateString() : "Date TBD"}
                        </span>
                      </div>
                      
                      {b.rental_end_date && (
                        <div className="flex items-center gap-2 text-white/80">
                          <Clock className="h-4 w-4 text-gold" />
                          <span className="text-sm">Until: {new Date(b.rental_end_date).toLocaleDateString()}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                        <span className="text-white/70 text-sm">
                          {b.type === 'vehicle_reservation' ? 'Deposit:' : 'Total:'}
                        </span>
                        <span className="font-semibold text-gold">
                          ${Number(b.total_price || 0).toLocaleString()}
                        </span>
                      </div>
                      
                      {b.expiry_date && b.type === 'vehicle_reservation' && (
                        <div className="text-xs text-orange-400 bg-orange-400/10 px-2 py-1 rounded">
                          Expires: {new Date(b.expiry_date).toLocaleDateString()}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
