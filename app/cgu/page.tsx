import Link from 'next/link'

export const metadata = { title: 'Conditions générales — DreamReader' }

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

export default function CGU() {
  return (
    <div style={S.page}>
      <div style={S.wrap}>
        <Link href="/" style={S.brand}>✦ DreamReader</Link>
        <h1 style={S.h1}>Conditions générales d&apos;utilisation et de vente</h1>
        <div style={S.date}>Dernière mise à jour : juillet 2026</div>

        <h2 style={S.h2}>1. Le service</h2>
        <p style={S.p}>DreamReader est une plateforme de lecture de romans interactifs en français. Les lecteurs découvrent des chapitres publiés progressivement et peuvent, via un système de vote, influencer l&apos;orientation des chapitres suivants, commenter et interagir avec l&apos;auteur.</p>

        <h2 style={S.h2}>2. Compte et essai gratuit</h2>
        <p style={S.p}>La création d&apos;un compte est gratuite et requiert une adresse email valide. Chaque nouveau compte bénéficie d&apos;un accès complet gratuit pendant 3 jours à compter de l&apos;inscription, sans carte bancaire. À l&apos;issue de cette période, l&apos;accès aux chapitres payants et au vote nécessite un abonnement.</p>

        <h2 style={S.h2}>3. Abonnement et paiement</h2>
        <p style={S.p}>L&apos;abonnement est proposé au tarif de 5 € TTC par mois, sans engagement. Le paiement est traité de manière sécurisée par Stripe. L&apos;abonnement se renouvelle automatiquement chaque mois. Il peut être résilié à tout moment ; la résiliation prend effet à la fin de la période en cours, sans remboursement au prorata.</p>

        <h2 style={S.h2}>4. Droit de rétractation</h2>
        <p style={S.p}>Conformément à la législation applicable aux contenus numériques fournis immédiatement, en souscrivant l&apos;abonnement, vous demandez l&apos;exécution immédiate du service et reconnaissez renoncer expressément à votre droit de rétractation de 14 jours dès l&apos;accès au contenu.</p>

        <h2 style={S.h2}>5. Propriété intellectuelle</h2>
        <p style={S.p}>L&apos;ensemble des textes, romans, chapitres et éléments graphiques publiés sur DreamReader sont protégés par le droit d&apos;auteur. L&apos;abonnement confère un droit de lecture strictement personnel. Toute reproduction, diffusion ou exploitation, totale ou partielle, sans autorisation écrite préalable est interdite.</p>

        <h2 style={S.h2}>6. Comportement des utilisateurs</h2>
        <p style={S.p}>Les commentaires doivent rester respectueux. Sont notamment interdits : propos haineux, harcèlement, spam, contenus illicites. L&apos;éditeur se réserve le droit de supprimer tout commentaire contraire à ces règles et, en cas de récidive, de suspendre le compte concerné.</p>

        <h2 style={S.h2}>7. Disponibilité et responsabilité</h2>
        <p style={S.p}>DreamReader s&apos;efforce d&apos;assurer un accès continu au service, sans pouvoir garantir une disponibilité ininterrompue. La responsabilité de l&apos;éditeur ne saurait être engagée en cas d&apos;interruption temporaire, de maintenance ou de force majeure.</p>

        <h2 style={S.h2}>8. Droit applicable</h2>
        <p style={S.p}>Les présentes conditions sont régies par le droit belge. En cas de litige, une solution amiable sera recherchée en priorité ; à défaut, les tribunaux belges seront compétents. Contact : dreamreadercontact@gmail.com.</p>
      </div>
    </div>
  )
}
