"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"

const ICONS: Record<string, string> = {
  reply: "💬",
  like: "❤️",
  new_chapter: "📖",
  new_candidature: "✍️",
  new_ad_request: "📣",
  new_comment: "💬",
}

export default function NotificationBell({ userId, onOpenChapter }: { userId: string; onOpenChapter?: (chapterId: number) => void }) {
  const supabase = createClient()
  const [notifs, setNotifs] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  const unread = notifs.filter(n => !n.read).length

  async function load() {
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(30)
    if (data) setNotifs(data)
    setLoaded(true)
  }

  useEffect(() => {
    if (!userId) return
    load()
    // Rafraîchit toutes les 60s tant que l'app est ouverte
    const interval = setInterval(load, 60000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  // Ferme au clic extérieur
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [open])

  async function toggleOpen() {
    const next = !open
    setOpen(next)
    if (next && unread > 0) {
      // Marque comme lu
      await supabase.rpc("mark_notifications_read")
      setNotifs(prev => prev.map(n => ({ ...n, read: true })))
    }
  }

  function handleClick(n: any) {
    if (n.type === "new_chapter" && n.link && onOpenChapter) {
      const cid = parseInt(n.link)
      if (!isNaN(cid)) { onOpenChapter(cid); setOpen(false) }
    }
  }

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const m = Math.floor(diff / 60000)
    if (m < 1) return "à l'instant"
    if (m < 60) return `il y a ${m} min`
    const h = Math.floor(m / 60)
    if (h < 24) return `il y a ${h} h`
    const d = Math.floor(h / 24)
    return `il y a ${d} j`
  }

  return (
    <div ref={panelRef} style={{ position: "relative" }}>
      <button
        onClick={toggleOpen}
        aria-label="Notifications"
        style={{ position: "relative", width: 36, height: 36, borderRadius: "50%", border: "1.5px solid #d8cfc4", background: open ? "#1a1a1a" : "none", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
      >
        <span style={{ filter: open ? "grayscale(1) brightness(3)" : "none" }}>🔔</span>
        {unread > 0 && (
          <span style={{ position: "absolute", top: -4, right: -4, minWidth: 18, height: 18, padding: "0 4px", borderRadius: 10, background: "#c0392b", color: "#fff", fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box" }}>
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div style={{ position: "absolute", top: 46, right: 0, width: 320, maxWidth: "calc(100vw - 32px)", maxHeight: 420, overflow: "auto", background: "#fff", border: "1px solid #e0d8cc", borderRadius: 14, boxShadow: "0 12px 40px rgba(0,0,0,.15)", zIndex: 100 }}>
          <div style={{ padding: "14px 16px", borderBottom: "1px solid #ede8e0", fontSize: 13, fontWeight: 800, color: "#1a1a1a", position: "sticky", top: 0, background: "#fff" }}>
            Notifications
          </div>
          {!loaded && <div style={{ padding: 24, textAlign: "center", color: "#c8b89a", fontSize: 13 }}>Chargement...</div>}
          {loaded && notifs.length === 0 && (
            <div style={{ padding: "32px 20px", textAlign: "center", color: "#c8b89a", fontFamily: "Lora,Georgia,serif", fontStyle: "italic", fontSize: 14 }}>
              ✦ Aucune notification
            </div>
          )}
          {notifs.map(n => (
            <div
              key={n.id}
              onClick={() => handleClick(n)}
              style={{ display: "flex", gap: 12, padding: "12px 16px", borderBottom: "1px solid #f2ece0", cursor: n.type === "new_chapter" ? "pointer" : "default", background: n.read ? "#fff" : "#faf5ec" }}
            >
              <div style={{ fontSize: 18, flexShrink: 0, lineHeight: 1.4 }}>{ICONS[n.type] || "🔔"}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.4 }}>{n.title}</div>
                {n.body && <div style={{ fontSize: 12, color: "#9a8878", marginTop: 2, lineHeight: 1.4 }}>{n.body}</div>}
                <div style={{ fontSize: 11, color: "#c8b89a", marginTop: 4 }}>{timeAgo(n.created_at)}</div>
              </div>
              {!n.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#c0392b", flexShrink: 0, marginTop: 6 }} />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
