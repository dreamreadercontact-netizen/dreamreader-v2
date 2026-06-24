import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createClient()
  const { name, email } = await request.json()

  if (!name || !email) return NextResponse.json({ error: 'Champs requis' }, { status: 400 })

  const { error } = await supabase.from('candidatures').insert({ name, email })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

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
