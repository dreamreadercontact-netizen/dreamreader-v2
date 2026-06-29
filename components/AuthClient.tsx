'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type AuthView = 'landing' | 'login' | 'signup' | 'admin_login' | 'apprenti'

export default function AuthClient() {
  const router = useRouter()
  const supabase = createClient()

  const [view, setView] = useState<AuthView>('landing')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [apprentiSent, setApprontiSent] = useState(false)
  const [apprentiName, setApprontiName] = useState('')
  const [apprentiEmail, setApprontiEmail] = useState('')
  const [showPass, setShowPass] = useState(false)

  async function handleLogin() {
    setError(''); setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password })
    setLoading(false)
    if (error) { setError('Email ou mot de passe incorrect.'); return }
    router.push('/')
    router.refresh()
  }

  async function handleSignup() {
    setError(''); setLoading(true)
    if (!name || !email || !password) { setError('Tous les champs sont requis.'); setLoading(false); return }
    if (password.length < 6) { setError('Mot de passe trop court.'); setLoading(false); return }
    const { error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(), password,
      options: { data: { name } }
    })
    setLoading(false)
    if (error) { setError(error.message); return }
    router.push('/')
    router.refresh()
  }

  async function handleGuest() {
    setLoading(true)
    await supabase.auth.signInAnonymously()
    setLoading(false)
    router.push('/')
    router.refresh()
  }

  async function submitCandidature() {
    if (!apprentiName || !apprentiEmail) return
    await fetch('/api/candidatures', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: apprentiName, email: apprentiEmail })
    })
    setApprontiSent(true)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-beige-100 px-6">
      {view === 'landing' && (
        <div className="w-full max-w-[400px] text-center">
          <div className="text-[11px] font-bold text-beige-400 tracking-[3px] uppercase mb-6">DreamReader</div>
          <h1 className="font-serif text-[48px] font-semibold tracking-[-2px] leading-none mb-2 text-[#1a1a1a]">
            L&apos;histoire<br/>que vous<br/>écrivez.
          </h1>
          <p className="text-beige-500 mb-9 text-[14px]">Romans interactifs · Votez · Influencez</p>
          <div className="flex flex-col gap-[10px]">
            <button className="btn-primary w-full h-[50px] text-[15px] rounded-xl" onClick={() => { setView('signup'); setError('') }}>
              Créer un compte
            </button>
            <button className="btn-outline w-full h-[50px] text-[15px] rounded-xl" onClick={() => { setView('login'); setError('') }}>
              Se connecter
            </button>
            <button className="w-full h-[42px] text-[13px] bg-none border-none text-beige-400 cursor-pointer font-sans" onClick={handleGuest}>
              Continuer en visiteur →
            </button>
          </div>
        </div>
      )}

      {view === 'login' && (
        <div className="w-full max-w-[400px]">
          <h2 className="text-[26px] font-black tracking-[-1px] mb-[22px] text-[#1a1a1a]">Connexion</h2>
          <div className="field">
            <label className="label">Email</label>
            <input className="input" type="email" placeholder="votre@email.com" value={email}
              onChange={e => {
                setEmail(e.target.value)
                if (e.target.value === 'Je suis admin') { setView('admin_login'); setEmail('') }
                if (e.target.value === 'Je suis apprenti admin') { setView('apprenti'); setEmail('') }
              }} />
          </div>
          <div className="field">
            <label className="label">Mot de passe</label>
            <div style={{position:"relative"}}>
              <input className="input" type={showPass?"text":"password"} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} style={{paddingRight:44}} />
              <button onClick={()=>setShowPass(p=>!p)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:16,color:"#9a8878"}}>
                {showPass?"🙈":"👁️"}
              </button>
            </div>
          </div>
          {error && <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-[13px] text-red-600 mb-3">{error}</div>}
          <button className="btn-primary w-full h-[48px] text-[14px] rounded-xl mb-[10px]" onClick={handleLogin} disabled={loading}>
            {loading ? '...' : 'Se connecter'}
          </button>
          <button className="btn-outline w-full h-[42px] text-[13px] rounded-xl" onClick={() => { setView('landing'); setError('') }}>← Retour</button>
          <p className="text-center mt-[14px] text-[13px] text-beige-400">
            Pas de compte ? <span className="text-[#1a1a1a] font-bold cursor-pointer" onClick={() => { setView('signup'); setError('') }}>S&apos;inscrire</span>
          </p>
        </div>
      )}

      {view === 'signup' && (
        <div className="w-full max-w-[400px]">
          <h2 className="text-[26px] font-black tracking-[-1px] mb-[22px] text-[#1a1a1a]">Créer un compte</h2>
          <div className="field"><label className="label">Pseudo</label><input className="input" placeholder="Votre pseudo" value={name} onChange={e => setName(e.target.value)} /></div>
          <div className="field"><label className="label">Email</label><input className="input" type="email" placeholder="votre@email.com" value={email} onChange={e => setEmail(e.target.value)} /></div>
          <div className="field"><label className="label">Mot de passe</label>
            <div style={{position:"relative"}}>
              <input className="input" type={showPass?"text":"password"} placeholder="6 caractères minimum" value={password} onChange={e => setPassword(e.target.value)} style={{paddingRight:44}} />
              <button onClick={()=>setShowPass(p=>!p)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:16,color:"#9a8878"}}>
                {showPass?"🙈":"👁️"}
              </button>
            </div>
          </div>
          {error && <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-[13px] text-red-600 mb-3">{error}</div>}
          <button className="btn-primary w-full h-[48px] text-[14px] rounded-xl mb-[10px]" onClick={handleSignup} disabled={loading}>{loading ? '...' : 'Créer mon compte'}</button>
          <button className="btn-outline w-full h-[42px] text-[13px] rounded-xl" onClick={() => { setView('landing'); setError('') }}>← Retour</button>
        </div>
      )}

      {view === 'admin_login' && (
        <div className="w-full max-w-[400px] text-center">
          <div className="text-[64px] mb-3">📖</div>
          <h2 className="text-[22px] font-black mb-1 text-[#1a1a1a]">Espace auteur</h2>
          <p className="text-beige-400 text-[13px] mb-[22px]">Accès réservé</p>
          <div className="field text-left"><label className="label">Email</label><input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
          <div className="field text-left"><label className="label">Mot de passe</label>
            <div style={{position:"relative"}}>
              <input className="input" type={showPass?"text":"password"} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} style={{paddingRight:44}} />
              <button onClick={()=>setShowPass(p=>!p)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:16,color:"#9a8878"}}>
                {showPass?"🙈":"👁️"}
              </button>
            </div>
          </div>
          {error && <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-[13px] text-red-600 mb-3">{error}</div>}
          <button className="btn-primary w-full h-[48px] text-[14px] rounded-xl mb-[10px]" onClick={handleLogin} disabled={loading}>{loading ? '...' : 'Entrer'}</button>
          <button className="btn-outline w-full h-[42px] text-[13px] rounded-xl" onClick={() => { setView('landing'); setError(''); setEmail(''); setPassword('') }}>← Retour</button>
        </div>
      )}

      {view === 'apprenti' && (
        <div className="w-full max-w-[400px] text-center">
          {!apprentiSent ? (
            <>
              <div className="text-[64px] mb-3">📜</div>
              <h2 className="text-[22px] font-black mb-4 text-[#1a1a1a]">Êtes-vous ici par hasard ?</h2>
              <div className="bg-beige-200 rounded-xl p-[18px] mb-[18px] border border-beige-300 text-[14px] text-beige-600 text-left leading-[1.8]">
                <p>Si oui... <strong className="text-[#1a1a1a]">partez, c&apos;est mieux.</strong></p>
                <p className="mt-2">Si vous êtes un futur auteur DreamReader... <strong className="text-[#1a1a1a]">✦ Bienvenue. ✦</strong></p>
              </div>
              <div className="text-left">
                <div className="field"><label className="label">Nom d&apos;auteur</label><input className="input" value={apprentiName} onChange={e => setApprontiName(e.target.value)} /></div>
                <div className="field"><label className="label">Email</label><input className="input" type="email" value={apprentiEmail} onChange={e => setApprontiEmail(e.target.value)} /></div>
              </div>
              <button className="btn-primary w-full h-[46px] text-[14px] rounded-xl mb-[10px]" onClick={submitCandidature}>✦ Soumettre ma candidature</button>
              <button className="btn-outline w-full h-[42px] text-[13px] rounded-xl" onClick={() => setView('landing')}>← Retour</button>
            </>
          ) : (
            <>
              <div className="text-[64px] mb-3">✉️</div>
              <h2 className="text-[22px] font-black mb-3 text-[#1a1a1a]">Candidature envoyée</h2>
              <p className="text-beige-400 text-[14px] leading-[1.8] mb-5">Si votre candidature est acceptée, vous recevrez un accès.</p>
              <button className="btn-outline w-full h-[42px] text-[13px] rounded-xl" onClick={() => { setView('landing'); setApprontiSent(false); setApprontiName(''); setApprontiEmail('') }}>← Retour</button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
