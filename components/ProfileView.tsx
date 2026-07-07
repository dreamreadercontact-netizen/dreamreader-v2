'use client'
import { useEffect, useState } from 'react'
import { Profile } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'

export function ProfileView({ user, isSub, isAdmin, onLogout }: { user: Profile; isSub: boolean; isAdmin: boolean; onLogout: () => void }) {
  const supabase = createClient()
  const [notif, setNotif] = useState<boolean | null>(null)
  const [ref, setRef] = useState<any>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!user?.id) return
    // Source fiable : on lit tout directement depuis le profil
    supabase.from('profiles')
      .select('notify_new_chapter, referral_code, ambassador_level, validated_referrals, free_months_earned')
      .eq('id', user.id).single()
      .then(({ data }) => {
        if (data) {
          setNotif(data.notify_new_chapter ?? true)
          if (data.referral_code) {
            setRef({
              code: data.referral_code,
              level: data.ambassador_level ?? 0,
              validated: data.validated_referrals ?? 0,
              subscribed: 0,
              free_months: data.free_months_earned ?? 0,
            })
          }
        }
      })
    // Complément (nombre de filleuls en cours) — si ça échoue, la carte reste affichée
    supabase.rpc('my_referral_stats').then(({ data }) => { if (data && data.code) setRef(data) }).catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  const refLink = ref?.code ? `https://dreamreader.fr/r/${ref.code}` : ''

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(refLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  async function shareLink() {
    if (navigator.share) {
      try { await navigator.share({ title: 'DreamReader', text: 'Rejoins-moi sur DreamReader — des romans où tu votes pour la suite ! 5 jours gratuits :', url: refLink }) } catch {}
    } else {
      copyLink()
    }
  }

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
        {ref && ref.level >= 1 && (
          <div style={{ display: 'inline-block', marginLeft: isSub && !isAdmin ? 8 : 0, padding: '4px 12px', borderRadius: 20, background: 'linear-gradient(135deg,#8b6f4e,#c8a96e)', color: '#fff', fontSize: 12, fontWeight: 800, marginBottom: 12 }}>
            {ref.level >= 2 ? '✦✦ AMBASSADEUR D\'OR' : '✦ AMBASSADEUR'}
          </div>
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
        {ref && ref.code && !isAdmin && (
          <div style={{ borderTop: '1px solid #ede8e0', paddingTop: 16, marginBottom: 12 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#1a1a1a', marginBottom: 4 }}>✦ Parrainez des lecteurs</div>
            <div style={{ fontSize: 12, color: '#9a8878', lineHeight: 1.6, marginBottom: 14 }}>
              Partagez votre lien. Chaque filleul reçoit <strong>5 jours d&apos;essai</strong>. Dès qu&apos;il s&apos;abonne, vous gagnez du galon : badge Ambassadeur, vote qui compte double, et un mois offert.
            </div>

            {/* Le lien */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <div style={{ flex: 1, background: '#f5f0e8', border: '1.5px solid #e0d8cc', borderRadius: 10, padding: '11px 14px', fontSize: 13, fontFamily: 'monospace', color: '#5a4a3a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                dreamreader.fr/r/{ref.code}
              </div>
              <button onClick={copyLink} style={{ padding: '0 16px', borderRadius: 10, border: 'none', background: '#1a1a1a', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>
                {copied ? '✓' : 'Copier'}
              </button>
            </div>
            <button onClick={shareLink} style={{ width: '100%', height: 44, borderRadius: 10, border: '1.5px solid #c8b89a', background: '#fff', color: '#1a1a1a', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginBottom: 16 }}>
              📤 Partager mon lien
            </button>

            {/* Progression */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
              <div style={{ flex: 1, background: '#faf5ec', borderRadius: 10, padding: '12px 8px', textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#8b6f4e' }}>{ref.validated}</div>
                <div style={{ fontSize: 10, color: '#9a8878', fontWeight: 700 }}>Validés</div>
              </div>
              <div style={{ flex: 1, background: '#faf5ec', borderRadius: 10, padding: '12px 8px', textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#8b6f4e' }}>{ref.subscribed}</div>
                <div style={{ fontSize: 10, color: '#9a8878', fontWeight: 700 }}>En cours</div>
              </div>
              <div style={{ flex: 1, background: '#faf5ec', borderRadius: 10, padding: '12px 8px', textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#8b6f4e' }}>{ref.free_months}</div>
                <div style={{ fontSize: 10, color: '#9a8878', fontWeight: 700 }}>Mois offerts</div>
              </div>
            </div>
            {ref.level < 2 && (
              <div style={{ fontSize: 11, color: '#b0a090', textAlign: 'center', marginTop: 8 }}>
                {ref.level === 0
                  ? `Encore ${1 - ref.validated <= 0 ? 1 : 1} filleul abonné pour devenir Ambassadeur ✦`
                  : `Plus que ${5 - ref.validated} filleuls pour devenir Ambassadeur d'Or ✦✦`}
              </div>
            )}
          </div>
        )}
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
