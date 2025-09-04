"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LoadingSpinner from "@/components/loading-spinner"
import { CreditCard, ShieldCheck, Bitcoin, Car, Calendar, DollarSign } from "lucide-react"

function formatMoney(n: number) {
  if (!Number.isFinite(n)) return "$0"
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" })
}

export default function VehicleCheckoutPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const search = useSearchParams()
  const mode = (search.get("mode") as "deposit" | "full") || "deposit"

  const [vehicle, setVehicle] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "coinbase">("stripe")
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/vehicles/${id}`)
        const json = await res.json()
        if (active) setVehicle(json?.item || null)
      } catch (e) {
        if (active) setVehicle(null)
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [id])

  const amount = useMemo(() => {
    const price = Number(vehicle?.price) || 0
    return mode === "deposit" ? Math.round(price * 0.25) : price
  }, [mode, vehicle?.price])

  const handleStripePayment = async () => {
    setProcessing(true)
    try {
      const response = await fetch('/api/payments/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          vehicleId: id,
          mode: mode,
          vehicleName: `${vehicle?.make} ${vehicle?.model}`,
        }),
      })

      const data = await response.json()
      if (data.error) {
        alert('Payment failed: ' + data.error)
      } else if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url
      } else if (data.clientSecret) {
        // Handle Payment Intent - redirect to a payment form page
        const params = new URLSearchParams({
          clientSecret: data.clientSecret,
          amount: amount.toString(),
          vehicleId: id,
          mode: mode,
          vehicleName: `${vehicle?.make} ${vehicle?.model}`
        })
        window.location.href = `/checkout/payment-form?${params.toString()}`
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('Payment failed')
    } finally {
      setProcessing(false)
    }
  }

  const handleCoinbasePayment = async () => {
    setProcessing(true)
    try {
      const response = await fetch('/api/payments/coinbase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          vehicleId: id,
          mode,
        }),
      })
      
      const { hostedUrl } = await response.json()
      
      if (hostedUrl) {
        // Redirect to Coinbase Commerce hosted checkout
        window.location.href = hostedUrl
      }
    } catch (error) {
      console.error('Coinbase payment failed:', error)
    } finally {
      setProcessing(false)
    }
  }

  if (loading) return <div className="container mx-auto px-4 py-10 text-white">Loading...</div>
  if (!vehicle) return <div className="container mx-auto px-4 py-10 text-white">Vehicle not found.</div>

  return (
    <div className="min-h-screen bg-black pb-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">Checkout – {vehicle.name}</h1>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Payment Form */}
          <Card className="bg-zinc-900/50 border-zinc-800 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><CreditCard className="h-5 w-5 text-gold" /> Payment Method</CardTitle>
              <CardDescription>Choose your preferred payment method for your {mode === "deposit" ? "25% deposit" : "full"} payment.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as "stripe" | "coinbase")} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-zinc-800">
                  <TabsTrigger value="stripe" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Card Payment
                  </TabsTrigger>
                  <TabsTrigger value="coinbase" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                    <Bitcoin className="h-4 w-4 mr-2" />
                    Crypto Payment
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="stripe" className="mt-6">
                  <Alert className="bg-zinc-900/60 border-zinc-800">
                    <ShieldCheck className="h-4 w-4" />
                    <AlertTitle>Secure checkout</AlertTitle>
                    <AlertDescription>You'll be redirected to Stripe's secure checkout page to complete your payment.</AlertDescription>
                  </Alert>
                  <Button 
                    className="w-full bg-gold text-black hover:bg-gold/90" 
                    onClick={handleStripePayment}
                    disabled={processing}
                  >
                    {processing ? (
                      <div className="flex items-center gap-2">
                        <LoadingSpinner size="sm" className="text-black" />
                        <span>Redirecting...</span>
                      </div>
                    ) : (
                      `Pay ${formatMoney(amount)} with Card`
                    )}
                  </Button>
                </TabsContent>

                <TabsContent value="coinbase" className="mt-6">
                  <div className="space-y-4">
                    <div className="text-center py-8">
                      <Bitcoin className="h-16 w-16 text-gold mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">Pay with Cryptocurrency</h3>
                      <p className="text-white/70 mb-6">
                        Pay securely with Bitcoin, Ethereum, or other supported cryptocurrencies through Coinbase Commerce.
                      </p>
                      <div className="bg-zinc-800/50 rounded-lg p-4 mb-6">
                        <div className="flex justify-between items-center text-white">
                          <span>Amount:</span>
                          <span className="text-gold font-semibold">{formatMoney(amount)}</span>
                        </div>
                      </div>
                    </div>
                    <Alert className="bg-zinc-900/60 border-zinc-800">
                      <ShieldCheck className="h-4 w-4" />
                      <AlertTitle>Secure crypto payment</AlertTitle>
                      <AlertDescription>Powered by Coinbase Commerce. You'll be redirected to complete your payment.</AlertDescription>
                    </Alert>
                    <Button 
                      className="w-full mt-4 bg-gold text-black hover:bg-gold/90" 
                      onClick={handleCoinbasePayment}
                      disabled={processing}
                    >
                      {processing ? "Processing..." : `Pay ${formatMoney(amount)} with Crypto`}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Order summary</CardTitle>
              <CardDescription>Your reservation details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-white/90">
              <div className="flex items-center gap-3">
                <div className="relative h-16 w-24 overflow-hidden rounded-md border border-zinc-800">
                  <Image src={vehicle.image || "/placeholder.svg"} alt={vehicle.name} fill className="object-cover" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold truncate">{vehicle.name}</div>
                  <div className="text-sm text-white/60">{vehicle.year}</div>
                </div>
              </div>
              <div className="h-px bg-zinc-800" />
              <div className="flex justify-between"><span>Vehicle price</span><span className="text-gold">{formatMoney(Number(vehicle.price) || 0)}</span></div>
              <div className="flex justify-between"><span>{mode === "deposit" ? "Deposit (25%)" : "Total"}</span><span className="text-gold font-semibold">{formatMoney(amount)}</span></div>
              {mode === "deposit" && (
                <div className="flex justify-between text-white/70 text-sm"><span>Remainder due</span><span>{formatMoney(Math.max(0, (Number(vehicle.price) || 0) - amount))}</span></div>
              )}
              <Badge className="bg-gold/90 text-black">{mode === "deposit" ? "Deposit" : "Full payment"}</Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
