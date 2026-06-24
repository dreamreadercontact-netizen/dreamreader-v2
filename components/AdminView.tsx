'use client'

import { useState } from 'react'
import { Novel } from '@/lib/types'

interface Props {
  novels: Novel[]
  setNovels: (fn: (prev: Novel[]) => Novel[]) => void
  showToast: (msg: string) => void
}

type AdminTab = 'dash' | 'publish' | 'chapters' | 'candidatures'

export default function AdminView({ novels, setNovels, showToast }: Props) {
  const [adminTab, setAdminTab] = useState<AdminTab>('dash')
  const [newChap, setNewChap] = useState({ novelId: '', title: '', content: '', free: false, opt1: '', opt2: '', opt3: '' })
  const [showNewNovel, setShowNewNovel] = useState(false)
  const [newNovel, setNewNovel] = useState({ title: '', genre: '', desc: '', status: 'live', cover: '' })
  const [loading, setLoading] = useState(false)

  async function publishChapter() {
    if (!newChap.title || !newChap.content) { showToast('Titre et contenu requis'); return }
    const novelId = parseInt(newChap.novelId) || novels[0]?.id
    if (!novelId) { showToast('Choisissez un roman'); return }
    setLoading(true)
    const opts = [newChap.opt1, newChap.opt2, newChap.opt3].filter(Boolean)
    const res = await fetch('/api/chapters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ novel_id: novelId, title: newChap.title, content: newChap.content, free: newChap.free, options: opts })
    })
    setLoading(false)
    if (res.ok) {
      const chapter = await res.json()
      setNovels(prev => prev.map(n => n.id === novelId ? { ...n, chapters: [...(n.chapters || []), chapter] } : n))
      setNewChap({ novelId: '', title: '', content: '', free: false, opt1: '', opt2: '', opt3: '' })
      showToast('✓ Chapitre publié !')
    } else { showToast('Erreur lors de la publication') }
  }

  async function createNovel() {
    if (!newNovel.title) { showToast('Titre requis'); return }
    setLoading(true)
    const res = await fetch('/api/novels', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newNovel.title, genre: newNovel.genre || 'Roman', description: newNovel.desc, cover: newNovel.cover || 'linear-gradient(135deg,#8b6f4e,#c8a96e)', status: newNovel.status })
    })
    setLoading(false)
    if (res.ok) {
      const novel = await res.json()
      setNovels(prev => [...prev, { ...novel, chapters: [] }])
      setNewNovel({ title: '', genre: '', desc: '', status: 'live', cover: '' })
      setShowNewNovel(false)
      showToast('✓ Roman créé !')
    }
  }

  const tabs: [AdminTab, string][] = [['dash', 'Tableau'], ['publish', 'Publier'], ['chapters', 'Chapitres'], ['candidatures', 'Candidatures']]

  return (
    <div>
      <h2 className="text-[24px] font-black tracking-[-1px] mb-4 text-[#1a1a1a]">Administration</h2>
      <div className="flex gap-[6px] mb-5 flex-wrap">
        {tabs.map(([id, label]) => (
          <button key={id} onClick={() => setAdminTab(id)}
            className={`px-4 py-2 rounded-[30px] border-[1.5px] text-[11px] font-bold uppercase tracking-[0.5px] transition-all cursor-pointer font-sans ${adminTab === id ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]' : 'bg-none text-beige-500 border-beige-300'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* TABLEAU */}
      {adminTab === 'dash' && (
        <div>
          <div className="text-[13px] text-beige-400 mb-4">{new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
          <div className="grid grid-cols-2 gap-[10px]">
            {[
              { val: novels.length, label: 'ROMANS' },
              { val: novels.reduce((s, n) => s + (n.chapters?.length || 0), 0), label: 'CHAPITRES' },
              { val: '—', label: 'REVENUS' },
              { val: novels.reduce((s, n) => s + (n.chapters?.reduce((sc, c) => sc + (c.comments?.length || 0), 0) || 0), 0), label: 'COMMENTAIRES' },
            ].map((s, i) => (
              <div key={i} className="bg-white border border-beige-200 rounded-xl p-4 shadow-sm">
                <div className="text-[32px] font-black tracking-[-2px] mb-1 text-[#1a1a1a]">{s.val}</div>
                <div className="text-[10px] font-bold text-beige-400 tracking-[1.5px]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PUBLIER */}
      {adminTab === 'publish' && (
        <div>
          <div className="flex justify-between items-center mb-[14px]">
            <div className="text-[15px] font-bold text-[#1a1a1a]">Nouveau chapitre</div>
            <button className="btn-outline text-[11px] rounded-lg" onClick={() => setShowNewNovel(s => !s)}>+ Nouveau roman</button>
          </div>

          {showNewNovel && (
            <div className="bg-white border border-beige-200 rounded-xl p-4 mb-[14px] shadow-sm">
              <div className="text-[14px] font-bold mb-3 text-[#1a1a1a]">Créer un roman</div>
              <div className="field"><label className="label">Titre</label><input className="input" value={newNovel.title} onChange={e => setNewNovel(p => ({ ...p, title: e.target.value }))} /></div>
              <div className="field"><label className="label">Genre</label><input className="input" placeholder="Ex: Romance · Thriller" value={newNovel.genre} onChange={e => setNewNovel(p => ({ ...p, genre: e.target.value }))} /></div>
              <div className="field"><label className="label">Description</label><textarea className="input" rows={3} value={newNovel.desc} onChange={e => setNewNovel(p => ({ ...p, desc: e.target.value }))} /></div>
              <div className="field"><label className="label">Statut</label>
                <select className="input" value={newNovel.status} onChange={e => setNewNovel(p => ({ ...p, status: e.target.value }))}>
                  <option value="live">En cours</option><option value="soon">Bientôt</option><option value="finished">Terminé</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button className="btn-primary flex-1 h-[40px] rounded-xl" onClick={createNovel} disabled={loading}>✓ Créer</button>
                <button className="btn-outline flex-1 h-[40px] rounded-xl" onClick={() => setShowNewNovel(false)}>Annuler</button>
              </div>
            </div>
          )}

          <div className="bg-white border border-beige-200 rounded-xl p-4 shadow-sm">
            <div className="field"><label className="label">Roman</label>
              <select className="input" value={newChap.novelId} onChange={e => setNewChap(p => ({ ...p, novelId: e.target.value }))}>
                <option value="">Choisir...</option>
                {novels.map(n => <option key={n.id} value={n.id}>{n.title}</option>)}
              </select>
            </div>
            <div className="field"><label className="label">Titre du chapitre</label><input className="input" value={newChap.title} onChange={e => setNewChap(p => ({ ...p, title: e.target.value }))} /></div>
            <div className="field"><label className="label">Contenu</label><textarea className="input" rows={8} placeholder="Écrivez votre chapitre..." value={newChap.content} onChange={e => setNewChap(p => ({ ...p, content: e.target.value }))} /></div>
            <div className="field flex items-center gap-[10px]">
              <input type="checkbox" checked={newChap.free} onChange={e => setNewChap(p => ({ ...p, free: e.target.checked }))} style={{ width: 'auto', height: 'auto' }} />
              <label style={{ textTransform: 'none', margin: 0, fontSize: 14, color: '#7a6a5a' }}>Chapitre gratuit</label>
            </div>
            <div className="text-[11px] font-bold text-beige-400 uppercase tracking-[0.8px] mb-[10px]">Options de vote (optionnel)</div>
            {(['opt1', 'opt2', 'opt3'] as const).map((k, i) => (
              <div key={k} className="field"><label className="label">Option {i + 1}</label>
                <input className="input" placeholder={`Option ${i + 1}...`} value={newChap[k]} onChange={e => setNewChap(p => ({ ...p, [k]: e.target.value }))} />
              </div>
            ))}
            <button className="btn-primary w-full h-[46px] text-[14px] rounded-xl" onClick={publishChapter} disabled={loading}>
              {loading ? 'Publication...' : 'Publier le chapitre'}
            </button>
          </div>
        </div>
      )}

      {/* CHAPITRES */}
      {adminTab === 'chapters' && (
        <div>
          {novels.map(n => (
            <div key={n.id} className="mb-6">
              <div className="text-[14px] font-bold text-[#1a1a1a] mb-[10px] truncate">{n.title}</div>
              {n.chapters?.map(ch => (
                <div key={ch.id} className="bg-white border border-beige-200 rounded-xl p-[14px] mb-2 shadow-sm">
                  <div className="flex items-center gap-[10px] mb-[10px]">
                    <div style={{ width: 28, height: 28, borderRadius: 6, background: '#e0d8cc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12, color: '#1a1a1a' }}>{ch.num}</div>
                    <div className="flex-1">
                      <div className="font-bold text-[13px] text-[#1a1a1a]">{ch.title}</div>
                      <div className="text-[11px] text-beige-400">{new Date(ch.published_at).toLocaleDateString('fr-FR')}</div>
                    </div>
                    {ch.free && <span className="pill pill-default">Gratuit</span>}
                  </div>
                </div>
              ))}
              {(!n.chapters || n.chapters.length === 0) && <div className="text-[13px] text-beige-300 italic py-2">Aucun chapitre.</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
