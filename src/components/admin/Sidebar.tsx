'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

const links = [
  { href: '/admin', label: 'Dashboard', icon: '📊', exact: true },
  { href: '/admin/bookings', label: 'Bookings', icon: '📋' },
  { href: '/admin/clients', label: 'Clients CRM', icon: '👥' },
  { href: '/admin/staff', label: 'Staff', icon: '🧑‍💼' },
  { href: '/admin/finances', label: 'Finances', icon: '💰' },
  { href: '/admin/packages', label: 'Tour Packages', icon: '✈️' },
  { href: '/admin/reports', label: 'Reports', icon: '📈' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const active = (href: string, exact?: boolean) => exact ? pathname === href : pathname?.startsWith(href)

  return (
    <aside className="w-52 bg-forest-ink flex-shrink-0 h-[calc(100vh-64px)] sticky top-16 overflow-y-auto hidden md:block">
      <div className="pt-3 pb-6">
        <p className="text-[9px] tracking-[2px] uppercase text-white/30 px-6 pt-4 pb-2">Management</p>
        {links.map(({ href, label, icon, exact }) => (
          <Link key={href} href={href}
            className={`flex items-center gap-2.5 px-6 py-2.5 text-sm transition-all border-l-[3px] ${active(href, exact) ? 'text-gold-light bg-gold/10 border-gold font-medium' : 'text-white/60 border-transparent hover:text-white hover:bg-white/5'}`}>
            <span className="text-sm">{icon}</span>
            <span>{label}</span>
          </Link>
        ))}
        <p className="text-[9px] tracking-[2px] uppercase text-white/30 px-6 pt-6 pb-2">System</p>
        <Link href="/" className="flex items-center gap-2.5 px-6 py-2.5 text-sm text-white/60 border-l-[3px] border-transparent hover:text-white hover:bg-white/5 transition-all">
          <span>←</span><span>Public Website</span>
        </Link>
        <button onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full flex items-center gap-2.5 px-6 py-2.5 text-sm text-white/60 border-l-[3px] border-transparent hover:text-white hover:bg-white/5 transition-all">
          <span>🚪</span><span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
