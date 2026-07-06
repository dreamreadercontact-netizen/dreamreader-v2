'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function AnnonceursPage() {
  const [form, setForm] = useState({ company: '', contactEmail: '', website: '', budget: '', message: '' })
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit() {
    setError('')
    if (!form.company || !form.contactEmail) { setError('Entreprise et email requis.'); return }
    setLoading(true)
    const res = await fetch('/api/ad-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setLoading(false)
    if (!res.ok) { setError('Une erreur est survenue. Réessayez.'); return }
    setSent(true)
  }

  const input: React.CSSProperties = {
    width: '100%', border: '1.5px solid #d8cfc4', borderRadius: 10,
    padding: '12px 14px', fontSize: 14, marginBottom: 12, boxSizing: 'border-box', fontFamily: 'inherit',
  }
  const label: React.CSSProperties = { fontSize: 12, fontWeight: 700, color: '#9a8878', marginBottom: 4, display: 'block' }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f0e8', padding: '44px 20px', fontFamily: 'Georgia,serif' }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        <div style={{ fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', color: '#9a8878', marginBottom: 26, fontWeight: 700, textAlign: 'center' }}>✦ DreamReader</div>

        <div style={{ background: '#fff', border: '1px solid #e0d8cc', borderRadius: 18, padding: 32, boxShadow: '0 8px 32px rgba(0,0,0,.06)' }}>
          {!sent ? (
            <>
              <h1 style={{ fontSize: 28, letterSpacing: -1, color: '#1a1a1a', margin: '0 0 8px', lineHeight: 1.15 }}>Faites de la publicité sur DreamReader</h1>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: '#5a4a3a', margin: '0 0 24px' }}>
                Vous êtes indépendant ou une marque et souhaitez toucher notre communauté de lecteurs ? Envoyez-nous votre demande — chaque partenariat est étudié personnellement, et nous validons chaque annonce avant diffusion.
              </p>

              <label style={label}>Entreprise / Nom *</label>
              <input style={input} value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="Votre nom ou société" />

              <label style={label}>Email de contact *</label>
              <input style={input} type="email" value={form.contactEmail} onChange={e => setForm({ ...form, contactEmail: e.target.value })} placeholder="pour vous recontacter" />

              <label style={label}>Site web (optionnel)</label>
              <input style={input} type="url" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} placeholder="https://..." />

              <label style={label}>Budget envisagé (optionnel)</label>
              <input style={input} value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} placeholder="ex : 50€/mois" />

              <label style={label}>Votre message (optionnel)</label>
              <textarea style={{ ...input, minHeight: 90, resize: 'vertical', lineHeight: 1.6 }} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Décrivez ce que vous aimeriez promouvoir..." />

              {error && <div style={{ background: 'rgba(220,38,38,.08)', border: '1px solid rgba(220,38,38,.2)', borderRadius: 8, padding: 12, fontSize: 13, color: '#dc2626', marginBottom: 12 }}>{error}</div>}

              <button onClick={submit} disabled={loading} style={{ width: '100%', height: 50, borderRadius: 12, border: 'none', background: '#1a1a1a', color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: 'system-ui,sans-serif' }}>
                {loading ? '...' : 'Envoyer ma demande'}
              </button>
            </>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 56, marginBottom: 12 }}>✉️</div>
              <h1 style={{ fontSize: 26, color: '#1a1a1a', margin: '0 0 12px' }}>Demande envoyée</h1>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: '#5a4a3a' }}>Merci ! Nous étudions votre demande et vous recontacterons à l&apos;adresse indiquée.</p>
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: 22 }}>
          <Link href="/" style={{ fontSize: 13, color: '#9a8878', textDecoration: 'none', fontWeight: 700 }}>← Retour à DreamReader</Link>
        </div>
      </div>
    </div>
  )
}
