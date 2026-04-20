'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X } from 'lucide-react'

const publicLinks = [
  { href: '/tours', label: 'Tours' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

const adminLinks = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/bookings', label: 'Bookings' },
  { href: '/admin/clients', label: 'Clients' },
  { href: '/admin/staff', label: 'Staff' },
  { href: '/admin/finances', label: 'Finances' },
  { href: '/admin/packages', label: 'Packages' },
  { href: '/admin/reports', label: 'Reports' },
]

export default function Navbar({ isAdmin }: { isAdmin?: boolean }) {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [open, setOpen] = useState(false)
  const isLoggedIn = status === 'authenticated'
  const links = isAdmin ? adminLinks : publicLinks

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href
    return pathname?.startsWith(href) && href !== '/'
  }

  return (
    <>
      <nav className={`sticky top-0 z-50 h-16 px-[5%] flex items-center justify-between shadow-nav ${isAdmin ? 'bg-forest-ink' : 'bg-forest'}`}>
        <Link href={isAdmin ? '/admin' : '/'} className="flex items-center gap-2.5">
          <span className="text-2xl">🌍</span>
          <div className="flex flex-col">
            <span className="font-serif text-white text-[18px] font-bold leading-tight">Savanna & Beyond</span>
            <span className="text-[8px] tracking-[2.5px] uppercase text-gold-light">Travel Agency</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map(({ href, label, exact }: any) => (
            <Link key={href} href={href}
              className={`px-4 py-1.5 rounded-lg text-sm transition-all ${isActive(href, exact) ? 'text-gold-light bg-gold/15 font-medium' : 'text-white/75 hover:text-white hover:bg-white/10'}`}>
              {label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          {isAdmin ? (
            <>
              <Link href="/" className="btn-ghost text-xs">← Public Site</Link>
              <button onClick={() => signOut({ callbackUrl: '/login' })} className="btn-ghost text-xs">Sign Out</button>
            </>
          ) : (
            <>
              <Link href="/tours" className="btn-gold text-xs px-4 py-1.5">Book Now</Link>
              {isLoggedIn
                ? <Link href="/admin" className="btn-ghost">Dashboard</Link>
                : <Link href="/login" className="btn-ghost">Staff Login</Link>
              }
            </>
          )}
        </div>

        <button className="md:hidden text-white p-1" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className={`md:hidden ${isAdmin ? 'bg-forest-ink' : 'bg-forest'} border-t border-white/10 px-6 py-4 flex flex-col gap-1 sticky top-16 z-40`}>
          {links.map(({ href, label }: any) => (
            <Link key={href} href={href} className="text-white/80 hover:text-white py-2.5 text-sm border-b border-white/10 last:border-0"
              onClick={() => setOpen(false)}>{label}</Link>
          ))}
          {!isAdmin && !isLoggedIn && (
            <Link href="/login" className="text-white/80 hover:text-white py-2.5 text-sm" onClick={() => setOpen(false)}>Staff Login</Link>
          )}
          {isAdmin && (
            <button onClick={() => signOut({ callbackUrl: '/login' })} className="text-white/80 hover:text-white py-2.5 text-sm text-left">Sign Out</button>
          )}
        </div>
      )}
    </>
  )
}
