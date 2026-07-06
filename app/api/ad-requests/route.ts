import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://dreamreader.fr'

export async function POST(request: Request) {
  const supabase = createClient()
  const { company, contactEmail, website, message, budget } = await request.json()

  if (!company || !contactEmail) {
    return NextResponse.json({ error: 'Entreprise et email requis' }, { status: 400 })
  }

  const { error } = await supabase.from('ad_requests').insert({
    company, contact_email: contactEmail,
    website: website || null, message: message || null, budget: budget || null,
    status: 'pending',
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const apiKey = process.env.RESEND_API_KEY
  if (apiKey) {
    const adminEmail = process.env.ADMIN_EMAIL || 'dreamreadercontact@gmail.com'
    const from = process.env.EMAIL_FROM || 'DreamReader <onboarding@resend.dev>'
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from, to: [adminEmail],
        subject: `📣 Demande de partenariat pub : ${company}`,
        html: `<div style="font-family:Georgia,serif;color:#1a1a1a">
          <h2>Nouvelle demande de publicité</h2>
          <p><strong>Entreprise :</strong> ${company}</p>
          <p><strong>Email :</strong> ${contactEmail}</p>
          ${website ? `<p><strong>Site :</strong> <a href="${website}">${website}</a></p>` : ''}
          ${budget ? `<p><strong>Budget indiqué :</strong> ${budget}</p>` : ''}
          ${message ? `<p><strong>Message :</strong><br/>${message}</p>` : ''}
          <p style="margin-top:20px"><a href="${SITE}">Voir dans l'admin →</a></p>
        </div>`,
      }),
    }).catch(() => {})
  }

  return NextResponse.json({ success: true })
}

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  const { data } = await supabase.from('ad_requests').select('*').order('created_at', { ascending: false })
  return NextResponse.json(data || [])
}
