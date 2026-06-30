"use client"
import { useState, useRef } from "react"
import { Novel } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"

interface Props {
  novels: Novel[]
  isAdmin: boolean
  onSelect: (novel: Novel) => void
  onDelete: (id: number) => void
}

function CoverDiv({ cover, isAdmin, onUpload, uploading }: { cover: string; isAdmin: boolean; onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void; uploading: boolean }) {
  const isImg = cover && (cover.startsWith("data:") || cover.startsWith("http"))
  const fileRef = useRef<HTMLInputElement>(null)
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <div style={{
        width: 56, height: 76, borderRadius: 8,
        border: "1px solid #e0d8cc",
        background: isImg ? "#fff" : cover,
        backgroundImage: isImg ? `url(${cover})` : "none",
        backgroundSize: "cover", backgroundPosition: "center top",
      }} />
      {isAdmin && (
        <>
          <input ref={fileRef} type="file" accept="image/*" onChange={onUpload} style={{ display: "none" }} />
          <button
            onClick={e => { e.stopPropagation(); fileRef.current?.click() }}
            disabled={uploading}
            style={{
              position: "absolute", bottom: -6, right: -6, width: 22, height: 22, borderRadius: "50%",
              background: "#1a1a1a", color: "#fff", border: "2px solid #fff", fontSize: 13, fontWeight: 700,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1,
              boxShadow: "0 1px 4px rgba(0,0,0,.2)"
            }}>
            {uploading ? "…" : "+"}
          </button>
        </>
      )}
    </div>
  )
}

export default function LibraryView({ novels, isAdmin, onSelect, onDelete }: Props) {
  const supabase = createClient()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: "", genre: "", desc: "", status: "live" })
  const [localNovels, setLocalNovels] = useState<Novel[]>(novels)
  const [loading, setLoading] = useState(false)
  const [uploadingId, setUploadingId] = useState<number | null>(null)

  async function createNovel() {
    if (!form.title) return
    setLoading(true)
    const { data, error } = await supabase.from("novels").insert({
      title: form.title,
      genre: form.genre || "Roman",
      description: form.desc,
      cover: "linear-gradient(135deg,#8b6f4e,#c8a96e)",
      status: form.status
    }).select().single()
    setLoading(false)
    if (!error && data) {
      setLocalNovels(prev => [...prev, { ...data, chapters: [] }])
      setForm({ title: "", genre: "", desc: "", status: "live" })
      setShowForm(false)
    }
  }

  async function handleCoverUpload(novelId: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { alert("Image trop lourde (max 5MB)"); return }
    setUploadingId(novelId)

    const reader = new FileReader()
    reader.onload = async () => {
      const dataUrl = reader.result as string
      const { error } = await supabase.from("novels").update({ cover: dataUrl }).eq("id", novelId)
      if (!error) {
        setLocalNovels(prev => prev.map(n => n.id === novelId ? { ...n, cover: dataUrl } : n))
      }
      setUploadingId(null)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <h2 className="font-serif" style={{ fontSize: 26, fontWeight: 600, letterSpacing: -1, color: "#1a1a1a" }}>Bibliothèque</h2>
        {isAdmin && (
          <button onClick={() => setShowForm(!showForm)}
            style={{ width: 36, height: 36, borderRadius: "50%", background: "#1a1a1a", color: "#fff", border: "none", fontSize: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            +
          </button>
        )}
      </div>

      {showForm && isAdmin && (
        <div style={{ background: "#fff", border: "1px solid #e0d8cc", borderRadius: 14, padding: 18, marginBottom: 14, boxShadow: "0 1px 4px rgba(0,0,0,.05)" }}>
          <div className="field"><label className="label">Titre</label><input className="input" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} /></div>
          <div className="field"><label className="label">Genre</label><input className="input" placeholder="Ex: Romance · Thriller" value={form.genre} onChange={e => setForm(p => ({ ...p, genre: e.target.value }))} /></div>
          <div className="field"><label className="label">Description</label><textarea className="input" rows={3} value={form.desc} onChange={e => setForm(p => ({ ...p, desc: e.target.value }))} /></div>
          <div className="field"><label className="label">Statut</label>
            <select className="input" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
              <option value="live">En cours</option>
              <option value="soon">Bientôt</option>
              <option value="finished">Terminé</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn-primary" style={{ flex: 1, height: 42, borderRadius: 12 }} onClick={createNovel} disabled={loading}>
              {loading ? "..." : "✓ Créer"}
            </button>
            <button className="btn-outline" style={{ flex: 1, height: 42, borderRadius: 12 }} onClick={() => setShowForm(false)}>Annuler</button>
          </div>
        </div>
      )}

      {localNovels.map(n => (
        <div key={n.id} className="relative" style={{ position: "relative" }}>
          <div className="card" style={{ paddingRight: isAdmin ? "80px" : "18px" }} onClick={() => onSelect(n)}>
            <CoverDiv
              cover={n.cover}
              isAdmin={isAdmin}
              uploading={uploadingId === n.id}
              onUpload={e => handleCoverUpload(n.id, e)}
            />
            <div>
              <div className="font-serif" style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.3, color: "#1a1a1a" }}>{n.title}</div>
              <div style={{ fontSize: 11, color: "#9a8878", marginTop: 4, textTransform: "uppercase", letterSpacing: 1 }}>{n.genre}</div>
              <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
                {n.status === "live" && <span className="pill pill-default">En cours</span>}
                {n.status === "soon" && <span className="pill" style={{ background: "#fff", color: "#9a8878", border: "1px solid #e0d8cc" }}>Bientôt</span>}
                {n.status === "finished" && <span className="pill" style={{ background: "#fff", color: "#7a6a5a", border: "1px solid #e0d8cc" }}>Terminé</span>}
              </div>
            </div>
          </div>
          {isAdmin && (
            <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 6 }}>
              <button onClick={e => { e.stopPropagation(); onDelete(n.id) }}
                style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid rgba(180,60,60,.2)", background: "#fff", cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center" }}>🗑️</button>
            </div>
          )}
        </div>
      ))}

      {localNovels.length === 0 && (
        <div style={{ textAlign: "center", color: "#c8b89a", padding: "40px 0", fontFamily: "Lora,Georgia,serif", fontStyle: "italic" }}>
          Aucun roman pour l'instant.{isAdmin ? " Clique sur + pour en créer un." : ""}
        </div>
      )}
    </div>
  )
}
