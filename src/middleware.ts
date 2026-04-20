import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
  const isApiAdminRoute = req.nextUrl.pathname.startsWith('/api/') &&
    !req.nextUrl.pathname.startsWith('/api/auth') &&
    !req.nextUrl.pathname.startsWith('/api/tours') &&
    !req.nextUrl.pathname.startsWith('/api/contact')

  if ((isAdminRoute || isApiAdminRoute) && !req.auth) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }
})

export const config = {
  matcher: ['/admin/:path*', '/api/bookings/:path*', '/api/clients/:path*', '/api/staff/:path*', '/api/finances/:path*', '/api/stats'],
}
