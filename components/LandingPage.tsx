"use client"

import { useState } from "react"

interface Props {
  onEnter: () => void
  stripeUrl: string
}

export default function LandingPage({ onEnter, stripeUrl }: Props) {
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(true)

  const steps = [
    { bubble: "Bienvenue, voyageur des mots... ✦", sub: "Je suis le Gardien de DreamReader. Laisse-moi te guider vers un monde où les histoires t'appartiennent." },
    { bubble: "Des romans interactifs qui vivent grâce à toi. 📖", sub: "Chaque chapitre se termine par un vote. C'est TOI qui décides de la suite de l'histoire." },
    { bubble: "Tu lis. Tu votes. Tu influences. 🗳️", sub: "L'auteur écrit le chapitre suivant en fonction de tes choix. L'aventure vous appartient à tous." },
    { bubble: "Pour 5€/mois, l'aventure complète. 🌟", sub: "Accès illimité à tous les chapitres, votes et commentaires. Sans engagement." },
    { bubble: "Prêt à écrire l'histoire ? ✦", sub: "Rejoins la communauté DreamReader et commence ton aventure dès maintenant." },
  ]

  function next() {
    if (step < steps.length - 1) {
      setVisible(false)
      setTimeout(() => { setStep(s => s + 1); setVisible(true) }, 300)
    }
  }

  function prev() {
    if (step > 0) {
      setVisible(false)
      setTimeout(() => { setStep(s => s - 1); setVisible(true) }, 300)
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a1a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 16px", position: "relative", overflow: "hidden" }}>

      {/* Une seule grande étoile derrière l'astronaute */}
      <div style={{ position: "absolute", top: "8%", left: "50%", transform: "translateX(-50%)", pointerEvents: "none" }}>
        <svg width="320" height="320" viewBox="0 0 320 320" fill="none">
          <circle cx="160" cy="160" r="140" fill="none" stroke="rgba(200,169,110,0.06)" strokeWidth="80"/>
          <circle cx="160" cy="160" r="100" fill="none" stroke="rgba(200,169,110,0.08)" strokeWidth="1"/>
          <circle cx="160" cy="160" r="130" fill="none" stroke="rgba(200,169,110,0.05)" strokeWidth="1"/>
          {/* Grande étoile à 8 branches */}
          <path d="M160 20 L168 148 L296 160 L168 172 L160 300 L152 172 L24 160 L152 148 Z" fill="rgba(200,169,110,0.12)"/>
          <path d="M160 60 L165 148 L252 160 L165 172 L160 260 L155 172 L68 160 L155 148 Z" fill="rgba(200,169,110,0.08)"/>
          {/* Centre lumineux */}
          <circle cx="160" cy="160" r="30" fill="rgba(200,169,110,0.06)"/>
          <circle cx="160" cy="160" r="12" fill="rgba(200,169,110,0.1)"/>
        </svg>
      </div>

      {/* Logo */}
      <div style={{ fontSize: 11, fontWeight: 700, color: "#8b6f4e", letterSpacing: 6, textTransform: "uppercase", marginBottom: 32, opacity: 0.8, zIndex: 1 }}>✦ DreamReader</div>

      {/* Astronaut */}
      <div style={{ marginBottom: 32, animation: "float 4s ease-in-out infinite", zIndex: 1 }}>
        <svg width="160" height="200" viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="80" cy="130" rx="40" ry="50" fill="#e8e0d4" stroke="#c8b89a" strokeWidth="2"/>
          <circle cx="80" cy="72" r="38" fill="#d4cfc8" stroke="#b0a090" strokeWidth="2"/>
          <ellipse cx="80" cy="72" rx="26" ry="26" fill="#1a2a4a" opacity="0.9"/>
          <ellipse cx="72" cy="64" rx="8" ry="6" fill="#ffffff" opacity="0.15"/>
          <circle cx="72" cy="72" r="4" fill="#fff" opacity="0.9"/>
          <circle cx="88" cy="72" r="4" fill="#fff" opacity="0.9"/>
          <circle cx="73" cy="73" r="2" fill="#1a1a1a"/>
          <circle cx="89" cy="73" r="2" fill="#1a1a1a"/>
          <circle cx="74" cy="72" r="1" fill="#fff"/>
          <circle cx="90" cy="72" r="1" fill="#fff"/>
          <path d="M72 80 Q80 86 88 80" stroke="#fff" strokeWidth="1.5" fill="none" opacity="0.7" strokeLinecap="round"/>
          <ellipse cx="40" cy="130" rx="14" ry="28" fill="#e8e0d4" stroke="#c8b89a" strokeWidth="2" transform="rotate(-20 40 130)"/>
          <ellipse cx="120" cy="130" rx="14" ry="28" fill="#e8e0d4" stroke="#c8b89a" strokeWidth="2" transform="rotate(20 120 130)"/>
          <rect x="28" y="148" width="36" height="28" rx="3" fill="#8b6f4e"/>
          <rect x="30" y="150" width="16" height="24" rx="2" fill="#c8a96e"/>
          <rect x="48" y="150" width="14" height="24" rx="2" fill="#a07850"/>
          <line x1="46" y1="150" x2="46" y2="174" stroke="#6a5030" strokeWidth="1"/>
          <line x1="32" y1="156" x2="44" y2="156" stroke="#8b6f4e" strokeWidth="1" opacity="0.5"/>
          <line x1="32" y1="160" x2="44" y2="160" stroke="#8b6f4e" strokeWidth="1" opacity="0.5"/>
          <line x1="32" y1="164" x2="44" y2="164" stroke="#8b6f4e" strokeWidth="1" opacity="0.5"/>
          <ellipse cx="65" cy="178" rx="14" ry="20" fill="#e8e0d4" stroke="#c8b89a" strokeWidth="2"/>
          <ellipse cx="95" cy="178" rx="14" ry="20" fill="#e8e0d4" stroke="#c8b89a" strokeWidth="2"/>
          <ellipse cx="65" cy="194" rx="16" ry="8" fill="#b0a090"/>
          <ellipse cx="95" cy="194" rx="16" ry="8" fill="#b0a090"/>
          <rect x="66" y="118" width="28" height="18" rx="4" fill="#c8b89a" opacity="0.6"/>
          <text x="80" y="130" textAnchor="middle" fill="#1a1a1a" fontSize="7" fontWeight="bold" fontFamily="sans-serif">DR</text>
          <rect x="56" y="108" width="48" height="30" rx="6" fill="#d4cfc8" stroke="#b0a090" strokeWidth="1.5" opacity="0.7"/>
          <line x1="80" y1="34" x2="80" y2="20" stroke="#b0a090" strokeWidth="2"/>
          <circle cx="80" cy="18" r="4" fill="#8b6f4e"/>
        </svg>
      </div>

      {/* Speech bubble */}
      <div style={{ maxWidth: 360, width: "100%", zIndex: 1, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(10px)", transition: "all 0.3s ease" }}>
        <div style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 20, padding: "24px 28px", marginBottom: 14, backdropFilter: "blur(10px)" }}>
          <p style={{ fontFamily: "Lora,Georgia,serif", fontSize: 19, fontWeight: 600, color: "#f5f0e8", lineHeight: 1.4, marginBottom: 10 }}>
            {steps[step].bubble}
          </p>
          <p style={{ fontSize: 14, color: "rgba(245,240,232,.55)", lineHeight: 1.75 }}>
            {steps[step].sub}
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 16 }}>
          {steps.map((_, i) => (
            <div key={i} style={{ width: i === step ? 22 : 6, height: 6, borderRadius: 3, background: i === step ? "#8b6f4e" : "rgba(255,255,255,.15)", transition: "all .3s" }} />
          ))}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          {step > 0 && (
            <button onClick={prev} style={{ flex: 1, height: 48, borderRadius: 12, border: "1px solid rgba(255,255,255,.1)", background: "none", color: "rgba(245,240,232,.4)", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
              ← Précédent
            </button>
          )}
          {step < steps.length - 1 ? (
            <button onClick={next} style={{ flex: 1, height: 48, borderRadius: 12, background: "linear-gradient(135deg,#8b6f4e,#c8a96e)", border: "none", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", boxShadow: "0 4px 16px rgba(139,111,78,.4)" }}>
              Suivant →
            </button>
          ) : (
            <button onClick={onEnter} style={{ flex: 1, height: 48, borderRadius: 12, background: "linear-gradient(135deg,#f5f0e8,#c8a96e)", border: "none", color: "#1a0f0a", fontSize: 14, fontWeight: 900, cursor: "pointer", boxShadow: "0 4px 20px rgba(200,169,110,.4)" }}>
              Commencer l'aventure ✦
            </button>
          )}
        </div>

        {step < steps.length - 1 && (
          <button onClick={onEnter} style={{ width: "100%", marginTop: 10, height: 36, borderRadius: 10, border: "none", background: "none", color: "rgba(245,240,232,.25)", fontSize: 12, cursor: "pointer" }}>
            Passer l'intro →
          </button>
        )}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50% { transform: translateY(-16px) rotate(2deg); }
        }
      `}</style>
    </div>
  )
}
