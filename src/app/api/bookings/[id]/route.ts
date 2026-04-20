import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, err, requireAdmin } from '@/lib/api'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin()
  if (error) return error
  try {
    const body = await req.json()
    const booking = await prisma.booking.update({ where: { id: params.id }, data: body })
    return ok(booking)
  } catch (e) {
    return err('Failed to update booking', 500)
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin()
  if (error) return error
  try {
    await prisma.booking.delete({ where: { id: params.id } })
    return ok({ message: 'Booking deleted' })
  } catch (e) {
    return err('Failed to delete booking', 500)
  }
}
