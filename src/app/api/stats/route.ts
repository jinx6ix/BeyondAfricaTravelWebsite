import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, err, requireAdmin } from '@/lib/api'
import { startOfMonth, subMonths, format } from 'date-fns'

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const [
      totalBookings, pendingBookings, confirmedBookings,
      totalClients, vipClients,
      totalStaff,
      recentBookings,
      finances,
    ] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'PENDING' } }),
      prisma.booking.count({ where: { status: 'CONFIRMED' } }),
      prisma.client.count(),
      prisma.client.count({ where: { status: 'VIP' } }),
      prisma.staff.count({ where: { active: true } }),
      prisma.booking.findMany({
        take: 8,
        orderBy: { createdAt: 'desc' },
        include: { tour: { select: { emoji: true } } },
      }),
      prisma.finance.findMany({ orderBy: { date: 'desc' } }),
    ])

    const revenue = finances.filter(f => f.type === 'INCOME').reduce((s, f) => s + f.amount, 0)
    const expenses = finances.filter(f => f.type === 'EXPENSE').reduce((s, f) => s + f.amount, 0)
    const paidRevenue = await prisma.booking.aggregate({
      where: { paymentStatus: 'PAID' },
      _sum: { amount: true },
    })

    // Monthly trend — last 6 months
    const monthly = await Promise.all(
      Array.from({ length: 6 }, (_, i) => {
        const date = subMonths(new Date(), 5 - i)
        const start = startOfMonth(date)
        const end = startOfMonth(subMonths(date, -1))
        return Promise.all([
          prisma.finance.aggregate({ where: { type: 'INCOME', date: { gte: start, lt: end } }, _sum: { amount: true } }),
          prisma.finance.aggregate({ where: { type: 'EXPENSE', date: { gte: start, lt: end } }, _sum: { amount: true } }),
        ]).then(([inc, exp]) => ({
          month: format(date, 'MMM'),
          revenue: inc._sum.amount ?? 0,
          expenses: exp._sum.amount ?? 0,
        }))
      })
    )

    // Tour popularity from bookings
    const tourBookings = await prisma.booking.groupBy({
      by: ['tourName'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 6,
    })

    return ok({
      kpis: {
        totalBookings,
        pendingBookings,
        confirmedBookings,
        totalClients,
        vipClients,
        totalStaff,
        revenue,
        expenses,
        profit: revenue - expenses,
        paidRevenue: paidRevenue._sum.amount ?? 0,
        margin: revenue > 0 ? Math.round(((revenue - expenses) / revenue) * 100) : 0,
      },
      recentBookings,
      monthly,
      tourPopularity: tourBookings.map(t => ({ name: t.tourName.split(' ').slice(0, 2).join(' '), bookings: t._count.id })),
    })
  } catch (e) {
    console.error(e)
    return err('Failed to load stats', 500)
  }
}
