'use client'

export default function SubscribeView({ stripeUrl }: { stripeUrl: string }) {
  return (
    <div className="max-w-[400px] mx-auto py-[44px]">
      <div className="text-[10px] text-beige-400 tracking-[2px] uppercase mb-[14px]">Abonnement</div>
      <h2 className="font-serif text-[40px] font-semibold tracking-[-2px] mb-2 leading-none text-[#1a1a1a]">
        Rejoignez<br />l&apos;aventure.
      </h2>
      <p className="text-beige-500 mb-8 text-[14px] leading-[1.7]">Lisez, votez, influencez chaque chapitre.</p>
      <div className="bg-white border border-beige-200 rounded-[14px] p-[26px] mb-3 shadow-sm">
        <div className="text-[48px] font-black tracking-[-3px] leading-none mb-1 text-[#1a1a1a]">5€</div>
        <div className="text-beige-400 mb-[22px] text-[13px]">/mois · sans engagement</div>
        {[
          'Accès illimité à tous les chapitres',
          "Votes pour influencer l'histoire",
          'Commentaires et likes',
        ].map((f, i) => (
          <div key={i} className="flex gap-[10px] mb-[10px] text-[14px] text-beige-500 items-center">
            <span className="text-[#1a1a1a] font-bold">—</span>{f}
          </div>
        ))}
        <a
          href={stripeUrl}
          target="_blank"
          className="flex items-center justify-center w-full h-[50px] bg-[#1a1a1a] text-white rounded-xl font-black no-underline text-[14px] mt-5"
        >
          S&apos;abonner maintenant →
        </a>
      </div>
      <div className="text-[12px] text-beige-300 text-center">CB · Apple Pay · Stripe sécurisé</div>
    </div>
  )
}
