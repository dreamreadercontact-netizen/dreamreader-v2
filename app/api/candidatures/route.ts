import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://dreamreader.fr'

export async function POST(request: Request) {
  const supabase = createClient()
  const { name, email, pitch, writingSample, sampleUrl } = await request.json()

  if (!name || !email) return NextResponse.json({ error: 'Nom et email requis' }, { status: 400 })
  if (!writingSample && !sampleUrl) {
    return NextResponse.json({ error: 'Un exemple de texte ou un lien est requis' }, { status: 400 })
  }

  const { error } = await supabase.from('candidatures').insert({
    name, email,
    pitch: pitch || null,
    writing_sample: writingSample || null,
    sample_url: sampleUrl || null,
    status: 'pending',
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Notifie l'admin par email (si Resend configuré)
  const apiKey = process.env.RESEND_API_KEY
  if (apiKey) {
    const adminEmail = process.env.ADMIN_EMAIL || 'dreamreadercontact@gmail.com'
    const from = process.env.EMAIL_FROM || 'DreamReader <onboarding@resend.dev>'
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from, to: [adminEmail],
        subject: `✦ Nouvelle candidature auteur : ${name}`,
        html: `<div style="font-family:Georgia,serif;color:#1a1a1a">
          <h2>Nouvelle candidature auteur</h2>
          <p><strong>Nom :</strong> ${name}</p>
          <p><strong>Email :</strong> ${email}</p>
          ${pitch ? `<p><strong>Présentation :</strong><br/>${pitch}</p>` : ''}
          ${sampleUrl ? `<p><strong>Lien vers son œuvre :</strong> <a href="${sampleUrl}">${sampleUrl}</a></p>` : ''}
          ${writingSample ? `<p><strong>Extrait fourni :</strong></p><div style="background:#f5f0e8;padding:16px;border-radius:8px;white-space:pre-wrap">${writingSample.slice(0, 3000)}</div>` : ''}
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

  const { data } = await supabase.from('candidatures').select('*').order('created_at', { ascending: false })
  return NextResponse.json(data || [])
}
