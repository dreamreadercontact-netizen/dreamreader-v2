"use client"

import { useState, useEffect } from "react"

const TIPS: Record<string, string> = {
  home: "Bienvenue ! 👋 Ici tu vois tous les romans en cours. Clique sur un roman pour lire le premier chapitre gratuitement.",
  library: "La bibliothèque contient tous les romans. Les abonnés accèdent à tous les chapitres et peuvent voter pour influencer la suite !",
  books: "Retrouve ici tous les romans terminés. Certains seront aussi disponibles en version imprimée sur Amazon. 📚",
  sub: "Pour 5€/mois seulement, tu votes, tu lis tout, et tu influences chaque chapitre. Sans engagement !",
  profile: "Ton profil, ton historique, ton statut d'abonnement. Tout est ici. ✦",
  admin: "Bienvenue dans ton espace auteur ! Publie tes chapitres, suis tes stats et gère ta communauté.",
  reader: "Tu lis un chapitre ! À la fin, vote pour décider de la suite. Les abonnés influencent vraiment l'histoire. 🗳️",
}

interface Props {
  section: string
}

export default function OnboardingTip({ section }: Props) {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const key = `dr_onboard_${section}`
    const seen = localStorage.getItem(key)
    if (!seen) {
      setTimeout(() => setVisible(true), 600)
    }
  }, [section])

  function dismiss() {
    const key = `dr_onboard_${section}`
    localStorage.setItem(key, "1")
    setDismissed(true)
    setTimeout(() => setVisible(false), 300)
  }

  const tip = TIPS[section]
  if (!tip || !visible) return null

  return (
    <div style={{
      position: "fixed", bottom: 80, left: "50%", transform: "translateX(-50%)",
      zIndex: 200, width: "calc(100% - 32px)", maxWidth: 420,
      opacity: dismissed ? 0 : 1,
      transition: "opacity 0.3s ease",
      pointerEvents: dismissed ? "none" : "auto"
    }}>
      <div style={{ background: "#1a1a1a", borderRadius: 16, padding: "16px 16px 16px 20px", boxShadow: "0 8px 32px rgba(0,0,0,.3)", display: "flex", gap: 12, alignItems: "flex-start" }}>
        {/* Mini astronaut */}
        <div style={{ flexShrink: 0, animation: "float 3s ease-in-out infinite" }}>
          <svg width="44" height="54" viewBox="0 0 160 200" fill="none">
            <ellipse cx="80" cy="130" rx="40" ry="50" fill="#e8e0d4" stroke="#c8b89a" strokeWidth="3"/>
            <circle cx="80" cy="72" r="38" fill="#d4cfc8" stroke="#b0a090" strokeWidth="3"/>
            <ellipse cx="80" cy="72" rx="26" ry="26" fill="#1a2a4a" opacity="0.9"/>
            <circle cx="72" cy="72" r="4" fill="#fff" opacity="0.9"/>
            <circle cx="88" cy="72" r="4" fill="#fff" opacity="0.9"/>
            <circle cx="73" cy="73" r="2" fill="#1a1a1a"/>
            <circle cx="89" cy="73" r="2" fill="#1a1a1a"/>
            <path d="M72 80 Q80 86 88 80" stroke="#fff" strokeWidth="1.5" fill="none" opacity="0.7" strokeLinecap="round"/>
            <ellipse cx="40" cy="130" rx="14" ry="28" fill="#e8e0d4" stroke="#c8b89a" strokeWidth="2" transform="rotate(-20 40 130)"/>
            <ellipse cx="120" cy="130" rx="14" ry="28" fill="#e8e0d4" stroke="#c8b89a" strokeWidth="2" transform="rotate(20 120 130)"/>
            <ellipse cx="65" cy="178" rx="14" ry="20" fill="#e8e0d4" stroke="#c8b89a" strokeWidth="2"/>
            <ellipse cx="95" cy="178" rx="14" ry="20" fill="#e8e0d4" stroke="#c8b89a" strokeWidth="2"/>
            <ellipse cx="65" cy="194" rx="16" ry="8" fill="#b0a090"/>
            <ellipse cx="95" cy="194" rx="16" ry="8" fill="#b0a090"/>
          </svg>
        </div>
        {/* Text */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#8b6f4e", marginBottom: 4, letterSpacing: 0.5 }}>✦ Guide DreamReader</div>
          <p style={{ fontSize: 14, color: "#fff", lineHeight: 1.6, margin: 0 }}>{tip}</p>
        </div>
        {/* Close */}
        <button onClick={dismiss} style={{ flexShrink: 0, width: 28, height: 28, borderRadius: "50%", border: "1px solid rgba(255,255,255,.15)", background: "none", color: "rgba(255,255,255,.5)", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", marginTop: -4 }}>
          ✕
        </button>
      </div>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  )
}
