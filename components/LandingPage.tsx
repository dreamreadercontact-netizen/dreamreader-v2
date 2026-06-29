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
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #0a0f1a 0%, #0d1a2e 50%, #0a0f1a 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px", position: "relative", overflow: "hidden" }}>

      {/* Stars background */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        {[...Array(100)].map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            width: (i % 4 === 0 ? 3 : 1.5) + "px",
            height: (i % 4 === 0 ? 3 : 1.5) + "px",
            background: i % 6 === 0 ? "#f5d080" : "#ffffff",
            borderRadius: "50%",
            left: ((i * 137.5) % 100) + "%",
            top: ((i * 97.3) % 100) + "%",
            opacity: 0.3 + (i % 5) * 0.12,
            animation: `twinkle ${2 + (i % 4)}s ease-in-out infinite`,
            animationDelay: (i % 6) * 0.5 + "s"
          }} />
        ))}
      </div>

      {/* MAIN FRAME - Art Nouveau Steampunk */}
      <div style={{ position: "relative", width: "100%", maxWidth: 380 }}>
        <svg width="100%" viewBox="0 0 380 480" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Outer frame background */}
          <rect x="10" y="10" width="360" height="460" rx="12" fill="#0d1a2e" stroke="#c8a030" strokeWidth="1.5" opacity="0.8"/>
          
          {/* Inner starfield panel */}
          <rect x="40" y="80" width="300" height="260" rx="4" fill="#060e1a"/>
          <rect x="40" y="80" width="300" height="260" rx="4" fill="url(#starGrad)" opacity="0.8"/>
          
          {/* Gradient definitions */}
          <defs>
            <radialGradient id="starGrad" cx="50%" cy="60%" r="60%">
              <stop offset="0%" stopColor="#1a3a6a" stopOpacity="0.8"/>
              <stop offset="60%" stopColor="#0a1a3a" stopOpacity="0.9"/>
              <stop offset="100%" stopColor="#060e1a" stopOpacity="1"/>
            </radialGradient>
            <radialGradient id="glowOrb" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#40ff80" stopOpacity="1"/>
              <stop offset="40%" stopColor="#20c050" stopOpacity="0.8"/>
              <stop offset="100%" stopColor="#008030" stopOpacity="0"/>
            </radialGradient>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f5d080"/>
              <stop offset="50%" stopColor="#c8a030"/>
              <stop offset="100%" stopColor="#a07820"/>
            </linearGradient>
            <linearGradient id="colGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b6010"/>
              <stop offset="30%" stopColor="#d4a030"/>
              <stop offset="70%" stopColor="#c8a030"/>
              <stop offset="100%" stopColor="#7a5010"/>
            </linearGradient>
          </defs>

          {/* ── LEFT COLUMN ── */}
          <rect x="18" y="80" width="26" height="260" rx="4" fill="url(#colGrad)"/>
          <rect x="20" y="82" width="22" height="256" rx="3" fill="#c8a030" opacity="0.2"/>
          {/* Column detail lines */}
          {[100,120,140,160,180,200,220,240,260,280,300].map((y,i) => (
            <rect key={i} x="18" y={y} width="26" height="4" rx="1" fill="#f5d080" opacity="0.5"/>
          ))}
          {/* Column capital top */}
          <rect x="12" y="76" width="38" height="10" rx="3" fill="url(#goldGrad)"/>
          <rect x="16" y="74" width="30" height="6" rx="2" fill="#f5d080" opacity="0.6"/>
          {/* Column base */}
          <rect x="12" y="334" width="38" height="10" rx="3" fill="url(#goldGrad)"/>

          {/* ── RIGHT COLUMN ── */}
          <rect x="336" y="80" width="26" height="260" rx="4" fill="url(#colGrad)"/>
          <rect x="338" y="82" width="22" height="256" rx="3" fill="#c8a030" opacity="0.2"/>
          {[100,120,140,160,180,200,220,240,260,280,300].map((y,i) => (
            <rect key={i} x="336" y={y} width="26" height="4" rx="1" fill="#f5d080" opacity="0.5"/>
          ))}
          <rect x="330" y="76" width="38" height="10" rx="3" fill="url(#goldGrad)"/>
          <rect x="334" y="74" width="30" height="6" rx="2" fill="#f5d080" opacity="0.6"/>
          <rect x="330" y="334" width="38" height="10" rx="3" fill="url(#goldGrad)"/>

          {/* ── TOP GEAR LEFT ── */}
          <g transform="translate(75, 45)">
            <circle cx="0" cy="0" r="34" fill="#1a1228" stroke="#c8a030" strokeWidth="2"/>
            <circle cx="0" cy="0" r="26" fill="none" stroke="#c8a030" strokeWidth="1.5"/>
            <circle cx="0" cy="0" r="8" fill="#c8a030"/>
            {[0,45,90,135,180,225,270,315].map((a,i) => (
              <rect key={i} x="-5" y="-38" width="10" height="10" rx="2" fill="#c8a030" transform={`rotate(${a})`}/>
            ))}
            {[0,30,60,90,120,150,180,210,240,270,300,330].map((a,i) => (
              <line key={i} x1="0" y1="0" x2={26*Math.cos(a*Math.PI/180)} y2={26*Math.sin(a*Math.PI/180)} stroke="#c8a030" strokeWidth="1" opacity="0.4"/>
            ))}
          </g>

          {/* ── TOP GEAR RIGHT ── */}
          <g transform="translate(305, 45)">
            <circle cx="0" cy="0" r="34" fill="#1a1228" stroke="#c8a030" strokeWidth="2"/>
            <circle cx="0" cy="0" r="26" fill="none" stroke="#c8a030" strokeWidth="1.5"/>
            <circle cx="0" cy="0" r="8" fill="#c8a030"/>
            {[22.5,67.5,112.5,157.5,202.5,247.5,292.5,337.5].map((a,i) => (
              <rect key={i} x="-5" y="-38" width="10" height="10" rx="2" fill="#c8a030" transform={`rotate(${a})`}/>
            ))}
          </g>

          {/* ── TOP ARCH / BANNER ── */}
          <path d="M108 30 Q190 10 272 30 Q260 55 190 58 Q120 55 108 30Z" fill="#8b6010" stroke="#c8a030" strokeWidth="1.5"/>
          <path d="M115 32 Q190 14 265 32 Q253 52 190 55 Q127 52 115 32Z" fill="#c8a030" opacity="0.3"/>
          <text x="190" y="42" textAnchor="middle" fill="#f5d080" fontSize="11" fontFamily="Georgia,serif" fontWeight="bold" letterSpacing="3">✦ DREAMREADER ✦</text>

          {/* Stars in panel */}
          {[[80,110],[120,90],[200,95],[280,105],[300,130],[60,180],[320,200],[70,250],[310,240],[150,340],[230,330]].map(([x,y],i) => (
            <circle key={i} cx={x} cy={y} r={i%3===0?2:1} fill="#fff" opacity={0.4+i%3*0.2}/>
          ))}

          {/* Green glowing orb at bottom of panel */}
          <circle cx="190" cy="330" r="18" fill="url(#glowOrb)" opacity="0.9"/>
          <circle cx="190" cy="330" r="24" fill="none" stroke="#40ff80" strokeWidth="1" opacity="0.3"/>
          <circle cx="190" cy="330" r="32" fill="none" stroke="#40ff80" strokeWidth="0.5" opacity="0.15"/>

          {/* ── ASTRONAUT in center ── */}
          <g transform="translate(190, 200) scale(0.85)">
            {/* Body suit */}
            <ellipse cx="0" cy="40" rx="38" ry="46" fill="#e8e0d4" stroke="#c8b89a" strokeWidth="2"/>
            {/* Helmet */}
            <circle cx="0" cy="-14" r="36" fill="#d4cfc8" stroke="#b0a090" strokeWidth="2"/>
            {/* Visor */}
            <ellipse cx="0" cy="-14" rx="24" ry="24" fill="#1a2a4a" opacity="0.95"/>
            <ellipse cx="-8" cy="-20" rx="7" ry="5" fill="#fff" opacity="0.12"/>
            {/* Eyes */}
            <circle cx="-8" cy="-14" r="4" fill="#fff" opacity="0.9"/>
            <circle cx="8" cy="-14" r="4" fill="#fff" opacity="0.9"/>
            <circle cx="-7" cy="-13" r="2" fill="#1a1a1a"/>
            <circle cx="9" cy="-13" r="2" fill="#1a1a1a"/>
            <circle cx="-6" cy="-14" r="1" fill="#fff"/>
            <circle cx="10" cy="-14" r="1" fill="#fff"/>
            <path d="M-8 -6 Q0 -2 8 -6" stroke="#fff" strokeWidth="1.5" fill="none" opacity="0.7" strokeLinecap="round"/>
            {/* Arms */}
            <ellipse cx="-44" cy="30" rx="13" ry="26" fill="#e8e0d4" stroke="#c8b89a" strokeWidth="2" transform="rotate(-15 -44 30)"/>
            <ellipse cx="44" cy="30" rx="13" ry="26" fill="#e8e0d4" stroke="#c8b89a" strokeWidth="2" transform="rotate(15 44 30)"/>
            {/* Book */}
            <rect x="-56" y="42" width="32" height="24" rx="3" fill="#8b6f4e"/>
            <rect x="-54" y="44" width="14" height="20" rx="2" fill="#c8a96e"/>
            <rect x="-38" y="44" width="12" height="20" rx="2" fill="#a07850"/>
            <line x1="-40" y1="44" x2="-40" y2="64" stroke="#6a5030" strokeWidth="1"/>
            <text x="-47" y="54" textAnchor="middle" fill="#8b6f4e" fontSize="4" fontFamily="Georgia,serif" opacity="0.8">DR</text>
            {/* Legs */}
            <ellipse cx="-14" cy="84" rx="13" ry="18" fill="#e8e0d4" stroke="#c8b89a" strokeWidth="2"/>
            <ellipse cx="14" cy="84" rx="13" ry="18" fill="#e8e0d4" stroke="#c8b89a" strokeWidth="2"/>
            {/* Boots */}
            <ellipse cx="-14" cy="100" rx="15" ry="7" fill="#b0a090"/>
            <ellipse cx="14" cy="100" rx="15" ry="7" fill="#b0a090"/>
            {/* Chest */}
            <rect x="-14" y="18" width="28" height="16" rx="4" fill="#c8b89a" opacity="0.6"/>
            <text x="0" y="29" textAnchor="middle" fill="#1a1a1a" fontSize="6" fontWeight="bold" fontFamily="sans-serif">DR</text>
            {/* Antenna */}
            <line x1="0" y1="-50" x2="0" y2="-62" stroke="#b0a090" strokeWidth="2"/>
            <circle cx="0" cy="-64" r="4" fill="#c8a96e"/>
          </g>

          {/* ── BOTTOM BANNER ── */}
          <path d="M80 380 Q190 365 300 380 Q300 410 190 415 Q80 410 80 380Z" fill="#8b6010" stroke="#c8a030" strokeWidth="1.5"/>
          <path d="M88 382 Q190 368 292 382 Q290 406 190 410 Q90 406 88 382Z" fill="#c8a030" opacity="0.25"/>
          <text x="190" y="393" textAnchor="middle" fill="#f5d080" fontSize="14" fontFamily="Georgia,serif" fontWeight="bold" letterSpacing="2">DreamReader</text>
          <text x="190" y="408" textAnchor="middle" fill="#c8a96e" fontSize="8" fontFamily="Georgia,serif" letterSpacing="3">L'HISTOIRE QUE VOUS ÉCRIVEZ</text>

          {/* Frame corners ornaments */}
          <circle cx="10" cy="10" r="8" fill="#c8a030" opacity="0.6"/>
          <circle cx="370" cy="10" r="8" fill="#c8a030" opacity="0.6"/>
          <circle cx="10" cy="470" r="8" fill="#c8a030" opacity="0.6"/>
          <circle cx="370" cy="470" r="8" fill="#c8a030" opacity="0.6"/>

          {/* Side ornaments */}
          <path d="M10 200 Q0 210 10 220" stroke="#c8a030" strokeWidth="2" fill="none"/>
          <path d="M370 200 Q380 210 370 220" stroke="#c8a030" strokeWidth="2" fill="none"/>
        </svg>

        {/* Floating astronaut animation overlay */}
        <div style={{ position: "absolute", top: "12%", left: "50%", transform: "translateX(-50%)", animation: "float 5s ease-in-out infinite", pointerEvents: "none", width: 1, height: 1 }} />
      </div>

      {/* Speech bubble */}
      <div style={{
        maxWidth: 380, width: "100%", marginTop: 16,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(10px)",
        transition: "all 0.3s ease"
      }}>
        <div style={{ background: "rgba(10,15,26,.9)", border: "1px solid rgba(200,160,48,.3)", borderRadius: 16, padding: "20px 24px", marginBottom: 14, backdropFilter: "blur(20px)", boxShadow: "0 8px 32px rgba(0,0,0,.5)" }}>
          <p style={{ fontFamily: "Lora,Georgia,serif", fontSize: 18, fontWeight: 600, color: "#f5f0e8", lineHeight: 1.4, marginBottom: 8 }}>
            {steps[step].bubble}
          </p>
          <p style={{ fontSize: 13, color: "rgba(245,240,232,.5)", lineHeight: 1.75 }}>
            {steps[step].sub}
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 14 }}>
          {steps.map((_, i) => (
            <div key={i} style={{ width: i === step ? 22 : 6, height: 6, borderRadius: 3, background: i === step ? "#c8a030" : "rgba(200,160,48,.2)", transition: "all .3s" }} />
          ))}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          {step > 0 && (
            <button onClick={prev} style={{ flex: 1, height: 46, borderRadius: 12, border: "1px solid rgba(200,160,48,.2)", background: "none", color: "rgba(245,240,232,.4)", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
              ← Précédent
            </button>
          )}
          {step < steps.length - 1 ? (
            <button onClick={next} style={{ flex: 1, height: 46, borderRadius: 12, background: "linear-gradient(135deg,#8b6010,#c8a030)", border: "none", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", boxShadow: "0 4px 16px rgba(200,160,48,.3)" }}>
              Suivant →
            </button>
          ) : (
            <button onClick={onEnter} style={{ flex: 1, height: 46, borderRadius: 12, background: "linear-gradient(135deg,#c8a030,#f5d080)", border: "none", color: "#1a0f0a", fontSize: 14, fontWeight: 900, cursor: "pointer", boxShadow: "0 4px 20px rgba(200,160,48,.4)" }}>
              Commencer l'aventure ✦
            </button>
          )}
        </div>

        {step < steps.length - 1 && (
          <button onClick={onEnter} style={{ width: "100%", marginTop: 8, height: 36, borderRadius: 10, border: "none", background: "none", color: "rgba(245,240,232,.25)", fontSize: 12, cursor: "pointer" }}>
            Passer l'intro →
          </button>
        )}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateX(-50%) translateY(0px); }
          50% { transform: translateX(-50%) translateY(-12px); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.9; }
        }
      `}</style>
    </div>
  )
}
