import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import HomeClient from '@/components/HomeClient'

export default async function HomePage() {
  const supabase = createClient()
  
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  const { data: novels } = await supabase
    .from('novels')
    .select('*, chapters(id, num, title, free, published_at, vote_open, vote_closed)')
    .order('created_at')

  return <HomeClient user={profile || { id: session.user.id, name: session.user.email?.split('@')[0] || 'User', role: 'reader', subscribed: false, avatar: '?' }} novels={novels || []} />
}
