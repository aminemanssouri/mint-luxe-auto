"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import LanguageSwitcher from "@/components/language-switcher"
import { CheckCircle, Home, Receipt, ArrowLeft } from "lucide-react"

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const [paymentMethod, setPaymentMethod] = useState<string>("")

  useEffect(() => {
    const method = searchParams.get("method") || "stripe"
    setPaymentMethod(method)
  }, [searchParams])

  return (
    <div className="min-h-screen bg-black pb-20">
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
              <h1 className="text-xl font-bold text-white">Payment Success</h1>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <CardTitle className="text-white text-2xl">Payment Successful!</CardTitle>
              <CardDescription className="text-lg">
                Your payment has been processed successfully.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <Badge className="bg-gold/90 text-black text-sm px-3 py-1">
                  {paymentMethod === "coinbase" ? "Crypto Payment" : "Card Payment"} Completed
                </Badge>
                
                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-2">What happens next?</h3>
                  <ul className="text-white/70 text-sm space-y-2 text-left">
                    <li>• You'll receive a confirmation email shortly</li>
                    <li>• Our team will contact you within 24 hours</li>
                    <li>• Vehicle preparation and documentation will begin</li>
                    <li>• Delivery or pickup details will be arranged</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="flex-1 bg-gold text-black hover:bg-gold/90">
                  <Link href="/">
                    <Home className="h-4 w-4 mr-2" />
                    Back to Home
                  </Link>
                </Button>
                <Button asChild variant="outline" className="flex-1 border-zinc-700 text-white hover:bg-zinc-800">
                  <Link href="/collection">
                    <Receipt className="h-4 w-4 mr-2" />
                    View More Vehicles
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
