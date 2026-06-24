'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Novel, Profile } from '@/lib/types'
import LibraryView from './LibraryView'
import AdminView from './AdminView'
import ProfileView from './ProfileView'
import SubscribeView from './SubscribeView'
import NovelDetail from './NovelDetail'
import Reader from './Reader'

type Tab = 'home' | 'library' | 'books' | 'admin' | 'sub' | 'profile'

interface Props {
  user: Profile
  novels: Novel[]
}

export default function HomeClient({ user: initialUser, novels: initialNovels }: Props) {
  const router = useRouter()
  const supabase = createClient()

  const [tab, setTab] = useState<Tab>('home')
  const [novels, setNovels] = useState<Novel[]>(initialNovels)
  const [user] = useState<Profile>(initialUser)
  const [selNovel, setSelNovel] = useState<Novel | null>(null)
  const [selChapId, setSelChapId] = useState<number | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const isAdmin = user?.role === 'admin'
  const isSub = user?.subscribed || isAdmin
  const STRIPE = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK || ''

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 2400)
  }

  async function logout() {
    await supabase.auth.signOut()
    router.push('/auth')
    router.refresh()
  }

  function goTo(t: Tab) {
    setSelNovel(null)
    setSelChapId(null)
    setTab(t)
  }

  // Find selected chapter
  const selChap = selNovel?.chapters?.find(c => c.id === selChapId) || null

  // If reading a chapter
  if (selChap && selNovel) {
    return (
      <Reader
        novel={selNovel}
        chap={selChap}
        user={user}
        isSub={isSub}
        isAdmin={isAdmin}
        onBack={() => setSelChapId(null)}
        showToast={showToast}
        stripeUrl={STRIPE}
      />
    )
  }

  return (
    <div className="min-h-screen bg-beige-100">
      {/* TOP NAV */}
      <nav className="sticky top-0 z-40 bg-beige-100/95 border-b border-beige-200 h-14 flex items-center px-4 gap-[10px] backdrop-blur-xl">
        <div className="text-[17px] font-black mr-auto cursor-pointer tracking-[-0.5px] text-[#1a1a1a]" onClick={() => goTo('home')}>
          ✦ DreamReader
        </div>
        {isSub && !isAdmin && <span className="text-[11px] text-beige-600 font-bold">★ ABONNÉ</span>}
        {!isSub && (
          <a href={STRIPE} target="_blank" className="btn-primary text-[12px] h-[34px] px-4 rounded-full no-underline flex items-center">
            S&apos;abonner
          </a>
        )}
        <button className="btn-outline text-[12px] h-[34px] px-4 rounded-full" onClick={logout}>Quitter</button>
      </nav>

      {/* CONTENT */}
      <div className="max-w-[680px] mx-auto px-4 pt-5 pb-[100px]">

        {/* HOME */}
        {tab === 'home' && (
          <div>
            <div className="py-10">
              <div className="text-[10px] font-bold text-beige-400 tracking-[3px] uppercase mb-[14px]">La plateforme de romans interactifs</div>
              <h1 className="font-serif text-[44px] font-semibold tracking-[-2px] leading-[1.05] mb-[14px] text-[#1a1a1a]">
                L&apos;histoire<br/>que vous<br/>écrivez.
              </h1>
              <p className="text-[14px] text-beige-500 mb-6 max-w-[360px] leading-[1.7]">
                Lisez, votez, influencez. Chaque chapitre se termine par un choix qui façonne la suite.
              </p>
              <div className="flex gap-[10px] flex-wrap">
                <button className="btn-primary h-[46px] px-[26px] text-[14px] rounded-xl" onClick={() => setTab('library')}>
                  Découvrir les romans
                </button>
                {!isSub && (
                  <a href={STRIPE} target="_blank" className="btn-outline h-[46px] px-[26px] text-[14px] rounded-xl no-underline flex items-center">
                    S&apos;abonner · 5€/mois
                  </a>
                )}
              </div>
            </div>

            <div className="text-[10px] font-bold text-beige-400 tracking-[2px] uppercase mb-3">En cours</div>
            {novels.filter(n => n.status === 'live').map(n => (
              <div key={n.id} className="card" onClick={() => { setSelNovel(n); setTab('library') }}>
                <CoverDiv cover={n.cover} />
                <div className="flex-1">
                  <div className="font-serif text-[17px] font-semibold mb-1 leading-[1.3] text-[#1a1a1a]">{n.title}</div>
                  <div className="text-[11px] text-beige-400 mb-[6px] uppercase tracking-[1px]">{n.genre}</div>
                  <div className="text-[13px] text-beige-500 leading-[1.5]">{n.description}</div>
                  <div className="mt-[10px] flex gap-2">
                    <span className="pill pill-default">En cours</span>
                    {!isSub && !isAdmin && <span className="pill pill-red">Ch.1 gratuit</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* LIBRARY */}
        {tab === 'library' && !selNovel && (
          <LibraryView
            novels={novels}
            isAdmin={isAdmin}
            onSelect={setSelNovel}
            onDelete={async (id) => {
              if (!confirm('Supprimer ce roman ?')) return
              await fetch(`/api/novels/${id}`, { method: 'DELETE' })
              setNovels(prev => prev.filter(n => n.id !== id))
              showToast('Roman supprimé')
            }}
          />
        )}

        {/* NOVEL DETAIL */}
        {tab === 'library' && selNovel && (
          <NovelDetail
            novel={selNovel}
            isSub={isSub}
            isAdmin={isAdmin}
            onBack={() => setSelNovel(null)}
            onReadChapter={(chapId) => setSelChapId(chapId)}
          />
        )}

        {/* SUBSCRIPTION */}
        {tab === 'sub' && <SubscribeView stripeUrl={STRIPE} />}

        {/* PROFILE */}
        {tab === 'profile' && <ProfileView user={user} isSub={isSub} isAdmin={isAdmin} onLogout={logout} />}

        {/* ADMIN */}
        {isAdmin && tab === 'admin' && (
          <AdminView
            novels={novels}
            setNovels={setNovels}
            showToast={showToast}
          />
        )}
      </div>

      {/* BOTTOM NAV */}
      <nav className="bottom-nav">
        {[
          { id: 'home', icon: '⌂', label: 'Accueil' },
          { id: 'library', icon: '◻', label: 'Romans' },
          { id: 'books', icon: '◈', label: 'Livres' },
          ...(isAdmin ? [{ id: 'admin', icon: '⚙', label: 'Admin' }] : [{ id: 'sub', icon: '★', label: 'Abonnement' }]),
          { id: 'profile', icon: '◉', label: 'Profil' },
        ].map(item => (
          <button key={item.id} className={`bottom-nav-item ${tab === item.id ? 'active' : ''}`} onClick={() => goTo(item.id as Tab)}>
            <span className="text-[20px] leading-none">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}

function CoverDiv({ cover, w = 56, h = 76 }: { cover: string; w?: number; h?: number }) {
  const isImg = cover && (cover.startsWith('data:') || cover.startsWith('http'))
  return (
    <div
      style={{
        width: w, height: h, borderRadius: 8, flexShrink: 0,
        border: '1px solid #e0d8cc',
        background: isImg ? '#fff' : cover,
        backgroundImage: isImg ? `url(${cover})` : 'none',
        backgroundSize: 'cover', backgroundPosition: 'center top',
      }}
    />
  )
}
