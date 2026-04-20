'use client'
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Spinner } from '@/components/ui'
import toast from 'react-hot-toast'

const FAQS = [
  { q: "What's included in the tour price?", a: "All prices include accommodation, meals as specified, national park fees, professional guides, and airport transfers. International flights, travel insurance, and visa fees are NOT included." },
  { q: "How far in advance should I book?", a: "We recommend 3–6 months in advance, especially for gorilla trekking and peak season July–October. We can often accommodate last-minute requests too." },
  { q: "Is travel insurance required?", a: "Yes, comprehensive travel and emergency medical evacuation insurance is required for all travellers." },
  { q: "What is your cancellation policy?", a: "Free cancellation up to 30 days (full refund). 15–30 days: 50% refund. Under 15 days: no refund. Travel insurance is strongly recommended." },
  { q: "Can you accommodate dietary requirements?", a: "Absolutely. We accommodate all dietary needs — vegetarian, vegan, halal, kosher, and gluten-free. Please inform us at booking." },
  { q: "Are tours suitable for children?", a: "Most safaris suit children 5+. Kilimanjaro requires age 10+. Gorilla trekking requires age 15+. We customise family itineraries on request." },
]

const contactInfo = [
  { emoji: '📍', label: 'Address', value: 'Westlands Business Park, Nairobi, Kenya' },
  { emoji: '📞', label: 'Phone', value: '+254 700 SAFARI (723274)' },
  { emoji: '✉️', label: 'Email', value: 'hello@savannaandbeyond.co.ke' },
  { emoji: '💬', label: 'WhatsApp', value: '+254 700 723274' },
  { emoji: '🕐', label: 'Hours', value: 'Mon–Sat: 8:00am – 6:00pm EAT' },
]

export default function ContactPage() {
  const [open, setOpen] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ name:'', email:'', phone:'', tourName:'', message:'' })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setSubmitted(true)
      toast.success('Message sent! We\'ll be in touch within 24 hours.')
    } catch {
      toast.error('Failed to send message. Please email us directly.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Navbar />
      <main>
        <div className="page-hero">
          <h1 className="font-serif text-white text-[clamp(30px,5vw,52px)]">Get in Touch</h1>
          <p className="text-white/70 mt-2 text-base">We're here to help plan your perfect African journey.</p>
        </div>
        <section className="section bg-cream">
          <div className="container-main grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <div className="card">
                <h2 className="font-serif text-2xl text-forest mb-5">Send Us a Message</h2>
                {submitted ? (
                  <div className="text-center py-10">
                    <div className="text-5xl mb-4">✉️</div>
                    <h3 className="font-serif text-2xl text-forest mb-2">Message Received!</h3>
                    <p className="text-gray-500">We'll respond within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="label">Full Name *</label><input required className="input" placeholder="Your full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
                      <div><label className="label">Email *</label><input required type="email" className="input" placeholder="hello@email.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></div>
                      <div><label className="label">Phone</label><input type="tel" className="input" placeholder="+254 7XX XXX XXX" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} /></div>
                      <div><label className="label">Interested In</label><input className="input" placeholder="e.g. Masai Mara Safari" value={form.tourName} onChange={e=>setForm({...form,tourName:e.target.value})} /></div>
                    </div>
                    <div><label className="label">Message *</label><textarea required className="input min-h-[110px] resize-none" placeholder="Tell us about your dream trip..." value={form.message} onChange={e=>setForm({...form,message:e.target.value})} /></div>
                    <button type="submit" disabled={submitting} className="btn-primary w-full justify-center py-3">
                      {submitting ? <Spinner size={16}/> : 'Send Message →'}
                    </button>
                  </form>
                )}
              </div>
            </div>
            <div className="space-y-5">
              <div className="card">
                <h3 className="font-serif text-xl text-forest mb-5">Contact Details</h3>
                <div className="space-y-3">
                  {contactInfo.map(({ emoji, label, value }) => (
                    <div key={label} className="flex gap-3 pb-3 border-b border-cream-border last:border-0">
                      <span className="text-base w-6 flex-shrink-0">{emoji}</span>
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-wide">{label}</div>
                        <div className="text-sm font-medium mt-0.5">{value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-serif text-xl text-forest mb-4">Frequently Asked Questions</h3>
                <div className="space-y-2">
                  {FAQS.map((f, i) => (
                    <div key={i} className="bg-white rounded-xl border border-cream-border overflow-hidden">
                      <button className="w-full flex justify-between items-center px-5 py-4 text-sm font-medium text-left hover:bg-cream/50 transition-colors"
                        onClick={() => setOpen(open === i ? null : i)}>
                        <span className="pr-4">{f.q}</span>
                        <span className="text-forest text-lg flex-shrink-0 transition-transform" style={{ transform: open === i ? 'rotate(45deg)' : 'none' }}>+</span>
                      </button>
                      {open === i && (
                        <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-cream-border">{f.a}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  )
}
