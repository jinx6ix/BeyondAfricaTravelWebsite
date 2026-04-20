'use client'
import { useEffect, useState, useCallback } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { KpiCard, Badge, Spinner, Modal, Empty } from '@/components/ui'
import toast from 'react-hot-toast'

function fmt(n: number) { return '$' + n.toLocaleString() }
function fdate(d: string) { return new Date(d).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}) }

type Filter = 'All'|'INCOME'|'EXPENSE'

export default function FinancesPage() {
  const [finances, setFinances] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>('All')
  const [showAdd, setShowAdd] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ type:'INCOME', category:'Booking', description:'', amount:0, date:new Date().toISOString().slice(0,10), status:'RECEIVED' })

  const load = useCallback(() => {
    setLoading(true)
    const p = new URLSearchParams()
    if (filter !== 'All') p.set('type', filter)
    fetch(`/api/finances?${p}`).then(r=>r.json()).then(d=>setFinances(d.data||[])).finally(()=>setLoading(false))
  }, [filter])

  useEffect(() => { load() }, [load])

  const income = finances.filter(f=>f.type==='INCOME').reduce((s,f)=>s+f.amount,0)
  const expense = finances.filter(f=>f.type==='EXPENSE').reduce((s,f)=>s+f.amount,0)
  const profit = income - expense
  const margin = income > 0 ? Math.round((profit/income)*100) : 0

  const expByCat = ['Accommodation','Park Fees','Staff','Transport','Marketing','Insurance'].map(cat=>({
    cat, total: finances.filter(f=>f.type==='EXPENSE'&&f.category===cat).reduce((s,f)=>s+f.amount,0)
  })).filter(e=>e.total>0)

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/finances', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({...form, status: form.type==='INCOME'?'RECEIVED':'PAID'}),
      })
      if (!res.ok) throw new Error()
      toast.success('Entry added!')
      setShowAdd(false)
      setForm({ type:'INCOME', category:'Booking', description:'', amount:0, date:new Date().toISOString().slice(0,10), status:'RECEIVED' })
      load()
    } catch { toast.error('Failed to add entry') } finally { setSaving(false) }
  }

  async function del(id: string) {
    if (!confirm('Delete this entry?')) return
    await fetch(`/api/finances/${id}`, { method:'DELETE' })
    setFinances(prev => prev.filter(f=>f.id!==id))
    toast.success('Entry deleted')
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-3xl text-forest">Financial Tracker</h1>
          <p className="text-gray-500 text-sm mt-1">P&amp;L overview — income, expenses and profitability</p>
        </div>
        <button className="btn-gold text-sm" onClick={()=>setShowAdd(true)}>+ Add Entry</button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <KpiCard icon="📈" label="Total Income" value={fmt(income)} sub="All time received" color="#16a34a" />
        <KpiCard icon="📉" label="Total Expenses" value={fmt(expense)} sub="All time paid out" color="#dc2626" />
        <KpiCard icon="💵" label="Net Profit" value={fmt(profit)} sub={`${margin}% profit margin`} color={profit>=0?'#1B3A2D':'#dc2626'} />
      </div>

      {/* Charts */}
      {expByCat.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
          <div className="card">
            <h3 className="font-serif text-[16px] text-forest mb-4">Expense Breakdown by Category</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={expByCat} layout="vertical" barSize={14}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EDE5D6" horizontal={false} />
                <XAxis type="number" tick={{fontSize:11}} tickFormatter={v=>`$${v}`} />
                <YAxis dataKey="cat" type="category" tick={{fontSize:11}} width={100} />
                <Tooltip formatter={(v:number)=>fmt(v)} />
                <Bar dataKey="total" fill="#1B3A2D" radius={[0,4,4,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <h3 className="font-serif text-[16px] text-forest mb-4">Income vs Expense Trend</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={
                Object.entries(
                  finances.reduce((acc: Record<string,any>, f) => {
                    const m = new Date(f.date).toLocaleDateString('en',{month:'short'})
                    if (!acc[m]) acc[m] = { month:m, income:0, expense:0 }
                    if (f.type==='INCOME') acc[m].income += f.amount
                    else acc[m].expense += f.amount
                    return acc
                  }, {})
                ).map(([,v])=>v).slice(-6)
              }>
                <CartesianGrid strokeDasharray="3 3" stroke="#EDE5D6" />
                <XAxis dataKey="month" tick={{fontSize:11}} />
                <YAxis tick={{fontSize:11}} tickFormatter={v=>`$${v/1000}k`} />
                <Tooltip formatter={(v:number)=>fmt(v)} />
                <Line type="monotone" dataKey="income" name="Income" stroke="#1B3A2D" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="expense" name="Expense" stroke="#C9943A" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Transactions table */}
      <div className="card p-0 overflow-hidden">
        <div className="flex justify-between items-center px-5 py-4 border-b border-cream-border">
          <h3 className="font-serif text-[16px] text-forest">Transactions</h3>
          <div className="flex gap-2">
            {(['All','INCOME','EXPENSE'] as Filter[]).map(f=>(
              <button key={f} onClick={()=>setFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${filter===f?'bg-forest text-white border-forest':'bg-white text-gray-700 border-cream-border hover:border-forest'}`}>
                {f.charAt(0)+f.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center py-10"><Spinner size={28}/></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-cream/40">
                  {['Date','Description','Category','Type','Amount','Status','Actions'].map(h=>(
                    <th key={h} className="table-th">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {finances.map(f=>(
                  <tr key={f.id} className="hover:bg-cream/30 transition-colors">
                    <td className="table-td text-xs text-gray-500 whitespace-nowrap">{fdate(f.date)}</td>
                    <td className="table-td max-w-[220px] text-sm">{f.description}</td>
                    <td className="table-td text-xs text-gray-500">{f.category}</td>
                    <td className="table-td"><Badge status={f.type} /></td>
                    <td className={`table-td font-bold whitespace-nowrap ${f.type==='INCOME'?'text-green-600':'text-red-600'}`}>
                      {f.type==='INCOME'?'+':'-'}{fmt(f.amount)}
                    </td>
                    <td className="table-td"><Badge status={f.status} /></td>
                    <td className="table-td">
                      <button onClick={()=>del(f.id)} className="btn-danger">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {finances.length === 0 && <Empty icon="💰" message="No financial entries found." />}
          </div>
        )}
      </div>

      {showAdd && (
        <Modal title="Add Financial Entry" onClose={()=>setShowAdd(false)}>
          <form onSubmit={handleAdd} className="space-y-3">
            <div>
              <label className="label">Type</label>
              <select className="input" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
                <option value="INCOME">Income</option>
                <option value="EXPENSE">Expense</option>
              </select>
            </div>
            <div><label className="label">Description *</label><input required className="input" placeholder="e.g. Booking payment – Client Name" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} /></div>
            <div><label className="label">Category</label>
              <select className="input" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
                {['Booking','Commission','Accommodation','Park Fees','Staff','Transport','Marketing','Insurance','Other'].map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="label">Amount (USD) *</label><input required type="number" className="input" placeholder="e.g. 1500" value={form.amount||''} onChange={e=>setForm({...form,amount:Number(e.target.value)})} /></div>
              <div><label className="label">Date</label><input type="date" className="input" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} /></div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center py-2.5">{saving?'Saving...':'Add Entry'}</button>
              <button type="button" onClick={()=>setShowAdd(false)} className="btn-outline flex-1 justify-center py-2.5">Cancel</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
