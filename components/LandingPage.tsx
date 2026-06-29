"use client"

import { useState, useEffect } from "react"

interface Props {
  onEnter: () => void
  stripeUrl: string
}

export default function LandingPage({ onEnter, stripeUrl }: Props) {
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(true)

  const steps = [
    {
      bubble: "Bienvenue dans l'espace, lecteur... 🌌",
      sub: "Je suis l'Astronaute DreamReader. Laisse-moi t'expliquer où tu viens d'atterrir.",
    },
    {
      bubble: "DreamReader, c'est une bibliothèque vivante. ✦",
      sub: "Des romans interactifs où VOUS décidez de la suite. Chaque chapitre se termine par un vote.",
    },
    {
      bubble: "Vous lisez. Vous votez. Vous influencez. 🗳️",
      sub: "L'auteur écrit le chapitre suivant en fonction de vos choix. L'histoire vous appartient.",
    },
    {
      bubble: "Pour 5€/mois, accès illimité. 🚀",
      sub: "Tous les chapitres, tous les votes, tous les commentaires. Sans engagement.",
    },
    {
      bubble: "Prêt pour l'aventure ? 📖",
      sub: "Créez votre compte et rejoignez la communauté DreamReader.",
    },
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
      
      {/* Stars background */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        {[...Array(60)].map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            width: Math.random() * 3 + 1 + "px",
            height: Math.random() * 3 + 1 + "px",
            background: "#fff",
            borderRadius: "50%",
            left: Math.random() * 100 + "%",
            top: Math.random() * 100 + "%",
            opacity: Math.random() * 0.7 + 0.3,
            animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
            animationDelay: Math.random() * 3 + "s"
          }} />
        ))}
      </div>

      {/* Logo */}
      <div style={{ fontSize: 13, fontWeight: 700, color: "#8b6f4e", letterSpacing: 4, textTransform: "uppercase", marginBottom: 40, opacity: 0.8 }}>✦ DreamReader</div>

      {/* Astronaut SVG */}
      <div style={{ marginBottom: 32, animation: "float 4s ease-in-out infinite" }}>
        <svg width="160" height="200" viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Body suit */}
          <ellipse cx="80" cy="130" rx="40" ry="50" fill="#e8e0d4" stroke="#c8b89a" strokeWidth="2"/>
          {/* Helmet */}
          <circle cx="80" cy="72" r="38" fill="#d4cfc8" stroke="#b0a090" strokeWidth="2"/>
          {/* Visor */}
          <ellipse cx="80" cy="72" rx="26" ry="26" fill="#1a2a4a" opacity="0.9"/>
          {/* Visor reflection */}
          <ellipse cx="72" cy="64" rx="8" ry="6" fill="#ffffff" opacity="0.15"/>
          {/* Eyes inside visor */}
          <circle cx="72" cy="72" r="4" fill="#fff" opacity="0.9"/>
          <circle cx="88" cy="72" r="4" fill="#fff" opacity="0.9"/>
          <circle cx="73" cy="73" r="2" fill="#1a1a1a"/>
          <circle cx="89" cy="73" r="2" fill="#1a1a1a"/>
          {/* Smile */}
          <path d="M72 80 Q80 86 88 80" stroke="#fff" strokeWidth="1.5" fill="none" opacity="0.7" strokeLinecap="round"/>
          {/* Left arm holding book */}
          <ellipse cx="40" cy="130" rx="14" ry="28" fill="#e8e0d4" stroke="#c8b89a" strokeWidth="2" transform="rotate(-20 40 130)"/>
          {/* Right arm */}
          <ellipse cx="120" cy="130" rx="14" ry="28" fill="#e8e0d4" stroke="#c8b89a" strokeWidth="2" transform="rotate(20 120 130)"/>
          {/* Book */}
          <rect x="28" y="148" width="36" height="28" rx="3" fill="#8b6f4e"/>
          <rect x="30" y="150" width="16" height="24" rx="2" fill="#c8a96e"/>
          <rect x="48" y="150" width="14" height="24" rx="2" fill="#a07850"/>
          <line x1="46" y1="150" x2="46" y2="174" stroke="#6a5030" strokeWidth="1"/>
          {/* Book lines */}
          <line x1="32" y1="156" x2="44" y2="156" stroke="#8b6f4e" strokeWidth="1" opacity="0.5"/>
          <line x1="32" y1="160" x2="44" y2="160" stroke="#8b6f4e" strokeWidth="1" opacity="0.5"/>
          <line x1="32" y1="164" x2="44" y2="164" stroke="#8b6f4e" strokeWidth="1" opacity="0.5"/>
          {/* Legs */}
          <ellipse cx="65" cy="178" rx="14" ry="20" fill="#e8e0d4" stroke="#c8b89a" strokeWidth="2"/>
          <ellipse cx="95" cy="178" rx="14" ry="20" fill="#e8e0d4" stroke="#c8b89a" strokeWidth="2"/>
          {/* Boots */}
          <ellipse cx="65" cy="194" rx="16" ry="8" fill="#b0a090"/>
          <ellipse cx="95" cy="194" rx="16" ry="8" fill="#b0a090"/>
          {/* Chest badge */}
          <rect x="66" y="118" width="28" height="18" rx="4" fill="#c8b89a" opacity="0.6"/>
          <text x="80" y="130" textAnchor="middle" fill="#1a1a1a" fontSize="7" fontWeight="bold" fontFamily="sans-serif">DR</text>
          {/* Oxygen pack */}
          <rect x="56" y="108" width="48" height="30" rx="6" fill="#d4cfc8" stroke="#b0a090" strokeWidth="1.5" opacity="0.7"/>
          {/* Antenna */}
          <line x1="80" y1="34" x2="80" y2="20" stroke="#b0a090" strokeWidth="2"/>
          <circle cx="80" cy="18" r="4" fill="#8b6f4e"/>
        </svg>
      </div>

      {/* Speech bubble */}
      <div style={{
        maxWidth: 360, width: "100%",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(10px)",
        transition: "all 0.3s ease"
      }}>
        <div style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 20, padding: "24px 28px", marginBottom: 12, backdropFilter: "blur(10px)" }}>
          <p style={{ fontFamily: "Lora,Georgia,serif", fontSize: 20, fontWeight: 600, color: "#f5f0e8", lineHeight: 1.4, marginBottom: 10 }}>
            {steps[step].bubble}
          </p>
          <p style={{ fontSize: 14, color: "rgba(245,240,232,.6)", lineHeight: 1.7 }}>
            {steps[step].sub}
          </p>
        </div>

        {/* Progress dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 20 }}>
          {steps.map((_, i) => (
            <div key={i} style={{ width: i === step ? 20 : 6, height: 6, borderRadius: 3, background: i === step ? "#8b6f4e" : "rgba(255,255,255,.2)", transition: "all .3s" }} />
          ))}
        </div>

        {/* Navigation */}
        <div style={{ display: "flex", gap: 10 }}>
          {step > 0 && (
            <button onClick={prev} style={{ flex: 1, height: 46, borderRadius: 12, border: "1px solid rgba(255,255,255,.15)", background: "none", color: "rgba(245,240,232,.6)", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
              ← Précédent
            </button>
          )}
          {step < steps.length - 1 ? (
            <button onClick={next} style={{ flex: 1, height: 46, borderRadius: 12, background: "#8b6f4e", border: "none", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
              Suivant →
            </button>
          ) : (
            <button onClick={onEnter} style={{ flex: 1, height: 46, borderRadius: 12, background: "#f5f0e8", border: "none", color: "#1a1a1a", fontSize: 14, fontWeight: 800, cursor: "pointer" }}>
              Commencer l'aventure ✦
            </button>
          )}
        </div>

        {step === steps.length - 1 && (
          <button onClick={onEnter} style={{ width: "100%", marginTop: 10, height: 40, borderRadius: 12, border: "1px solid rgba(255,255,255,.15)", background: "none", color: "rgba(245,240,232,.5)", fontSize: 13, cursor: "pointer" }}>
            Passer l'intro →
          </button>
        )}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50% { transform: translateY(-16px) rotate(2deg); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
