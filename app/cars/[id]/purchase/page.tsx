import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import PurchaseAgreementForm from '@/components/purchase-agreement-form'

interface Vehicle {
  id: string
  name: string
  brand: string
  year: number
  purchase_price: number | null
  deposit_amount: number
  image_url: string | null
  description: string | null
  vin: string | null
  mileage: number | null
  condition_status: string
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

async function getAvailableTradeInVehicles(): Promise<any[]> {
  const supabase = await createClient()
  
  const { data: vehicles, error } = await supabase
    .from('vehicles')
    .select('id, name, brand, year, purchase_price')
    .eq('inventory_status', 'available')
    .order('name')

  return vehicles || []
}

export default async function PurchasePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const vehicle = await getVehicle(id)
  const customerId = await getCustomerId()
  const tradeInVehicles = await getAvailableTradeInVehicles()

  if (!vehicle) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Purchase {vehicle.name}</h1>
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
                  <p><span className="text-gold">Purchase Price:</span> ${vehicle.purchase_price?.toLocaleString() || 'N/A'}</p>
                  <p><span className="text-gold">Condition:</span> {vehicle.condition_status}</p>
                  {vehicle.vin && <p><span className="text-gold">VIN:</span> {vehicle.vin}</p>}
                  {vehicle.mileage && <p><span className="text-gold">Mileage:</span> {vehicle.mileage.toLocaleString()} miles</p>}
                  <p><span className="text-gold">Required Deposit:</span> ${vehicle.deposit_amount}</p>
                </div>
                {vehicle.description && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gold mb-2">Description</h3>
                    <p className="text-gray-300">{vehicle.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <PurchaseAgreementForm
            vehicleId={vehicle.id}
            vehicleName={vehicle.name}
            purchasePrice={vehicle.purchase_price || 0}
            depositAmount={vehicle.deposit_amount}
            tradeInVehicles={tradeInVehicles}
            customerId={customerId || undefined}
          />
        </div>
      </div>
    </div>
  )
}
