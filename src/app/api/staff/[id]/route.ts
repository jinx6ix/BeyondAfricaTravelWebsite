import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, err, requireAdmin } from '@/lib/api'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin()
  if (error) return error
  const body = await req.json()
  const member = await prisma.staff.update({ where: { id: params.id }, data: body })
  return ok(member)
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin()
  if (error) return error
  await prisma.staff.update({ where: { id: params.id }, data: { active: false } })
  return ok({ message: 'Staff member removed' })
}
