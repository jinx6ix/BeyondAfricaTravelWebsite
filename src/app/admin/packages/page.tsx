'use client'
import { useEffect, useState, useCallback } from 'react'
import { Spinner, Modal, Empty } from '@/components/ui'
import toast from 'react-hot-toast'

function fmt(n: number) { return '$' + n.toLocaleString() }

const CATS = ['SAFARI','BEACH','ADVENTURE','WILDLIFE','CULTURAL']

export default function PackagesPage() {
  const [tours, setTours] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name:'', destination:'Kenya', category:'SAFARI', days:5, nights:4,
    price:0, maxGroup:12, emoji:'🌍', description:'', featured:false
  })

  const load = useCallback(() => {
    setLoading(true)
    fetch('/api/tours').then(r=>r.json()).then(d=>setTours(d.data||[])).finally(()=>setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/tours', {
        method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form),
      })
      if (!res.ok) { const d=await res.json(); throw new Error(d.error) }
      toast.success('Tour package created!')
      setShowAdd(false)
      setForm({ name:'', destination:'Kenya', category:'SAFARI', days:5, nights:4, price:0, maxGroup:12, emoji:'🌍', description:'', featured:false })
      load()
    } catch (e:any) { toast.error(e.message || 'Failed to create tour') } finally { setSaving(false) }
  }

  async function toggleActive(id: number, active: boolean) {
    await fetch(`/api/tours/${id}`, {
      method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({active:!active}),
    })
    setTours(prev => prev.map(t => t.id===id ? {...t, active:!active} : t))
    toast.success(active ? 'Tour deactivated' : 'Tour activated')
  }

  async function toggleFeatured(id: number, featured: boolean) {
    await fetch(`/api/tours/${id}`, {
      method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({featured:!featured}),
    })
    setTours(prev => prev.map(t => t.id===id ? {...t, featured:!featured} : t))
    toast.success(featured ? 'Removed from featured' : 'Marked as featured')
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-3xl text-forest">Tour Packages</h1>
          <p className="text-gray-500 text-sm mt-1">{tours.length} packages · {tours.filter(t=>t.featured).length} featured</p>
        </div>
        <button className="btn-gold text-sm" onClick={()=>setShowAdd(true)}>+ New Package</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={32}/></div>
      ) : tours.length === 0 ? (
        <Empty icon="✈️" message="No tour packages found." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tours.map(t => (
            <div key={t.id} className={`card hover:shadow-modal transition-shadow ${!t.active ? 'opacity-60' : ''}`}>
              <div className="flex gap-4 items-start mb-4">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{background:`linear-gradient(135deg,${t.color},${t.color}99)`}}>{t.emoji}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-[17px] text-forest truncate">{t.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">📍 {t.destination} · {t.category}</p>
                  {t.rating > 0 && <p className="text-xs text-gold mt-0.5">★ {t.rating} ({t.reviewCount} reviews)</p>}
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-2">{t.description}</p>
              <div className="flex gap-4 text-xs text-gray-500 mb-4">
                <span>🗓 {t.days}D/{t.nights}N</span>
                <span>👥 Max {t.maxGroup}</span>
                <span>{t.featured ? '⭐ Featured' : ''}</span>
              </div>
              <div className="flex justify-between items-center border-t border-cream-border pt-4">
                <div>
                  <span className="font-serif text-xl font-bold text-forest">{fmt(t.price)}</span>
                  <span className="text-xs text-gray-500">/pp</span>
                </div>
                <div className="flex gap-2 flex-wrap justify-end">
                  <button onClick={()=>toggleFeatured(t.id,t.featured)}
                    className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${t.featured?'bg-gold/10 text-gold border-gold/30':'bg-gray-100 text-gray-500 border-gray-200 hover:border-gold'}`}>
                    {t.featured?'Unfeature':'Feature'}
                  </button>
                  <button onClick={()=>toggleActive(t.id,t.active)}
                    className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${t.active?'btn-danger':'bg-green-100 text-green-700 border-green-200 hover:bg-green-200'}`}>
                    {t.active?'Deactivate':'Activate'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <Modal title="New Tour Package" onClose={()=>setShowAdd(false)}>
          <form onSubmit={handleAdd} className="space-y-3">
            <div><label className="label">Package Name *</label><input required className="input" placeholder="e.g. Serengeti Migration Safari" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
            <div className="grid grid-cols-3 gap-3">
              <div><label className="label">Destination</label><input className="input" placeholder="Kenya" value={form.destination} onChange={e=>setForm({...form,destination:e.target.value})} /></div>
              <div>
                <label className="label">Category</label>
                <select className="input" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
                  {CATS.map(c=><option key={c} value={c}>{c.charAt(0)+c.slice(1).toLowerCase()}</option>)}
                </select>
              </div>
              <div><label className="label">Emoji</label><input className="input" placeholder="🌍" value={form.emoji} onChange={e=>setForm({...form,emoji:e.target.value})} /></div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div><label className="label">Days</label><input type="number" className="input" value={form.days} onChange={e=>setForm({...form,days:Number(e.target.value)})} /></div>
              <div><label className="label">Nights</label><input type="number" className="input" value={form.nights} onChange={e=>setForm({...form,nights:Number(e.target.value)})} /></div>
              <div><label className="label">Price $</label><input type="number" className="input" placeholder="1850" value={form.price||''} onChange={e=>setForm({...form,price:Number(e.target.value)})} /></div>
              <div><label className="label">Max</label><input type="number" className="input" value={form.maxGroup} onChange={e=>setForm({...form,maxGroup:Number(e.target.value)})} /></div>
            </div>
            <div><label className="label">Description</label><textarea className="input min-h-[80px] resize-none" placeholder="Brief description..." value={form.description} onChange={e=>setForm({...form,description:e.target.value})} /></div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="featured" checked={form.featured} onChange={e=>setForm({...form,featured:e.target.checked})} className="w-4 h-4 accent-forest" />
              <label htmlFor="featured" className="text-sm text-gray-700 cursor-pointer">Feature on homepage</label>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center py-2.5">{saving?'Saving...':'Create Package'}</button>
              <button type="button" onClick={()=>setShowAdd(false)} className="btn-outline flex-1 justify-center py-2.5">Cancel</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
