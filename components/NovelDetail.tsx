"use client"
import { useState } from "react"
import { Novel } from "@/lib/types"

interface Props {
  novel: Novel
  isSub: boolean
  isAdmin: boolean
  onBack: () => void
  onReadChapter: (chapId: number) => void
}

export default function NovelDetail({ novel, isSub, isAdmin, onBack, onReadChapter }: Props) {
  const [zoomed, setZoomed] = useState(false)
  const isImg = novel.cover && (novel.cover.startsWith("data:") || novel.cover.startsWith("http"))

  return (
    <div>
      <button className="btn-outline mb-[18px] rounded-xl text-[13px]" onClick={onBack}>← Retour</button>

      {/* Grande cover */}
      <div
        onClick={() => isImg && setZoomed(true)}
        style={{
          width: "100%", aspectRatio: "16/9", borderRadius: 16, marginBottom: 20,
          border: "1px solid #e0d8cc", overflow: "hidden",
          background: isImg ? "#fff" : novel.cover,
          backgroundImage: isImg ? `url(${novel.cover})` : "none",
          backgroundSize: "cover", backgroundPosition: "center",
          cursor: isImg ? "zoom-in" : "default",
          boxShadow: "0 4px 20px rgba(0,0,0,.08)"
        }}
      />

      <h2 className="font-serif text-[26px] font-semibold tracking-[-1px] mb-[6px] text-[#1a1a1a]">{novel.title}</h2>
      <p className="text-[13px] text-beige-500 mb-3 leading-[1.6]">{novel.description}</p>
      <span className="pill pill-default mb-5 inline-block">{(novel.followers || 0).toLocaleString("fr-FR")} lecteurs</span>

      {(!novel.chapters || novel.chapters.length === 0) && (
        <div className="text-center text-beige-300 py-10 italic font-serif">Aucun chapitre publié pour l&apos;instant.</div>
      )}

      {novel.chapters?.map(ch => (
        <div key={ch.id} className="card" onClick={() => onReadChapter(ch.id)}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "#e0d8cc", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, flexShrink: 0, border: "1px solid #d8cfc4", color: "#1a1a1a" }}>
            {ch.num}
          </div>
          <div className="flex-1">
            <div className="font-serif font-medium text-[15px] leading-[1.3] text-[#1a1a1a]">
              {ch.title} {ch.free && <span className="pill pill-default text-[10px] align-middle ml-1">Gratuit</span>}
            </div>
            <div className="text-[11px] text-beige-400 mt-1">
              {new Date(ch.published_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
            </div>
          </div>
          {ch.vote_open && <span className="pill pill-red">Vote</span>}
          {ch.vote_closed && <span className="pill" style={{ background: "#fff", color: "#9a8878", border: "1px solid #e0d8cc" }}>Clos</span>}
        </div>
      ))}

      {zoomed && (
        <div onClick={() => setZoomed(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.9)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, cursor: "zoom-out" }}>
          <img src={novel.cover} alt="Couverture" style={{ maxWidth: "100%", maxHeight: "90vh", borderRadius: 12, boxShadow: "0 8px 40px rgba(0,0,0,.5)" }} />
          <button onClick={() => setZoomed(false)} style={{ position: "absolute", top: 20, right: 20, width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,.15)", color: "#fff", border: "none", fontSize: 18, cursor: "pointer" }}>✕</button>
        </div>
      )}
    </div>
  )
}
