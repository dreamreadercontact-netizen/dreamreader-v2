import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('subscribed, role').eq('id', user.id).single()
  if (!profile?.subscribed && profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Abonnement requis' }, { status: 403 })
  }

  const { chapter_id, option_id } = await request.json()

  // Check if already voted
  const { data: existing } = await supabase
    .from('user_votes')
    .select('id')
    .eq('user_id', user.id)
    .eq('chapter_id', chapter_id)
    .single()

  if (existing) return NextResponse.json({ error: 'Déjà voté' }, { status: 409 })

  // Record vote
  await supabase.from('user_votes').insert({
    user_id: user.id,
    chapter_id,
    option_id,
  })

  // Increment vote count
  const { data: option } = await supabase
    .from('vote_options')
    .select('votes')
    .eq('id', option_id)
    .single()

  await supabase
    .from('vote_options')
    .update({ votes: (option?.votes || 0) + 1 })
    .eq('id', option_id)

  return NextResponse.json({ success: true })
}
