"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import LanguageSwitcher from "@/components/language-switcher"
import PageLoader from "@/components/page-loader"
import LoadingSpinner from "@/components/loading-spinner"
import { CalendarDays, DollarSign, ShieldCheck, CreditCard, ArrowLeft, Phone, Mail } from "lucide-react"
// Date range popover picker (shadcn style)
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { createClient as createSupabaseBrowserClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"

// Minimal vehicle detail shape
type Contact = { contact_name?: string | null; phone?: string | null; email?: string | null }

type VehicleDetail = {
  id: string
  name: string
  price: number
  year?: number
  image?: string
  contacts?: Contact[]
}

function formatMoney(n: number) {
  if (!Number.isFinite(n)) return "$0"
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${n.toLocaleString()}`
}

export default function ReserveVehiclePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [authChecked, setAuthChecked] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [vehicle, setVehicle] = useState<VehicleDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Rent state
  const [startDateTime, setStartDateTime] = useState("")
  const [endDateTime, setEndDateTime] = useState("")
  const [reservedDates, setReservedDates] = useState<Date[]>([])
  const [reserving, setReserving] = useState(false)

  const daysSelected = useMemo(() => {
    if (startDateTime && endDateTime) {
      const startDate = new Date(startDateTime)
      const endDate = new Date(endDateTime)
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return 0
      const ms = Math.max(0, endDate.getTime() - startDate.getTime())
      return Math.floor(ms / (1000 * 60 * 60 * 24)) + 1
    }
    return 0
  }, [startDateTime, endDateTime])

  // Buy action handled via navigation to checkout page

  // Derived pricing (fallback daily rate if not provided)
  const dailyRate = useMemo(() => {
    const base = vehicle?.price ?? 0
    // heuristic: 0.15% of price per day, min $300
    return Math.max(300, Math.round(base * 0.0015))
  }, [vehicle?.price])
  const rentTotal = useMemo(() => dailyRate * Math.max(0, daysSelected), [dailyRate, daysSelected])
  const deposit25 = useMemo(() => Math.round((vehicle?.price ?? 0) * 0.25), [vehicle?.price])

  // Auth guard
  useEffect(() => {
    const supabase = createSupabaseBrowserClient()
    supabase.auth.getUser().then(({ data }: { data: { user: SupabaseUser | null } }) => {
      setUser(data.user || null)
      setAuthChecked(true)
      if (!data.user) {
        const next = `/cars/${id}/reserve`
        router.replace(`/auth/login?next=${encodeURIComponent(next)}`)
      }
    })
  }, [id, router])

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white/80">
        Checking authentication...
      </div>
    )
  }
  if (authChecked && !user) {
    return null
  }

  useEffect(() => {
    let active = true
    async function load() {
      try {
        setLoading(true)
        const res = await fetch(`/api/vehicles/${id}`)
        if (!res.ok) throw new Error(`Load failed: ${res.status}`)
        const json = await res.json()
        const item = json?.item
        if (active && item) {
          setVehicle({ id: item.id, name: item.name, price: Number(item.price) || 0, year: item.year, image: item.image, contacts: item.contacts || [] })
        }
      } catch (e: any) {
        if (active) setError(e?.message || "Failed to load vehicle")
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [id])

  // Load availability for the next 6 months
  useEffect(() => {
    let active = true
    async function loadAvail() {
      try {
        const from = new Date(); from.setHours(0,0,0,0)
        const to = new Date(); to.setMonth(to.getMonth() + 6); to.setHours(0,0,0,0)
        const fmt = (d: Date) => d.toISOString().slice(0,10)
        const res = await fetch(`/api/vehicle-availability?vehicle_id=${encodeURIComponent(id)}&from=${fmt(from)}&to=${fmt(to)}`)
        const json = await res.json()
        const dates: string[] = json?.reservedDates || []
        if (active) setReservedDates(dates.map((s) => new Date(s + "T00:00:00")))
      } catch {}
    }
    if (id) loadAvail()
    return () => { active = false }
  }, [id])

  const disabledMatcher = (date: Date) => {
    const d0 = new Date(date); d0.setHours(0,0,0,0)
    return reservedDates.some((rd) => rd.getTime() === d0.getTime())
  }

  async function handleReserveRental() {
    if (!startDateTime || !endDateTime || daysSelected <= 0) return
    try {
      setReserving(true)
      const res = await fetch(`/api/vehicles/${id}/rent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: null, // Will be handled by the API
          rentalType: "daily",
          startDate: startDateTime,
          endDate: endDateTime,
          pickupLocation: "showroom",
          returnLocation: "showroom",
          pickupAddress: "",
          returnAddress: "",
          dailyRate: vehicle?.price || 0,
          weeklyRate: null,
          monthlyRate: null,
          totalDays: daysSelected,
          baseAmount: rentTotal,
          depositAmount: 0,
          additionalDrivers: [],
          driverLicenseInfo: null,
          insuranceOption: "basic",
          specialRequests: "",
          totalAmount: rentTotal
        }),
      })
      if (res.status === 401) {
        router.push("/auth/login")
        return
      }
      const json = await res.json()
      if (!json?.success) throw new Error(json?.error || "Failed to create rental agreement")
      router.push("/my-bookings")
    } catch (e) {
      console.error(e)
      alert("Could not create rental reservation.")
    } finally {
      setReserving(false)
    }
  }

  const chartData = useMemo(() => {
    const price = vehicle?.price ?? 0
    return [
      { name: "Deposit (25%)", value: Math.round(price * 0.25) },
      { name: "Remainder", value: Math.max(0, price - Math.round(price * 0.25)) },
    ]
  }, [vehicle?.price])

  if (loading) return <PageLoader message="Loading vehicle reservation..." />
  if (error || !vehicle) return <PageLoader message={error || "Vehicle not found"} />

  return (
    <div className="min-h-screen bg-black pb-20">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 sticky top-0 z-40">
        <div className="container mx-auto px-4 pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)]">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/collection"
                className="inline-flex items-center text-gold hover:text-gold/80 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span>Back to Collection</span>
              </Link>
              <div className="h-6 w-px bg-zinc-700" />
              <h1 className="text-xl font-bold text-white">Reserve Vehicle</h1>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Reserve {vehicle.name}</h2>

        <Tabs defaultValue="rent" className="w-full">
          <TabsList className="bg-zinc-900 border border-zinc-800">
            <TabsTrigger value="rent">Rent</TabsTrigger>
            <TabsTrigger value="buy">Buy</TabsTrigger>
          </TabsList>

          <TabsContent value="rent" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="bg-zinc-900/50 border-zinc-800 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2"><CalendarDays className="h-5 w-5 text-gold" /> Select rental dates</CardTitle>
                  <CardDescription>Pick start and end dates with times.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="start-datetime" className="text-white/80">
                        Start Date & Time
                      </Label>
                      <Input
                        id="start-datetime"
                        type="datetime-local"
                        value={startDateTime}
                        onChange={(e) => setStartDateTime(e.target.value)}
                        className="bg-zinc-900 border-zinc-800 text-white"
                        min={new Date().toISOString().slice(0, 16)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-datetime" className="text-white/80">
                        End Date & Time
                      </Label>
                      <Input
                        id="end-datetime"
                        type="datetime-local"
                        value={endDateTime}
                        onChange={(e) => setEndDateTime(e.target.value)}
                        className="bg-zinc-900 border-zinc-800 text-white"
                        min={startDateTime || new Date().toISOString().slice(0, 16)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2"><DollarSign className="h-5 w-5 text-gold" /> Summary</CardTitle>
                  <CardDescription>Daily rate is estimated based on vehicle value.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-white/90">
                  <div className="flex justify-between"><span>Daily rate</span><span className="text-gold font-semibold">{formatMoney(dailyRate)}</span></div>
                  <div className="flex justify-between"><span>Days</span><span>{daysSelected}</span></div>
                  <div className="h-px bg-zinc-800" />
                  <div className="flex justify-between text-lg font-bold"><span>Total</span><span className="text-gold">{formatMoney(rentTotal)}</span></div>
                  <Button className="w-full mt-4 bg-gold text-black hover:bg-gold/90" disabled={daysSelected <= 0 || reserving} onClick={handleReserveRental}>
                    {reserving ? (
                      <div className="flex items-center gap-2">
                        <LoadingSpinner size="sm" className="text-black" />
                        <span>Reserving...</span>
                      </div>
                    ) : (
                      "Reserve Rental"
                    )}
                  </Button>
                  <Alert className="bg-zinc-900/60 border-zinc-800 mt-4">
                    <ShieldCheck className="h-4 w-4" />
                    <AlertTitle>Secure reservation</AlertTitle>
                    <AlertDescription>
                      Your rental is subject to availability review. You will be contacted to finalize delivery and deposit.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="buy" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="bg-zinc-900/50 border-zinc-800 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white">Owner contact</CardTitle>
                  <CardDescription>Reach out directly to arrange viewing and purchase.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(vehicle.contacts && vehicle.contacts.length > 0) ? (
                    vehicle.contacts.map((c, idx) => (
                      <div key={idx} className="flex items-center justify-between rounded-md border border-zinc-800 bg-zinc-900 p-3 text-white/90">
                        <div>
                          <div className="font-semibold">{c.contact_name || "Owner"}</div>
                          <div className="text-sm text-white/60">{c.email || ""}</div>
                        </div>
                        <div className="flex gap-2">
                          {c.phone && (
                            <a href={`tel:${c.phone}`} className="inline-flex items-center gap-1 px-3 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 text-white text-sm"><Phone className="h-4 w-4"/> Call</a>
                          )}
                          {c.email && (
                            <a href={`mailto:${c.email}`} className="inline-flex items-center gap-1 px-3 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 text-white text-sm"><Mail className="h-4 w-4"/> Email</a>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-white/70">Contact details will be provided after deposit.</div>
                  )}

                  <div className="rounded-md border border-zinc-800 bg-zinc-900 p-4 mt-4">
                    <div className="text-white/80 mb-2">Price</div>
                    <div className="text-2xl font-bold text-gold">{formatMoney(vehicle.price)}</div>
                  </div>

                  <div className="rounded-md border border-zinc-800 bg-zinc-900 p-4 mt-4">
                    <div className="text-white/80 mb-3">Payment breakdown</div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-zinc-800/50 rounded">
                        <span className="text-white/70">Deposit (25%)</span>
                        <span className="text-gold font-semibold">{formatMoney(Math.round(vehicle.price * 0.25))}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-zinc-800/50 rounded">
                        <span className="text-white/70">Remainder</span>
                        <span className="text-white font-semibold">{formatMoney(vehicle.price - Math.round(vehicle.price * 0.25))}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white">Buy Options</CardTitle>
                  <CardDescription>Pay a deposit to reserve, or pay in full.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-white/90">
                  <div className="flex justify-between"><span>Deposit (25%)</span><span className="text-gold font-semibold">{formatMoney(deposit25)}</span></div>
                  <div className="flex justify-between"><span>Full amount</span><span className="text-gold font-semibold">{formatMoney(vehicle.price)}</span></div>
                  <div className="h-px bg-zinc-800" />
                  <Button className="w-full bg-gold text-black hover:bg-gold/90" asChild>
                    <Link href={`/checkout/vehicle/${id}?mode=deposit`}>Pay 25% deposit</Link>
                  </Button>
                  <Button variant="outline" className="w-full border-zinc-700 text-white hover:bg-zinc-800" asChild>
                    <Link href={`/checkout/vehicle/${id}?mode=full`}>Pay full amount</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
