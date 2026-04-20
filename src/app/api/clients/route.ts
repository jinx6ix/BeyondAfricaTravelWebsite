// src/app/api/clients/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, err, requireAdmin } from '@/lib/api'

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search')
  const clients = await prisma.client.findMany({
    where: search ? { OR: [{ name: { contains: search, mode: 'insensitive' } }, { email: { contains: search, mode: 'insensitive' } }] } : undefined,
    orderBy: [{ status: 'desc' }, { totalSpent: 'desc' }],
  })
  return ok(clients)
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error
  try {
    const body = await req.json()
    const client = await prisma.client.create({ data: body })
    return ok(client, 201)
  } catch (e: any) {
    return err(e.message ?? 'Failed to create client', 500)
  }
}
