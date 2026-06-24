import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })

  const body = await request.json()

  // Get max chapter number
  const { data: existing } = await supabase
    .from('chapters')
    .select('num')
    .eq('novel_id', body.novel_id)
    .order('num', { ascending: false })
    .limit(1)

  const nextNum = existing && existing.length > 0 ? existing[0].num + 1 : 1

  // Insert chapter
  const { data: chapter, error } = await supabase
    .from('chapters')
    .insert({
      novel_id: body.novel_id,
      num: nextNum,
      title: body.title,
      content: body.content,
      free: body.free || false,
      vote_open: body.options && body.options.length > 0,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Insert vote options
  if (body.options && body.options.length > 0) {
    await supabase.from('vote_options').insert(
      body.options.map((text: string) => ({ chapter_id: chapter.id, text, votes: 0 }))
    )
  }

  // Send email notifications to subscribers
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      
      // Get novel info
      const { data: novel } = await supabase.from('novels').select('title').eq('id', body.novel_id).single()
      
      // Get subscribers emails via admin client
      const { data: subscribers } = await supabase
        .from('profiles')
        .select('id')
        .eq('subscribed', true)

      if (subscribers && subscribers.length > 0 && novel) {
        await resend.emails.send({
          from: 'DreamReader <notifications@dreamreader.fr>',
          to: ['dreamreadercontact@gmail.com'], // TODO: get real emails
          subject: `✦ Nouveau chapitre : ${body.title}`,
          html: `
            <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:40px 20px;background:#f5f0e8">
              <h1 style="font-size:32px;color:#1a1a1a;letter-spacing:-1px;margin-bottom:8px">✦ DreamReader</h1>
              <p style="color:#9a8878;font-size:14px;margin-bottom:32px">Nouveau chapitre disponible</p>
              <div style="background:#fff;border-radius:14px;padding:28px;border:1px solid #e0d8cc">
                <div style="font-size:11px;color:#b0a090;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px">Chapitre ${nextNum}</div>
                <h2 style="font-size:24px;color:#1a1a1a;margin-bottom:8px">${body.title}</h2>
                <p style="color:#6a5a4a;font-size:14px;margin-bottom:24px">dans <strong>${novel.title}</strong></p>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="display:inline-block;background:#1a1a1a;color:#fff;padding:12px 28px;border-radius:30px;text-decoration:none;font-weight:700;font-size:14px">Lire maintenant →</a>
              </div>
              <p style="color:#c8b89a;font-size:12px;text-align:center;margin-top:24px">Vous recevez cet email car vous êtes abonné à DreamReader.</p>
            </div>
          `,
        })
      }
    } catch (e) {
      console.error('Email error:', e)
    }
  }

  return NextResponse.json(chapter)
}
