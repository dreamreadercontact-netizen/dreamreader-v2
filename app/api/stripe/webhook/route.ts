import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-04-10',
})

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.CheckoutSession
      const customerEmail = session.customer_email || session.customer_details?.email

      if (customerEmail) {
        // Find user by email and mark as subscribed
        const { data: users } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', customerEmail.toLowerCase())

        // Update via service role (server-side)
        if (users && users.length > 0) {
          await supabase
            .from('profiles')
            .update({ subscribed: true })
            .eq('id', users[0].id)
        }
      }
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      // Mark user as unsubscribed
      const { data: customer } = await stripe.customers.retrieve(
        subscription.customer as string
      ) as any

      if (customer?.email) {
        await supabase
          .from('profiles')
          .update({ subscribed: false })
          .eq('email', customer.email.toLowerCase())
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
