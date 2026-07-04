'use client'
import { useEffect, useState } from 'react'
import { Profile } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'

export function ProfileView({ user, isSub, isAdmin, onLogout }: { user: Profile; isSub: boolean; isAdmin: boolean; onLogout: () => void }) {
  const supabase = createClient()
  const [notif, setNotif] = useState<boolean | null>(null)

  useEffect(() => {
    if (!user?.id) return
    supabase.from('profiles').select('notify_new_chapter').eq('id', user.id).single()
      .then(({ data }) => setNotif(data?.notify_new_chapter ?? true))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  async function toggleNotif() {
    if (notif === null) return
    const next = !notif
    setNotif(next)
    const { error } = await supabase.from('profiles').update({ notify_new_chapter: next }).eq('id', user.id)
    if (error) setNotif(!next)
  }

  return (
    <div>
      <div className="bg-white border border-beige-200 rounded-[14px] p-5 shadow-sm">
        <div style={{ width: 48, height: 48, borderRadius: 10, background: '#e0d8cc', color: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, marginBottom: 12 }}>
          {user?.avatar || '?'}
        </div>
        <div className="font-serif text-[22px] font-semibold mb-1 text-[#1a1a1a]">{user?.name}</div>
        <div className="text-[13px] text-beige-400 mb-3">{user?.role === 'admin' ? 'Auteur' : 'Lecteur'}</div>
        {isSub && !isAdmin && (
          <div className="inline-block px-3 py-1 rounded-[20px] bg-[#1a1a1a] text-white text-[12px] font-bold mb-3">★ ABONNÉ</div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '14px 0', borderTop: '1px solid #ede8e0', marginTop: 6, marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>📖 Nouveaux chapitres</div>
            <div style={{ fontSize: 11, color: '#9a8878', marginTop: 2 }}>Recevoir un email à chaque parution</div>
          </div>
          <button
            onClick={toggleNotif}
            aria-label="Activer ou désactiver les notifications"
            style={{ width: 46, height: 26, borderRadius: 20, border: 'none', cursor: 'pointer', position: 'relative', background: notif ? '#1a1a1a' : '#d8cfc4', transition: 'background .2s', flexShrink: 0 }}
          >
            <span style={{ position: 'absolute', top: 3, left: notif ? 23 : 3, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left .2s' }} />
          </button>
        </div>
        <button className="btn-outline rounded-xl text-[13px]" onClick={onLogout}>Se déconnecter</button>
      </div>
    </div>
  )
}

export function SubscribeView({ stripeUrl }: { stripeUrl: string }) {
  return (
    <div className="max-w-[400px] mx-auto py-[44px]">
      <div className="text-[10px] text-beige-400 tracking-[2px] uppercase mb-[14px]">Abonnement</div>
      <h2 className="font-serif text-[40px] font-semibold tracking-[-2px] mb-2 leading-none text-[#1a1a1a]">Rejoignez<br />l&apos;aventure.</h2>
      <p className="text-beige-500 mb-8 text-[14px] leading-[1.7]">Lisez, votez, influencez chaque chapitre.</p>
      <div className="bg-white border border-beige-200 rounded-[14px] p-[26px] mb-3 shadow-sm">
        <div className="text-[48px] font-black tracking-[-3px] leading-none mb-1 text-[#1a1a1a]">5€</div>
        <div className="text-beige-400 mb-[22px] text-[13px]">/mois · sans engagement</div>
        {['Accès illimité à tous les chapitres', 'Votes pour influencer l\'histoire', 'Commentaires et likes'].map((f, i) => (
          <div key={i} className="flex gap-[10px] mb-[10px] text-[14px] text-beige-500 items-center">
            <span className="text-[#1a1a1a] font-bold">—</span>{f}
          </div>
        ))}
        <a href={stripeUrl} target="_blank" className="flex items-center justify-center w-full h-[50px] bg-[#1a1a1a] text-white rounded-xl font-black no-underline text-[14px] mt-5">
          S&apos;abonner maintenant →
        </a>
      </div>
      <div className="text-[12px] text-beige-300 text-center">CB · Apple Pay · Stripe sécurisé</div>
    </div>
  )
}

export default ProfileView
