'use client'
import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Stars, Spinner } from '@/components/ui'
import toast from 'react-hot-toast'

export default function TourDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const [tour, setTour] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'overview' | 'itinerary' | 'includes' | 'book'>('overview')
  const [submitting, setSubmitting] = useState(false)
  const [booked, setBooked] = useState(false)
  const [form, setForm] = useState({ clientName: '', clientEmail: '', clientPhone: '', travelDate: '', pax: 2, notes: '' })

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetch(`/api/tours/${id}`)
      .then(async r => {
        if (!r.ok) throw new Error()
        return r.json()
      })
      .then(d => setTour(d.data || null))
      .catch(() => setTour(null))
      .finally(() => setLoading(false))
  }, [id])

  async function handleBook(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          tourName: tour.name,
          tourId: tour.id,
          amount: tour.price * form.pax,
        }),
      })
      if (!res.ok) throw new Error()
      setBooked(true)
      toast.success('Booking request sent!')
    } catch {
      toast.error('Failed to submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-[60vh]">
          <Spinner size={36} />
        </div>
      </>
    )
  }

  if (!tour) {
    return (
      <>
        <Navbar />
        <div className="text-center py-20">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="font-serif text-2xl text-forest mb-2">Tour Not Found</h2>
          <p className="text-gray-500 mb-6">This tour may not exist or the database hasn't been seeded yet.</p>
          <Link href="/tours" className="btn-primary">Back to Tours</Link>
        </div>
        <Footer />
      </>
    )
  }

  const tabs = ['overview', 'itinerary', 'includes', 'book'] as const

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <div className="h-[52vh] min-h-[300px] flex items-center justify-center relative text-center"
          style={{ background: `linear-gradient(180deg, ${tour.color}cc, ${tour.color})` }}>
          <Link href="/tours" className="absolute top-5 left-[5%] btn-ghost text-xs">← Back to Tours</Link>
          <div>
            <span className="text-[80px] block mb-3">{tour.emoji}</span>
            <span className="bg-black/30 text-white text-xs px-3 py-1 rounded-full">
              {tour.category} · {tour.destination}
            </span>
            <h1 className="font-serif text-white text-[clamp(26px,5vw,52px)] mt-2">{tour.name}</h1>
            <p className="text-white/80 text-sm mt-2">
              <Stars rating={tour.rating} /> {tour.rating} ({tour.reviewCount} reviews) · {tour.days} Days / {tour.nights} Nights
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-cream-border sticky top-16 z-40 px-[5%]">
          <div className="flex overflow-x-auto">
            {tabs.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-6 py-4 text-sm font-medium transition-all border-b-2 whitespace-nowrap ${tab === t ? 'text-forest border-forest' : 'text-gray-500 border-transparent hover:text-forest'}`}>
                {t === 'book' ? '📅 Book Now' : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <section className="section bg-cream">
          <div className="container-main grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 items-start">
            <div>
              {tab === 'overview' && (
                <div>
                  <h2 className="font-serif text-3xl text-forest mb-4">About This Experience</h2>
                  <p className="text-gray-600 leading-relaxed mb-8 text-[15px]">{tour.description}</p>
                  {tour.highlights?.length > 0 && (
                    <>
                      <h3 className="font-serif text-xl text-forest mb-4">Highlights</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {tour.highlights.map((h: string) => (
                          <div key={h} className="flex gap-3 items-start bg-white p-3.5 rounded-xl border border-cream-border">
                            <span className="text-gold font-bold text-sm mt-0.5">✓</span>
                            <span className="text-sm">{h}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  {tour.reviews?.length > 0 && (
                    <div className="mt-10">
                      <h3 className="font-serif text-xl text-forest mb-5">Guest Reviews</h3>
                      <div className="space-y-4">
                        {tour.reviews.map((r: any) => (
                          <div key={r.id} className="card">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <span className="font-semibold text-sm">{r.name}</span>
                                {r.country && <span className="text-xs text-gray-500 ml-2">— {r.country}</span>}
                              </div>
                              <Stars rating={r.rating} />
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed italic">"{r.text}"</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {tab === 'itinerary' && (
                <div>
                  <h2 className="font-serif text-3xl text-forest mb-7">Day-by-Day Itinerary</h2>
                  <div className="relative pl-14">
                    <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-cream-border" />
                    {(tour.itinerary || []).map((d: any) => (
                      <div key={d.id} className="relative mb-7">
                        <div className={`absolute -left-9 w-10 h-10 rounded-full flex items-center justify-center font-serif text-sm font-bold text-white z-10 ${d.title.includes('SUMMIT') || d.title.includes('Arrival') ? 'bg-gold' : 'bg-forest'}`}>
                          {d.day}
                        </div>
                        <div className="pt-1.5">
                          <h4 className="font-serif text-[17px] text-forest mb-1.5">{d.title}</h4>
                          <p className="text-gray-600 text-sm leading-relaxed">{d.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tab === 'includes' && (
                <div>
                  <h2 className="font-serif text-3xl text-forest mb-6">What's Included</h2>
                  <div className="flex flex-col gap-3 mb-7">
                    {(tour.includes || []).map((inc: string) => (
                      <div key={inc} className="flex gap-3 items-center bg-green-50 border border-green-200 p-3.5 rounded-xl">
                        <span className="text-green-600 font-bold">✓</span>
                        <span className="text-sm">{inc}</span>
                      </div>
                    ))}
                  </div>
                  {(tour.excludes || []).length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
                      <strong className="text-amber-800 text-sm">⚠ Not Included:</strong>
                      <ul className="mt-2 space-y-1">
                        {tour.excludes.map((ex: string) => (
                          <li key={ex} className="text-amber-700 text-sm flex gap-2"><span>×</span>{ex}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {tab === 'book' && (
                <div>
                  <h2 className="font-serif text-3xl text-forest mb-6">Request a Booking</h2>
                  {booked ? (
                    <div className="text-center py-12">
                      <div className="text-5xl mb-4">🎉</div>
                      <h3 className="font-serif text-2xl text-forest mb-2">Booking Request Sent!</h3>
                      <p className="text-gray-600 mb-6">Our team will contact you within 24 hours about your {tour.name}.</p>
                      <Link href="/tours" className="btn-primary">Explore More Tours</Link>
                    </div>
                  ) : (
                    <form onSubmit={handleBook} className="space-y-4 max-w-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="label">Full Name *</label>
                          <input required className="input" placeholder="John Smith"
                            value={form.clientName} onChange={e => setForm({ ...form, clientName: e.target.value })} />
                        </div>
                        <div>
                          <label className="label">Email *</label>
                          <input required type="email" className="input" placeholder="john@email.com"
                            value={form.clientEmail} onChange={e => setForm({ ...form, clientEmail: e.target.value })} />
                        </div>
                        <div>
                          <label className="label">Phone / WhatsApp</label>
                          <input type="tel" className="input" placeholder="+254 7XX XXX XXX"
                            value={form.clientPhone} onChange={e => setForm({ ...form, clientPhone: e.target.value })} />
                        </div>
                        <div>
                          <label className="label">Travel Date *</label>
                          <input required type="date" className="input"
                            value={form.travelDate} onChange={e => setForm({ ...form, travelDate: e.target.value })} />
                        </div>
                      </div>
                      <div>
                        <label className="label">Number of Travellers</label>
                        <select className="input" value={form.pax} onChange={e => setForm({ ...form, pax: Number(e.target.value) })}>
                          {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                            <option key={n} value={n}>{n} Person{n > 1 ? 's' : ''} — ${(tour.price * n).toLocaleString()}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="label">Special Requests</label>
                        <textarea className="input min-h-[90px] resize-none"
                          placeholder="Dietary requirements, special occasions, customisations..."
                          value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                      </div>
                      <button type="submit" disabled={submitting} className="btn-gold w-full justify-center py-3.5 text-base">
                        {submitting ? 'Sending...' : 'Send Booking Request 🌍'}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>

            {/* Sticky sidebar */}
            <div className="sticky top-24 space-y-4">
              <div className="card border-2 border-forest">
                <div className="text-center pb-4 mb-4 border-b border-cream-border">
                  <span className="font-serif text-[32px] font-bold text-forest">${tour.price.toLocaleString()}</span>
                  <span className="text-xs text-gray-500"> /person</span>
                </div>
                <button onClick={() => setTab('book')} className="btn-gold w-full justify-center py-3 mb-2">
                  Book This Tour
                </button>
                <Link href="/contact" className="btn-outline w-full justify-center py-3 flex">
                  📞 Request a Call
                </Link>
                <p className="text-[11px] text-gray-500 text-center mt-4 leading-relaxed">
                  🔒 Free cancellation up to 30 days<br />
                  💳 30% deposit confirms booking
                </p>
              </div>
              <div className="card">
                <h4 className="font-serif text-[16px] text-forest mb-4">Quick Info</h4>
                {[
                  ['Duration', `${tour.days} Days / ${tour.nights} Nights`],
                  ['Max Group', `${tour.maxGroup} People`],
                  ['Destination', tour.destination],
                  ['Category', tour.category.charAt(0) + tour.category.slice(1).toLowerCase()],
                  ['Availability', 'Year-round'],
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between py-2 border-b border-cream-border last:border-0 text-sm">
                    <span className="text-gray-500">{l}</span>
                    <span className="font-medium">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  )
}
