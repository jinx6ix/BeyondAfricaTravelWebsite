'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Spinner, Empty } from '@/components/ui'

const CATS = ['All', 'SAFARI', 'BEACH', 'ADVENTURE', 'WILDLIFE', 'CULTURAL']
type SortKey = 'rating' | 'price-asc' | 'price-desc' | 'days'

export default function ToursPage() {
  const [tours, setTours] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('All')
  const [sort, setSort] = useState<SortKey>('rating')

  const load = useCallback(() => {
    setLoading(true)
    setError('')
    const p = new URLSearchParams()
    if (search) p.set('search', search)
    if (cat !== 'All') p.set('category', cat)
    fetch(`/api/tours?${p}`)
      .then(async r => {
        if (!r.ok) throw new Error(`Server error ${r.status}`)
        return r.json()
      })
      .then(d => setTours(Array.isArray(d.data) ? d.data : []))
      .catch(e => setError(e.message || 'Failed to load tours'))
      .finally(() => setLoading(false))
  }, [search, cat])

  useEffect(() => { load() }, [load])

  const sorted = [...tours].sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price
    if (sort === 'price-desc') return b.price - a.price
    if (sort === 'days') return a.days - b.days
    return b.rating - a.rating
  })

  return (
    <>
      <Navbar />
      <main>
        <div className="page-hero">
          <h1 className="font-serif text-white text-[clamp(30px,5vw,52px)]">Tours & Packages</h1>
          <p className="text-white/70 mt-2">{loading ? 'Loading...' : `${sorted.length} experiences across East Africa`}</p>
        </div>

        {/* Filters */}
        <div className="bg-white border-b border-cream-border px-[5%] py-3.5 sticky top-16 z-40 flex gap-3 flex-wrap items-center">
          <input
            className="input flex-1 min-w-[180px] max-w-xs py-2"
            placeholder="🔍 Search tours or destinations..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="flex gap-2 flex-wrap">
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${cat === c ? 'bg-forest text-white border-forest' : 'bg-white text-gray-700 border-cream-border hover:border-forest'}`}>
                {c === 'All' ? 'All' : c.charAt(0) + c.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
          <select className="input max-w-[170px] py-2" value={sort} onChange={e => setSort(e.target.value as SortKey)}>
            <option value="rating">Top Rated</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="days">Shortest First</option>
          </select>
        </div>

        <section className="section bg-cream">
          <div className="container-main">
            {loading ? (
              <div className="flex justify-center py-20"><Spinner size={32} /></div>
            ) : error ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">⚠️</div>
                <p className="text-red-600 font-medium mb-2">Could not load tours</p>
                <p className="text-gray-500 text-sm mb-6">{error}</p>
                <p className="text-gray-400 text-xs max-w-sm mx-auto">Make sure you have run <code className="bg-gray-100 px-1.5 py-0.5 rounded">npx prisma db push</code> and <code className="bg-gray-100 px-1.5 py-0.5 rounded">npm run db:seed</code> and that your <code className="bg-gray-100 px-1.5 py-0.5 rounded">.env.local</code> has a valid DATABASE_URL.</p>
                <button onClick={load} className="btn-primary mt-6">Try Again</button>
              </div>
            ) : sorted.length === 0 ? (
              <Empty icon="🔍" message="No tours match your search. Try adjusting your filters." />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sorted.map((tour: any) => (
                  <Link key={tour.id} href={`/tours/${tour.id}`}>
                    <article className="bg-white rounded-2xl border border-cream-border shadow-card overflow-hidden cursor-pointer transition-all hover:-translate-y-1 hover:shadow-modal group">
                      <div className="h-44 flex items-center justify-center relative text-6xl"
                        style={{ background: `linear-gradient(135deg, ${tour.color}, ${tour.color}bb)` }}>
                        <span>{tour.emoji}</span>
                        <span className="absolute top-3 left-3 bg-black/40 text-white text-[11px] px-3 py-1 rounded-full">
                          {tour.category.charAt(0) + tour.category.slice(1).toLowerCase()}
                        </span>
                        <span className="absolute top-3 right-3 bg-gold text-white text-[11px] px-3 py-1 rounded-full font-semibold">
                          ★ {tour.rating}
                        </span>
                      </div>
                      <div className="p-5">
                        <p className="text-[11px] text-gray-500 mb-1">📍 {tour.destination}</p>
                        <h3 className="font-serif text-[19px] text-forest mb-1.5 group-hover:text-forest-light transition-colors">{tour.name}</h3>
                        <p className="text-xs text-gray-500 mb-3 leading-relaxed line-clamp-2">{tour.description}</p>
                        <div className="flex gap-3 text-[11px] text-gray-500 mb-4">
                          <span>🗓 {tour.days} Days</span>
                          <span>👥 Max {tour.maxGroup}</span>
                          <span>💬 {tour.reviewCount} reviews</span>
                        </div>
                        <div className="flex justify-between items-center border-t border-cream-border pt-3">
                          <div>
                            <span className="text-[11px] text-gray-500">From </span>
                            <span className="font-serif text-[22px] font-bold text-forest">${tour.price.toLocaleString()}</span>
                            <span className="text-[11px] text-gray-500">/pp</span>
                          </div>
                          <span className="btn-primary text-xs px-3 py-1.5">View →</span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
        <Footer />
      </main>
    </>
  )
}
