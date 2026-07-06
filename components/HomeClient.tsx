"use client"

import { useState, useEffect } from "react"
import OnboardingTip from "./OnboardingTip"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Novel, Profile } from "@/lib/types"
import LibraryView from "./LibraryView"
import AdminView from "./AdminView"
import Reader from "./Reader"
import NovelDetail from "./NovelDetail"
import SubscribeView from "./SubscribeView"
import NotificationBell from "./NotificationBell"

type Tab = "home" | "library" | "books" | "admin" | "sub" | "profile"

interface Props {
  user: Profile
  novels: Novel[]
}

export default function HomeClient({ user: initialUser, novels: initialNovels }: Props) {
  const router = useRouter()
  const supabase = createClient()

  const [tab, setTab] = useState<Tab>("home")
  const [novels, setNovels] = useState<Novel[]>(initialNovels)
  const [user] = useState<Profile>(initialUser)
  const [selNovel, setSelNovel] = useState<Novel | null>(null)
  const [selChapId, setSelChapId] = useState<number | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState(false)
  const [zoomImage, setZoomImage] = useState<string|null>(null)
  const [resume, setResume] = useState<any>(null)

  useEffect(() => {
    if (!user?.id) return
    supabase.from("reading_progress").select("chapter_id, scroll_pct, updated_at").eq("user_id", user.id).order("updated_at", { ascending: false }).limit(1)
      .then(({ data }) => {
        const row = data?.[0]
        if (!row) return
        for (const n of novels) {
          const c = (n.chapters || []).find((ch: any) => ch.id === row.chapter_id)
          if (c) { setResume({ novel: n, chap: c, pct: row.scroll_pct }); break }
        }
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isAdmin = user?.role === "admin"
  const TRIAL_DAYS = 3
  const trialEnd = user?.created_at ? new Date(user.created_at).getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000 : 0
  const isTrial = !user?.subscribed && !isAdmin && Date.now() < trialEnd
  const trialDaysLeft = isTrial ? Math.max(1, Math.ceil((trialEnd - Date.now()) / (24 * 60 * 60 * 1000))) : 0
  const isSub = previewMode ? false : (user?.subscribed || isTrial || isAdmin)
  const STRIPE = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK || ""

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 2400)
  }

  async function logout() {
    await supabase.auth.signOut()
    router.push("/auth")
    router.refresh()
  }

  function goTo(t: Tab) {
    setSelNovel(null)
    setSelChapId(null)
    setTab(t)
  }

  async function deleteNovel(id: number) {
    if (!confirm("Supprimer ce roman ?")) return
    await supabase.from("novels").delete().eq("id", id)
    setNovels(prev => prev.filter(n => n.id !== id))
    showToast("Roman supprimé")
  }

  const selChap = selNovel?.chapters?.find((c: any) => c.id === selChapId) || null

  if (selChap && selNovel) {
    return (
      <Reader
        novel={selNovel}
        chap={selChap}
        user={user}
        isSub={isSub}
        isAdmin={isAdmin}
        onBack={() => setSelChapId(null)}
        showToast={showToast}
        stripeUrl={STRIPE}
      />
    )
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f0e8" }}>
      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 40, background: "rgba(245,240,232,.96)", borderBottom: "1px solid #e0d8cc", height: 56, display: "flex", alignItems: "center", padding: "0 16px", gap: 10, backdropFilter: "blur(20px)" }}>
        <div style={{ fontSize: 17, fontWeight: 900, marginRight: "auto", cursor: "pointer", letterSpacing: -0.5, color: "#1a1a1a" }} onClick={() => goTo("home")}>
          ✦ DreamReader
        </div>
        {isAdmin && (
          <button onClick={() => setPreviewMode(p => !p)}
            style={{ height: 32, padding: "0 12px", borderRadius: 20, border: "1.5px solid #d8cfc4", background: previewMode ? "#1a1a1a" : "none", color: previewMode ? "#fff" : "#9a8878", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
            {previewMode ? "✕ Quitter vue" : "👤 Vue abonné"}
          </button>
        )}
        {user?.subscribed && !isAdmin && <span style={{ fontSize: 11, color: "#8b6f4e", fontWeight: 700 }}>★ ABONNÉ</span>}
        {isTrial && !previewMode && <span style={{ fontSize: 11, color: "#8b6f4e", fontWeight: 700 }}>✦ ESSAI · {trialDaysLeft}{trialDaysLeft > 1 ? " jours" : " jour"}</span>}
        {!isSub && !isAdmin && (
          <a href={STRIPE} target="_blank" style={{ height: 34, padding: "0 14px", borderRadius: 30, background: "#1a1a1a", color: "#fff", fontWeight: 700, textDecoration: "none", fontSize: 12, display: "flex", alignItems: "center" }}>
            S'abonner
          </a>
        )}
        {user?.id && !user?.is_anonymous && (
          <NotificationBell
            userId={user.id}
            onOpenChapter={(chapterId) => {
              // Cherche le roman contenant ce chapitre et l'ouvre
              for (const n of novels) {
                const c = n.chapters?.find((ch: any) => ch.id === chapterId)
                if (c) { setSelNovel(n); setSelChapId(chapterId); goTo("home"); return }
              }
            }}
          />
        )}
        <button onClick={logout} style={{ height: 34, padding: "0 14px", borderRadius: 30, border: "1.5px solid #d8cfc4", background: "none", fontSize: 12, fontWeight: 700, cursor: "pointer", color: "#1a1a1a" }}>Quitter</button>
      </nav>

      {/* CONTENT */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "20px 16px 100px" }}>

        {/* HOME */}
        {tab === "home" && (
          <div>
            <div style={{ padding: "40px 0 20px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#b0a090", letterSpacing: 3, textTransform: "uppercase", marginBottom: 14 }}>La plateforme de romans interactifs</div>
              <h1 style={{ fontFamily: "Lora,Georgia,serif", fontSize: "clamp(36px,6vw,44px)", fontWeight: 600, letterSpacing: -2, lineHeight: 1.05, marginBottom: 14, color: "#1a1a1a" }}>
                L'histoire<br/>que vous<br/>écrivez.
              </h1>
              <p style={{ fontSize: 14, color: "#9a8878", marginBottom: 24, maxWidth: 360, lineHeight: 1.7 }}>
                Lisez, votez, influencez. Chaque chapitre se termine par un choix qui façonne la suite.
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button onClick={() => setTab("library")} style={{ height: 46, padding: "0 26px", borderRadius: 12, background: "#1a1a1a", color: "#fff", fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer" }}>
                  Découvrir les romans
                </button>
                {!isSub && (
                  <a href={STRIPE} target="_blank" style={{ height: 46, padding: "0 26px", borderRadius: 12, border: "1.5px solid #c8b89a", color: "#1a1a1a", fontWeight: 700, fontSize: 14, textDecoration: "none", display: "flex", alignItems: "center" }}>
                    S'abonner · 5€/mois
                  </a>
                )}
              </div>
            </div>
            {resume && (
              <div onClick={() => { setSelNovel(resume.novel); setSelChapId(resume.chap.id) }}
                style={{ background: "#1a1a1a", borderRadius: 14, padding: "16px 18px", marginBottom: 14, display: "flex", alignItems: "center", gap: 14, cursor: "pointer", boxShadow: "0 2px 10px rgba(0,0,0,.15)" }}>
                <div style={{ fontSize: 22 }}>▶</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#c8a96e", letterSpacing: 2, textTransform: "uppercase", marginBottom: 3 }}>Reprendre la lecture</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{resume.chap.title}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,.5)", marginTop: 2 }}>{resume.novel.title} · {Math.round((resume.pct || 0) * 100)} %</div>
                </div>
                <div style={{ color: "rgba(255,255,255,.4)", fontSize: 18 }}>→</div>
              </div>
            )}
            {novels.filter(n => n.status === "live").map(n => (
              <div key={n.id}
                style={{ background: "#fff", border: "1px solid #e0d8cc", borderRadius: 14, padding: 18, marginBottom: 10, display: "flex", gap: 14, alignItems: "center", boxShadow: "0 1px 4px rgba(0,0,0,.05)" }}>
                <div onClick={e => { e.stopPropagation(); if (n.cover && (n.cover.startsWith("data:") || n.cover.startsWith("http"))) setZoomImage(n.cover) }} style={{ cursor: n.cover?.startsWith("data:") || n.cover?.startsWith("http") ? "zoom-in" : "default" }}>
                  <CoverDiv cover={n.cover} />
                </div>
                <div onClick={() => { setSelNovel(n); setTab("library") }} style={{ flex: 1, cursor: "pointer" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "Lora,Georgia,serif", fontSize: 17, fontWeight: 600, marginBottom: 4, lineHeight: 1.3, color: "#1a1a1a" }}>{n.title}</div>
                  <div style={{ fontSize: 11, color: "#9a8878", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>{n.genre}</div>
                  <div style={{ fontSize: 13, color: "#9a8878", lineHeight: 1.5 }}>{n.description}</div>
                  <div style={{ marginTop: 10 }}>
                    <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: "rgba(0,0,0,.07)", color: "#1a1a1a", border: "1px solid rgba(0,0,0,.12)" }}>En cours</span>
                  </div>
                </div>
                </div>
              </div>
            ))}

            {/* Image zoom modal */}
            {zoomImage && (
              <div onClick={() => setZoomImage(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.9)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, cursor: "zoom-out" }}>
                <img src={zoomImage} alt="Couverture" style={{ maxWidth: "100%", maxHeight: "90vh", borderRadius: 12, boxShadow: "0 8px 40px rgba(0,0,0,.5)" }} />
                <button onClick={() => setZoomImage(null)} style={{ position: "absolute", top: 20, right: 20, width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,.15)", color: "#fff", border: "none", fontSize: 18, cursor: "pointer" }}>✕</button>
              </div>
            )}
            {novels.length === 0 && (
              <div style={{ textAlign: "center", color: "#c8b89a", padding: "60px 0", fontFamily: "Lora,Georgia,serif", fontStyle: "italic" }}>
                Les romans arrivent bientôt...
              </div>
            )}
          </div>
        )}

        {/* LIBRARY */}
        {tab === "library" && !selNovel && (
          <LibraryView novels={novels} isAdmin={isAdmin} onSelect={setSelNovel} onDelete={deleteNovel} />
        )}

        {/* NOVEL DETAIL */}
        {tab === "library" && selNovel && (
          <NovelDetail novel={selNovel} isSub={isSub} isAdmin={isAdmin} onBack={() => setSelNovel(null)} onReadChapter={(chapId) => setSelChapId(chapId)} />
        )}

        {/* ABONNEMENT */}
        {tab === "sub" && <SubscribeView stripeUrl={STRIPE} trialDaysLeft={trialDaysLeft} />}

        {/* PROFIL */}
        {tab === "profile" && (
          <div>
            <div style={{ background: "#fff", border: "1px solid #e0d8cc", borderRadius: 14, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,.05)" }}>
              <div style={{ width: 48, height: 48, borderRadius: 10, background: "#e0d8cc", color: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, marginBottom: 12 }}>
                {user?.avatar || "?"}
              </div>
              <div style={{ fontFamily: "Lora,Georgia,serif", fontSize: 22, fontWeight: 600, marginBottom: 4, color: "#1a1a1a" }}>{user?.name}</div>
              <div style={{ fontSize: 13, color: "#9a8878", marginBottom: 12 }}>{user?.role === "admin" ? "Auteur" : "Lecteur"}</div>
              {isSub && !isAdmin && (
                <div style={{ display: "inline-block", padding: "4px 12px", borderRadius: 20, background: "#1a1a1a", color: "#fff", fontSize: 12, fontWeight: 700, marginBottom: 12 }}>★ ABONNÉ</div>
              )}
              {!isSub && !isAdmin && (
                <a href={STRIPE} target="_blank" style={{ display: "inline-block", padding: "10px 24px", borderRadius: 30, background: "#1a1a1a", color: "#fff", fontWeight: 700, textDecoration: "none", fontSize: 13, marginBottom: 12 }}>
                  S'abonner · 5€/mois
                </a>
              )}
              <br />
              <button onClick={logout} style={{ padding: "8px 20px", borderRadius: 12, border: "1.5px solid #d8cfc4", background: "none", fontSize: 13, fontWeight: 700, cursor: "pointer", color: "#1a1a1a" }}>Se déconnecter</button>
            </div>
          </div>
        )}

        {/* ADMIN */}
        {isAdmin && tab === "admin" && (
          <AdminView novels={novels} setNovels={setNovels} showToast={showToast} />
        )}
      </div>

      {/* BOTTOM NAV */}
      <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(245,240,232,.97)", borderTop: "1px solid #e0d8cc", display: "flex", height: 62, zIndex: 40, backdropFilter: "blur(20px)" }}>
        {[
          { id: "home", icon: "⌂", label: "Accueil" },
          { id: "library", icon: "◻", label: "Romans" },
          { id: "books", icon: "◈", label: "Livres" },
          ...(isAdmin ? [{ id: "admin", icon: "⚙", label: "Admin" }] : [{ id: "sub", icon: "★", label: "Abonnement" }]),
          { id: "profile", icon: "◉", label: "Profil" },
        ].map(item => (
          <button key={item.id}
            onClick={() => goTo(item.id as Tab)}
            style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, fontSize: 9, color: tab === item.id ? "#1a1a1a" : "#b0a090", cursor: "pointer", border: "none", background: "none", fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", fontFamily: "Inter,sans-serif" }}>
            <span style={{ fontSize: 20, lineHeight: 1 }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <OnboardingTip section={tab} />

      {toast && (
        <div style={{ position: "fixed", bottom: 72, left: "50%", transform: "translateX(-50%)", background: "#1a1a1a", color: "#fff", padding: "10px 20px", borderRadius: 30, fontSize: 13, fontWeight: 700, zIndex: 999, whiteSpace: "nowrap" }}>
          {toast}
        </div>
      )}
    </div>
  )
}

function CoverDiv({ cover, w = 56, h = 76 }: { cover: string; w?: number; h?: number }) {
  const isImg = cover && (cover.startsWith("data:") || cover.startsWith("http"))
  return (
    <div style={{
      width: w, height: h, borderRadius: 8, flexShrink: 0,
      border: "1px solid #e0d8cc",
      background: isImg ? "#fff" : cover,
      backgroundImage: isImg ? `url(${cover})` : "none",
      backgroundSize: "cover", backgroundPosition: "center top",
    }} />
  )
}
