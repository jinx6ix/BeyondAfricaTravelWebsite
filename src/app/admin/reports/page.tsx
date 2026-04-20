'use client'
import { useEffect, useState } from 'react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { KpiCard, Spinner } from '@/components/ui'

function fmt(n: number) { return '$' + n.toLocaleString() }

const COLORS = ['#1B3A2D','#C9943A','#4A235A','#1A5276','#78410A','#1E5631']
const STATUS_COLORS: Record<string,string> = { CONFIRMED:'#16a34a', PENDING:'#d97706', COMPLETED:'#2563eb', CANCELLED:'#dc2626' }

export default function ReportsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/stats').then(r=>r.json()).then(d=>setData(d.data)).finally(()=>setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-20"><Spinner size={36}/></div>
  if (!data) return <p className="text-red-500 py-10">Failed to load reports.</p>

  const { kpis, monthly, tourPopularity } = data

  const statusData = [
    { name:'Confirmed', value:kpis.confirmedBookings, color:STATUS_COLORS.CONFIRMED },
    { name:'Pending', value:kpis.pendingBookings, color:STATUS_COLORS.PENDING },
    { name:'Completed', value:kpis.totalBookings - kpis.confirmedBookings - kpis.pendingBookings, color:STATUS_COLORS.COMPLETED },
  ].filter(s => s.value > 0)

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-3xl text-forest">Reports & Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Live agency performance overview from your database</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <KpiCard icon="💰" label="Gross Revenue" value={fmt(kpis.revenue)} color="#16a34a" />
        <KpiCard icon="📋" label="Total Bookings" value={kpis.totalBookings} color="#1B3A2D" />
        <KpiCard icon="👥" label="Total Clients" value={kpis.totalClients} color="#7c3aed" />
        <KpiCard icon="📊" label="Profit Margin" value={`${kpis.margin}%`} color="#d97706" />
        <KpiCard icon="⭐" label="VIP Clients" value={kpis.vipClients} color="#C9943A" />
      </div>

      {/* Revenue vs Expenses 6-month */}
      <div className="card mb-5">
        <h3 className="font-serif text-[16px] text-forest mb-4">6-Month Revenue & Expense Trend</h3>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={monthly}>
            <CartesianGrid strokeDasharray="3 3" stroke="#EDE5D6" />
            <XAxis dataKey="month" tick={{fontSize:11}} />
            <YAxis tick={{fontSize:11}} tickFormatter={v=>`$${v/1000}k`} />
            <Tooltip formatter={(v:number)=>fmt(v)} />
            <Legend wrapperStyle={{fontSize:12}} />
            <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#1B3A2D" strokeWidth={2.5} dot={{r:4}} />
            <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#C9943A" strokeWidth={2} strokeDasharray="5 5" dot={{r:4}} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Tour popularity */}
        <div className="card">
          <h3 className="font-serif text-[16px] text-forest mb-4">Tour Popularity by Bookings</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={tourPopularity} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDE5D6" />
              <XAxis dataKey="name" tick={{fontSize:10}} angle={-15} textAnchor="end" height={44}/>
              <YAxis tick={{fontSize:11}} />
              <Tooltip />
              <Bar dataKey="bookings" radius={[4,4,0,0]}>
                {tourPopularity.map((_:any,i:number)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Booking status doughnut */}
        <div className="card">
          <h3 className="font-serif text-[16px] text-forest mb-4">Booking Status Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                label={({name,percent})=>`${name} ${Math.round(percent*100)}%`} labelLine={false}>
                {statusData.map((e:any,i:number)=><Cell key={i} fill={e.color}/>)}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{fontSize:12}} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue bar by month */}
      <div className="card">
        <h3 className="font-serif text-[16px] text-forest mb-4">Monthly Revenue Breakdown</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthly} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="#EDE5D6" />
            <XAxis dataKey="month" tick={{fontSize:11}} />
            <YAxis tick={{fontSize:11}} tickFormatter={v=>`$${v/1000}k`} />
            <Tooltip formatter={(v:number)=>fmt(v)} />
            <Bar dataKey="revenue" name="Revenue" fill="#1B3A2D" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
