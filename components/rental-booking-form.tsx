"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin, Shield, Users, Clock } from "lucide-react"

interface RentalBookingFormProps {
  vehicleId: string
  vehicleName: string
  dailyRate: number
  weeklyRate?: number | null
  monthlyRate?: number | null
  depositAmount: number
  minRentalDays: number
  maxRentalDays?: number | null
  insuranceRequired: boolean
  customerId?: string
}

export default function RentalBookingForm({
  vehicleId,
  vehicleName,
  dailyRate,
  weeklyRate,
  monthlyRate,
  depositAmount,
  minRentalDays,
  maxRentalDays,
  insuranceRequired,
  customerId
}: RentalBookingFormProps) {
  const [formData, setFormData] = useState({
    rentalType: 'daily',
    startDate: '',
    endDate: '',
    pickupLocation: 'showroom',
    returnLocation: 'showroom',
    pickupAddress: '',
    returnAddress: '',
    driverLicense: '',
    licenseExpiry: '',
    additionalDrivers: [] as Array<{
      name: string
      license: string
      relationship: string
    }>,
    insuranceOption: 'basic',
    specialRequests: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [totalDays, setTotalDays] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0)

  const calculateTotal = () => {
    if (!formData.startDate || !formData.endDate) return

    const start = new Date(formData.startDate)
    const end = new Date(formData.endDate)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    
    if (days < minRentalDays) return

    setTotalDays(days)

    let baseAmount = 0
    if (formData.rentalType === 'daily') {
      baseAmount = days * dailyRate
    } else if (formData.rentalType === 'weekly' && weeklyRate) {
      const weeks = Math.ceil(days / 7)
      baseAmount = weeks * weeklyRate
    } else if (formData.rentalType === 'monthly' && monthlyRate) {
      const months = Math.ceil(days / 30)
      baseAmount = months * monthlyRate
    }

    let insuranceAmount = 0
    if (formData.insuranceOption === 'comprehensive') {
      insuranceAmount = baseAmount * 0.15
    } else if (formData.insuranceOption === 'premium') {
      insuranceAmount = baseAmount * 0.25
    }

    const additionalDriverFee = formData.additionalDrivers.length * 50 * days

    setTotalAmount(baseAmount + insuranceAmount + additionalDriverFee + depositAmount)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerId) {
      alert('Please log in to continue with the rental booking.')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/vehicles/${vehicleId}/rent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          rentalType: formData.rentalType,
          startDate: formData.startDate,
          endDate: formData.endDate,
          pickupLocation: formData.pickupLocation,
          returnLocation: formData.returnLocation,
          pickupAddress: formData.pickupAddress,
          returnAddress: formData.returnAddress,
          dailyRate,
          weeklyRate,
          monthlyRate,
          totalDays,
          baseAmount: totalAmount - depositAmount,
          depositAmount,
          additionalDrivers: formData.additionalDrivers,
          driverLicenseInfo: {
            license: formData.driverLicense,
            expiry: formData.licenseExpiry
          },
          insuranceOption: formData.insuranceOption,
          specialRequests: formData.specialRequests,
          totalAmount
        }),
      })

      const result = await response.json()

      if (result.success) {
        alert('Rental agreement created successfully!')
        // Redirect to booking confirmation or payment
        window.location.href = `/booking-confirmation/${result.agreement.id}`
      } else {
        alert(result.error || 'Failed to create rental agreement')
      }
    } catch (error) {
      console.error('Rental booking error:', error)
      alert('An error occurred while processing your rental booking')
    } finally {
      setIsSubmitting(false)
    }
  }

  const addAdditionalDriver = () => {
    setFormData(prev => ({
      ...prev,
      additionalDrivers: [...prev.additionalDrivers, { name: '', license: '', relationship: '' }]
    }))
  }

  const removeAdditionalDriver = (index: number) => {
    setFormData(prev => ({
      ...prev,
      additionalDrivers: prev.additionalDrivers.filter((_, i) => i !== index)
    }))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-gold flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Rental Booking for {vehicleName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rental Type */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="rentalType">Rental Type</Label>
                <Select value={formData.rentalType} onValueChange={(value) => setFormData(prev => ({ ...prev, rentalType: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily (${dailyRate}/day)</SelectItem>
                    {weeklyRate && <SelectItem value="weekly">Weekly (${weeklyRate}/week)</SelectItem>}
                    {monthlyRate && <SelectItem value="monthly">Monthly (${monthlyRate}/month)</SelectItem>}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, startDate: e.target.value }))
                    setTimeout(calculateTotal, 100)
                  }}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, endDate: e.target.value }))
                    setTimeout(calculateTotal, 100)
                  }}
                  min={formData.startDate}
                  required
                />
              </div>
            </div>

            {/* Pickup & Return */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gold flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Pickup Details
                </h3>
                <div>
                  <Label htmlFor="pickupLocation">Pickup Location</Label>
                  <Select value={formData.pickupLocation} onValueChange={(value) => setFormData(prev => ({ ...prev, pickupLocation: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="showroom">Our Showroom</SelectItem>
                      <SelectItem value="delivery">Delivery to Address</SelectItem>
                      <SelectItem value="airport">Airport Pickup</SelectItem>
                      <SelectItem value="hotel">Hotel Pickup</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formData.pickupLocation !== 'showroom' && (
                  <div>
                    <Label htmlFor="pickupAddress">Pickup Address</Label>
                    <Textarea
                      value={formData.pickupAddress}
                      onChange={(e) => setFormData(prev => ({ ...prev, pickupAddress: e.target.value }))}
                      placeholder="Enter pickup address..."
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gold flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Return Details
                </h3>
                <div>
                  <Label htmlFor="returnLocation">Return Location</Label>
                  <Select value={formData.returnLocation} onValueChange={(value) => setFormData(prev => ({ ...prev, returnLocation: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="showroom">Our Showroom</SelectItem>
                      <SelectItem value="pickup">Pickup from Address</SelectItem>
                      <SelectItem value="airport">Airport Return</SelectItem>
                      <SelectItem value="hotel">Hotel Return</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formData.returnLocation !== 'showroom' && (
                  <div>
                    <Label htmlFor="returnAddress">Return Address</Label>
                    <Textarea
                      value={formData.returnAddress}
                      onChange={(e) => setFormData(prev => ({ ...prev, returnAddress: e.target.value }))}
                      placeholder="Enter return address..."
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Driver Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gold">Driver Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="driverLicense">Driver License Number</Label>
                  <Input
                    value={formData.driverLicense}
                    onChange={(e) => setFormData(prev => ({ ...prev, driverLicense: e.target.value }))}
                    placeholder="Enter license number"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="licenseExpiry">License Expiry Date</Label>
                  <Input
                    type="date"
                    value={formData.licenseExpiry}
                    onChange={(e) => setFormData(prev => ({ ...prev, licenseExpiry: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Additional Drivers */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gold flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Additional Drivers
                </h3>
                <Button type="button" variant="outline" onClick={addAdditionalDriver}>
                  Add Driver
                </Button>
              </div>
              {formData.additionalDrivers.map((driver, index) => (
                <div key={index} className="grid md:grid-cols-4 gap-4 p-4 border border-gray-700 rounded-lg">
                  <Input
                    placeholder="Full Name"
                    value={driver.name}
                    onChange={(e) => {
                      const newDrivers = [...formData.additionalDrivers]
                      newDrivers[index].name = e.target.value
                      setFormData(prev => ({ ...prev, additionalDrivers: newDrivers }))
                    }}
                  />
                  <Input
                    placeholder="License Number"
                    value={driver.license}
                    onChange={(e) => {
                      const newDrivers = [...formData.additionalDrivers]
                      newDrivers[index].license = e.target.value
                      setFormData(prev => ({ ...prev, additionalDrivers: newDrivers }))
                    }}
                  />
                  <Input
                    placeholder="Relationship"
                    value={driver.relationship}
                    onChange={(e) => {
                      const newDrivers = [...formData.additionalDrivers]
                      newDrivers[index].relationship = e.target.value
                      setFormData(prev => ({ ...prev, additionalDrivers: newDrivers }))
                    }}
                  />
                  <Button type="button" variant="destructive" onClick={() => removeAdditionalDriver(index)}>
                    Remove
                  </Button>
                </div>
              ))}
            </div>

            {/* Insurance Options */}
            {insuranceRequired && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gold flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Insurance Coverage
                </h3>
                <Select value={formData.insuranceOption} onValueChange={(value) => {
                  setFormData(prev => ({ ...prev, insuranceOption: value }))
                  setTimeout(calculateTotal, 100)
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic Coverage (Included)</SelectItem>
                    <SelectItem value="comprehensive">Comprehensive (+15%)</SelectItem>
                    <SelectItem value="premium">Premium Coverage (+25%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Special Requests */}
            <div>
              <Label htmlFor="specialRequests">Special Requests</Label>
              <Textarea
                value={formData.specialRequests}
                onChange={(e) => setFormData(prev => ({ ...prev, specialRequests: e.target.value }))}
                placeholder="Any special requests or requirements..."
                rows={3}
              />
            </div>

            {/* Pricing Summary */}
            {totalDays > 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gold flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Rental Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Rental Period:</span>
                    <span>{totalDays} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Base Rate:</span>
                    <span>${(totalAmount - depositAmount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Security Deposit:</span>
                    <span>${depositAmount.toFixed(2)}</span>
                  </div>
                  {formData.additionalDrivers.length > 0 && (
                    <div className="flex justify-between">
                      <span>Additional Drivers:</span>
                      <span>${(formData.additionalDrivers.length * 50 * totalDays).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-600 pt-2">
                    <div className="flex justify-between font-bold text-gold">
                      <span>Total Amount:</span>
                      <span>${totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Button
              type="submit"
              disabled={isSubmitting || !customerId || totalDays < minRentalDays}
              className="w-full bg-gold hover:bg-gold/90 text-black"
            >
              {isSubmitting ? 'Processing...' : 'Create Rental Agreement'}
            </Button>

            {!customerId && (
              <p className="text-center text-red-400">
                Please <a href="/auth/login" className="text-gold underline">log in</a> to continue with the rental booking.
              </p>
            )}

            {totalDays > 0 && totalDays < minRentalDays && (
              <p className="text-center text-red-400">
                Minimum rental period is {minRentalDays} days.
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
