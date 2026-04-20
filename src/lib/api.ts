import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export function ok(data: unknown, status = 200) {
  return NextResponse.json({ success: true, data }, { status })
}

export function err(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status })
}

export async function requireAdmin() {
  const session = await auth()
  if (!session?.user) {
    return { session: null, error: err('Unauthorized', 401) }
  }
  return { session, error: null }
}

export function paginate<T>(items: T[], page: number, limit: number) {
  const total = items.length
  const start = (page - 1) * limit
  const data = items.slice(start, start + limit)
  return { data, total, page, limit, pages: Math.ceil(total / limit) }
}
