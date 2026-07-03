'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
  const supabase = createClient()
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { if (data.session) setReady(true) })
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') setReady(true)
    })
    return () => sub.subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleSave() {
    setError('')
    if (password.length < 6) { setError('Le mot de passe doit contenir au moins 6 caractères.'); return }
    if (password !== confirm) { setError('Les deux mots de passe ne correspondent pas.'); return }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) { setError(error.message); return }
    setDone(true)
    setTimeout(() => { router.push('/'); router.refresh() }, 2000)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f0e8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 400, background: '#fff', border: '1px solid #e0d8cc', borderRadius: 16, padding: 28 }}>
        <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: -0.5, marginBottom: 4, color: '#1a1a1a' }}>✦ DreamReader</div>
        <h1 style={{ fontSize: 24, fontWeight: 900, letterSpacing: -1, margin: '14px 0 18px', color: '#1a1a1a' }}>Nouveau mot de passe</h1>

        {!ready && !done && (
          <p style={{ fontSize: 13, color: '#9a8878', lineHeight: 1.7 }}>
            Vérification du lien en cours... Si rien ne se passe, le lien a peut-être expiré :
            retournez sur la page de connexion et cliquez à nouveau sur « Mot de passe oublié ? ».
          </p>
        )}

        {ready && !done && (
          <>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#9a8878', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Nouveau mot de passe</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                style={{ width: '100%', height: 46, border: '1.5px solid #d8cfc4', borderRadius: 10, padding: '0 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#9a8878', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Confirmez le mot de passe</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••"
                style={{ width: '100%', height: 46, border: '1.5px solid #d8cfc4', borderRadius: 10, padding: '0 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            {error && <div style={{ background: 'rgba(220,60,60,.08)', border: '1px solid rgba(220,60,60,.2)', borderRadius: 10, padding: 12, fontSize: 13, color: '#c0392b', marginBottom: 14 }}>{error}</div>}
            <button onClick={handleSave} disabled={loading}
              style={{ width: '100%', height: 48, borderRadius: 12, background: '#1a1a1a', color: '#fff', fontWeight: 800, fontSize: 14, border: 'none', cursor: 'pointer' }}>
              {loading ? '...' : 'Enregistrer le nouveau mot de passe'}
            </button>
          </>
        )}

        {done && (
          <div style={{ background: 'rgba(60,180,90,.08)', border: '1px solid rgba(60,180,90,.25)', borderRadius: 10, padding: 14, fontSize: 13, color: '#1e7a3c' }}>
            ✓ Mot de passe mis à jour ! Redirection en cours...
          </div>
        )}
      </div>
    </div>
  )
}
