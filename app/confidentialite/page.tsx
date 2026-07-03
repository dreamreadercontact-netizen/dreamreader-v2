import Link from 'next/link'

export const metadata = { title: 'Politique de confidentialité — DreamReader' }

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

export default function Confidentialite() {
  return (
    <div style={S.page}>
      <div style={S.wrap}>
        <Link href="/" style={S.brand}>✦ DreamReader</Link>
        <h1 style={S.h1}>Politique de confidentialité</h1>
        <div style={S.date}>Dernière mise à jour : juillet 2026</div>

        <h2 style={S.h2}>1. Données collectées</h2>
        <p style={S.p}>Lors de la création d&apos;un compte : adresse email et pseudonyme. Lors de l&apos;utilisation : progression de lecture, votes, commentaires et mentions « j&apos;aime », statut d&apos;abonnement. Les données de paiement (carte bancaire) sont traitées exclusivement par Stripe et ne transitent jamais par nos serveurs.</p>

        <h2 style={S.h2}>2. Finalités et base légale</h2>
        <p style={S.p}>Ces données servent uniquement au fonctionnement du service : authentification, reprise de lecture, système de vote et de commentaires, gestion de l&apos;abonnement (exécution du contrat), et communications liées au service (intérêt légitime).</p>

        <h2 style={S.h2}>3. Hébergement et sous-traitants</h2>
        <p style={S.p}>Les données sont hébergées par Supabase (base de données, région Union européenne — Irlande) et Vercel (application). Les paiements sont traités par Stripe. Aucune donnée n&apos;est vendue ni transmise à des tiers à des fins publicitaires.</p>

        <h2 style={S.h2}>4. Durée de conservation</h2>
        <p style={S.p}>Les données sont conservées tant que le compte est actif. La suppression du compte entraîne l&apos;effacement des données personnelles associées dans un délai raisonnable, hors obligations légales de conservation (facturation).</p>

        <h2 style={S.h2}>5. Vos droits</h2>
        <p style={S.p}>Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement, de limitation et de portabilité de vos données. Pour exercer ces droits : dreamreadercontact@gmail.com. Vous pouvez également introduire une réclamation auprès de l&apos;Autorité de protection des données (Belgique).</p>

        <h2 style={S.h2}>6. Cookies</h2>
        <p style={S.p}>DreamReader n&apos;utilise pas de cookies publicitaires. Seuls des éléments techniques strictement nécessaires à l&apos;authentification et au maintien de la session sont stockés dans votre navigateur.</p>
      </div>
    </div>
  )
}
