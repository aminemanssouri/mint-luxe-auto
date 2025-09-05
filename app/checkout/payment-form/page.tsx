"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingButton } from "@/components/ui/loading-button"
import { PageLoading } from "@/components/ui/page-loading"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, CreditCard, ShieldCheck } from "lucide-react"
import Link from "next/link"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function PaymentForm() {
  const stripe = useStripe()
  const elements = useElements()
  const searchParams = useSearchParams()
  
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const clientSecret = searchParams.get("clientSecret")
  const amount = searchParams.get("amount")
  const vehicleId = searchParams.get("vehicleId")
  const mode = searchParams.get("mode")
  const vehicleName = searchParams.get("vehicleName")

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    if (!stripe || !elements || !clientSecret) {
      return
    }

    setProcessing(true)
    setError(null)

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      setError("Card element not found")
      setProcessing(false)
      return
    }

    const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      }
    })

    if (confirmError) {
      setError(confirmError.message || "Payment failed")
    } else if (paymentIntent?.status === "succeeded") {
      setSuccess(true)
      // Redirect to success page after a short delay
      setTimeout(() => {
        window.location.href = `/checkout/success?payment_intent=${paymentIntent.id}&method=stripe`
      }, 2000)
    }
    
    setProcessing(false)
  }

  if (!clientSecret) {
    return (
      <div className="container mx-auto px-4 pt-28 pb-16">
        <Card className="max-w-md mx-auto bg-black/60 border-white/10">
          <CardContent className="py-10 text-center text-white/70">
            Invalid payment session. Please try again.
          </CardContent>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="container mx-auto px-4 pt-28 pb-16">
        <Card className="max-w-md mx-auto bg-black/60 border-white/10">
          <CardContent className="py-10 text-center">
            <div className="text-green-400 text-6xl mb-4">✓</div>
            <h2 className="text-xl font-semibold text-white mb-2">Payment Successful!</h2>
            <p className="text-white/70">Redirecting to confirmation page...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 pt-28 pb-16">
      <div className="mb-4">
        <Link
          href={`/checkout/vehicle/${vehicleId}`}
          className="inline-flex items-center text-white hover:text-gold transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Checkout
        </Link>
      </div>

      <Card className="max-w-md mx-auto bg-black/60 border-white/10">
        <CardHeader className="text-center">
          <CardTitle className="text-white flex items-center justify-center gap-2">
            <CreditCard className="h-5 w-5" />
            Complete Payment
          </CardTitle>
          <div className="text-white/70 space-y-1">
            <p className="font-medium">{vehicleName}</p>
            <p className="text-sm">
              {mode === "deposit" ? "Deposit Payment (25%)" : "Full Payment"}
            </p>
            <p className="text-gold font-semibold text-lg">
              ${Number(amount).toFixed(2)}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6 bg-zinc-900/60 border-zinc-800">
            <ShieldCheck className="h-4 w-4" />
            <AlertDescription className="text-white/80">
              Your payment is secured by Stripe. Your card information is encrypted and never stored.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 border border-white/20 rounded-lg bg-white/5">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#ffffff',
                      '::placeholder': {
                        color: '#9ca3af',
                      },
                    },
                  },
                }}
              />
            </div>

            {error && (
              <Alert className="bg-red-900/20 border-red-800">
                <AlertDescription className="text-red-400">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <LoadingButton
              type="submit"
              loading={processing}
              loadingText="Processing payment..."
              loadingDelay={300}
              className="w-full bg-gold hover:bg-gold/90 text-black font-semibold"
            >
              Pay ${Number(amount).toFixed(2)}
            </LoadingButton>
          </form>

          <div className="mt-4 text-center text-xs text-white/60">
            <p>Powered by Stripe • PCI DSS Compliant</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function PaymentFormPage() {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  )
}
