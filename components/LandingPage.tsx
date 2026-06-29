"use client"

import { useState, useEffect } from "react"

interface Props {
  onEnter: () => void
  stripeUrl: string
}

export default function LandingPage({ onEnter, stripeUrl }: Props) {
  const [votes, setVotes] = useState([62, 23, 15])
  const [voted, setVoted] = useState<number|null>(null)
  const [readers, setReaders] = useState(1247)
  const [showAstro, setShowAstro] = useState(true)

  // Simulate live vote updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (!voted) {
        setVotes(prev => {
          const total = prev.reduce((a,b) => a+b, 0)
          const i = Math.floor(Math.random() * 3)
          const newVotes = [...prev]
          newVotes[i] = Math.min(newVotes[i] + 1, 80)
          return newVotes
        })
        setReaders(r => r + Math.floor(Math.random() * 2))
      }
    }, 3000)
    return () => clearInterval(interval)
  }, [voted])

  const total = votes.reduce((a,b) => a+b, 0)
  const pcts = votes.map(v => Math.round(v/total*100))

  const voteOptions = [
    "Eleanor suit Ciro dans les ruelles de Portofino",
    "Elle rentre à Londres sans se retourner",
    "Elle découvre un secret dans sa chambre d'hôtel"
  ]

  return (
    <div style={{ background: "#f5f0e8", minHeight: "100vh", fontFamily: "Inter,sans-serif" }}>

      {/* ── NAV ── */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(245,240,232,.97)", borderBottom: "1px solid #e0d8cc", height: 56, display: "flex", alignItems: "center", padding: "0 20px", backdropFilter: "blur(20px)" }}>
        <div style={{ fontSize: 17, fontWeight: 900, color: "#1a1a1a", letterSpacing: -0.5, marginRight: "auto" }}>✦ DreamReader</div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button onClick={onEnter} style={{ height: 34, padding: "0 16px", borderRadius: 30, border: "1.5px solid #d8cfc4", background: "none", fontSize: 13, fontWeight: 700, cursor: "pointer", color: "#1a1a1a" }}>
            Se connecter
          </button>
          <a href={stripeUrl} target="_blank" style={{ height: 36, padding: "0 18px", borderRadius: 30, background: "#1a1a1a", color: "#fff", fontWeight: 700, fontSize: 13, textDecoration: "none", display: "flex", alignItems: "center" }}>
            S'abonner · 5€
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 20px" }}>

        {/* Section 1 : Hook émotionnel */}
        <div style={{ padding: "60px 0 40px", textAlign: "center" }}>
          {/* Live readers badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #e0d8cc", borderRadius: 30, padding: "6px 16px", marginBottom: 24, boxShadow: "0 1px 4px rgba(0,0,0,.06)" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "pulse 2s ease-in-out infinite" }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>{readers.toLocaleString("fr-FR")} lecteurs en ce moment</span>
          </div>

          <h1 style={{ fontFamily: "Lora,Georgia,serif", fontSize: "clamp(36px,6vw,52px)", fontWeight: 600, color: "#1a1a1a", lineHeight: 1.1, letterSpacing: -2, marginBottom: 20 }}>
            L'histoire que<br/>
            <span style={{ color: "#8b6f4e" }}>vous écrivez.</span>
          </h1>
          <p style={{ fontSize: 17, color: "#6a5a4a", lineHeight: 1.75, marginBottom: 32, maxWidth: 480, margin: "0 auto 32px" }}>
            Des romans interactifs où <strong>chaque vote façonne la suite.</strong> Lisez, votez, influencez — l'auteur écrit le prochain chapitre selon vos choix.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={onEnter} style={{ height: 50, padding: "0 32px", borderRadius: 12, background: "#1a1a1a", color: "#fff", fontWeight: 800, fontSize: 15, border: "none", cursor: "pointer", boxShadow: "0 4px 16px rgba(0,0,0,.2)" }}>
              Commencer gratuitement →
            </button>
            <a href={stripeUrl} target="_blank" style={{ height: 50, padding: "0 28px", borderRadius: 12, border: "1.5px solid #c8b89a", color: "#1a1a1a", fontWeight: 700, fontSize: 15, textDecoration: "none", display: "flex", alignItems: "center" }}>
              S'abonner · 5€/mois
            </a>
          </div>
        </div>

        {/* Astronaut mascot small */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
          <div style={{ animation: "float 4s ease-in-out infinite", position: "relative" }}>
            <svg width="90" height="110" viewBox="0 0 160 200" fill="none">
              <ellipse cx="80" cy="130" rx="40" ry="50" fill="#e8e0d4" stroke="#c8b89a" strokeWidth="2"/>
              <circle cx="80" cy="72" r="38" fill="#d4cfc8" stroke="#b0a090" strokeWidth="2"/>
              <ellipse cx="80" cy="72" rx="26" ry="26" fill="#1a2a4a" opacity="0.9"/>
              <circle cx="72" cy="72" r="4" fill="#fff" opacity="0.9"/><circle cx="88" cy="72" r="4" fill="#fff" opacity="0.9"/>
              <circle cx="73" cy="73" r="2" fill="#1a1a1a"/><circle cx="89" cy="73" r="2" fill="#1a1a1a"/>
              <path d="M72 80 Q80 86 88 80" stroke="#fff" strokeWidth="1.5" fill="none" opacity="0.7" strokeLinecap="round"/>
              <ellipse cx="40" cy="130" rx="14" ry="28" fill="#e8e0d4" stroke="#c8b89a" strokeWidth="2" transform="rotate(-20 40 130)"/>
              <ellipse cx="120" cy="130" rx="14" ry="28" fill="#e8e0d4" stroke="#c8b89a" strokeWidth="2" transform="rotate(20 120 130)"/>
              <rect x="28" y="148" width="36" height="28" rx="3" fill="#8b6f4e"/>
              <rect x="30" y="150" width="16" height="24" rx="2" fill="#c8a96e"/>
              <rect x="48" y="150" width="14" height="24" rx="2" fill="#a07850"/>
              <ellipse cx="65" cy="178" rx="14" ry="20" fill="#e8e0d4" stroke="#c8b89a" strokeWidth="2"/>
              <ellipse cx="95" cy="178" rx="14" ry="20" fill="#e8e0d4" stroke="#c8b89a" strokeWidth="2"/>
              <ellipse cx="65" cy="194" rx="16" ry="8" fill="#b0a090"/>
              <ellipse cx="95" cy="194" rx="16" ry="8" fill="#b0a090"/>
              <rect x="66" y="118" width="28" height="18" rx="4" fill="#c8b89a" opacity="0.6"/>
              <line x1="80" y1="34" x2="80" y2="20" stroke="#b0a090" strokeWidth="2"/>
              <circle cx="80" cy="18" r="4" fill="#8b6f4e"/>
            </svg>
            {/* Speech bubble */}
            <div style={{ position: "absolute", top: -20, left: 95, background: "#fff", border: "1px solid #e0d8cc", borderRadius: 12, padding: "8px 14px", whiteSpace: "nowrap", fontSize: 13, fontWeight: 600, color: "#1a1a1a", boxShadow: "0 2px 8px rgba(0,0,0,.08)" }}>
              Chapitre 1 gratuit ! 👇
              <div style={{ position: "absolute", left: -8, top: "50%", transform: "translateY(-50%)", width: 0, height: 0, borderTop: "7px solid transparent", borderBottom: "7px solid transparent", borderRight: "8px solid #e0d8cc" }} />
            </div>
          </div>
        </div>

        {/* Section 2 : Extrait du roman GRATUIT */}
        <div style={{ background: "#fff", border: "1px solid #e0d8cc", borderRadius: 16, padding: "28px 24px", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#b0a090", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Roman en cours</div>
              <div style={{ fontFamily: "Lora,Georgia,serif", fontSize: 18, fontWeight: 600, color: "#1a1a1a" }}>Après le dernier adieu</div>
              <div style={{ fontSize: 12, color: "#9a8878" }}>Romance · Thriller</div>
            </div>
            <span style={{ background: "#dcfce7", color: "#16a34a", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20, border: "1px solid #bbf7d0" }}>GRATUIT</span>
          </div>

          {/* Chapter excerpt */}
          <div style={{ borderLeft: "3px solid #c8b89a", paddingLeft: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#b0a090", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>Chapitre 1 — Extrait</div>
            <p style={{ fontFamily: "Lora,Georgia,serif", fontSize: 15, lineHeight: 1.85, color: "#2a2018" }}>
              Eleanor Whitmore avait tout quitté pour trois pinceaux, une valise et cette conviction fragile que sa vie devait commencer ailleurs.<br/><br/>
              Le marché de Portofino sentait le citron et l'eau salée. Entre les étals de tissu coloré, ses yeux s'arrêtèrent sur un homme aux mains trop grandes pour ce qu'il vendait.
            </p>
            <div style={{ marginTop: 12, fontSize: 13, color: "#9a8878", fontStyle: "italic" }}>— Suite disponible avec l'abonnement...</div>
          </div>

          <button onClick={onEnter} style={{ width: "100%", height: 44, borderRadius: 10, border: "none", background: "#1a1a1a", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
            Lire le chapitre complet gratuitement →
          </button>
        </div>

        {/* Section 3 : VOTE EN DIRECT - FOMO */}
        <div style={{ background: "#fff", border: "1px solid #e0d8cc", borderRadius: 16, overflow: "hidden", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,.06)" }}>
          <div style={{ background: "#1a1a1a", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,.5)", letterSpacing: 2, textTransform: "uppercase" }}>Vote en cours · Chapitre 1</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#fff", marginTop: 2 }}>Que se passe-t-il ensuite ?</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "pulse 2s ease-in-out infinite" }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,.7)" }}>{total} votes</span>
            </div>
          </div>
          <div style={{ padding: 16, background: "#faf7f2" }}>
            {voteOptions.map((opt, i) => (
              <div key={i}
                onClick={() => { if (!voted) { setVoted(i); setVotes(prev => { const n=[...prev]; n[i]+=1; return n }) } else { onEnter() } }}
                style={{ border: `1.5px solid ${voted===i ? "#8b6f4e" : "#e0d8cc"}`, borderRadius: 10, padding: "12px 16px", marginBottom: 8, cursor: "pointer", background: voted===i ? "#fdfaf5" : "#fff", transition: ".15s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 600, color: "#1a1a1a", marginBottom: voted!==null ? 8 : 0 }}>
                  <span>{opt}</span>
                  {voted !== null && <span style={{ fontWeight: 800, color: voted===i ? "#8b6f4e" : "#b0a090", minWidth: 36, textAlign: "right" }}>{pcts[i]}%</span>}
                </div>
                {voted !== null && (
                  <div style={{ height: 4, background: "#e0d8cc", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ height: "100%", background: voted===i ? "#8b6f4e" : "#c8b89a", width: pcts[i]+"%", borderRadius: 2, transition: "width .6s ease" }} />
                  </div>
                )}
              </div>
            ))}
            {voted === null ? (
              <div style={{ textAlign: "center", padding: "12px 0 4px", fontSize: 13, color: "#9a8878" }}>
                <span style={{ marginRight: 6 }}>⌛</span>
                <span>Essayez de voter · </span>
                <span onClick={onEnter} style={{ color: "#8b6f4e", fontWeight: 700, cursor: "pointer" }}>S'abonner pour voter pour de vrai</span>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "12px 0 4px" }}>
                <span style={{ fontSize: 13, color: "#9a8878" }}>Votre vote influence la suite ! </span>
                <span onClick={onEnter} style={{ fontSize: 13, color: "#8b6f4e", fontWeight: 700, cursor: "pointer" }}>S'inscrire pour voter vraiment →</span>
              </div>
            )}
          </div>
        </div>

        {/* Section 4 : Ce que vous obtenez */}
        <div style={{ background: "#fff", border: "1px solid #e0d8cc", borderRadius: 16, padding: "24px 20px", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,.06)" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#b0a090", letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>✦ Avec l'abonnement</div>
          {[
            { icon: "📖", title: "Tous les chapitres", desc: "Accès illimité à l'intégralité des romans en cours et terminés" },
            { icon: "🗳️", title: "Votes qui comptent vraiment", desc: "Vos votes influencent directement l'écriture du prochain chapitre" },
            { icon: "💬", title: "Commentaires & likes", desc: "Réagissez, débattez, partagez vos théories avec la communauté" },
            { icon: "📚", title: "Bibliothèque complète", desc: "Relisez tous les romans terminés quand vous voulez" },
            { icon: "🛒", title: "Aussi sur Amazon", desc: "Les romans terminés disponibles en version imprimée sur Amazon" },
          ].map((f, i) => (
            <div key={i} style={{ display: "flex", gap: 14, marginBottom: i < 4 ? 16 : 0, paddingBottom: i < 4 ? 16 : 0, borderBottom: i < 4 ? "1px solid #f0ebe2" : "none" }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>{f.icon}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", marginBottom: 3 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: "#9a8878", lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Section 5 : Prix + CTA final */}
        <div style={{ background: "#1a1a1a", borderRadius: 16, padding: "32px 24px", marginBottom: 16, textAlign: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,.4)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>Rejoignez l'aventure</div>
          <div style={{ fontFamily: "Lora,Georgia,serif", fontSize: 36, fontWeight: 600, color: "#fff", letterSpacing: -2, marginBottom: 4 }}>5€ <span style={{ fontSize: 16, fontWeight: 400, color: "rgba(255,255,255,.5)" }}>/mois</span></div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.4)", marginBottom: 24 }}>Sans engagement · Annulable à tout moment</div>
          <a href={stripeUrl} target="_blank" style={{ display: "block", height: 52, borderRadius: 12, background: "linear-gradient(135deg,#8b6f4e,#c8a96e)", color: "#fff", fontWeight: 900, fontSize: 16, textDecoration: "none", lineHeight: "52px", boxShadow: "0 4px 20px rgba(139,111,78,.4)", marginBottom: 12 }}>
            S'abonner maintenant ✦
          </a>
          <button onClick={onEnter} style={{ width: "100%", height: 44, borderRadius: 12, border: "1px solid rgba(255,255,255,.1)", background: "none", color: "rgba(255,255,255,.5)", fontSize: 14, cursor: "pointer", fontWeight: 600 }}>
            Créer un compte gratuit d'abord →
          </button>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", padding: "20px 0 40px", fontSize: 12, color: "#c8b89a" }}>
          ✦ DreamReader · Romans interactifs en français
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
      `}</style>
    </div>
  )
}
