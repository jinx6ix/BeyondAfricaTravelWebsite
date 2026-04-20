'use client'
import { useEffect, useState, useCallback } from 'react'
import { Avatar, Badge, Spinner, Modal, Empty } from '@/components/ui'
import toast from 'react-hot-toast'

function fmt(n: number) { return '$' + n.toLocaleString() }

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name:'', email:'', phone:'', nationality:'', status:'NEW' })

  const load = useCallback(() => {
    setLoading(true)
    const p = new URLSearchParams()
    if (search) p.set('search', search)
    fetch(`/api/clients?${p}`)
      .then(r => r.json())
      .then(d => setClients(d.data || []))
      .finally(() => setLoading(false))
  }, [search])

  useEffect(() => { load() }, [load])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      toast.success('Client added!')
      setShowAdd(false)
      setForm({ name:'', email:'', phone:'', nationality:'', status:'NEW' })
      load()
    } catch {
      toast.error('Failed to add client')
    } finally {
      setSaving(false)
    }
  }

  async function del(id: string) {
    if (!confirm('Delete this client?')) return
    await fetch(`/api/clients/${id}`, { method: 'DELETE' })
    setClients(prev => prev.filter(c => c.id !== id))
    toast.success('Client removed')
  }

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/clients/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setClients(prev => prev.map(c => c.id === id ? { ...c, status } : c))
    toast.success('Status updated')
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-3xl text-forest">Client CRM</h1>
          <p className="text-gray-500 text-sm mt-1">
            {clients.length} clients · {clients.filter(c => c.status === 'VIP').length} VIP
          </p>
        </div>
        <button className="btn-gold text-sm" onClick={() => setShowAdd(true)}>+ Add Client</button>
      </div>

      <input className="input max-w-sm mb-5 py-2" placeholder="🔍 Search clients..."
        value={search} onChange={e => setSearch(e.target.value)} />

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={32} /></div>
      ) : clients.length === 0 ? (
        <Empty icon="👥" message="No clients found." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {clients.map(c => (
            <div key={c.id} className="card relative hover:shadow-modal transition-shadow">
              <button onClick={() => del(c.id)}
                className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl leading-none transition-colors">×</button>
              <div className="flex gap-3 items-start mb-4">
                <Avatar name={c.name} size={44} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate pr-6">{c.name}</div>
                  <div className="text-[11px] text-gray-500">{c.nationality || 'Unknown'}</div>
                  <div className="mt-1.5">
                    <select value={c.status}
                      onChange={e => updateStatus(c.id, e.target.value)}
                      className="text-[10px] border border-cream-border rounded-lg px-2 py-1 bg-white outline-none cursor-pointer">
                      {['NEW','ACTIVE','VIP'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div className="space-y-1 mb-4 text-xs text-gray-500">
                <div className="truncate">✉️ {c.email}</div>
                {c.phone && <div>📞 {c.phone}</div>}
              </div>
              <div className="flex justify-between border-t border-cream-border pt-3">
                <div className="text-center">
                  <div className="font-serif text-xl font-bold text-forest">{c.totalTrips}</div>
                  <div className="text-[10px] text-gray-500">Trips</div>
                </div>
                <div className="text-center">
                  <div className="font-serif text-xl font-bold text-forest">{fmt(c.totalSpent)}</div>
                  <div className="text-[10px] text-gray-500">Spent</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <Modal title="Add New Client" onClose={() => setShowAdd(false)}>
          <form onSubmit={handleAdd} className="space-y-3">
            <div><label className="label">Full Name *</label><input required className="input" placeholder="Client's full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
            <div><label className="label">Email *</label><input required type="email" className="input" placeholder="email@example.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="label">Phone</label><input type="tel" className="input" placeholder="+1 555 0000" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} /></div>
              <div><label className="label">Nationality</label><input className="input" placeholder="e.g. British" value={form.nationality} onChange={e=>setForm({...form,nationality:e.target.value})} /></div>
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
                {['NEW','ACTIVE','VIP'].map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center py-2.5">{saving?'Saving...':'Add Client'}</button>
              <button type="button" onClick={()=>setShowAdd(false)} className="btn-outline flex-1 justify-center py-2.5">Cancel</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
