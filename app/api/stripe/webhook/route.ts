import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature || !process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Missing config' }, { status: 400 })
  }

  try {
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-04-10' as any })
    
    const event = stripe.webhooks.constructEvent(
      body, signature, process.env.STRIPE_WEBHOOK_SECRET || ''
    )

    const supabase = createClient()

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any
      const customerEmail = session.customer_email || session.customer_details?.email
      if (customerEmail) {
        await supabase.from('profiles').update({ subscribed: true })
          .eq('email', customerEmail.toLowerCase())
      }
    }

    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as any
      if (subscription.customer) {
        const stripe2 = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-04-10' as any })
        const customer = await stripe2.customers.retrieve(subscription.customer as string) as any
        if (customer?.email) {
          await supabase.from('profiles').update({ subscribed: false })
            .eq('email', customer.email.toLowerCase())
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: 'Webhook failed' }, { status: 400 })
  }
}
