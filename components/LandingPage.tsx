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
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #0d0a1a 0%, #1a0f2e 40%, #2d1810 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 16px", position: "relative", overflow: "hidden" }}>

      {/* Stars */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        {[...Array(80)].map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            width: (i % 3 === 0 ? 3 : i % 3 === 1 ? 2 : 1) + "px",
            height: (i % 3 === 0 ? 3 : i % 3 === 1 ? 2 : 1) + "px",
            background: i % 5 === 0 ? "#f5d080" : "#ffffff",
            borderRadius: "50%",
            left: ((i * 137.5) % 100) + "%",
            top: ((i * 97.3) % 100) + "%",
            opacity: 0.4 + (i % 4) * 0.15,
            animation: `twinkle ${2 + (i % 4)}s ease-in-out infinite`,
            animationDelay: (i % 5) * 0.6 + "s"
          }} />
        ))}
      </div>

      {/* Nebula glow */}
      <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 400, height: 300, background: "radial-gradient(ellipse, rgba(139,111,78,.15) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", right: "10%", width: 200, height: 200, background: "radial-gradient(ellipse, rgba(100,60,140,.12) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Logo */}
      <div style={{ fontSize: 11, fontWeight: 700, color: "#c8a96e", letterSpacing: 6, textTransform: "uppercase", marginBottom: 32, opacity: 0.9 }}>✦ DreamReader</div>

      {/* Explorer Character - Treasure Planet Style */}
      <div style={{ marginBottom: 28, animation: "float 5s ease-in-out infinite", position: "relative" }}>
        <svg width="200" height="240" viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Cape flowing behind */}
          <path d="M60 100 Q30 140 20 200 Q50 180 80 160 Z" fill="#8b2020" opacity="0.9"/>
          <path d="M140 100 Q170 140 180 200 Q150 180 120 160 Z" fill="#6b1818" opacity="0.9"/>
          <path d="M60 100 Q100 90 140 100 Q150 150 120 160 Q100 170 80 160 Q50 150 60 100Z" fill="#a02828"/>
          {/* Cape inner lining */}
          <path d="M65 105 Q100 95 135 105 Q142 145 118 156 Q100 164 82 156 Q58 145 65 105Z" fill="#c84040" opacity="0.5"/>

          {/* Body/Coat */}
          <rect x="70" y="110" width="60" height="70" rx="8" fill="#2a1f3d"/>
          {/* Coat details */}
          <rect x="95" y="110" width="10" height="70" fill="#1a1228" opacity="0.5"/>
          {/* Gold buttons */}
          <circle cx="100" cy="125" r="3" fill="#c8a96e"/>
          <circle cx="100" cy="138" r="3" fill="#c8a96e"/>
          <circle cx="100" cy="151" r="3" fill="#c8a96e"/>
          {/* Collar/cravat */}
          <path d="M82 110 Q100 118 118 110 L115 125 Q100 130 85 125 Z" fill="#f5f0e8"/>

          {/* Head */}
          <ellipse cx="100" cy="82" rx="28" ry="30" fill="#d4956a"/>
          {/* Hair - wild adventurer style */}
          <path d="M72 78 Q68 55 80 50 Q90 45 100 48 Q115 45 125 55 Q130 65 128 78" fill="#3d2010"/>
          <path d="M72 78 Q70 62 76 58 Q82 52 88 54" fill="#4a2818"/>
          {/* Wild hair strands */}
          <path d="M75 60 Q70 45 78 40" stroke="#3d2010" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <path d="M88 52 Q85 38 92 35" stroke="#3d2010" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <path d="M108 50 Q110 36 118 38" stroke="#3d2010" strokeWidth="2.5" fill="none" strokeLinecap="round"/>

          {/* Face */}
          {/* Eyes - expressive */}
          <ellipse cx="89" cy="82" rx="6" ry="7" fill="#fff"/>
          <ellipse cx="111" cy="82" rx="6" ry="7" fill="#fff"/>
          <circle cx="91" cy="83" r="4" fill="#3d2010"/>
          <circle cx="113" cy="83" r="4" fill="#3d2010"/>
          <circle cx="92" cy="82" r="1.5" fill="#fff"/>
          <circle cx="114" cy="82" r="1.5" fill="#fff"/>
          {/* Eyebrows - adventurous */}
          <path d="M83 75 Q89 72 95 74" stroke="#3d2010" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <path d="M105 74 Q111 72 117 75" stroke="#3d2010" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          {/* Nose */}
          <path d="M98 88 Q100 92 102 88" stroke="#b07040" strokeWidth="1.5" fill="none"/>
          {/* Smile - warm */}
          <path d="M88 96 Q100 104 112 96" stroke="#8b4020" strokeWidth="2" fill="none" strokeLinecap="round"/>
          {/* Cheek glow */}
          <circle cx="85" cy="93" r="5" fill="#e07050" opacity="0.2"/>
          <circle cx="115" cy="93" r="5" fill="#e07050" opacity="0.2"/>

          {/* Scar - adventurer detail */}
          <path d="M116 79 L120 86" stroke="#a06040" strokeWidth="1.5" fill="none" opacity="0.7"/>

          {/* Ear */}
          <ellipse cx="72" cy="84" rx="5" ry="7" fill="#c4855a"/>
          <ellipse cx="128" cy="84" rx="5" ry="7" fill="#c4855a"/>
          {/* Earring */}
          <circle cx="69" cy="90" r="3" fill="#c8a96e"/>

          {/* Left arm + book */}
          <path d="M70 120 Q45 130 35 155 Q50 158 65 145" fill="#2a1f3d" stroke="#1a1228" strokeWidth="1"/>
          {/* Hand */}
          <ellipse cx="38" cy="158" rx="10" ry="8" fill="#d4956a"/>

          {/* Right arm gesturing */}
          <path d="M130 120 Q155 130 162 118" fill="#2a1f3d" stroke="#1a1228" strokeWidth="1"/>
          <ellipse cx="165" cy="115" rx="9" ry="7" fill="#d4956a"/>

          {/* BOOK - ancient tome */}
          <rect x="18" y="148" width="44" height="58" rx="4" fill="#5a3010"/>
          {/* Book cover texture */}
          <rect x="20" y="150" width="40" height="54" rx="3" fill="#6a3818"/>
          {/* Book spine details */}
          <line x1="34" y1="150" x2="34" y2="204" stroke="#4a2810" strokeWidth="2"/>
          <rect x="20" y="150" width="14" height="54" rx="2" fill="#7a4820" opacity="0.8"/>
          {/* Gold clasp */}
          <rect x="56" y="172" width="6" height="10" rx="2" fill="#c8a96e"/>
          <circle cx="59" cy="177" r="2" fill="#f5d080"/>
          {/* Book title emboss */}
          <text x="42" y="170" textAnchor="middle" fill="#c8a96e" fontSize="5" fontFamily="Georgia,serif" fontWeight="bold" opacity="0.8">DREAM</text>
          <text x="42" y="178" textAnchor="middle" fill="#c8a96e" fontSize="5" fontFamily="Georgia,serif" fontWeight="bold" opacity="0.8">READER</text>
          {/* Stars on book cover */}
          <text x="30" y="192" fill="#c8a96e" fontSize="6" opacity="0.6">✦ ✦ ✦</text>

          {/* Legs */}
          <rect x="78" y="175" width="18" height="45" rx="6" fill="#2a1f3d"/>
          <rect x="104" y="175" width="18" height="45" rx="6" fill="#2a1f3d"/>
          {/* Boots */}
          <ellipse cx="87" cy="222" rx="14" ry="8" fill="#1a0f0a"/>
          <ellipse cx="113" cy="222" rx="14" ry="8" fill="#1a0f0a"/>
          {/* Boot buckles */}
          <rect x="80" y="216" width="14" height="5" rx="2" fill="#c8a96e" opacity="0.7"/>
          <rect x="106" y="216" width="14" height="5" rx="2" fill="#c8a96e" opacity="0.7"/>

          {/* Hat - tricorn style */}
          <path d="M70 72 Q80 55 100 52 Q120 55 130 72 Q115 65 100 63 Q85 65 70 72Z" fill="#1a0f1a"/>
          <path d="M68 74 Q100 60 132 74 L128 78 Q100 66 72 78Z" fill="#2a1525"/>
          {/* Hat band */}
          <path d="M72 76 Q100 64 128 76" stroke="#c8a96e" strokeWidth="2" fill="none"/>
          {/* Feather */}
          <path d="M125 68 Q135 50 128 35 Q122 45 118 55 Q115 62 118 68" fill="#e8c870" opacity="0.9"/>
          <path d="M127 66 Q133 52 127 40" stroke="#d4a830" strokeWidth="1" fill="none"/>

          {/* Glowing orb/compass */}
          <circle cx="168" cy="100" r="12" fill="#1a1228" stroke="#c8a96e" strokeWidth="1.5"/>
          <circle cx="168" cy="100" r="8" fill="#2d1f4a"/>
          <circle cx="168" cy="100" r="5" fill="#8b6f4e" opacity="0.6"/>
          <circle cx="166" cy="98" r="2" fill="#f5d080" opacity="0.8"/>
          {/* Compass glow */}
          <circle cx="168" cy="100" r="14" fill="none" stroke="#c8a96e" strokeWidth="0.5" opacity="0.4"/>

          {/* Magic sparkles around book */}
          <text x="12" y="145" fill="#f5d080" fontSize="10" opacity="0.7">✦</text>
          <text x="62" y="160" fill="#c8a96e" fontSize="8" opacity="0.6">✦</text>
          <text x="5" y="175" fill="#f5d080" fontSize="6" opacity="0.5">★</text>
        </svg>

        {/* Floating particles around character */}
        <div style={{ position: "absolute", top: 20, right: -10, animation: "orbit 6s linear infinite" }}>
          <span style={{ fontSize: 14, opacity: 0.7 }}>✦</span>
        </div>
        <div style={{ position: "absolute", bottom: 30, left: -15, animation: "orbit 8s linear infinite reverse" }}>
          <span style={{ fontSize: 10, opacity: 0.5, color: "#c8a96e" }}>★</span>
        </div>
      </div>

      {/* Speech bubble */}
      <div style={{
        maxWidth: 380, width: "100%",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(10px)",
        transition: "all 0.3s ease"
      }}>
        <div style={{ background: "rgba(20,12,35,.85)", border: "1px solid rgba(200,169,110,.25)", borderRadius: 20, padding: "24px 28px", marginBottom: 16, backdropFilter: "blur(20px)", boxShadow: "0 8px 32px rgba(0,0,0,.4)" }}>
          <p style={{ fontFamily: "Lora,Georgia,serif", fontSize: 19, fontWeight: 600, color: "#f5f0e8", lineHeight: 1.4, marginBottom: 10 }}>
            {steps[step].bubble}
          </p>
          <p style={{ fontSize: 14, color: "rgba(245,240,232,.55)", lineHeight: 1.75 }}>
            {steps[step].sub}
          </p>
        </div>

        {/* Progress dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 18 }}>
          {steps.map((_, i) => (
            <div key={i} style={{ width: i === step ? 24 : 6, height: 6, borderRadius: 3, background: i === step ? "#c8a96e" : "rgba(255,255,255,.15)", transition: "all .3s" }} />
          ))}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          {step > 0 && (
            <button onClick={prev} style={{ flex: 1, height: 48, borderRadius: 12, border: "1px solid rgba(200,169,110,.2)", background: "none", color: "rgba(245,240,232,.5)", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
              ← Précédent
            </button>
          )}
          {step < steps.length - 1 ? (
            <button onClick={next} style={{ flex: 1, height: 48, borderRadius: 12, background: "linear-gradient(135deg,#8b6f4e,#c8a96e)", border: "none", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", boxShadow: "0 4px 16px rgba(139,111,78,.4)" }}>
              Suivant →
            </button>
          ) : (
            <button onClick={onEnter} style={{ flex: 1, height: 48, borderRadius: 12, background: "linear-gradient(135deg,#f5f0e8,#c8a96e)", border: "none", color: "#1a0f0a", fontSize: 14, fontWeight: 900, cursor: "pointer", boxShadow: "0 4px 20px rgba(200,169,110,.5)" }}>
              Commencer l'aventure ✦
            </button>
          )}
        </div>

        {step < steps.length - 1 && (
          <button onClick={onEnter} style={{ width: "100%", marginTop: 10, height: 38, borderRadius: 10, border: "none", background: "none", color: "rgba(245,240,232,.3)", fontSize: 12, cursor: "pointer" }}>
            Passer l'intro →
          </button>
        )}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          50% { transform: translateY(-18px) rotate(1.5deg); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(20px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(20px) rotate(-360deg); }
        }
      `}</style>
    </div>
  )
}
