'use client'
import { ReactNode } from 'react'
import clsx from 'clsx'

// ─── Badge ───────────────────────────────────────────────────────────────────
const BADGE: Record<string, string> = {
  CONFIRMED: 'bg-green-100 text-green-700',
  PENDING: 'bg-yellow-100 text-yellow-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
  CANCELLED: 'bg-red-100 text-red-700',
  PAID: 'bg-green-100 text-green-700',
  PARTIAL: 'bg-yellow-100 text-yellow-700',
  DEPOSIT: 'bg-sky-100 text-sky-700',
  UNPAID: 'bg-red-100 text-red-700',
  RECEIVED: 'bg-green-100 text-green-700',
  INCOME: 'bg-green-100 text-green-700',
  EXPENSE: 'bg-red-100 text-red-700',
  VIP: 'bg-amber-100 text-amber-700',
  ACTIVE: 'bg-blue-100 text-blue-700',
  NEW: 'bg-purple-100 text-purple-700',
  SAFARI: 'bg-green-100 text-green-800',
  BEACH: 'bg-sky-100 text-sky-800',
  ADVENTURE: 'bg-purple-100 text-purple-800',
  WILDLIFE: 'bg-emerald-100 text-emerald-800',
  CULTURAL: 'bg-amber-100 text-amber-800',
}

export function Badge({ status }: { status: string }) {
  return (
    <span className={clsx('badge', BADGE[status?.toUpperCase()] ?? 'bg-gray-100 text-gray-600')}>
      {status?.toLowerCase()}
    </span>
  )
}

// ─── KpiCard ─────────────────────────────────────────────────────────────────
export function KpiCard({ icon, label, value, sub, color = '#1B3A2D' }: {
  icon: string; label: string; value: string | number; sub?: string; color?: string
}) {
  return (
    <div className="card flex items-center gap-4">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
        style={{ background: `${color}18` }}>{icon}</div>
      <div>
        <div className="font-serif text-[22px] font-bold leading-none" style={{ color }}>{value}</div>
        <div className="text-[11px] text-gray-500 mt-1">{label}</div>
        {sub && <div className="text-[11px] text-green-600 mt-0.5">{sub}</div>}
      </div>
    </div>
  )
}

// ─── Avatar ──────────────────────────────────────────────────────────────────
export function Avatar({ name, size = 44 }: { name: string; size?: number }) {
  return (
    <div className="rounded-full flex items-center justify-center text-white font-serif font-bold flex-shrink-0"
      style={{ width: size, height: size, background: 'linear-gradient(135deg,#1B3A2D,#C9943A)', fontSize: Math.floor(size * 0.4) }}>
      {name?.[0] ?? '?'}
    </div>
  )
}

// ─── Stars ───────────────────────────────────────────────────────────────────
export function Stars({ rating }: { rating: number }) {
  return <span className="text-gold text-sm">{'★'.repeat(Math.round(rating))}</span>
}

// ─── Spinner ─────────────────────────────────────────────────────────────────
export function Spinner({ size = 20 }: { size?: number }) {
  return (
    <div className="animate-spin rounded-full border-2 border-cream-border border-t-forest"
      style={{ width: size, height: size }} />
  )
}

// ─── Modal ───────────────────────────────────────────────────────────────────
export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl p-7 w-full max-w-md shadow-modal animate-fade-up max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-5">
          <h2 className="font-serif text-xl text-forest">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl leading-none transition-colors">×</button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ─── SectionHeader ───────────────────────────────────────────────────────────
export function SectionHeader({ label, title, subtitle, center }: {
  label?: string; title: string; subtitle?: string; center?: boolean
}) {
  return (
    <div className={clsx('mb-10', center && 'text-center')}>
      {label && <p className="section-label mb-2">{label}</p>}
      <h2 className="section-title text-4xl lg:text-5xl">{title}</h2>
      {subtitle && <p className={clsx('text-gray-500 mt-3 text-[15px] leading-relaxed', center && 'max-w-lg mx-auto')}>{subtitle}</p>}
    </div>
  )
}

// ─── Empty state ─────────────────────────────────────────────────────────────
export function Empty({ icon, message }: { icon: string; message: string }) {
  return (
    <div className="text-center py-20 text-gray-400">
      <div className="text-5xl mb-3">{icon}</div>
      <p>{message}</p>
    </div>
  )
}
