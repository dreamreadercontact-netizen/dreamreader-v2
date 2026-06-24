import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import HomeClient from '@/components/HomeClient'

export default async function HomePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth')
  }

  // Get profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get novels with chapters
  const { data: novels } = await supabase
    .from('novels')
    .select('*, chapters(id, num, title, free, published_at, vote_open, vote_closed)')
    .order('created_at')

  return <HomeClient user={profile} novels={novels || []} />
}
