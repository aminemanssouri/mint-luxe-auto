import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import RentalBookingForm from '@/components/rental-booking-form'

interface Vehicle {
  id: string
  name: string
  brand: string
  year: number
  rental_price_daily: number | null
  rental_price_weekly: number | null
  rental_price_monthly: number | null
  deposit_amount: number
  min_rental_days: number
  max_rental_days: number | null
  insurance_required: boolean
  image_url: string | null
  description: string | null
}

async function getVehicle(id: string): Promise<Vehicle | null> {
  const supabase = await createClient()
  
  const { data: vehicle, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !vehicle) {
    return null
  }

  return vehicle
}

async function getCustomerId(): Promise<string | null> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: customer } = await supabase
    .from('customers')
    .select('id')
    .eq('user_id', user.id)
    .single()

  return customer?.id || null
}

export default async function RentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const vehicle = await getVehicle(id)
  const customerId = await getCustomerId()

  if (!vehicle) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Rent {vehicle.name}</h1>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                {vehicle.image_url && (
                  <img
                    src={vehicle.image_url}
                    alt={vehicle.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-4">Vehicle Details</h2>
                <div className="space-y-2 text-gray-300">
                  <p><span className="text-gold">Brand:</span> {vehicle.brand}</p>
                  <p><span className="text-gold">Year:</span> {vehicle.year}</p>
                  <p><span className="text-gold">Daily Rate:</span> ${vehicle.rental_price_daily || 'N/A'}</p>
                  <p><span className="text-gold">Weekly Rate:</span> ${vehicle.rental_price_weekly || 'N/A'}</p>
                  <p><span className="text-gold">Monthly Rate:</span> ${vehicle.rental_price_monthly || 'N/A'}</p>
                  <p><span className="text-gold">Deposit:</span> ${vehicle.deposit_amount}</p>
                  <p><span className="text-gold">Min Rental:</span> {vehicle.min_rental_days} days</p>
                  {vehicle.max_rental_days && (
                    <p><span className="text-gold">Max Rental:</span> {vehicle.max_rental_days} days</p>
                  )}
                  <p><span className="text-gold">Insurance Required:</span> {vehicle.insurance_required ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>
          </div>

          <RentalBookingForm
            vehicleId={vehicle.id}
            vehicleName={vehicle.name}
            dailyRate={vehicle.rental_price_daily || 0}
            weeklyRate={vehicle.rental_price_weekly}
            monthlyRate={vehicle.rental_price_monthly}
            depositAmount={vehicle.deposit_amount}
            minRentalDays={vehicle.min_rental_days}
            maxRentalDays={vehicle.max_rental_days}
            insuranceRequired={vehicle.insurance_required}
            customerId={customerId || undefined}
          />
        </div>
      </div>
    </div>
  )
}
