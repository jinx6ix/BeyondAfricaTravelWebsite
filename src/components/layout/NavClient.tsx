'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Menu, X } from 'lucide-react'

interface Props {
  links: { href: string; label: string }[]
  isAdmin: boolean
  isLoggedIn: boolean
  userEmail?: string | null
}

export default function NavClient({ links, isAdmin, isLoggedIn, userEmail }: Props) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin'
    return pathname?.startsWith(href) && href !== '/'
  }

  return (
    <>
      <nav className={`sticky top-0 z-50 h-16 px-[5%] flex items-center justify-between shadow-nav ${isAdmin ? 'bg-forest-ink' : 'bg-forest'}`}>
        {/* Logo */}
        <Link href={isAdmin ? '/admin' : '/'} className="flex items-center gap-2.5">
          <span className="text-2xl">🌍</span>
          <div className="flex flex-col">
            <span className="font-serif text-white text-[18px] font-bold leading-tight">Savanna & Beyond</span>
            <span className="text-[8px] tracking-[2.5px] uppercase text-gold-light">Travel Agency</span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(({ href, label }) => (
            <Link key={href} href={href}
              className={`px-4 py-1.5 rounded-lg text-sm transition-all ${isActive(href) ? 'text-gold-light bg-gold/15 font-medium' : 'text-white/75 hover:text-white hover:bg-white/10'}`}>
              {label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
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

        {/* Mobile toggle */}
        <button className="md:hidden text-white p-1" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className={`md:hidden ${isAdmin ? 'bg-forest-ink' : 'bg-forest'} border-t border-white/10 px-6 py-4 flex flex-col gap-1`}>
          {links.map(({ href, label }) => (
            <Link key={href} href={href} className="text-white/80 hover:text-white py-2.5 text-sm border-b border-white/10 last:border-0" onClick={() => setOpen(false)}>
              {label}
            </Link>
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
