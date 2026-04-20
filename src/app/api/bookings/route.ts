import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, err, requireAdmin } from '@/lib/api'
import { z } from 'zod'
import { BookingStatus, PaymentStatus } from '@prisma/client'

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') as BookingStatus | null
  const search = searchParams.get('search')

  const bookings = await prisma.booking.findMany({
    where: {
      ...(status && { status }),
      ...(search && {
        OR: [
          { clientName: { contains: search, mode: 'insensitive' } },
          { tourName: { contains: search, mode: 'insensitive' } },
          { clientEmail: { contains: search, mode: 'insensitive' } },
        ],
      }),
    },
    orderBy: { createdAt: 'desc' },
    include: { client: true, tour: { select: { name: true, emoji: true } } },
  })
  return ok(bookings)
}

const createSchema = z.object({
  clientName: z.string().min(1),
  clientEmail: z.string().email(),
  clientPhone: z.string().optional(),
  tourName: z.string().min(1),
  tourId: z.number().optional(),
  travelDate: z.string(),
  pax: z.number().int().positive().default(1),
  amount: z.number().nonnegative(),
  notes: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = createSchema.parse(body)

    // Auto-create or link client
    let client = await prisma.client.findUnique({ where: { email: data.clientEmail } })
    if (!client) {
      client = await prisma.client.create({
        data: { name: data.clientName, email: data.clientEmail, phone: data.clientPhone },
      })
    }

    const booking = await prisma.booking.create({
      data: {
        ...data,
        travelDate: new Date(data.travelDate),
        clientId: client.id,
      },
    })
    return ok(booking, 201)
  } catch (e: any) {
    if (e.name === 'ZodError') return err(e.errors[0]?.message ?? 'Validation error', 422)
    console.error(e)
    return err('Failed to create booking', 500)
  }
}
