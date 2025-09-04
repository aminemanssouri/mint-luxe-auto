"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LoadingSpinner from "@/components/loading-spinner"
import { CreditCard, ShieldCheck, Bitcoin, Calendar, Clock, Video, MapPin, User } from "lucide-react"

function formatMoney(n: number) {
  if (!Number.isFinite(n)) return "$0"
  return new Intl.NumberFormat('en-US', { 
    style: "currency", 
    currency: "USD" 
  }).format(n)
}

export default function AppointmentCheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [appointmentDetails, setAppointmentDetails] = useState({
    type: searchParams.get("appointmentType") || "online",
    amount: Number(searchParams.get("amount")) || 30,
    name: searchParams.get("name") || "",
    date: searchParams.get("date") || "",
    time: searchParams.get("time") || ""
  })
  
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "coinbase">("stripe")
  const [processing, setProcessing] = useState(false)

  const handleStripePayment = async () => {
    setProcessing(true)
    try {
      const response = await fetch('/api/payments/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: appointmentDetails.amount,
          appointmentType: appointmentDetails.type,
          appointmentDate: appointmentDetails.date,
          appointmentTime: appointmentDetails.time,
          customerName: appointmentDetails.name,
        }),
      })
      
      const { clientSecret } = await response.json()
      
      if (clientSecret) {
        console.log('Appointment payment initiated:', clientSecret)
        router.push('/checkout/success?type=appointment')
      }
    } catch (error) {
      console.error('Stripe payment failed:', error)
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
          amount: appointmentDetails.amount,
          appointmentType: appointmentDetails.type,
          appointmentDate: appointmentDetails.date,
          appointmentTime: appointmentDetails.time,
          customerName: appointmentDetails.name,
        }),
      })
      
      const data = await response.json()
      if (data.error) {
        alert('Payment failed: ' + data.error)
      } else if (data.url) {
        // Redirect to Coinbase Checkout
        window.location.href = data.url
      } else if (data.clientSecret) {
        // Handle Payment Intent - redirect to payment form page
        const params = new URLSearchParams({
          clientSecret: data.clientSecret,
          amount: appointmentDetails.amount.toString(),
          vehicleId: 'appointment',
          mode: 'full',
          vehicleName: 'Service Appointment'
        })
        window.location.href = `/checkout/payment-form?${params.toString()}`
      }
    } catch (error) {
      console.error('Coinbase payment failed:', error)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-black pb-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">
          Complete Your Appointment Booking
        </h1>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Payment Form */}
          <Card className="bg-zinc-900/50 border-zinc-800 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-gold" />
                Payment Method
              </CardTitle>
              <CardDescription>
                Choose your preferred payment method for your consultation fee.
              </CardDescription>
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
                  <div className="space-y-4">
                    <Alert className="bg-zinc-900/60 border-zinc-800">
                      <ShieldCheck className="h-4 w-4" />
                      <AlertTitle>Secure checkout</AlertTitle>
                      <AlertDescription>Your payment is protected by Stripe. We do not store card details.</AlertDescription>
                    </Alert>
                    <Button 
                      className="w-full bg-gold text-black hover:bg-gold/90" 
                      onClick={handleStripePayment}
                      disabled={processing}
                    >
                      {processing ? (
                        <div className="flex items-center gap-2">
                          <LoadingSpinner size="sm" className="text-black" />
                          <span>Processing...</span>
                        </div>
                      ) : (
                        `Pay ${formatMoney(appointmentDetails.amount)} with Card`
                      )}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="coinbase" className="mt-6">
                  <div className="space-y-4">
                    <div className="text-center py-8">
                      <Bitcoin className="h-16 w-16 text-gold mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">Pay with Cryptocurrency</h3>
                      <p className="text-white/70 mb-6">
                        Pay securely with Bitcoin, Ethereum, or other supported cryptocurrencies.
                      </p>
                      <div className="bg-zinc-800/50 rounded-lg p-4 mb-6">
                        <div className="flex justify-between items-center text-white">
                          <span>Consultation Fee:</span>
                          <span className="text-gold font-semibold">{formatMoney(appointmentDetails.amount)}</span>
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
                      {processing ? "Processing..." : `Pay ${formatMoney(appointmentDetails.amount)} with Crypto`}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Appointment Summary */}
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Appointment Summary</CardTitle>
              <CardDescription>Review your booking details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-white/90">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg">
                  {appointmentDetails.type === "online" ? (
                    <Video className="h-5 w-5 text-gold" />
                  ) : (
                    <MapPin className="h-5 w-5 text-gold" />
                  )}
                  <div>
                    <div className="text-white font-medium">
                      {appointmentDetails.type === "online" ? "Online Meeting" : "In-Person Meeting"}
                    </div>
                    <div className="text-white/60 text-sm">
                      {appointmentDetails.type === "online" 
                        ? "Video consultation" 
                        : "Showroom visit"
                      }
                    </div>
                  </div>
                </div>

                {appointmentDetails.date && appointmentDetails.time && (
                  <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg">
                    <Calendar className="h-5 w-5 text-gold" />
                    <div>
                      <div className="text-white font-medium">
                        {new Date(appointmentDetails.date).toLocaleDateString('en-US')}
                      </div>
                      <div className="text-white/60 text-sm">
                        {appointmentDetails.time}
                      </div>
                    </div>
                  </div>
                )}

                {appointmentDetails.name && (
                  <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg">
                    <User className="h-5 w-5 text-gold" />
                    <div>
                      <div className="text-white font-medium">{appointmentDetails.name}</div>
                      <div className="text-white/60 text-sm">Consultant</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="h-px bg-zinc-800" />
              <div className="flex justify-between">
                <span>Consultation Fee</span>
                <span className="text-gold font-semibold">{formatMoney(appointmentDetails.amount)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-gold">{formatMoney(appointmentDetails.amount)}</span>
              </div>
              
              <Badge className="bg-gold/90 text-black w-full justify-center">
                {appointmentDetails.type === "online" ? "Online Consultation" : "In-Person Meeting"}
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
