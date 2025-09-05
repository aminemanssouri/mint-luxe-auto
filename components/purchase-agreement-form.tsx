"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Car, FileText, Calendar, Shield } from "lucide-react"

interface PurchaseAgreementFormProps {
  vehicleId: string
  vehicleName: string
  purchasePrice: number
  depositAmount: number
  tradeInVehicles: Array<{
    id: string
    name: string
    brand: string
    year: number
    purchase_price: number | null
  }>
  customerId?: string
}

export default function PurchaseAgreementForm({
  vehicleId,
  vehicleName,
  purchasePrice,
  depositAmount,
  tradeInVehicles,
  customerId
}: PurchaseAgreementFormProps) {
  const [formData, setFormData] = useState({
    downPayment: depositAmount,
    paymentMethod: 'cash',
    financingTerms: {
      loanAmount: 0,
      interestRate: 0,
      termMonths: 0,
      monthlyPayment: 0
    },
    tradeInVehicleId: '',
    tradeInValue: 0,
    deliveryDate: '',
    deliveryAddress: '',
    warrantyOption: 'standard',
    insuranceRequired: true,
    specialTerms: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [taxes, setTaxes] = useState(0)
  const [fees, setFees] = useState(2500) // Standard processing fees
  const [totalAmount, setTotalAmount] = useState(0)

  const calculateTotal = () => {
    const basePrice = purchasePrice
    const tradeInDeduction = formData.tradeInValue
    const calculatedTaxes = (basePrice - tradeInDeduction) * 0.08 // 8% tax rate
    const netAmount = basePrice - tradeInDeduction + calculatedTaxes + fees
    
    setTaxes(calculatedTaxes)
    setTotalAmount(netAmount)

    // Update financing if applicable
    if (formData.paymentMethod === 'financing') {
      const loanAmount = netAmount - formData.downPayment
      const monthlyRate = formData.financingTerms.interestRate / 100 / 12
      const numPayments = formData.financingTerms.termMonths
      
      if (monthlyRate > 0 && numPayments > 0) {
        const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)
        
        setFormData(prev => ({
          ...prev,
          financingTerms: {
            ...prev.financingTerms,
            loanAmount,
            monthlyPayment
          }
        }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerId) {
      alert('Please log in to continue with the purchase.')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/vehicles/${vehicleId}/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          purchasePrice,
          downPayment: formData.downPayment,
          financingAmount: formData.paymentMethod === 'financing' ? formData.financingTerms.loanAmount : 0,
          tradeInVehicleId: formData.tradeInVehicleId || null,
          tradeInValue: formData.tradeInValue,
          taxes,
          fees,
          totalAmount,
          paymentMethod: formData.paymentMethod,
          financingTerms: formData.paymentMethod === 'financing' ? formData.financingTerms : null,
          deliveryDate: formData.deliveryDate,
          deliveryAddress: formData.deliveryAddress,
          warrantyInfo: {
            type: formData.warrantyOption,
            coverage: formData.warrantyOption === 'extended' ? '5 years / 100,000 miles' : '2 years / 50,000 miles'
          },
          specialTerms: formData.specialTerms
        }),
      })

      const result = await response.json()

      if (result.success) {
        alert('Purchase agreement created successfully!')
        // Redirect to agreement confirmation or payment
        window.location.href = `/purchase-confirmation/${result.agreement.id}`
      } else {
        alert(result.error || 'Failed to create purchase agreement')
      }
    } catch (error) {
      console.error('Purchase agreement error:', error)
      alert('An error occurred while processing your purchase agreement')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTradeInChange = (vehicleId: string) => {
    const vehicle = tradeInVehicles.find(v => v.id === vehicleId)
    if (vehicle) {
      // Estimate trade-in value as 70% of purchase price
      const estimatedValue = (vehicle.purchase_price || 0) * 0.7
      setFormData(prev => ({
        ...prev,
        tradeInVehicleId: vehicleId,
        tradeInValue: estimatedValue
      }))
      setTimeout(calculateTotal, 100)
    } else {
      setFormData(prev => ({
        ...prev,
        tradeInVehicleId: '',
        tradeInValue: 0
      }))
      setTimeout(calculateTotal, 100)
    }
  }

  // Calculate totals when form data changes
  React.useEffect(() => {
    calculateTotal()
  }, [formData.downPayment, formData.tradeInValue, formData.paymentMethod, formData.financingTerms.interestRate, formData.financingTerms.termMonths])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-gold flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Purchase Agreement for {vehicleName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Payment Method */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gold flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Payment Method
              </h3>
              <Select value={formData.paymentMethod} onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash Payment</SelectItem>
                  <SelectItem value="financing">Financing</SelectItem>
                  <SelectItem value="lease">Lease</SelectItem>
                  <SelectItem value="crypto">Cryptocurrency</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Down Payment */}
            <div>
              <Label htmlFor="downPayment">Down Payment</Label>
              <Input
                type="number"
                value={formData.downPayment}
                onChange={(e) => setFormData(prev => ({ ...prev, downPayment: Number(e.target.value) }))}
                min={depositAmount}
                max={purchasePrice}
                required
              />
              <p className="text-sm text-gray-400 mt-1">Minimum: ${depositAmount.toLocaleString()}</p>
            </div>

            {/* Financing Details */}
            {formData.paymentMethod === 'financing' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gold">Financing Details</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="interestRate">Interest Rate (%)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.financingTerms.interestRate}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        financingTerms: { ...prev.financingTerms, interestRate: Number(e.target.value) }
                      }))}
                      placeholder="e.g., 4.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="termMonths">Loan Term (Months)</Label>
                    <Select value={formData.financingTerms.termMonths.toString()} onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      financingTerms: { ...prev.financingTerms, termMonths: Number(value) }
                    }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select term" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="36">36 months</SelectItem>
                        <SelectItem value="48">48 months</SelectItem>
                        <SelectItem value="60">60 months</SelectItem>
                        <SelectItem value="72">72 months</SelectItem>
                        <SelectItem value="84">84 months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Estimated Monthly Payment</Label>
                    <div className="p-2 bg-gray-800 rounded border text-gold font-semibold">
                      ${formData.financingTerms.monthlyPayment.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Trade-In Vehicle */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gold flex items-center gap-2">
                <Car className="h-4 w-4" />
                Trade-In Vehicle (Optional)
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tradeInVehicle">Select Trade-In Vehicle</Label>
                  <Select value={formData.tradeInVehicleId} onValueChange={handleTradeInChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="No trade-in" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No trade-in</SelectItem>
                      {tradeInVehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.year} {vehicle.brand} {vehicle.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tradeInValue">Trade-In Value</Label>
                  <Input
                    type="number"
                    value={formData.tradeInValue}
                    onChange={(e) => setFormData(prev => ({ ...prev, tradeInValue: Number(e.target.value) }))}
                    placeholder="0"
                    disabled={!formData.tradeInVehicleId}
                  />
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gold flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Delivery Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="deliveryDate">Preferred Delivery Date</Label>
                  <Input
                    type="date"
                    value={formData.deliveryDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, deliveryDate: e.target.value }))}
                    min={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} // 7 days from now
                  />
                </div>
                <div>
                  <Label htmlFor="deliveryAddress">Delivery Address</Label>
                  <Textarea
                    value={formData.deliveryAddress}
                    onChange={(e) => setFormData(prev => ({ ...prev, deliveryAddress: e.target.value }))}
                    placeholder="Enter delivery address or leave blank for showroom pickup"
                    rows={2}
                  />
                </div>
              </div>
            </div>

            {/* Warranty Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gold flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Warranty Options
              </h3>
              <Select value={formData.warrantyOption} onValueChange={(value) => setFormData(prev => ({ ...prev, warrantyOption: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard Warranty (2 years / 50,000 miles)</SelectItem>
                  <SelectItem value="extended">Extended Warranty (5 years / 100,000 miles) - +$3,000</SelectItem>
                  <SelectItem value="premium">Premium Warranty (7 years / 150,000 miles) - +$5,000</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Insurance Requirement */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="insuranceRequired"
                checked={formData.insuranceRequired}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, insuranceRequired: !!checked }))}
              />
              <Label htmlFor="insuranceRequired">
                I understand that comprehensive insurance is required for this vehicle
              </Label>
            </div>

            {/* Special Terms */}
            <div>
              <Label htmlFor="specialTerms">Special Terms & Conditions</Label>
              <Textarea
                value={formData.specialTerms}
                onChange={(e) => setFormData(prev => ({ ...prev, specialTerms: e.target.value }))}
                placeholder="Any special terms, conditions, or requests..."
                rows={3}
              />
            </div>

            {/* Purchase Summary */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-gold">Purchase Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Vehicle Price:</span>
                  <span>${purchasePrice.toLocaleString()}</span>
                </div>
                {formData.tradeInValue > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Trade-In Credit:</span>
                    <span>-${formData.tradeInValue.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Taxes (8%):</span>
                  <span>${taxes.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Fees:</span>
                  <span>${fees.toLocaleString()}</span>
                </div>
                {formData.warrantyOption === 'extended' && (
                  <div className="flex justify-between">
                    <span>Extended Warranty:</span>
                    <span>$3,000</span>
                  </div>
                )}
                {formData.warrantyOption === 'premium' && (
                  <div className="flex justify-between">
                    <span>Premium Warranty:</span>
                    <span>$5,000</span>
                  </div>
                )}
                <div className="border-t border-gray-600 pt-2">
                  <div className="flex justify-between">
                    <span>Down Payment:</span>
                    <span>${formData.downPayment.toLocaleString()}</span>
                  </div>
                  {formData.paymentMethod === 'financing' && (
                    <div className="flex justify-between">
                      <span>Financing Amount:</span>
                      <span>${formData.financingTerms.loanAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-gold text-lg">
                    <span>Total Purchase Price:</span>
                    <span>${totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              type="submit"
              disabled={isSubmitting || !customerId || !formData.insuranceRequired}
              className="w-full bg-gold hover:bg-gold/90 text-black"
            >
              {isSubmitting ? 'Processing...' : 'Create Purchase Agreement'}
            </Button>

            {!customerId && (
              <p className="text-center text-red-400">
                Please <a href="/auth/login" className="text-gold underline">log in</a> to continue with the purchase.
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
