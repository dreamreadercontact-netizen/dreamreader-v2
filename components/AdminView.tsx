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
  const [adminTab, setAdminTab] = useState<"dash"|"publish"|"chapters"|"candidatures"|"readers">("dash")
  const [readers, setReaders] = useState<any[]>([])
  const [readersLoaded, setReadersLoaded] = useState(false)
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
  }

  const tabs: ["dash"|"publish"|"chapters"|"candidatures"|"readers", string][] = [["dash", "Tableau"], ["publish", "Publier"], ["chapters", "Chapitres"], ["readers", "Lecteurs"], ["candidatures", "Candidatures"]]

  async function loadReaders() {
    const { data, error } = await supabase.rpc("admin_list_profiles")
    if (!error && data) { setReaders(data); setReadersLoaded(true) }
  }

  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 900, letterSpacing: -1, marginBottom: 16, color: "#1a1a1a" }}>Administration</h2>
      <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
        {tabs.map(([id, label]) => (
          <button key={id} onClick={() => { setAdminTab(id); if (id === "readers" && !readersLoaded) loadReaders() }}
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
          {novels.map(n => (
            <div key={n.id} style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", marginBottom: 10 }}>{n.title}</div>
              {n.chapters?.map((ch: any) => (
                <div key={ch.id} style={{ background: "#fff", border: "1px solid #e0d8cc", borderRadius: 12, padding: 14, marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 6, background: "#e0d8cc", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12, color: "#1a1a1a" }}>{ch.num}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: "#1a1a1a" }}>{ch.title}</div>
                      <div style={{ fontSize: 11, color: "#b0a090" }}>{new Date(ch.published_at).toLocaleDateString("fr-FR")}</div>
                    </div>
                    {ch.free && <span className="pill pill-default" style={{ marginLeft: "auto" }}>Gratuit</span>}
                  </div>
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
          <div style={{ fontSize: 13, color: "#b0a090", marginBottom: 16 }}>Candidatures d'auteurs reçues</div>
          <div style={{ background: "#fff", border: "1px solid #e0d8cc", borderRadius: 14, padding: 20, textAlign: "center", color: "#c8b89a", fontFamily: "Lora,Georgia,serif", fontStyle: "italic" }}>
            Aucune candidature pour l'instant.
          </div>
        </div>
      )}
    </div>
  )
}
