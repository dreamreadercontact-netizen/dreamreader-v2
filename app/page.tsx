"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function Root() {
  const router = useRouter()
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace("/home")
      } else {
        router.replace("/auth")
      }
    })
  }, [])
  return (
    <div style={{minHeight:"100vh",background:"#f5f0e8",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <p style={{fontFamily:"Lora,Georgia,serif",color:"#9a8878",fontSize:18}}>Chargement...</p>
    </div>
  )
}
