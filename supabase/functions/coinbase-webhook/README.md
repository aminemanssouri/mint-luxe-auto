# Coinbase Commerce Webhook for Supabase

This Edge function handles Coinbase Commerce webhook events for cryptocurrency payments in your luxury car rental/sales application.

## Setup Instructions

### 1. Deploy to Supabase

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy the function
supabase functions deploy coinbase-webhook
```

### 2. Environment Variables

Add these to your Supabase project settings:

```bash
# In Supabase Dashboard > Settings > Edge Functions
COINBASE_WEBHOOK_SECRET=your_coinbase_webhook_secret_here
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Coinbase Commerce Configuration

1. Go to [Coinbase Commerce Dashboard](https://commerce.coinbase.com/dashboard/settings)
2. Navigate to **Webhooks** section
3. Add webhook endpoint: `https://YOUR_PROJECT_REF.supabase.co/functions/v1/coinbase-webhook`
4. Select events to subscribe to:
   - `charge:confirmed`
   - `charge:failed` 
   - `charge:pending`
   - `charge:delayed`
   - `charge:resolved`
5. Copy the webhook secret and add to environment variables

### 4. Database Requirements

Ensure these tables exist in your Supabase database:

- `vehicle_reservations`
- `rental_agreements` 
- `vehicles`
- `payments`

## Webhook Events Handled

### `charge:confirmed`
- Updates reservation status to 'confirmed'
- Converts vehicle reservations to rental agreements
- Updates vehicle inventory status
- Creates payment record

### `charge:failed`
- Updates reservation status to 'payment_failed'
- Releases vehicle from reserved status
- Creates failed payment record

### `charge:pending`
- Updates reservation status to 'payment_pending'
- Maintains vehicle reservation

### `charge:delayed`
- Updates status to 'payment_delayed'
- Common for Bitcoin transactions

### `charge:resolved`
- Handles delayed payments that complete
- Same processing as confirmed charges

## Integration with Your App

The webhook expects metadata in Coinbase charges:

```javascript
// When creating Coinbase charge
{
  metadata: {
    vehicleId: "vehicle-uuid",
    mode: "rental", // or "purchase"
    vehicleName: "Lamborghini Huracan",
    customerId: "customer-uuid",
    reservationId: "reservation-uuid"
  }
}
```

## Testing

Test webhook locally:

```bash
# Start local development
supabase functions serve coinbase-webhook

# Test with curl
curl -X POST http://localhost:54321/functions/v1/coinbase-webhook \
  -H "Content-Type: application/json" \
  -H "x-cc-webhook-signature: test-signature" \
  -d '{"type": "charge:confirmed", "data": {...}}'
```

## Security Features

- Webhook signature verification
- CORS headers configured
- Service role key for database access
- Proper error handling and logging

## Monitoring

Monitor webhook activity in:
- Supabase Dashboard > Edge Functions > Logs
- Coinbase Commerce Dashboard > Webhooks > Delivery attempts
