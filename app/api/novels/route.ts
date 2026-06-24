import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('novels')
    .select('*, chapters(id, num, title, free, published_at, vote_open, vote_closed, vote_options(id, text, votes), comments(id))')
    .order('created_at')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })

  const body = await request.json()
  
  const { data, error } = await supabase
    .from('novels')
    .insert({
      title: body.title,
      genre: body.genre,
      description: body.description,
      cover: body.cover || 'linear-gradient(135deg,#8b6f4e,#c8a96e)',
      status: body.status || 'live',
      author_id: user.id,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
