'use client'
import { useEffect, useState, useCallback } from 'react'
import { Badge, Spinner, Modal, Empty } from '@/components/ui'
import toast from 'react-hot-toast'

function fmt(n: number) { return '$' + n.toLocaleString() }
function fdate(d: string) { return new Date(d).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}) }

const STATUS_OPTS = ['PENDING','CONFIRMED','COMPLETED','CANCELLED']
const PAY_OPTS = ['UNPAID','DEPOSIT','PARTIAL','PAID']

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [showAdd, setShowAdd] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ clientName:'', clientEmail:'', clientPhone:'', tourName:'', travelDate:'', pax:2, amount:0 })

  const load = useCallback(() => {
    setLoading(true)
    const p = new URLSearchParams()
    if (search) p.set('search', search)
    if (filter !== 'All') p.set('status', filter)
    fetch(`/api/bookings?${p}`)
      .then(r => r.json())
      .then(d => setBookings(d.data || []))
      .finally(() => setLoading(false))
  }, [search, filter])

  useEffect(() => { load() }, [load])

  async function updateField(id: string, field: string, value: string) {
    await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: value }),
    })
    setBookings(prev => prev.map(b => b.id === id ? { ...b, [field]: value } : b))
    toast.success('Updated')
  }

  async function del(id: string) {
    if (!confirm('Delete this booking?')) return
    await fetch(`/api/bookings/${id}`, { method: 'DELETE' })
    setBookings(prev => prev.filter(b => b.id !== id))
    toast.success('Booking deleted')
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      toast.success('Booking created!')
      setShowAdd(false)
      setForm({ clientName:'', clientEmail:'', clientPhone:'', tourName:'', travelDate:'', pax:2, amount:0 })
      load()
    } catch {
      toast.error('Failed to create booking')
    } finally {
      setSaving(false)
    }
  }

  const total = bookings.reduce((s, b) => s + b.amount, 0)

  return (
    <div>
      <div className="flex justify-between items-start mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-3xl text-forest">Bookings</h1>
          <p className="text-gray-500 text-sm mt-1">{bookings.length} bookings · Total: {fmt(total)}</p>
        </div>
        <button className="btn-gold text-sm" onClick={() => setShowAdd(true)}>+ New Booking</button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5 flex-wrap items-center">
        <input className="input flex-1 min-w-[200px] max-w-xs py-2" placeholder="🔍 Search client or tour..."
          value={search} onChange={e => setSearch(e.target.value)} />
        <div className="flex gap-2 flex-wrap">
          {['All', ...STATUS_OPTS].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${filter===s ? 'bg-forest text-white border-forest' : 'bg-white text-gray-700 border-cream-border hover:border-forest'}`}>
              {s.charAt(0)+s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={32} /></div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-cream/40">
                  {['ID','Client','Tour','Date','Pax','Amount','Status','Payment','Actions'].map(h => (
                    <th key={h} className="table-th">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id} className="hover:bg-cream/30 transition-colors">
                    <td className="table-td font-mono text-[10px] text-gray-400">{b.id.slice(0,8)}</td>
                    <td className="table-td">
                      <div className="font-medium">{b.clientName}</div>
                      <div className="text-[11px] text-gray-500">{b.clientEmail}</div>
                    </td>
                    <td className="table-td text-gray-600 text-xs max-w-[140px] truncate">{b.tourName}</td>
                    <td className="table-td text-xs text-gray-500 whitespace-nowrap">{fdate(b.travelDate)}</td>
                    <td className="table-td text-center">{b.pax}</td>
                    <td className="table-td font-semibold whitespace-nowrap">{fmt(b.amount)}</td>
                    <td className="table-td">
                      <select value={b.status}
                        onChange={e => updateField(b.id, 'status', e.target.value)}
                        className="text-[11px] border border-cream-border rounded-lg px-2 py-1.5 bg-white outline-none focus:border-forest cursor-pointer">
                        {STATUS_OPTS.map(s => <option key={s} value={s}>{s.charAt(0)+s.slice(1).toLowerCase()}</option>)}
                      </select>
                    </td>
                    <td className="table-td">
                      <select value={b.paymentStatus}
                        onChange={e => updateField(b.id, 'paymentStatus', e.target.value)}
                        className="text-[11px] border border-cream-border rounded-lg px-2 py-1.5 bg-white outline-none focus:border-forest cursor-pointer">
                        {PAY_OPTS.map(s => <option key={s} value={s}>{s.charAt(0)+s.slice(1).toLowerCase()}</option>)}
                      </select>
                    </td>
                    <td className="table-td">
                      <button onClick={() => del(b.id)} className="btn-danger">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {bookings.length === 0 && <Empty icon="📋" message="No bookings found." />}
        </div>
      )}

      {showAdd && (
        <Modal title="New Booking" onClose={() => setShowAdd(false)}>
          <form onSubmit={handleAdd} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="label">Client Name *</label><input required className="input" placeholder="Full name" value={form.clientName} onChange={e=>setForm({...form,clientName:e.target.value})} /></div>
              <div><label className="label">Email *</label><input required type="email" className="input" placeholder="client@email.com" value={form.clientEmail} onChange={e=>setForm({...form,clientEmail:e.target.value})} /></div>
              <div><label className="label">Phone</label><input type="tel" className="input" placeholder="+254 7XX" value={form.clientPhone} onChange={e=>setForm({...form,clientPhone:e.target.value})} /></div>
              <div><label className="label">Tour Name *</label><input required className="input" placeholder="Tour name" value={form.tourName} onChange={e=>setForm({...form,tourName:e.target.value})} /></div>
              <div><label className="label">Travel Date *</label><input required type="date" className="input" value={form.travelDate} onChange={e=>setForm({...form,travelDate:e.target.value})} /></div>
              <div><label className="label">Amount (USD)</label><input type="number" className="input" placeholder="e.g. 3700" value={form.amount||''} onChange={e=>setForm({...form,amount:Number(e.target.value)})} /></div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center py-2.5">
                {saving ? 'Saving...' : 'Add Booking'}
              </button>
              <button type="button" onClick={() => setShowAdd(false)} className="btn-outline flex-1 justify-center py-2.5">Cancel</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
