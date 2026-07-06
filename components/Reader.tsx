"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

interface Props {
  novel: any
  chap: any
  user: any
  isSub: boolean
  isAdmin: boolean
  onBack: () => void
  showToast: (msg: string) => void
  stripeUrl: string
}

function useScrollProgress() {
  const [p, setP] = useState(0)
  useEffect(() => {
    const fn = () => {
      const el = document.documentElement
      const tot = el.scrollHeight - el.clientHeight
      setP(tot > 0 ? Math.min(100, Math.round(window.scrollY / tot * 100)) : 0)
    }
    window.addEventListener("scroll", fn, { passive: true })
    fn()
    return () => window.removeEventListener("scroll", fn)
  }, [])
  return p
}

export default function Reader({ novel, chap, user, isSub, isAdmin, onBack, showToast, stripeUrl }: Props) {
  const supabase = createClient()
  const prog = useScrollProgress()
  const canRead = chap?.free || isSub || isAdmin
  const [ad, setAd] = useState<any>(null)

  useEffect(() => {
    // Les pubs ne s'affichent qu'aux lecteurs non-abonnés (pas admin, pas abonné)
    if (isSub || isAdmin) return
    supabase.from("ads").select("id, title, image_url, link_url").eq("active", true).then(({ data }) => {
      if (data && data.length > 0) {
        setAd(data[Math.floor(Math.random() * data.length)])
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chap?.id, isSub, isAdmin])
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState<any[]>(chap?.comments || [])
  const [myLikes, setMyLikes] = useState<Set<number>>(new Set())
  const [replyTo, setReplyTo] = useState<number | null>(null)
  const [replyText, setReplyText] = useState("")
  const [options, setOptions] = useState<any[]>(chap?.vote_options || [])
  const [userVoted, setUserVoted] = useState<number | null>(null)
  const [content, setContent] = useState<string | null>(null)
  const total = options.reduce((s: number, o: any) => s + (o.votes || 0), 0)

  useEffect(() => {
    if (!user?.id) return
    const ids = (chap?.comments || []).map((c: any) => c.id)
    if (ids.length === 0) return
    supabase.from("comment_likes").select("comment_id").eq("user_id", user.id).in("comment_id", ids)
      .then(({ data }) => {
        if (data) setMyLikes(new Set(data.map((r: any) => r.comment_id)))
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chap?.id])

  useEffect(() => {
    if (!chap?.id || !canRead) return
    let cancelled = false
    supabase.rpc("get_chapter_content", { p_chapter_id: chap.id }).then(({ data, error }) => {
      if (!cancelled) setContent(error ? "" : ((data as string) || ""))
    })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chap?.id, canRead])

  const [initialPct, setInitialPct] = useState(0)

  useEffect(() => {
    if (!user?.id || !chap?.id) return
    supabase.from("reading_progress").select("scroll_pct").eq("user_id", user.id).eq("chapter_id", chap.id).maybeSingle()
      .then(({ data }) => { if (data?.scroll_pct) setInitialPct(data.scroll_pct) })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chap?.id])

  useEffect(() => {
    if (content === null || initialPct <= 0.02) return
    const t = setTimeout(() => {
      const h = document.documentElement.scrollHeight - window.innerHeight
      if (h > 0) window.scrollTo({ top: h * initialPct })
    }, 150)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content])

  useEffect(() => {
    if (!user?.id || !chap?.id || content === null) return
    let last = -1
    let saveTimer: any = null
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight
      if (h <= 0) return
      const pct = Math.min(1, Math.max(0, window.scrollY / h))
      if (Math.abs(pct - last) < 0.05) return
      last = pct
      clearTimeout(saveTimer)
      saveTimer = setTimeout(() => {
        supabase.from("reading_progress").upsert({ user_id: user.id, chapter_id: chap.id, scroll_pct: pct, updated_at: new Date().toISOString() })
      }, 800)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => { window.removeEventListener("scroll", onScroll); clearTimeout(saveTimer) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, chap?.id])

  if (!chap) return null

  async function handleVote(optionId: number) {
    if (!isSub && !isAdmin) return
    const { error } = await supabase.rpc("cast_vote", { p_option_id: optionId })
    if (error) { showToast("Erreur vote"); return }
    setUserVoted(optionId)
    setOptions((prev: any[]) => prev.map((o: any) => o.id === optionId ? { ...o, votes: o.votes + 1 } : o))
    showToast("✦ Vote enregistré")
  }

  async function handleComment() {
    if (!comment.trim()) return
    const { data, error } = await supabase.from("comments").insert({
      chapter_id: chap.id, user_id: user.id, text: comment.trim()
    }).select().single()
    if (error) { showToast("Erreur commentaire"); return }
    setComments((prev: any[]) => [{ ...data, profile: { name: user.name, avatar: user.avatar, role: user.role } }, ...prev])
    setComment("")
    showToast("Commentaire publié")
  }

  async function handleToggleLike(commentId: number) {
    if (!user) return
    const { data, error } = await supabase.rpc("toggle_comment_like", { p_comment_id: commentId })
    if (error) { showToast("Erreur"); return }
    setMyLikes(prev => {
      const next = new Set(prev)
      if (data.liked) next.add(commentId); else next.delete(commentId)
      return next
    })
    setComments((prev: any[]) => prev.map((c: any) => c.id === commentId ? { ...c, likes: data.likes } : c))
  }

  async function handleReply(parentId: number) {
    if (!replyText.trim()) return
    const { data, error } = await supabase.from("comments").insert({
      chapter_id: chap.id, user_id: user.id, text: replyText.trim(), parent_id: parentId
    }).select().single()
    if (error) { showToast("Erreur réponse"); return }
    setComments((prev: any[]) => [...prev, { ...data, profile: { name: user.name, avatar: user.avatar, role: user.role } }])
    setReplyText("")
    setReplyTo(null)
    showToast("Réponse publiée")
  }

  async function handleDeleteComment(commentId: number) {
    if (!confirm("Supprimer ce commentaire ?")) return
    const { error } = await supabase.from("comments").delete().eq("id", commentId)
    if (error) { showToast("Erreur suppression"); return }
    setComments((prev: any[]) => prev.filter((c: any) => c.id !== commentId && c.parent_id !== commentId))
    showToast("Commentaire supprimé")
  }

  return (
    <div style={{ minHeight: "100vh", background: "#faf7f2", paddingBottom: 80 }}>
      {/* Progress */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 3, background: "rgba(0,0,0,.08)", zIndex: 200 }}>
        <div style={{ height: "100%", background: "#8b6f4e", width: prog + "%", transition: "width .15s" }} />
      </div>

      {/* Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 40, borderBottom: "1px solid #e0d8cc", padding: "10px 16px", display: "flex", alignItems: "center", gap: 12, background: "rgba(250,247,242,.96)", backdropFilter: "blur(20px)" }}>
        <button onClick={onBack} style={{ background: "none", border: "1px solid #d8cfc4", borderRadius: 8, color: "#9a8878", fontSize: 12, fontWeight: 700, padding: "6px 12px", cursor: "pointer" }}>← Retour</button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#b0a090", letterSpacing: 1.5, textTransform: "uppercase", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{novel?.title}</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#6a5a4a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{chap.title}</div>
        </div>
        <span style={{ fontSize: 10, color: "#b0a090", fontWeight: 700 }}>{prog}%</span>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "44px 20px 60px" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#b0a090", letterSpacing: 3, textTransform: "uppercase", marginBottom: 18, display: "flex", alignItems: "center", gap: 10 }}>
          Chapitre {chap.num} <div style={{ flex: 1, height: 1, background: "#e0d8cc" }} />
        </div>
        <h1 style={{ fontFamily: "Lora,Georgia,serif", fontSize: "clamp(26px,5vw,38px)", fontWeight: 600, color: "#1a1a1a", lineHeight: 1.2, marginBottom: 10 }}>{chap.title}</h1>
        <div style={{ fontSize: 11, color: "#b0a090", marginBottom: 44 }}>
          {chap.published_at ? new Date(chap.published_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }) : ""}
        </div>

        {!canRead ? (
          <div style={{ background: "#fff", border: "1px solid #e0d8cc", borderRadius: 16, padding: 40, textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,.06)" }}>
            <div style={{ fontSize: 11, color: "#b0a090", textTransform: "uppercase", letterSpacing: 2, marginBottom: 16 }}>Réservé aux abonnés</div>
            <h2 style={{ fontFamily: "Lora,Georgia,serif", fontSize: 28, fontWeight: 600, color: "#1a1a1a", marginBottom: 8 }}>Continuez l'aventure.</h2>
            <p style={{ color: "#9a8878", fontSize: 14, fontFamily: "Lora,Georgia,serif", lineHeight: 1.8, marginBottom: 28 }}>Lisez, votez, influencez chaque chapitre.</p>
            <div style={{ fontSize: 48, fontWeight: 900, letterSpacing: -3, marginBottom: 4, color: "#1a1a1a" }}>5€</div>
            <div style={{ color: "#b0a090", fontSize: 13, marginBottom: 20 }}>/mois · sans engagement</div>
            <a href={stripeUrl} target="_blank" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 50, background: "#1a1a1a", color: "#fff", borderRadius: 12, fontWeight: 800, textDecoration: "none", fontSize: 14 }}>S'abonner maintenant →</a>
          </div>
        ) : (
          <>
            <div style={{ fontFamily: "Lora,Georgia,serif", fontSize: 18, lineHeight: 1.9, color: "#2a2018" }}>
              {content === null
                ? <p style={{ color: "#9a8878", textAlign: "center", padding: "40px 0" }}>Chargement du chapitre...</p>
                : content.split("\n\n").map((p: string, i: number) => <p key={i} style={{ marginBottom: "1.5em" }}>{p}</p>)}
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, margin: "44px 0", color: "#c8b89a", fontSize: 14, letterSpacing: 8 }}>
              <div style={{ flex: 1, height: 1, background: "#e0d8cc" }} />✦ ✦ ✦<div style={{ flex: 1, height: 1, background: "#e0d8cc" }} />
            </div>

            {/* PUBLICITÉ (non-abonnés uniquement) */}
            {ad && (
              <a href={ad.link_url} target="_blank" rel="noopener sponsored" style={{ display: "block", textDecoration: "none", marginBottom: 40 }}>
                <div style={{ position: "relative", border: "1px solid #e0d8cc", borderRadius: 14, overflow: "hidden", background: "#fff" }}>
                  <div style={{ position: "absolute", top: 8, right: 8, fontSize: 9, fontWeight: 700, color: "#b0a090", background: "rgba(245,240,232,.9)", padding: "2px 8px", borderRadius: 10, letterSpacing: 0.5, textTransform: "uppercase", zIndex: 2 }}>Publicité</div>
                  {ad.image_url && <div style={{ width: "100%", height: 160, background: `#f5f0e8 url(${ad.image_url}) center/cover` }} />}
                  <div style={{ padding: "14px 18px" }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a" }}>{ad.title}</div>
                    <div style={{ fontSize: 12, color: "#8b6f4e", marginTop: 4, fontWeight: 600 }}>En savoir plus →</div>
                  </div>
                </div>
                <div style={{ textAlign: "center", fontSize: 11, color: "#c8b89a", marginTop: 8 }}>Sans publicité avec l&apos;abonnement ✦</div>
              </a>
            )}


            {options.length > 0 && (
              <div style={{ marginTop: 50, borderRadius: 14, overflow: "hidden", border: "1px solid #e0d8cc", boxShadow: "0 2px 8px rgba(0,0,0,.05)" }}>
                <div style={{ padding: "28px 22px 20px", background: "#fff", borderBottom: "1px solid #e0d8cc", textAlign: "center" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#b0a090", letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 10 }}>À vous de choisir</div>
                  <div style={{ fontFamily: "Lora,Georgia,serif", fontSize: 22, fontWeight: 600, color: "#1a1a1a" }}>Que se passe-t-il ensuite ?</div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 12px", borderRadius: 20, background: "rgba(0,0,0,.04)", border: "1px solid rgba(0,0,0,.08)", fontSize: 10, fontWeight: 700, color: "#b0a090", marginTop: 12 }}>
                    {total === 0 && !chap.vote_closed ? "✦ Soyez le premier à voter" : `✦ ${total} vote${total > 1 ? "s" : ""}`}
                  </div>
                </div>
                <div style={{ padding: 16, background: "#faf7f2" }}>
                  {options.map((o: any) => {
                    const pct = total ? Math.round(o.votes / total * 100) : 0
                    const isSel = userVoted === o.id
                    const show = userVoted !== null || chap.vote_closed
                    return (
                      <div key={o.id} onClick={() => !chap.vote_closed && !userVoted && (isSub || isAdmin) && handleVote(o.id)}
                        style={{ border: `1.5px solid ${isSel ? "#8b6f4e" : "#e0d8cc"}`, borderRadius: 10, padding: "14px 16px", marginBottom: 8, cursor: (!chap.vote_closed && !userVoted && (isSub || isAdmin)) ? "pointer" : "default", background: isSel ? "#fdfaf5" : "#fff" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>
                          <span>{o.text}</span>
                          {show && <span style={{ fontWeight: 800, color: isSel ? "#8b6f4e" : "#b0a090" }}>{pct}%</span>}
                        </div>
                        {show && <div style={{ height: 2, background: "#e0d8cc", borderRadius: 2, marginTop: 8, overflow: "hidden" }}>
                          <div style={{ height: "100%", background: "#8b6f4e", width: pct + "%" }} />
                        </div>}
                      </div>
                    )
                  })}
                  {!isSub && !isAdmin && !chap.vote_closed && (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: 18 }}>
                      <span style={{ fontSize: 18, animation: "spin 1.2s linear infinite", display: "inline-block" }}>⌛</span>
                      <span style={{ fontSize: 13, color: "#9a8878" }}><a href={stripeUrl} target="_blank" style={{ color: "#8b6f4e", fontWeight: 700, textDecoration: "none" }}>S'abonner</a> pour voter</span>
                    </div>
                  )}
                  {userVoted && !chap.vote_closed && <div style={{ textAlign: "center", padding: 14, fontSize: 11, fontWeight: 700, color: "#b0a090", textTransform: "uppercase", letterSpacing: 1 }}>✓ Vote enregistré</div>}
                </div>
              </div>
            )}

            {/* COMMENTS */}
            <div style={{ marginTop: 50, paddingTop: 36, borderTop: "1px solid #e0d8cc" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#b0a090", letterSpacing: 2, textTransform: "uppercase", marginBottom: 24 }}>Commentaires ({comments.length})</div>

              {(isSub || isAdmin) ? (
                <div style={{ display: "flex", gap: 12, marginBottom: 24, alignItems: "flex-start" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: "#e0d8cc", color: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{user?.avatar || "?"}</div>
                  <div style={{ flex: 1 }}>
                    <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Votre réaction..." rows={2}
                      style={{ width: "100%", border: "1.5px solid #d8cfc4", borderRadius: 10, padding: "11px 14px", fontFamily: "Lora,Georgia,serif", fontSize: 14, lineHeight: 1.7, outline: "none", marginBottom: 8, resize: "vertical" }} />
                    <button onClick={handleComment} style={{ height: 34, padding: "0 16px", borderRadius: 20, border: "1.5px solid #d8cfc4", background: "none", color: "#9a8878", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Publier</button>
                  </div>
                </div>
              ) : (
                <div style={{ padding: 24, background: "#fff", border: "1px solid #e0d8cc", borderRadius: 12, marginBottom: 20, textAlign: "center" }}>
                  <span style={{ fontSize: 40, display: "block", marginBottom: 12, animation: "spin 1.2s linear infinite" }}>⌛</span>
                  <div style={{ fontSize: 14, color: "#9a8878", marginBottom: 8 }}>Réservé aux abonnés</div>
                  <a href={stripeUrl} target="_blank" style={{ display: "inline-block", background: "#1a1a1a", color: "#fff", fontWeight: 700, textDecoration: "none", padding: "10px 24px", borderRadius: 30, fontSize: 13 }}>S'abonner pour commenter</a>
                </div>
              )}

              {comments.length === 0 && (
                <div style={{ textAlign: "center", padding: "28px 0", color: "#b0a090", fontSize: 13, fontFamily: "Lora,Georgia,serif" }}>
                  ✦ Soyez le premier à partager votre réaction
                </div>
              )}
              {comments.filter((c: any) => !c.parent_id).map((c: any) => {
                const renderComment = (cc: any, isReply: boolean) => {
                  const prof = cc.profile || cc.profiles
                  const liked = myLikes.has(cc.id)
                  const canDelete = isAdmin || cc.user_id === user?.id
                  return (
                    <div key={cc.id} style={{ display: "flex", gap: 12, padding: isReply ? "12px 0 4px" : "16px 0 4px", marginLeft: isReply ? 46 : 0 }}>
                      <div style={{ width: isReply ? 30 : 36, height: isReply ? 30 : 36, borderRadius: 8, background: prof?.role === "admin" ? "#1a1a1a" : "#e0d8cc", color: prof?.role === "admin" ? "#c8a96e" : "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: isReply ? 11 : 13, flexShrink: 0 }}>{prof?.avatar || "?"}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a", marginBottom: 5 }}>
                          {prof?.name || "Lecteur"}
                          {prof?.role === "admin" && <span style={{ marginLeft: 8, padding: "2px 8px", borderRadius: 20, background: "linear-gradient(135deg,#8b6f4e,#c8a96e)", color: "#fff", fontSize: 10, fontWeight: 800, letterSpacing: 0.5 }}>✦ AUTEUR</span>}
                        </div>
                        <div style={{ fontFamily: "Lora,Georgia,serif", fontSize: 14, lineHeight: 1.7, color: "#5a4a3a" }}>{cc.text}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 8, fontSize: 11 }}>
                          <span style={{ color: "#c8b89a" }}>{cc.created_at ? new Date(cc.created_at).toLocaleDateString("fr-FR") : ""}</span>
                          <span onClick={() => handleToggleLike(cc.id)} style={{ cursor: "pointer", fontWeight: 700, color: liked ? "#c0392b" : "#b0a090", userSelect: "none" }}>
                            {liked ? "♥" : "♡"} {cc.likes || 0}
                          </span>
                          {!isReply && (isSub || isAdmin) && (
                            <span onClick={() => { setReplyTo(replyTo === cc.id ? null : cc.id); setReplyText("") }} style={{ cursor: "pointer", fontWeight: 700, color: "#9a8878", userSelect: "none" }}>Répondre</span>
                          )}
                          {canDelete && (
                            <span onClick={() => handleDeleteComment(cc.id)} style={{ cursor: "pointer", fontWeight: 700, color: "#b0a090", userSelect: "none" }}>Supprimer</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                }
                const replies = comments.filter((r: any) => r.parent_id === c.id)
                return (
                  <div key={c.id} style={{ borderBottom: "1px solid #ede8e0", paddingBottom: 12 }}>
                    {renderComment(c, false)}
                    {replies.map((r: any) => renderComment(r, true))}
                    {replyTo === c.id && (
                      <div style={{ display: "flex", gap: 8, marginLeft: 46, marginTop: 8 }}>
                        <textarea value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Votre réponse..." rows={1}
                          style={{ flex: 1, border: "1.5px solid #d8cfc4", borderRadius: 10, padding: "8px 12px", fontFamily: "Lora,Georgia,serif", fontSize: 13, lineHeight: 1.6, outline: "none", resize: "vertical" }} />
                        <button onClick={() => handleReply(c.id)} style={{ height: 34, padding: "0 14px", borderRadius: 20, border: "none", background: "#1a1a1a", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", alignSelf: "flex-end" }}>Publier</button>
                      </div>
                    )}
                  </div>
                )
              })}
              {comments.length === 0 && <div style={{ fontSize: 14, color: "#c8b89a", fontStyle: "italic", fontFamily: "Lora,Georgia,serif" }}>Soyez le premier à commenter.</div>}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
