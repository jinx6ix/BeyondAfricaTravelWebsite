import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, err, requireAdmin } from '@/lib/api'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const tour = await prisma.tour.findUnique({
      where: { id: Number(params.id) },
      include: {
        itinerary: { orderBy: { day: 'asc' } },
        reviews: { where: { approved: true }, orderBy: { createdAt: 'desc' } },
      },
    })
    if (!tour) return err('Tour not found', 404)
    return ok(tour)
  } catch (e) {
    return err('Failed to fetch tour', 500)
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin()
  if (error) return error
  try {
    const body = await req.json()
    const tour = await prisma.tour.update({ where: { id: Number(params.id) }, data: body })
    return ok(tour)
  } catch (e) {
    return err('Failed to update tour', 500)
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin()
  if (error) return error
  try {
    await prisma.tour.update({ where: { id: Number(params.id) }, data: { active: false } })
    return ok({ message: 'Tour deactivated' })
  } catch (e) {
    return err('Failed to delete tour', 500)
  }
}
