import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, err, requireAdmin } from '@/lib/api'
import { z } from 'zod'
import { TourCategory } from '@prisma/client'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category') as TourCategory | null
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')

    const tours = await prisma.tour.findMany({
      where: {
        active: true,
        ...(category && { category }),
        ...(featured === 'true' && { featured: true }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { destination: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
      include: { itinerary: { orderBy: { day: 'asc' } } },
      orderBy: { rating: 'desc' },
    })
    return ok(tours)
  } catch (e) {
    console.error(e)
    return err('Failed to fetch tours', 500)
  }
}

const createSchema = z.object({
  name: z.string().min(2),
  destination: z.string(),
  days: z.number().int().positive(),
  nights: z.number().int().positive(),
  price: z.number().positive(),
  category: z.nativeEnum(TourCategory),
  description: z.string(),
  maxGroup: z.number().int().positive().default(12),
  emoji: z.string().default('🌍'),
  color: z.string().default('#1B3A2D'),
  highlights: z.array(z.string()).default([]),
  includes: z.array(z.string()).default([]),
  excludes: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
})

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const body = await req.json()
    const data = createSchema.parse(body)
    const tour = await prisma.tour.create({ data })
    return ok(tour, 201)
  } catch (e: any) {
    if (e.name === 'ZodError') return err(e.message, 422)
    console.error(e)
    return err('Failed to create tour', 500)
  }
}
