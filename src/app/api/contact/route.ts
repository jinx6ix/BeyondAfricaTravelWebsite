import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, err, requireAdmin } from '@/lib/api'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  tourName: z.string().optional(),
  message: z.string().min(5, 'Message too short'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = schema.parse(body)
    const enquiry = await prisma.enquiry.create({ data })
    return ok(enquiry, 201)
  } catch (e: any) {
    if (e.name === 'ZodError') return err(e.errors[0]?.message ?? 'Validation error', 422)
    return err('Failed to submit enquiry', 500)
  }
}

export async function GET() {
  const { error } = await requireAdmin()
  if (error) return error
  const enquiries = await prisma.enquiry.findMany({ orderBy: { createdAt: 'desc' } })
  return ok(enquiries)
}
