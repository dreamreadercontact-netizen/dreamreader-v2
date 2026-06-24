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

  const { chapter_id, text } = await request.json()

  if (!text?.trim()) return NextResponse.json({ error: 'Commentaire vide' }, { status: 400 })

  const { data, error } = await supabase
    .from('comments')
    .insert({ chapter_id, user_id: user.id, text: text.trim() })
    .select('*, profile:profiles(name, avatar)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await request.json()

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  
  // Only admin or comment owner can delete
  const query = profile?.role === 'admin'
    ? supabase.from('comments').delete().eq('id', id)
    : supabase.from('comments').delete().eq('id', id).eq('user_id', user.id)

  const { error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
