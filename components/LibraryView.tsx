'use client'
import { Novel } from '@/lib/types'

interface Props {
  novels: Novel[]
  isAdmin: boolean
  onSelect: (novel: Novel) => void
  onDelete: (id: number) => void
}

function CoverDiv({ cover }: { cover: string }) {
  const isImg = cover && (cover.startsWith('data:') || cover.startsWith('http'))
  return (
    <div style={{
      width: 56, height: 76, borderRadius: 8, flexShrink: 0,
      border: '1px solid #e0d8cc',
      background: isImg ? '#fff' : cover,
      backgroundImage: isImg ? `url(${cover})` : 'none',
      backgroundSize: 'cover', backgroundPosition: 'center top',
    }} />
  )
}

export default function LibraryView({ novels, isAdmin, onSelect, onDelete }: Props) {
  return (
    <div>
      <h2 className="font-serif text-[26px] font-semibold tracking-[-1px] mb-[18px] text-[#1a1a1a]">Bibliothèque</h2>
      {novels.map(n => (
        <div key={n.id} className="relative">
          <div
            className="card"
            style={{ paddingRight: isAdmin ? '80px' : '18px' }}
            onClick={() => onSelect(n)}
          >
            <CoverDiv cover={n.cover} />
            <div>
              <div className="font-serif text-[17px] font-semibold leading-[1.3] text-[#1a1a1a]">{n.title}</div>
              <div className="text-[11px] text-beige-400 mt-1 uppercase tracking-[1px]">{n.genre}</div>
              <div className="mt-2 flex gap-[6px]">
                {n.status === 'live' && <span className="pill pill-default">En cours</span>}
                {n.status === 'soon' && <span className="pill" style={{ background: '#fff', color: '#9a8878', border: '1px solid #e0d8cc' }}>Bientôt</span>}
                {n.status === 'finished' && <span className="pill" style={{ background: '#fff', color: '#7a6a5a', border: '1px solid #e0d8cc' }}>Terminé</span>}
              </div>
            </div>
          </div>
          {isAdmin && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-[6px]">
              <button
                onClick={e => { e.stopPropagation(); alert('Modifier → onglet Admin → Chapitres') }}
                style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #d8cfc4', background: '#fff', cursor: 'pointer', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 3px rgba(0,0,0,.08)' }}
              >✏️</button>
              <button
                onClick={e => { e.stopPropagation(); onDelete(n.id) }}
                style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid rgba(180,60,60,.2)', background: '#fff', cursor: 'pointer', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 3px rgba(0,0,0,.08)' }}
              >🗑️</button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
