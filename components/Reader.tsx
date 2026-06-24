'use client'

import { useState, useEffect } from 'react'
import { Chapter, Novel, Profile } from '@/lib/types'

interface Props {
  novel: Novel
  chap: Chapter
  user: Profile
  isSub: boolean
  isAdmin: boolean
  onBack: () => void
  showToast: (msg: string) => void
  stripeUrl: string
}

function useScrollProgress() {
  const [p, setP] = useState(0)
  useEffect(() => {
    const fn = () => {
      const el = document.documentElement
      const tot = el.scrollHeight - el.clientHeight
      setP(tot > 0 ? Math.min(100, Math.round(window.scrollY / tot * 100)) : 0)
    }
    window.addEventListener('scroll', fn, { passive: true })
    fn()
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return p
}

export default function Reader({ novel, chap, user, isSub, isAdmin, onBack, showToast, stripeUrl }: Props) {
  const prog = useScrollProgress()
  const canRead = chap.free || isSub || isAdmin
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState(chap.comments || [])
  const [options, setOptions] = useState(chap.vote_options || [])
  const [userVoted, setUserVoted] = useState<number | null>(null)
  const total = options.reduce((s, o) => s + o.votes, 0)

  async function handleVote(optionId: number) {
    const res = await fetch('/api/votes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chapter_id: chap.id, option_id: optionId })
    })
    if (res.ok) {
      setUserVoted(optionId)
      setOptions(prev => prev.map(o => o.id === optionId ? { ...o, votes: o.votes + 1 } : o))
      showToast('✦ Vote enregistré')
    }
  }

  async function handleComment() {
    if (!comment.trim()) return
    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chapter_id: chap.id, text: comment })
    })
    if (res.ok) {
      const newComment = await res.json()
      setComments(prev => [{ ...newComment, profile: { name: user.name, avatar: user.avatar } }, ...prev])
      setComment('')
      showToast('Commentaire publié')
    }
  }

  const winOpt = chap.vote_closed ? options.find(o => o.id === chap.winner_option_id) : null

  return (
    <div className="min-h-screen" style={{ background: '#faf7f2', paddingBottom: 80 }}>
      {/* Progress */}
      <div className="progress-bar"><div className="progress-fill" style={{ width: prog + '%' }} /></div>

      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-beige-200 px-4 py-[10px] flex items-center gap-3 backdrop-blur-xl" style={{ background: 'rgba(250,247,242,.96)' }}>
        <button className="back-btn" onClick={onBack} style={{ background: 'none', border: '1px solid #d8cfc4', borderRadius: 8, color: '#9a8878', fontSize: 12, fontWeight: 700, padding: '6px 12px', cursor: 'pointer' }}>← Retour</button>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-bold text-beige-400 tracking-[1.5px] uppercase truncate">{novel.title}</div>
          <div className="text-[13px] font-semibold text-beige-600 truncate mt-[1px]">{chap.title}</div>
        </div>
        <span className="text-[10px] text-beige-300 font-bold">{prog}%</span>
      </div>

      {/* Body */}
      <div className="max-w-[640px] mx-auto px-5 py-[44px]">
        <div className="text-[10px] font-bold text-beige-400 tracking-[3px] uppercase mb-[18px] flex items-center gap-[10px]">
          Chapitre {chap.num}
          <div className="flex-1 h-[1px] bg-beige-200" />
        </div>
        <h1 className="font-serif text-[clamp(26px,5vw,38px)] font-semibold text-[#1a1a1a] leading-[1.2] mb-[10px]">{chap.title}</h1>
        <div className="text-[11px] text-beige-400 tracking-[0.5px] uppercase mb-[44px] flex gap-[14px]">
          <span>{new Date(chap.published_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>

        {!canRead ? (
          <div className="bg-white border border-beige-200 rounded-[16px] p-[40px] text-center mt-5 shadow-sm">
            <div className="text-[11px] text-beige-400 uppercase tracking-[2px] mb-4">Réservé aux abonnés</div>
            <h2 className="font-serif text-[clamp(26px,5vw,34px)] font-semibold text-[#1a1a1a] leading-[1.2] mb-[10px]">Continuez l&apos;aventure.</h2>
            <p className="text-beige-400 text-[14px] font-serif leading-[1.8] mb-8">Lisez, votez, influencez chaque chapitre.</p>
            <div className="text-[48px] font-black tracking-[-3px] mb-1 text-[#1a1a1a]">5€</div>
            <div className="text-beige-400 text-[13px] mb-6">/mois · sans engagement</div>
            <a href={stripeUrl} target="_blank" className="flex items-center justify-center w-full h-[50px] bg-[#1a1a1a] text-white rounded-xl font-black no-underline text-[14px]">
              S&apos;abonner maintenant →
            </a>
          </div>
        ) : (
          <>
            <div className="reader-text">
              {chap.content.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
            </div>

            <div className="flex items-center justify-center gap-[10px] my-[44px] text-beige-300 text-[14px] tracking-[8px]">
              <div className="flex-1 h-[1px] bg-beige-200" />✦ ✦ ✦<div className="flex-1 h-[1px] bg-beige-200" />
            </div>

            {/* VOTE */}
            {options.length > 0 && (
              <div className="mt-[50px] rounded-[14px] overflow-hidden border border-beige-200 shadow-sm">
                <div className="px-[22px] pt-[28px] pb-[20px] bg-white border-b border-beige-200 text-center">
                  <div className="text-[10px] font-bold text-beige-400 tracking-[2.5px] uppercase mb-[10px]">
                    {chap.vote_closed ? 'Vote clôturé' : 'À vous de choisir'}
                  </div>
                  <div className="font-serif text-[clamp(18px,3vw,24px)] font-semibold text-[#1a1a1a] leading-[1.3]">Que se passe-t-il ensuite ?</div>
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-[20px] bg-black/[0.04] border border-black/[0.08] text-[10px] font-bold text-beige-400 mt-3">
                    ✦ {total.toLocaleString('fr-FR')} votes
                  </div>
                </div>
                <div className="p-4" style={{ background: '#faf7f2' }}>
                  {options.map(o => {
                    const pct = total ? Math.round(o.votes / total * 100) : 0
                    const isWin = chap.vote_closed && o.id === chap.winner_option_id
                    const isSel = userVoted === o.id
                    const show = userVoted !== null || chap.vote_closed
                    return (
                      <div key={o.id}
                        onClick={() => !chap.vote_closed && !userVoted && isSub && handleVote(o.id)}
                        style={{
                          border: `1.5px solid ${isWin ? '#1a1a1a' : isSel ? '#8b6f4e' : '#e0d8cc'}`,
                          borderRadius: 10, padding: '14px 16px', marginBottom: 8,
                          cursor: (!chap.vote_closed && !userVoted && isSub) ? 'pointer' : 'default',
                          background: isWin ? '#1a1a1a' : isSel ? '#fdfaf5' : '#fff',
                          transition: '.15s'
                        }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14, fontWeight: 600, color: isWin ? '#fff' : '#1a1a1a' }}>
                          <span>{isWin ? '★ ' : ''}{o.text}</span>
                          {show && <span style={{ fontSize: 13, fontWeight: 800, color: isWin ? '#fff' : isSel ? '#8b6f4e' : '#b0a090' }}>{pct}%</span>}
                        </div>
                        {show && <div style={{ height: 2, background: isWin ? 'rgba(255,255,255,.2)' : '#e0d8cc', borderRadius: 2, marginTop: 8, overflow: 'hidden' }}>
                          <div style={{ height: '100%', background: isWin ? '#fff' : '#8b6f4e', width: pct + '%', borderRadius: 2 }} />
                        </div>}
                      </div>
                    )
                  })}
                  {userVoted && !chap.vote_closed && <div className="text-center py-[14px] text-[11px] font-bold text-beige-400 uppercase tracking-[1px]">✓ Vote enregistré</div>}
                  {!isSub && !chap.vote_closed && (
                    <div className="flex items-center justify-center gap-[10px] p-[18px]">
                      <span className="spinner text-[18px]">⌛</span>
                      <span className="text-[13px] text-beige-400"><a href={stripeUrl} target="_blank" className="text-beige-600 font-bold no-underline">S&apos;abonner</a> pour voter</span>
                    </div>
                  )}
                </div>
                {chap.vote_closed && winOpt && (
                  <div className="text-center py-[14px] px-[18px] bg-[#1a1a1a] text-[11px] font-bold text-white tracking-[2px] uppercase">
                    ★ L&apos;histoire continue : {winOpt.text}
                  </div>
                )}
              </div>
            )}

            {/* COMMENTS */}
            <div className="mt-[50px] pt-9 border-t border-beige-200">
              <div className="text-[11px] font-bold text-beige-400 tracking-[2px] uppercase mb-6">Commentaires ({comments.length})</div>

              {isSub || isAdmin ? (
                <div className="flex gap-3 mb-6 items-start">
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: '#e0d8cc', color: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>
                    {user.avatar}
                  </div>
                  <div className="flex-1">
                    <textarea className="input font-serif text-[14px] leading-[1.7] mb-2" rows={2} placeholder="Votre réaction..." value={comment} onChange={e => setComment(e.target.value)} />
                    <button className="btn-outline text-[12px] h-[34px] px-4 rounded-[20px]" onClick={handleComment}>Publier</button>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-white border border-beige-200 rounded-xl mb-5 text-center">
                  <span className="spinner text-[40px] block mb-3">⌛</span>
                  <div className="text-[14px] text-beige-400 mb-2">Réservé aux abonnés</div>
                  <a href={stripeUrl} target="_blank" className="inline-block bg-[#1a1a1a] text-white font-bold no-underline py-[10px] px-6 rounded-[30px] text-[13px]">S&apos;abonner pour commenter</a>
                </div>
              )}

              {comments.map((c: any) => (
                <div key={c.id} className="flex gap-3 py-4 border-b border-beige-100">
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: '#e0d8cc', color: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>
                    {c.profile?.avatar || '?'}
                  </div>
                  <div className="flex-1">
                    <div className="text-[12px] font-bold text-[#1a1a1a] mb-1">{c.profile?.name || 'Lecteur'}</div>
                    <div className="font-serif text-[14px] leading-[1.7] text-beige-600">{c.text}</div>
                    <div className="text-[11px] text-beige-300 mt-2">{new Date(c.created_at).toLocaleDateString('fr-FR')}</div>
                  </div>
                </div>
              ))}
              {comments.length === 0 && <div className="text-[14px] text-beige-300 italic font-serif py-4">Soyez le premier à commenter.</div>}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
