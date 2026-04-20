import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, err, requireAdmin } from '@/lib/api'

export async function GET() {
  const { error } = await requireAdmin()
  if (error) return error
  const staff = await prisma.staff.findMany({ where: { active: true }, orderBy: { name: 'asc' } })
  return ok(staff)
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error
  try {
    const body = await req.json()
    const member = await prisma.staff.create({ data: body })
    return ok(member, 201)
  } catch (e: any) {
    return err(e.message ?? 'Failed to create staff', 500)
  }
}
