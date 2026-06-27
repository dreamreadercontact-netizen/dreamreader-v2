"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import HomeClient from "@/components/HomeClient"

export default function Home() {
  const router = useRouter()
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    const supabase = createClient()
    
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.replace("/auth"); return }

      const [{ data: profile }, { data: novels }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", session.user.id).single(),
        supabase.from("novels").select("*, chapters(id, num, title, free, published_at, vote_open, vote_closed)").order("created_at")
      ])

      setData({
        user: profile || { id: session.user.id, name: session.user.email?.split("@")[0] || "Lecteur", role: "reader", subscribed: false, avatar: "L", created_at: new Date().toISOString() },
        novels: novels || []
      })
    }
    load()
  }, [])

  if (!data) return (
    <div style={{minHeight:"100vh",background:"#f5f0e8",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <p style={{fontFamily:"Lora,Georgia,serif",color:"#9a8878",fontSize:18}}>Chargement...</p>
    </div>
  )

  return <HomeClient user={data.user} novels={data.novels} />
}
