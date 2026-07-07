"use client"

import { useState } from "react"
import { Novel } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"

interface Props {
  novels: Novel[]
  setNovels: (fn: (prev: Novel[]) => Novel[]) => void
  showToast: (msg: string) => void
}

export default function AdminView({ novels, setNovels, showToast }: Props) {
  const supabase = createClient()
  const [adminTab, setAdminTab] = useState<"dash"|"publish"|"chapters"|"candidatures"|"readers"|"ads"|"partners">("dash")
  const [readers, setReaders] = useState<any[]>([])
  const [readersLoaded, setReadersLoaded] = useState(false)
  const [candidatures, setCandidatures] = useState<any[]>([])
  const [candLoaded, setCandLoaded] = useState(false)
  const [openCand, setOpenCand] = useState<number | null>(null)
  const [adRequests, setAdRequests] = useState<any[]>([])
  const [adReqLoaded, setAdReqLoaded] = useState(false)
  const [ads, setAds] = useState<any[]>([])
  const [adsLoaded, setAdsLoaded] = useState(false)
  const [newAd, setNewAd] = useState({ title: "", image_url: "", link_url: "" })
  const [editingChap, setEditingChap] = useState<number | null>(null)
  const [editChapData, setEditChapData] = useState<{ title: string; content: string; free: boolean }>({ title: "", content: "", free: false })
  const [editLoading, setEditLoading] = useState(false)

  function startEditChap(ch: any) {
    setEditingChap(ch.id)
    // charge le contenu complet du chapitre (via RPC sécurisée admin)
    supabase.rpc("get_chapter_content", { p_chapter_id: ch.id }).then(({ data }) => {
      setEditChapData({ title: ch.title || "", content: (data as string) || "", free: ch.free || false })
    })
  }

  async function saveEditChap(chapId: number, novelId: number) {
    if (!editChapData.title.trim() || !editChapData.content.trim()) { showToast("Titre et contenu requis"); return }
    setEditLoading(true)
    const { error } = await supabase.from("chapters")
      .update({ title: editChapData.title, content: editChapData.content, free: editChapData.free })
      .eq("id", chapId)
    setEditLoading(false)
    if (error) { showToast("Erreur: " + error.message); return }
    // met à jour l'affichage local
    setNovels(prev => prev.map(n => n.id === novelId ? {
      ...n, chapters: n.chapters.map((c: any) => c.id === chapId ? { ...c, title: editChapData.title, free: editChapData.free } : c)
    } : n))
    setEditingChap(null)
    showToast("✓ Chapitre modifié")
  }

  async function deleteChap(chapId: number, novelId: number) {
    if (!confirm("Supprimer définitivement ce chapitre ?")) return
    const { error } = await supabase.from("chapters").delete().eq("id", chapId)
    if (error) { showToast("Erreur: " + error.message); return }
    setNovels(prev => prev.map(n => n.id === novelId ? { ...n, chapters: n.chapters.filter((c: any) => c.id !== chapId) } : n))
    showToast("Chapitre supprimé")
  }
  const [newChap, setNewChap] = useState({ novelId: "", title: "", content: "", free: false, opt1: "", opt2: "", opt3: "" })
  const [showNewNovel, setShowNewNovel] = useState(false)
  const [newNovel, setNewNovel] = useState({ title: "", genre: "", desc: "", status: "live" })
  const [loading, setLoading] = useState(false)

  // Restaurer le brouillon si disponible
  useState(() => {
    const draft = localStorage.getItem("dr_draft_chapter")
    if (draft) {
      try {
        const parsed = JSON.parse(draft)
        setNewChap(parsed)
        showToast("📝 Brouillon restauré")
      } catch(e) {}
    }
  })

  async function createNovel() {
    if (!newNovel.title) { showToast("Titre requis"); return }
    setLoading(true)
    const { data, error } = await supabase.from("novels").insert({
      title: newNovel.title,
      genre: newNovel.genre || "Roman",
      description: newNovel.desc,
      cover: "linear-gradient(135deg,#8b6f4e,#c8a96e)",
      status: newNovel.status
    }).select().single()
    setLoading(false)
    if (error) { showToast("Erreur: " + error.message); return }
    setNovels(prev => [...prev, { ...data, chapters: [] }])
    setNewNovel({ title: "", genre: "", desc: "", status: "live" })
    setShowNewNovel(false)
    showToast("✓ Roman créé !")
  }

  async function publishChapter() {
    if (!newChap.title || !newChap.content) { showToast("Titre et contenu requis"); return }
    const novelId = parseInt(newChap.novelId) || novels[0]?.id
    if (!novelId) { showToast("Créez d'abord un roman"); return }
    setLoading(true)

    // Sauvegarde brouillon automatique
    localStorage.setItem("dr_draft_chapter", JSON.stringify(newChap))

    const novel = novels.find(n => n.id === novelId)
    const maxNum = novel?.chapters?.length ? Math.max(...novel.chapters.map((c: any) => c.num)) : 0
    const opts = [newChap.opt1, newChap.opt2, newChap.opt3].filter(Boolean)

    console.log("Publication chapitre:", { novelId, title: newChap.title, contentLength: newChap.content.length })

    const { data: chapter, error } = await supabase.from("chapters").insert({
      novel_id: novelId,
      num: maxNum + 1,
      title: newChap.title,
      content: newChap.content,
      free: newChap.free,
      vote_open: opts.length > 0
    }).select("id, novel_id, num, title, free, published_at, vote_open, vote_closed, winner_option_id").single()

    if (error) {
      setLoading(false)
      console.error("Erreur publication:", error)
      showToast("❌ Erreur: " + error.message + " (brouillon sauvegardé)")
      return
    }

    if (opts.length > 0) {
      const { error: optError } = await supabase.from("vote_options").insert(
        opts.map(text => ({ chapter_id: chapter.id, text, votes: 0 }))
      )
      if (optError) console.error("Erreur options:", optError)
    }

    setNovels(prev => prev.map(n => n.id === novelId ? {
      ...n, chapters: [...(n.chapters || []), chapter]
    } : n))

    // Supprime le brouillon après succès
    localStorage.removeItem("dr_draft_chapter")
    setNewChap({ novelId: "", title: "", content: "", free: false, opt1: "", opt2: "", opt3: "" })
    setLoading(false)
    showToast("✓ Chapitre publié avec succès !")

    // Notifie les lecteurs par email (nécessite RESEND_API_KEY dans Vercel)
    try {
      const res = await fetch("/api/notify-chapter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapterTitle: chapter.title,
          novelTitle: novels.find(n => String(n.id) === String(novelId))?.title || "DreamReader"
        })
      })
      const j = await res.json().catch(() => null)
      if (res.ok && j?.sent > 0) showToast(`📧 ${j.sent} lecteur${j.sent > 1 ? "s" : ""} notifié${j.sent > 1 ? "s" : ""} par email`)
    } catch {}
  }

  const tabs: ["dash"|"publish"|"chapters"|"candidatures"|"readers"|"ads"|"partners", string][] = [["dash", "Tableau"], ["publish", "Publier"], ["chapters", "Chapitres"], ["readers", "Lecteurs"], ["candidatures", "Candidatures"], ["partners", "Demandes pub"], ["ads", "Publicités"]]

  async function loadReaders() {
    const { data, error } = await supabase.rpc("admin_list_profiles")
    if (!error && data) { setReaders(data); setReadersLoaded(true) }
  }

  async function loadCandidatures() {
    const res = await fetch("/api/candidatures")
    if (res.ok) { setCandidatures(await res.json()); setCandLoaded(true) }
  }

  async function loadAdRequests() {
    const res = await fetch("/api/ad-requests")
    if (res.ok) { setAdRequests(await res.json()); setAdReqLoaded(true) }
  }

  async function loadAds() {
    const { data, error } = await supabase.from("ads").select("*").order("created_at", { ascending: false })
    if (!error && data) { setAds(data); setAdsLoaded(true) }
  }

  async function createAd() {
    if (!newAd.title || !newAd.link_url) { showToast("Titre et lien requis"); return }
    const { data, error } = await supabase.from("ads").insert({
      title: newAd.title, image_url: newAd.image_url || null, link_url: newAd.link_url, active: true
    }).select().single()
    if (error) { showToast("Erreur: " + error.message); return }
    setAds(prev => [data, ...prev])
    setNewAd({ title: "", image_url: "", link_url: "" })
    showToast("✓ Publicité ajoutée")
  }

  async function toggleAd(id: number, active: boolean) {
    const { error } = await supabase.from("ads").update({ active: !active }).eq("id", id)
    if (error) { showToast("Erreur"); return }
    setAds(prev => prev.map(a => a.id === id ? { ...a, active: !active } : a))
  }

  async function deleteAd(id: number) {
    if (!confirm("Supprimer cette publicité ?")) return
    const { error } = await supabase.from("ads").delete().eq("id", id)
    if (error) { showToast("Erreur"); return }
    setAds(prev => prev.filter(a => a.id !== id))
    showToast("Publicité supprimée")
  }

  async function setCandStatus(id: number, status: string) {
    const { error } = await supabase.from("candidatures").update({ status }).eq("id", id)
    if (error) { showToast("Erreur"); return }
    setCandidatures(prev => prev.map(c => c.id === id ? { ...c, status } : c))
    showToast(status === "accepted" ? "✓ Candidature acceptée" : "Candidature refusée")
  }

  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 900, letterSpacing: -1, marginBottom: 16, color: "#1a1a1a" }}>Administration</h2>
      <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
        {tabs.map(([id, label]) => (
          <button key={id} onClick={() => { setAdminTab(id); if (id === "readers" && !readersLoaded) loadReaders(); if (id === "candidatures" && !candLoaded) loadCandidatures(); if (id === "partners" && !adReqLoaded) loadAdRequests(); if (id === "ads" && !adsLoaded) loadAds() }}
            style={{ padding: "8px 16px", borderRadius: 30, border: "1.5px solid", borderColor: adminTab === id ? "#1a1a1a" : "#d8cfc4", background: adminTab === id ? "#1a1a1a" : "none", color: adminTab === id ? "#fff" : "#9a8878", fontSize: 11, fontWeight: 700, cursor: "pointer", textTransform: "uppercase", letterSpacing: 0.5 }}>
            {label}
          </button>
        ))}
      </div>

      {adminTab === "dash" && (
        <div>
          <div style={{ fontSize: 13, color: "#b0a090", marginBottom: 16 }}>{new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { val: novels.length, label: "ROMANS" },
              { val: "—", label: "ABONNÉS" },
              { val: "—", label: "REVENUS" },
              { val: "—", label: "LIKES" },
            ].map((s, i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid #e0d8cc", borderRadius: 12, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,.05)" }}>
                <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: -2, color: "#1a1a1a" }}>{s.val}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#b0a090", letterSpacing: 1.5 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {adminTab === "publish" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a" }}>Nouveau chapitre</div>
            <button style={{ padding: "6px 14px", borderRadius: 8, border: "1.5px solid #d8cfc4", background: "none", fontSize: 11, fontWeight: 700, cursor: "pointer", color: "#9a8878" }}
              onClick={() => setShowNewNovel(s => !s)}>+ Roman</button>
          </div>

          {showNewNovel && (
            <div style={{ background: "#fff", border: "1px solid #e0d8cc", borderRadius: 14, padding: 16, marginBottom: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: "#1a1a1a" }}>Créer un roman</div>
              <div className="field"><label className="label">Titre *</label><input className="input" value={newNovel.title} onChange={e => setNewNovel(p => ({ ...p, title: e.target.value }))} /></div>
              <div className="field"><label className="label">Genre</label><input className="input" placeholder="Romance · Thriller" value={newNovel.genre} onChange={e => setNewNovel(p => ({ ...p, genre: e.target.value }))} /></div>
              <div className="field"><label className="label">Description</label><textarea className="input" rows={3} value={newNovel.desc} onChange={e => setNewNovel(p => ({ ...p, desc: e.target.value }))} /></div>
              <div className="field"><label className="label">Statut</label>
                <select className="input" value={newNovel.status} onChange={e => setNewNovel(p => ({ ...p, status: e.target.value }))}>
                  <option value="live">En cours</option><option value="soon">Bientôt</option><option value="finished">Terminé</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn-primary" style={{ flex: 1, height: 42, borderRadius: 12 }} onClick={createNovel} disabled={loading}>{loading ? "..." : "✓ Créer"}</button>
                <button className="btn-outline" style={{ flex: 1, height: 42, borderRadius: 12 }} onClick={() => setShowNewNovel(false)}>Annuler</button>
              </div>
            </div>
          )}

          <div style={{ background: "#fff", border: "1px solid #e0d8cc", borderRadius: 14, padding: 16 }}>
            <div className="field"><label className="label">Roman *</label>
              <select className="input" value={newChap.novelId} onChange={e => setNewChap(p => ({ ...p, novelId: e.target.value }))}>
                <option value="">Choisir...</option>
                {novels.map(n => <option key={n.id} value={n.id}>{n.title}</option>)}
              </select>
            </div>
            <div className="field"><label className="label">Titre du chapitre *</label><input className="input" value={newChap.title} onChange={e => setNewChap(p => ({ ...p, title: e.target.value }))} /></div>
            <div className="field"><label className="label">Contenu *</label><textarea className="input" rows={10} placeholder="Écrivez votre chapitre..." value={newChap.content} onChange={e => setNewChap(p => ({ ...p, content: e.target.value }))} /></div>
            <div className="field" style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input type="checkbox" checked={newChap.free} onChange={e => setNewChap(p => ({ ...p, free: e.target.checked }))} />
              <label style={{ fontSize: 14, color: "#7a6a5a" }}>Chapitre gratuit</label>
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#b0a090", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>Options de vote (optionnel)</div>
            {(["opt1", "opt2", "opt3"] as const).map((k, i) => (
              <div key={k} className="field"><label className="label">Option {i + 1}</label>
                <input className="input" placeholder={`Option ${i + 1}...`} value={newChap[k]} onChange={e => setNewChap(p => ({ ...p, [k]: e.target.value }))} />
              </div>
            ))}
            <button className="btn-primary" style={{ width: "100%", height: 46, borderRadius: 12, fontSize: 14 }} onClick={publishChapter} disabled={loading}>
              {loading ? "Publication..." : "Publier le chapitre"}
            </button>
          </div>
        </div>
      )}

      {adminTab === "chapters" && (
        <div>
          <div style={{ background: "#faf5ec", border: "1px solid #e8dcc8", borderRadius: 12, padding: 14, marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#1a1a1a", marginBottom: 4 }}>✦ Roman en vitrine</div>
            <div style={{ fontSize: 12, color: "#9a8878", lineHeight: 1.6, marginBottom: 12 }}>
              Le roman dont les abonnés votent la suite. Les visiteurs non-abonnés le voient en avant-première (image + vote flouté) pour leur donner envie de rejoindre.
            </div>
            {novels.map(n => (
              <label key={n.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", cursor: "pointer" }}>
                <input type="checkbox" checked={!!n.showcase} onChange={async (e) => {
                  const on = e.target.checked
                  // un seul roman en vitrine à la fois
                  if (on) { await supabase.from("novels").update({ showcase: false }).neq("id", n.id) }
                  const { error } = await supabase.from("novels").update({ showcase: on }).eq("id", n.id)
                  if (!error) setNovels(prev => prev.map(x => ({ ...x, showcase: x.id === n.id ? on : false })))
                }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>{n.title}</span>
                {n.showcase && <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 800, color: "#fff", background: "linear-gradient(135deg,#8b6f4e,#c8a96e)", padding: "3px 10px", borderRadius: 20 }}>EN VITRINE</span>}
              </label>
            ))}
          </div>
          {novels.map(n => (
            <div key={n.id} style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", marginBottom: 10 }}>{n.title}</div>
              {n.chapters?.map((ch: any) => (
                <div key={ch.id} style={{ background: "#fff", border: "1px solid #e0d8cc", borderRadius: 12, padding: 14, marginBottom: 8 }}>
                  {editingChap === ch.id ? (
                    <div>
                      <input value={editChapData.title} onChange={e => setEditChapData({ ...editChapData, title: e.target.value })} placeholder="Titre du chapitre" style={{ width: "100%", border: "1.5px solid #d8cfc4", borderRadius: 10, padding: "10px 12px", fontSize: 14, fontWeight: 700, marginBottom: 8, boxSizing: "border-box" }} />
                      <textarea value={editChapData.content} onChange={e => setEditChapData({ ...editChapData, content: e.target.value })} placeholder="Contenu du chapitre" rows={10} style={{ width: "100%", border: "1.5px solid #d8cfc4", borderRadius: 10, padding: "10px 12px", fontSize: 13, lineHeight: 1.6, fontFamily: "Lora,Georgia,serif", marginBottom: 8, boxSizing: "border-box", resize: "vertical" }} />
                      <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#5a4a3a", marginBottom: 12, cursor: "pointer" }}>
                        <input type="checkbox" checked={editChapData.free} onChange={e => setEditChapData({ ...editChapData, free: e.target.checked })} />
                        Chapitre gratuit (accessible sans abonnement)
                      </label>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => saveEditChap(ch.id, n.id)} disabled={editLoading} style={{ flex: 1, height: 38, borderRadius: 10, border: "none", background: "#1a1a1a", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>{editLoading ? "..." : "✓ Enregistrer"}</button>
                        <button onClick={() => setEditingChap(null)} style={{ padding: "0 16px", height: 38, borderRadius: 10, border: "1.5px solid #d8cfc4", background: "none", color: "#9a8878", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Annuler</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 6, background: "#e0d8cc", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12, color: "#1a1a1a", flexShrink: 0 }}>{ch.num}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 13, color: "#1a1a1a" }}>{ch.title}</div>
                        <div style={{ fontSize: 11, color: "#b0a090" }}>{new Date(ch.published_at).toLocaleDateString("fr-FR")}</div>
                      </div>
                      {ch.free && <span className="pill pill-default">Gratuit</span>}
                      <button onClick={() => startEditChap(ch)} style={{ padding: "6px 12px", borderRadius: 8, border: "1.5px solid #d8cfc4", background: "none", color: "#8b6f4e", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Modifier</button>
                      <button onClick={() => deleteChap(ch.id, n.id)} style={{ background: "none", border: "none", color: "#c8b89a", cursor: "pointer", fontSize: 16 }}>✕</button>
                    </div>
                  )}
                </div>
              ))}
              {(!n.chapters || n.chapters.length === 0) && <div style={{ fontSize: 13, color: "#c8b89a", fontStyle: "italic" }}>Aucun chapitre.</div>}
            </div>
          ))}
        </div>
      )}

      {adminTab === "readers" && (
        <div>
          <div style={{ fontSize: 13, color: "#b0a090", marginBottom: 16 }}>{readers.length} compte{readers.length > 1 ? "s" : ""} créé{readers.length > 1 ? "s" : ""}</div>
          {readers.map((r: any) => (
            <div key={r.id} style={{ background: "#fff", border: "1px solid #e0d8cc", borderRadius: 12, padding: 14, marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: "#e0d8cc", color: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, flexShrink: 0 }}>
                {r.avatar || r.name?.[0]?.toUpperCase() || "?"}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#1a1a1a" }}>{r.name}</div>
                <div style={{ fontSize: 11, color: "#b0a090" }}>{r.created_at ? new Date(r.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }) : ""}</div>
              </div>
              {r.role === "admin" ? (
                <span style={{ padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: "#1a1a1a", color: "#fff" }}>Admin</span>
              ) : r.subscribed ? (
                <span style={{ padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: "#dcfce7", color: "#16a34a", border: "1px solid #bbf7d0" }}>★ Abonné</span>
              ) : (
                <span style={{ padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: "#f3f0eb", color: "#9a8878", border: "1px solid #e0d8cc" }}>Non abonné</span>
              )}
            </div>
          ))}
          {readers.length === 0 && readersLoaded && (
            <div style={{ background: "#fff", border: "1px solid #e0d8cc", borderRadius: 14, padding: 20, textAlign: "center", color: "#c8b89a", fontFamily: "Lora,Georgia,serif", fontStyle: "italic" }}>
              Aucun compte créé pour l'instant.
            </div>
          )}
        </div>
      )}

      {adminTab === "candidatures" && (
        <div>
          <div style={{ fontSize: 13, color: "#b0a090", marginBottom: 16 }}>Candidatures d&apos;auteurs reçues</div>
          {candidatures.map((c) => (
            <div key={c.id} style={{ background: "#fff", border: "1px solid #e0d8cc", borderRadius: 14, padding: 18, marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#1a1a1a" }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: "#9a8878", marginTop: 2 }}>{c.email}</div>
                  <div style={{ fontSize: 11, color: "#c8b89a", marginTop: 4 }}>{c.created_at ? new Date(c.created_at).toLocaleDateString("fr-FR") : ""}</div>
                </div>
                <span style={{ padding: "4px 10px", borderRadius: 20, fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                  background: c.status === "accepted" ? "#dcfce7" : c.status === "refused" ? "#fee2e2" : "#f3f0eb",
                  color: c.status === "accepted" ? "#16a34a" : c.status === "refused" ? "#dc2626" : "#9a8878" }}>
                  {c.status === "accepted" ? "Acceptée" : c.status === "refused" ? "Refusée" : "En attente"}
                </span>
              </div>
              {c.pitch && <div style={{ fontSize: 13, color: "#5a4a3a", marginTop: 10, fontStyle: "italic" }}>{c.pitch}</div>}
              {(c.writing_sample || c.sample_url) && (
                <div style={{ marginTop: 10 }}>
                  <button onClick={() => setOpenCand(openCand === c.id ? null : c.id)} style={{ fontSize: 12, fontWeight: 700, color: "#8b6f4e", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                    {openCand === c.id ? "▼ Masquer l'extrait" : "▶ Voir l'écriture"}
                  </button>
                  {openCand === c.id && (
                    <div style={{ marginTop: 8 }}>
                      {c.sample_url && <div style={{ fontSize: 13, marginBottom: 8 }}>🔗 <a href={c.sample_url} target="_blank" rel="noopener" style={{ color: "#8b6f4e" }}>{c.sample_url}</a></div>}
                      {c.writing_sample && <div style={{ background: "#f5f0e8", borderRadius: 8, padding: 14, fontSize: 13, lineHeight: 1.7, color: "#5a4a3a", fontFamily: "Lora,Georgia,serif", whiteSpace: "pre-wrap", maxHeight: 300, overflow: "auto" }}>{c.writing_sample}</div>}
                    </div>
                  )}
                </div>
              )}
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button onClick={() => setCandStatus(c.id, "accepted")} style={{ flex: 1, height: 36, borderRadius: 10, border: "none", background: "#1a1a1a", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>✓ Accepter</button>
                <button onClick={() => setCandStatus(c.id, "refused")} style={{ flex: 1, height: 36, borderRadius: 10, border: "1.5px solid #d8cfc4", background: "none", color: "#9a8878", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Refuser</button>
              </div>
            </div>
          ))}
          {candidatures.length === 0 && candLoaded && (
            <div style={{ background: "#fff", border: "1px solid #e0d8cc", borderRadius: 14, padding: 20, textAlign: "center", color: "#c8b89a", fontFamily: "Lora,Georgia,serif", fontStyle: "italic" }}>
              Aucune candidature pour l&apos;instant.
            </div>
          )}
        </div>
      )}

      {adminTab === "partners" && (
        <div>
          <div style={{ fontSize: 13, color: "#b0a090", marginBottom: 16 }}>Demandes de partenariat publicitaire reçues</div>
          {adRequests.map((r) => (
            <div key={r.id} style={{ background: "#fff", border: "1px solid #e0d8cc", borderRadius: 14, padding: 18, marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#1a1a1a" }}>{r.company}</div>
                  <div style={{ fontSize: 12, color: "#9a8878", marginTop: 2 }}>{r.contact_email}</div>
                  {r.website && <div style={{ fontSize: 12, marginTop: 2 }}>🔗 <a href={r.website} target="_blank" rel="noopener" style={{ color: "#8b6f4e" }}>{r.website}</a></div>}
                  {r.budget && <div style={{ fontSize: 12, color: "#9a8878", marginTop: 2 }}>Budget : {r.budget}</div>}
                </div>
                <div style={{ fontSize: 11, color: "#c8b89a" }}>{r.created_at ? new Date(r.created_at).toLocaleDateString("fr-FR") : ""}</div>
              </div>
              {r.message && <div style={{ fontSize: 13, color: "#5a4a3a", marginTop: 10, background: "#f5f0e8", borderRadius: 8, padding: 12 }}>{r.message}</div>}
              <div style={{ fontSize: 12, color: "#9a8878", marginTop: 10 }}>Pour répondre : <a href={`mailto:${r.contact_email}`} style={{ color: "#8b6f4e", fontWeight: 700 }}>Envoyer un email</a></div>
            </div>
          ))}
          {adRequests.length === 0 && adReqLoaded && (
            <div style={{ background: "#fff", border: "1px solid #e0d8cc", borderRadius: 14, padding: 20, textAlign: "center", color: "#c8b89a", fontFamily: "Lora,Georgia,serif", fontStyle: "italic" }}>
              Aucune demande pour l&apos;instant.
            </div>
          )}
        </div>
      )}

      {adminTab === "ads" && (
        <div>
          <div style={{ fontSize: 13, color: "#b0a090", marginBottom: 16 }}>Publicités affichées aux lecteurs non-abonnés</div>
          <div style={{ background: "#fff", border: "1px solid #e0d8cc", borderRadius: 14, padding: 18, marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#1a1a1a", marginBottom: 12 }}>Ajouter une publicité</div>
            <input value={newAd.title} onChange={e => setNewAd({ ...newAd, title: e.target.value })} placeholder="Titre / nom de l'annonceur" style={{ width: "100%", border: "1.5px solid #d8cfc4", borderRadius: 10, padding: "10px 12px", fontSize: 13, marginBottom: 8, boxSizing: "border-box" }} />
            <input value={newAd.image_url} onChange={e => setNewAd({ ...newAd, image_url: e.target.value })} placeholder="URL de l'image (optionnel)" style={{ width: "100%", border: "1.5px solid #d8cfc4", borderRadius: 10, padding: "10px 12px", fontSize: 13, marginBottom: 8, boxSizing: "border-box" }} />
            <input value={newAd.link_url} onChange={e => setNewAd({ ...newAd, link_url: e.target.value })} placeholder="Lien de destination (https://...)" style={{ width: "100%", border: "1.5px solid #d8cfc4", borderRadius: 10, padding: "10px 12px", fontSize: 13, marginBottom: 10, boxSizing: "border-box" }} />
            <button onClick={createAd} style={{ width: "100%", height: 40, borderRadius: 10, border: "none", background: "#1a1a1a", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>+ Ajouter</button>
          </div>
          {ads.map((a) => (
            <div key={a.id} style={{ background: "#fff", border: "1px solid #e0d8cc", borderRadius: 14, padding: 14, marginBottom: 10, display: "flex", alignItems: "center", gap: 12 }}>
              {a.image_url && <div style={{ width: 48, height: 48, borderRadius: 8, background: `#f5f0e8 url(${a.image_url}) center/cover`, flexShrink: 0, border: "1px solid #e0d8cc" }} />}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>{a.title}</div>
                <div style={{ fontSize: 11, color: "#9a8878", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.link_url}</div>
              </div>
              <button onClick={() => toggleAd(a.id, a.active)} style={{ padding: "4px 10px", borderRadius: 20, fontSize: 10, fontWeight: 700, border: "none", cursor: "pointer", background: a.active ? "#dcfce7" : "#f3f0eb", color: a.active ? "#16a34a" : "#9a8878" }}>{a.active ? "Active" : "Inactive"}</button>
              <button onClick={() => deleteAd(a.id)} style={{ background: "none", border: "none", color: "#c8b89a", cursor: "pointer", fontSize: 16 }}>✕</button>
            </div>
          ))}
          {ads.length === 0 && adsLoaded && (
            <div style={{ background: "#fff", border: "1px solid #e0d8cc", borderRadius: 14, padding: 20, textAlign: "center", color: "#c8b89a", fontFamily: "Lora,Georgia,serif", fontStyle: "italic" }}>
              Aucune publicité active.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
