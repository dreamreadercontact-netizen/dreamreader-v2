import Link from 'next/link'

export const metadata = { title: 'Mentions légales — DreamReader' }

const S = {
  page: { minHeight: "100vh", background: "#f5f0e8", padding: "40px 20px 80px" } as const,
  wrap: { maxWidth: 720, margin: "0 auto" } as const,
  brand: { fontSize: 15, fontWeight: 900, color: "#1a1a1a", textDecoration: "none" } as const,
  h1: { fontFamily: "Lora,Georgia,serif", fontSize: 34, fontWeight: 600, letterSpacing: -1, margin: "26px 0 8px", color: "#1a1a1a" } as const,
  date: { fontSize: 12, color: "#b0a090", marginBottom: 30 } as const,
  h2: { fontSize: 17, fontWeight: 800, margin: "30px 0 10px", color: "#1a1a1a" } as const,
  p: { fontSize: 14, lineHeight: 1.8, color: "#5a4a3a", margin: "0 0 12px" } as const,
  note: { fontSize: 12, color: "#9a8878", background: "#fff", border: "1px solid #e0d8cc", borderRadius: 10, padding: "10px 14px", margin: "18px 0" } as const,
}

export default function MentionsLegales() {
  return (
    <div style={S.page}>
      <div style={S.wrap}>
        <Link href="/" style={S.brand}>✦ DreamReader</Link>
        <h1 style={S.h1}>Mentions légales</h1>
        <div style={S.date}>Dernière mise à jour : juillet 2026</div>

        <h2 style={S.h2}>Éditeur du site</h2>
        <p style={S.p}>DreamReader est édité par Pietro Scalas.<br />Contact : dreamreadercontact@gmail.com<br />Belgique.</p>
        <div style={S.note}>[À compléter après immatriculation : numéro d&apos;entreprise BCE et adresse complète du siège.]</div>

        <h2 style={S.h2}>Directeur de la publication</h2>
        <p style={S.p}>Pietro Scalas.</p>

        <h2 style={S.h2}>Hébergement</h2>
        <p style={S.p}>Application hébergée par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.<br />Données hébergées par Supabase, région Union européenne (Irlande).</p>

        <h2 style={S.h2}>Propriété intellectuelle</h2>
        <p style={S.p}>L&apos;ensemble du contenu du site (textes, romans, éléments graphiques, marque « DreamReader ») est protégé par le droit d&apos;auteur. Toute reproduction sans autorisation écrite préalable est interdite.</p>
      </div>
    </div>
  )
}
