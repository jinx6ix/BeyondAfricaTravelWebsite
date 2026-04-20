import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, err, requireAdmin } from '@/lib/api'
import { FinanceType } from '@prisma/client'

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') as FinanceType | null

  const finances = await prisma.finance.findMany({
    where: type ? { type } : undefined,
    orderBy: { date: 'desc' },
  })
  return ok(finances)
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error
  try {
    const body = await req.json()
    const entry = await prisma.finance.create({ data: { ...body, date: new Date(body.date) } })
    return ok(entry, 201)
  } catch (e: any) {
    return err(e.message ?? 'Failed to create entry', 500)
  }
}
