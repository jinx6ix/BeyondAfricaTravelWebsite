'use client'
import { useEffect, useState, useCallback } from 'react'
import { Avatar, KpiCard, Spinner, Modal, Empty } from '@/components/ui'
import toast from 'react-hot-toast'

const DEPTS = ['OPERATIONS','SALES','FINANCE','MARKETING']
const DEPT_COLORS: Record<string,string> = { OPERATIONS:'#1B3A2D', SALES:'#7c3aed', FINANCE:'#2563eb', MARKETING:'#d97706' }

export default function StaffPage() {
  const [staff, setStaff] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name:'', role:'', department:'OPERATIONS', phone:'', email:'', toursLed:0, rating:0 })

  const load = useCallback(() => {
    setLoading(true)
    fetch('/api/staff').then(r=>r.json()).then(d=>setStaff(d.data||[])).finally(()=>setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/staff', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      toast.success('Staff member added!')
      setShowAdd(false)
      setForm({ name:'', role:'', department:'OPERATIONS', phone:'', email:'', toursLed:0, rating:0 })
      load()
    } catch { toast.error('Failed to add staff') } finally { setSaving(false) }
  }

  async function del(id: string) {
    if (!confirm('Remove this staff member?')) return
    await fetch(`/api/staff/${id}`, { method: 'DELETE' })
    setStaff(prev => prev.filter(s => s.id !== id))
    toast.success('Staff member removed')
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-3xl text-forest">Staff Management</h1>
          <p className="text-gray-500 text-sm mt-1">{staff.length} team members</p>
        </div>
        <button className="btn-gold text-sm" onClick={()=>setShowAdd(true)}>+ Add Staff Member</button>
      </div>

      {/* Dept KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {DEPTS.map(dept => (
          <KpiCard key={dept} icon={dept==='OPERATIONS'?'🧭':dept==='SALES'?'💼':dept==='FINANCE'?'💰':'📣'}
            label={`${dept.charAt(0)+dept.slice(1).toLowerCase()} dept`}
            value={staff.filter(s=>s.department===dept).length}
            color={DEPT_COLORS[dept]} />
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={32}/></div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-cream/40">
                  {['Staff Member','Role','Department','Contact','Tours Led','Rating','Actions'].map(h=>(
                    <th key={h} className="table-th">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {staff.map(m => (
                  <tr key={m.id} className="hover:bg-cream/30 transition-colors">
                    <td className="table-td">
                      <div className="flex items-center gap-3"><Avatar name={m.name} size={36}/><span className="font-medium">{m.name}</span></div>
                    </td>
                    <td className="table-td text-gray-600 text-xs">{m.role}</td>
                    <td className="table-td">
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg"
                        style={{background:`${DEPT_COLORS[m.department]}18`,color:DEPT_COLORS[m.department]}}>
                        {m.department}
                      </span>
                    </td>
                    <td className="table-td">
                      <div className="text-xs text-gray-600">{m.phone}</div>
                      <div className="text-[11px] text-gray-500">{m.email}</div>
                    </td>
                    <td className="table-td text-center font-medium">{m.toursLed||'—'}</td>
                    <td className="table-td text-center">
                      {m.rating>0 ? <span className={`font-semibold text-sm ${m.rating>=4.8?'text-green-600':''}`}>★ {m.rating}</span> : '—'}
                    </td>
                    <td className="table-td">
                      <button onClick={()=>del(m.id)} className="btn-danger">Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {staff.length === 0 && <Empty icon="🧑‍💼" message="No staff members found." />}
        </div>
      )}

      {showAdd && (
        <Modal title="Add Staff Member" onClose={()=>setShowAdd(false)}>
          <form onSubmit={handleAdd} className="space-y-3">
            <div><label className="label">Full Name *</label><input required className="input" placeholder="Staff member's name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
            <div><label className="label">Role / Job Title *</label><input required className="input" placeholder="e.g. Safari Guide" value={form.role} onChange={e=>setForm({...form,role:e.target.value})} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="label">Phone</label><input type="tel" className="input" placeholder="+254 7XX" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} /></div>
              <div><label className="label">Email *</label><input required type="email" className="input" placeholder="name@savanna.co.ke" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></div>
            </div>
            <div>
              <label className="label">Department</label>
              <select className="input" value={form.department} onChange={e=>setForm({...form,department:e.target.value})}>
                {DEPTS.map(d=><option key={d} value={d}>{d.charAt(0)+d.slice(1).toLowerCase()}</option>)}
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center py-2.5">{saving?'Saving...':'Add Member'}</button>
              <button type="button" onClick={()=>setShowAdd(false)} className="btn-outline flex-1 justify-center py-2.5">Cancel</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
