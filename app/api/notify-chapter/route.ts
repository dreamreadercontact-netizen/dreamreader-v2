import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://dreamreader-v2.vercel.app'

function emailHtml(chapterTitle: string, novelTitle: string, name: string) {
  return `
  <div style="background:#f5f0e8;padding:32px 16px;font-family:Georgia,serif">
    <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:14px;padding:36px 32px;border:1px solid #e0d8cc">
      <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#9a8878;margin-bottom:14px">✦ DreamReader</div>
      <h1 style="font-size:26px;color:#1a1a1a;margin:0 0 6px;letter-spacing:-1px">Nouveau chapitre disponible</h1>
      <p style="font-size:15px;color:#5a4a3a;line-height:1.7;margin:0 0 22px">
        ${name ? `Bonjour ${name}, ` : ''}la suite de <strong>${novelTitle}</strong> vient de paraître :
      </p>
      <div style="background:#f5f0e8;border-radius:12px;padding:18px 20px;margin-bottom:26px">
        <div style="font-size:18px;font-weight:bold;color:#1a1a1a">${chapterTitle}</div>
      </div>
      <a href="${SITE}" style="display:inline-block;background:#1a1a1a;color:#fff;text-decoration:none;padding:14px 28px;border-radius:12px;font-weight:bold;font-size:14px">Lire maintenant →</a>
      <p style="font-size:11px;color:#b0a090;margin-top:30px;line-height:1.6">
        Vous recevez cet email car vous avez un compte DreamReader.<br/>
        Pour ne plus recevoir ces notifications, désactivez-les dans votre profil sur ${SITE}.
      </p>
    </div>
  </div>`
}

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })

  const { chapterTitle, novelTitle } = await request.json()
  if (!chapterTitle) return NextResponse.json({ error: 'Titre requis' }, { status: 400 })

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'RESEND_API_KEY manquante dans Vercel', sent: 0 }, { status: 501 })
  }

  const { data: recipients, error } = await supabase.rpc('admin_list_notify_emails')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!recipients || recipients.length === 0) return NextResponse.json({ sent: 0 })

  const from = process.env.EMAIL_FROM || 'DreamReader <onboarding@resend.dev>'
  const emails = recipients.map((r: { email: string; name: string }) => ({
    from,
    to: [r.email],
    subject: `📖 Nouveau chapitre : ${chapterTitle}`,
    html: emailHtml(chapterTitle, novelTitle || 'DreamReader', r.name || ''),
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
