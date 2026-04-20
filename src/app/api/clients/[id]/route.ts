import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, err, requireAdmin } from '@/lib/api'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin()
  if (error) return error
  const body = await req.json()
  const client = await prisma.client.update({ where: { id: params.id }, data: body })
  return ok(client)
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin()
  if (error) return error
  await prisma.client.delete({ where: { id: params.id } })
  return ok({ message: 'Client deleted' })
}
