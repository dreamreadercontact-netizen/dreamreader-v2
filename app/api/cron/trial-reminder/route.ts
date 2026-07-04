import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://dreamreader-v2.vercel.app'

function reminderHtml(name: string) {
  return `
  <div style="background:#f5f0e8;padding:32px 16px;font-family:Georgia,serif">
    <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:14px;padding:36px 32px;border:1px solid #e0d8cc">
      <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#9a8878;margin-bottom:14px">✦ DreamReader</div>
      <h1 style="font-size:26px;color:#1a1a1a;margin:0 0 6px;letter-spacing:-1px">Votre essai se termine demain</h1>
      <p style="font-size:15px;color:#5a4a3a;line-height:1.7;margin:0 0 22px">
        ${name ? `Bonjour ${name}, ` : ''}votre accès gratuit à DreamReader arrive à sa fin.
        Pour continuer à lire, voter et influencer la suite de l'histoire, rejoignez les lecteurs abonnés.
      </p>
      <div style="background:#1a1a1a;border-radius:12px;padding:18px 20px;margin-bottom:26px;color:#fff">
        <div style="font-size:24px;font-weight:bold">5€<span style="font-size:13px;font-weight:normal;color:rgba(255,255,255,.6)">/mois · sans engagement</span></div>
      </div>
      <a href="${SITE}" style="display:inline-block;background:#1a1a1a;color:#fff;text-decoration:none;padding:14px 28px;border-radius:12px;font-weight:bold;font-size:14px">Continuer l'aventure →</a>
      <p style="font-size:11px;color:#b0a090;margin-top:30px;line-height:1.6">
        Vous recevez cet email car vous avez un compte DreamReader.
      </p>
    </div>
  </div>`
}

export async function GET(request: Request) {
  const auth = request.headers.get('authorization')
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const apiKey = process.env.RESEND_API_KEY
  if (!url || !serviceKey || !apiKey) {
    return NextResponse.json({ error: 'Variables manquantes (SUPABASE_SERVICE_ROLE_KEY / RESEND_API_KEY)', sent: 0 }, { status: 501 })
  }

  const sb = createClient(url, serviceKey)
  const from3d = new Date(Date.now() - 3 * 86400000).toISOString()
  const to2d = new Date(Date.now() - 2 * 86400000).toISOString()

  const { data: rows, error } = await sb
    .from('profiles')
    .select('email, name')
    .eq('subscribed', false)
    .neq('role', 'admin')
    .not('email', 'is', null)
    .gte('created_at', from3d)
    .lt('created_at', to2d)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!rows || rows.length === 0) return NextResponse.json({ sent: 0 })

  const from = process.env.EMAIL_FROM || 'DreamReader <onboarding@resend.dev>'
  const emails = rows.map((r) => ({
    from,
    to: [r.email as string],
    subject: '⏳ Votre essai gratuit DreamReader se termine demain',
    html: reminderHtml((r.name as string) || ''),
  }))

  let sent = 0
  for (let i = 0; i < emails.length; i += 100) {
    const batch = emails.slice(i, i + 100)
    const res = await fetch('https://api.resend.com/emails/batch', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(batch),
    })
    if (res.ok) sent += batch.length
  }

  return NextResponse.json({ sent })
}
