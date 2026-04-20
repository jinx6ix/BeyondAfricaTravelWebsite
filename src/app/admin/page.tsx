'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { KpiCard, Badge, Spinner } from '@/components/ui'

const COLORS = ['#1B3A2D','#C9943A','#4A235A','#1A5276','#78410A','#1E5631']

function fmt(n: number) { return '$' + n.toLocaleString() }
function fdate(d: string) { return new Date(d).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}) }

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then(d => setData(d.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-20"><Spinner size={36} /></div>
  if (!data) return <p className="text-red-600 py-10">Failed to load dashboard data.</p>

  const { kpis, recentBookings, monthly, tourPopularity } = data

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-3xl text-forest">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back. Here's what's happening at Savanna & Beyond today.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard icon="💰" label="Confirmed Revenue" value={fmt(kpis.paidRevenue)} sub={`${kpis.margin}% margin`} color="#16a34a" />
        <KpiCard icon="📋" label="Total Bookings" value={kpis.totalBookings} sub={`${kpis.confirmedBookings} confirmed`} color="#1B3A2D" />
        <KpiCard icon="⏳" label="Pending" value={kpis.pendingBookings} sub="Need attention" color="#d97706" />
        <KpiCard icon="👥" label="Clients" value={kpis.totalClients} sub={`${kpis.vipClients} VIP`} color="#7c3aed" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="card">
          <h3 className="font-serif text-[16px] text-forest mb-4">Revenue vs Expenses — 6 Months</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthly} barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDE5D6" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `$${v/1000}k`} />
              <Tooltip formatter={(v: number) => fmt(v)} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="revenue" name="Revenue" fill="#1B3A2D" radius={[4,4,0,0]} />
              <Bar dataKey="expenses" name="Expenses" fill="#C9943A" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="font-serif text-[16px] text-forest mb-4">Bookings by Tour</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={tourPopularity} dataKey="bookings" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                {tourPopularity.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent bookings */}
      <div className="card p-0 overflow-hidden">
        <div className="flex justify-between items-center px-5 py-4 border-b border-cream-border">
          <h3 className="font-serif text-[16px] text-forest">Recent Bookings</h3>
          <Link href="/admin/bookings" className="btn-primary text-xs px-3 py-1.5">View All →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-cream/40">
                {['Client','Tour','Date','Amount','Status','Payment'].map(h => (
                  <th key={h} className="table-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((b: any) => (
                <tr key={b.id} className="hover:bg-cream/30 transition-colors">
                  <td className="table-td">
                    <div className="font-medium text-sm">{b.clientName}</div>
                    <div className="text-[11px] text-gray-500">{b.clientEmail}</div>
                  </td>
                  <td className="table-td text-gray-600 text-xs">{b.tourName}</td>
                  <td className="table-td text-xs text-gray-500 whitespace-nowrap">{fdate(b.travelDate)}</td>
                  <td className="table-td font-semibold whitespace-nowrap">{fmt(b.amount)}</td>
                  <td className="table-td"><Badge status={b.status} /></td>
                  <td className="table-td"><Badge status={b.paymentStatus} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
