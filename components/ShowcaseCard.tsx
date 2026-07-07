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
          0%, 100% { transform: scale(1); box-shadow: 0 8px 28px rgba(139,111,78,.3); }
          50% { transform: scale(1.045); box-shadow: 0 16px 48px rgba(139,111,78,.55); }
        }
        @keyframes dr-glow { 0%,100% { opacity:.35 } 50% { opacity:.85 } }
        @keyframes dr-float-astro {
          0%, 100% { transform: translateY(0) rotate(-1deg); }
          50% { transform: translateY(-12px) rotate(1deg); }
        }
        @keyframes dr-bubble {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-4px) scale(1.02); }
        }
        @keyframes dr-blink { 0%,90%,100% { opacity:1 } 95% { opacity:.4 } }
      `}</style>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 14 }}>
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#c0392b", animation: "dr-glow 1.4s ease-in-out infinite" }} />
        <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", color: "#c0392b" }}>Vote en cours &middot; en direct</span>
      </div>

      <div style={{ background: "#fff", border: "1px solid #e0d8cc", borderRadius: 20, padding: 24, paddingBottom: 20, boxShadow: "0 8px 32px rgba(0,0,0,.07)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -50, left: "50%", transform: "translateX(-50%)", width: 300, height: 300, background: "radial-gradient(circle, rgba(200,169,110,.4), transparent 70%)", animation: "dr-glow 3s ease-in-out infinite", pointerEvents: "none" }} />

        <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", paddingBottom: 8 }}>
          <div style={{ textAlign: "center", marginBottom: 16, position: "relative", zIndex: 2 }}>
            {novel.genre && <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: "#9a8878", fontWeight: 700, marginBottom: 4 }}>{novel.genre}</div>}
            <div style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", lineHeight: 1.1, fontFamily: "Georgia,serif" }}>{novel.title}</div>
          </div>

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{
              width: 150, height: 210, borderRadius: 14, flexShrink: 0,
              border: "3px solid #c8a96e",
              background: isImg ? "#fff url(" + novel.cover + ") center/cover" : (novel.cover || "linear-gradient(135deg,#8b6f4e,#c8a96e)"),
              animation: "dr-pulse 1.8s ease-in-out infinite",
            }} />

            <div style={{ position: "absolute", bottom: -34, left: "50%", transform: "translateX(-50%)", zIndex: 3, animation: "dr-float-astro 3s ease-in-out infinite" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icon-192.png" alt="Astronaute DreamReader" style={{ width: 96, height: 96, borderRadius: 20, filter: "drop-shadow(0 8px 20px rgba(0,0,0,.25))" }} />
            </div>

            <div style={{ position: "absolute", bottom: 6, right: -18, zIndex: 4, animation: "dr-bubble 3s ease-in-out infinite" }}>
              <div style={{ position: "relative", background: "#1a1a1a", color: "#fff", padding: "9px 13px", borderRadius: 14, fontSize: 11.5, fontWeight: 700, lineHeight: 1.35, maxWidth: 155, boxShadow: "0 6px 18px rgba(0,0,0,.22)" }}>
                Les lecteurs votent la suite... rejoins-les&nbsp;! <span style={{ animation: "dr-blink 2s infinite" }}>&#10022;</span>
                <div style={{ position: "absolute", bottom: 10, left: -6, width: 0, height: 0, borderTop: "6px solid transparent", borderBottom: "6px solid transparent", borderRight: "8px solid #1a1a1a" }} />
              </div>
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 46, marginBottom: 4 }}>
          <div style={{ fontSize: 13, color: novel.teaser ? "#5a4a3a" : "#9a8878", lineHeight: 1.6, fontStyle: novel.teaser ? "italic" : "normal", maxWidth: 320, marginInline: "auto" }}>
            {novel.teaser || "Les abonnés décident de la suite de l'histoire en ce moment même."}
          </div>
        </div>

        {chapter && options.length > 0 && (
          <div style={{ marginTop: 16, position: "relative" }}>
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
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <div style={{ fontSize: 30 }}>&#128274;</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a", background: "rgba(255,255,255,.85)", padding: "4px 12px", borderRadius: 20 }}>Réservé aux abonnés</div>
            </div>
          </div>
        )}

        <a href={stripeUrl} target="_blank" rel="noopener" style={{ display: "block", textAlign: "center", marginTop: 18, padding: "14px", borderRadius: 14, background: "linear-gradient(135deg,#8b6f4e,#c8a96e)", color: "#fff", fontWeight: 800, fontSize: 14, textDecoration: "none", boxShadow: "0 6px 18px rgba(139,111,78,.3)" }}>
          &#10022; Participer au vote — 3 jours gratuits
        </a>
      </div>
    </div>
  )
}
