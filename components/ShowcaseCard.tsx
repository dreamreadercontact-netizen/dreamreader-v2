"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export default function ShowcaseCard({ stripeUrl }: { stripeUrl: string }) {
  const supabase = createClient()
  const [data, setData] = useState<any>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    supabase.rpc("get_showcase").then(({ data }) => { setData(data); setLoaded(true) })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!loaded || !data?.novel) return null

  const novel = data.novel
  const chapter = data.chapter
  const options = data.options || []
  const isImg = novel.cover && (novel.cover.startsWith("data:") || novel.cover.startsWith("http"))

  return (
    <div style={{ maxWidth: 440, margin: "0 auto 32px", padding: "0 4px" }}>
      <style>{`
        @keyframes dr-pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 8px 28px rgba(139,111,78,.25); }
          50% { transform: scale(1.04); box-shadow: 0 14px 42px rgba(139,111,78,.5); }
        }
        @keyframes dr-glow {
          0%, 100% { opacity: .4; }
          50% { opacity: .9; }
        }
        @keyframes dr-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>

      {/* Bandeau "en direct" */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 14 }}>
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#c0392b", animation: "dr-glow 1.4s ease-in-out infinite" }} />
        <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", color: "#c0392b" }}>Vote en cours · en direct</span>
      </div>

      <div style={{ background: "#fff", border: "1px solid #e0d8cc", borderRadius: 20, padding: 24, boxShadow: "0 8px 32px rgba(0,0,0,.06)", position: "relative", overflow: "hidden" }}>
        {/* Halo lumineux animé derrière la cover */}
        <div style={{ position: "absolute", top: -40, left: "50%", transform: "translateX(-50%)", width: 260, height: 260, background: "radial-gradient(circle, rgba(200,169,110,.35), transparent 70%)", animation: "dr-glow 3s ease-in-out infinite", pointerEvents: "none" }} />

        <div style={{ display: "flex", gap: 18, alignItems: "flex-start", position: "relative" }}>
          {/* Cover qui pulse fort */}
          <div style={{
            width: 110, height: 154, borderRadius: 12, flexShrink: 0,
            border: "2px solid #c8a96e",
            background: isImg ? `#fff url(${novel.cover}) center/cover` : (novel.cover || "linear-gradient(135deg,#8b6f4e,#c8a96e)"),
            animation: "dr-pulse 1.8s ease-in-out infinite",
          }} />

          <div style={{ flex: 1, minWidth: 0 }}>
            {novel.genre && <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: "#9a8878", fontWeight: 700, marginBottom: 4 }}>{novel.genre}</div>}
            <div style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a", lineHeight: 1.15, marginBottom: 6, fontFamily: "Georgia,serif" }}>{novel.title}</div>
            {novel.teaser
              ? <div style={{ fontSize: 12, color: "#5a4a3a", lineHeight: 1.5, fontStyle: "italic" }}>{novel.teaser}</div>
              : <div style={{ fontSize: 12, color: "#9a8878", lineHeight: 1.5 }}>Les lecteurs décident de la suite en ce moment...</div>}
          </div>
        </div>

        {/* Zone de vote FLOUTÉE + cadenas */}
        {chapter && options.length > 0 && (
          <div style={{ marginTop: 20, position: "relative" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9a8878", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10, textAlign: "center" }}>
              Quelle suite pour {chapter.title} ?
            </div>
            <div style={{ filter: "blur(6px)", pointerEvents: "none", userSelect: "none", opacity: .85 }}>
              {options.map((o: any, i: number) => (
                <div key={i} style={{ background: "#f5f0e8", border: "1px solid #e0d8cc", borderRadius: 12, padding: "14px 16px", marginBottom: 8, fontSize: 14, color: "#5a4a3a", fontWeight: 600 }}>
                  {o.text}
                </div>
              ))}
            </div>
            {/* Cadenas superposé */}
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <div style={{ fontSize: 30 }}>🔒</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a", background: "rgba(255,255,255,.85)", padding: "4px 12px", borderRadius: 20 }}>Réservé aux abonnés</div>
            </div>
          </div>
        )}

        {/* Astronaute + invitation */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 22, padding: 16, background: "#1a1a1a", borderRadius: 16 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon-192.png" alt="" style={{ width: 52, height: 52, borderRadius: 12, flexShrink: 0, animation: "dr-float 2.5s ease-in-out infinite" }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: "#fff", fontWeight: 700, lineHeight: 1.4, marginBottom: 2 }}>Rejoins l&apos;aventure !</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.6)", lineHeight: 1.4 }}>Abonne-toi pour voter et décider de la suite</div>
          </div>
        </div>
        <a href={stripeUrl} target="_blank" rel="noopener" style={{ display: "block", textAlign: "center", marginTop: 10, padding: "13px", borderRadius: 14, background: "linear-gradient(135deg,#8b6f4e,#c8a96e)", color: "#fff", fontWeight: 800, fontSize: 14, textDecoration: "none" }}>
          ✦ Participer au vote — 3 jours gratuits
        </a>
      </div>
    </div>
  )
}
