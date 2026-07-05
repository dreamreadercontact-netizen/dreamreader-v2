'use client'

import { useEffect, useState } from 'react'

export default function TelechargerPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [platform, setPlatform] = useState<'android' | 'ios' | 'desktop'>('desktop')
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    const ua = navigator.userAgent
    if (/iPhone|iPad|iPod/i.test(ua)) setPlatform('ios')
    else if (/Android/i.test(ua)) setPlatform('android')

    if (window.matchMedia('(display-mode: standalone)').matches) setInstalled(true)

    const handler = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', () => setInstalled(true))
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  async function handleInstall() {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setInstalled(true)
    setDeferredPrompt(null)
  }

  const stepStyle: React.CSSProperties = {
    display: 'flex', gap: 14, alignItems: 'flex-start',
    padding: '14px 0', borderBottom: '1px solid #ede8e0',
  }
  const numStyle: React.CSSProperties = {
    width: 26, height: 26, borderRadius: '50%', background: '#1a1a1a', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 13, fontWeight: 800, flexShrink: 0, fontFamily: 'system-ui,sans-serif',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f0e8', padding: '44px 20px', fontFamily: 'Georgia,serif' }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        <div style={{ fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', color: '#9a8878', marginBottom: 26, fontWeight: 700, textAlign: 'center' }}>
          ✦ DreamReader
        </div>

        <div style={{ background: '#fff', border: '1px solid #e0d8cc', borderRadius: 18, padding: 32, boxShadow: '0 8px 32px rgba(0,0,0,.06)', textAlign: 'center' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon-192.png" alt="DreamReader" style={{ width: 88, height: 88, borderRadius: 20, border: '1px solid #e0d8cc', marginBottom: 18 }} />
          <h1 style={{ fontSize: 30, letterSpacing: -1, color: '#1a1a1a', margin: '0 0 8px', lineHeight: 1.1 }}>
            Installez l&apos;application
          </h1>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: '#5a4a3a', margin: '0 0 24px' }}>
            Gratuit, en 10 secondes, sans passer par un store. L&apos;app s&apos;ajoute à votre écran d&apos;accueil.
          </p>

          {installed && (
            <div style={{ background: '#1a1a1a', color: '#fff', borderRadius: 12, padding: '14px 18px', fontSize: 14, fontWeight: 700, fontFamily: 'system-ui,sans-serif' }}>
              ✓ L&apos;application est installée — cherchez l&apos;astronaute sur votre écran d&apos;accueil !
            </div>
          )}

          {!installed && platform === 'android' && (
            <>
              {deferredPrompt ? (
                <button
                  onClick={handleInstall}
                  style={{ width: '100%', height: 52, borderRadius: 12, border: 'none', background: '#1a1a1a', color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: 'system-ui,sans-serif' }}
                >
                  📲 Installer l&apos;application
                </button>
              ) : (
                <div style={{ textAlign: 'left' }}>
                  <div style={stepStyle}><span style={numStyle}>1</span><span style={{ fontSize: 14, color: '#5a4a3a', lineHeight: 1.6 }}>Appuyez sur le menu <strong>⋮</strong> en haut à droite de Chrome</span></div>
                  <div style={stepStyle}><span style={numStyle}>2</span><span style={{ fontSize: 14, color: '#5a4a3a', lineHeight: 1.6 }}>Choisissez <strong>« Ajouter à l&apos;écran d&apos;accueil »</strong> ou <strong>« Installer l&apos;application »</strong></span></div>
                  <div style={{ ...stepStyle, borderBottom: 'none' }}><span style={numStyle}>3</span><span style={{ fontSize: 14, color: '#5a4a3a', lineHeight: 1.6 }}>Confirmez — l&apos;astronaute apparaît sur votre écran d&apos;accueil ✦</span></div>
                </div>
              )}
            </>
          )}

          {!installed && platform === 'ios' && (
            <div style={{ textAlign: 'left' }}>
              <div style={stepStyle}><span style={numStyle}>1</span><span style={{ fontSize: 14, color: '#5a4a3a', lineHeight: 1.6 }}>Ouvrez cette page dans <strong>Safari</strong></span></div>
              <div style={stepStyle}><span style={numStyle}>2</span><span style={{ fontSize: 14, color: '#5a4a3a', lineHeight: 1.6 }}>Appuyez sur le bouton <strong>Partager</strong> (le carré avec la flèche ↑)</span></div>
              <div style={stepStyle}><span style={numStyle}>3</span><span style={{ fontSize: 14, color: '#5a4a3a', lineHeight: 1.6 }}>Choisissez <strong>« Sur l&apos;écran d&apos;accueil »</strong></span></div>
              <div style={{ ...stepStyle, borderBottom: 'none' }}><span style={numStyle}>4</span><span style={{ fontSize: 14, color: '#5a4a3a', lineHeight: 1.6 }}>Appuyez sur <strong>Ajouter</strong> — c&apos;est fait ✦</span></div>
            </div>
          )}

          {!installed && platform === 'desktop' && (
            <div style={{ background: '#f5f0e8', borderRadius: 12, padding: '18px 20px', fontSize: 14, color: '#5a4a3a', lineHeight: 1.7 }}>
              📱 Ouvrez cette page sur votre <strong>téléphone</strong> pour installer l&apos;application :<br />
              <strong style={{ fontSize: 13, fontFamily: 'monospace' }}>dreamreader-v2.vercel.app/telecharger</strong>
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: 22 }}>
          <a href="/" style={{ fontSize: 13, color: '#9a8878', textDecoration: 'none', fontWeight: 700 }}>← Retour à DreamReader</a>
        </div>
      </div>
    </div>
  )
}
