import type { Metadata } from 'next'
import Link from 'next/link'
import NewsletterForm from '@/components/NewsletterForm'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { SectionHeader, Stars } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Savanna & Beyond | East Africa Safari & Travel Agency',
  description: "East Africa's most trusted travel agency. Bespoke safaris, Kilimanjaro treks, gorilla trekking and cultural tours.",
}

async function getFeaturedTours() {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const res = await fetch(`${base}/api/tours?featured=true`, { next: { revalidate: 300 } })
    const json = await res.json()
    return json.data || []
  } catch { return [] }
}

const stats = [
  { value: '2,400+', label: 'Happy Travellers' },
  { value: '15+', label: 'Years Experience' },
  { value: '48', label: 'Destinations' },
  { value: '4.9 ★', label: 'Average Rating' },
]

const features = [
  { emoji: '🏡', title: 'Local Expertise', desc: "Born in East Africa. Our guides have decades of on-the-ground knowledge no guidebook can replicate." },
  { emoji: '✏️', title: 'Fully Bespoke', desc: "No two trips alike. Every itinerary is crafted around your interests, pace, and travel style." },
  { emoji: '🛡️', title: 'Fully Insured', desc: "Travel with total confidence. All tours include comprehensive travel and liability insurance." },
  { emoji: '🌿', title: 'Eco-Responsible', desc: "10% of profits fund community wildlife conservancies. We carbon-offset all tours." },
  { emoji: '💬', title: '24/7 Support', desc: "A dedicated contact is reachable by WhatsApp and phone from booking to touchdown." },
  { emoji: '💎', title: 'Best Price Promise', desc: "Book direct and save — no OTA commissions. We pass the savings directly to you." },
]

const testimonials = [
  { name: 'Sarah Mitchell', country: 'United Kingdom', flag: '🇬🇧', tour: 'Masai Mara Safari', text: "Witnessing the Great Migration was a bucket-list moment. The guides' knowledge was extraordinary — they knew every lion by name.", rating: 5 },
  { name: 'Liu Wei', country: 'China', flag: '🇨🇳', tour: 'Kilimanjaro Trek', text: "Reaching Uhuru Peak was the most challenging and rewarding experience of my life. The team was incredible throughout every step.", rating: 5 },
  { name: 'Dr. Anand Patel', country: 'India', flag: '🇮🇳', tour: 'Ethiopia Historic Circuit', text: "A deeply spiritual and historically rich journey. Our guide brought each ancient site to life. Logistics were completely flawless.", rating: 5 },
  { name: 'Amira Hassan', country: 'UAE', flag: '🇦🇪', tour: 'Rwanda Gorilla Trek', text: "Meeting the mountain gorillas face-to-face was indescribable. Worth every penny and far more. Already planning my return.", rating: 5 },
]

export default async function HomePage() {
  const tours = await getFeaturedTours()

  return (
    <>
      <Navbar />
      <main>
        {/* HERO */}
        <section className="min-h-[90vh] bg-forest flex items-center justify-center text-center px-5 relative overflow-hidden">
          {[1,2,3,4,5].map(i=>(
            <div key={i} className="absolute rounded-full border border-gold/10 pointer-events-none"
              style={{width:i*180,height:i*180,top:'50%',left:'50%',transform:'translate(-50%,-50%)'}}/>
          ))}
          <div className="relative z-10 max-w-3xl animate-fade-up">
            <p className="text-gold-light text-[11px] tracking-[3px] uppercase mb-4">✦ East Africa's Premier Travel Agency ✦</p>
            <h1 className="font-serif text-[clamp(48px,9vw,90px)] text-white leading-[1.08] mb-5">
              Discover the<br /><em className="text-gold-light not-italic">Soul of Africa</em>
            </h1>
            <p className="text-white/70 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
              Bespoke safaris, mountain expeditions, and cultural journeys crafted by local experts with over 15 years of experience.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/tours" className="btn-gold text-base px-8 py-3.5">Explore Our Tours →</Link>
              <Link href="/contact" className="btn-ghost text-sm px-6 py-3.5">Plan a Custom Trip</Link>
            </div>
          </div>
        </section>

        {/* STATS */}
        <div className="bg-gold py-8 px-[5%]">
          <div className="container-main flex justify-center gap-12 md:gap-20 flex-wrap">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="font-serif text-4xl font-bold text-white">{value}</div>
                <div className="text-xs text-white/85 tracking-wide mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* TOURS */}
        <section className="section bg-cream">
          <div className="container-main">
            <SectionHeader label="Our Journeys" title="Signature Experiences"
              subtitle="Handcrafted itineraries built around authentic encounters, expert guides, and memories that last a lifetime." center />
            {tours.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tours.map((tour: any) => (
                  <Link key={tour.id} href={`/tours/${tour.id}`}>
                    <article className="bg-white rounded-2xl border border-cream-border shadow-card overflow-hidden cursor-pointer transition-all hover:-translate-y-1 hover:shadow-modal group">
                      <div className="h-44 flex items-center justify-center relative text-6xl"
                        style={{ background: `linear-gradient(135deg, ${tour.color}, ${tour.color}bb)` }}>
                        <span>{tour.emoji}</span>
                        <span className="absolute top-3 left-3 bg-black/40 text-white text-[11px] px-3 py-1 rounded-full">{tour.category}</span>
                        <span className="absolute top-3 right-3 bg-gold text-white text-[11px] px-3 py-1 rounded-full font-semibold">★ {tour.rating}</span>
                      </div>
                      <div className="p-5">
                        <p className="text-[11px] text-gray-500 mb-1">📍 {tour.destination}</p>
                        <h3 className="font-serif text-[19px] text-forest mb-1.5 group-hover:text-forest-light transition-colors">{tour.name}</h3>
                        <p className="text-xs text-gray-500 mb-3 leading-relaxed line-clamp-2">{tour.description}</p>
                        <div className="flex gap-3 text-[11px] text-gray-500 mb-4">
                          <span>🗓 {tour.days} Days</span><span>👥 Max {tour.maxGroup}</span><span>💬 {tour.reviewCount} reviews</span>
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
            ) : (
              <p className="text-center text-gray-500 py-10">Loading tours...</p>
            )}
            <div className="text-center mt-10">
              <Link href="/tours" className="btn-outline">View All Tours →</Link>
            </div>
          </div>
        </section>

        {/* WHY US */}
        <section className="section bg-white">
          <div className="container-main">
            <SectionHeader label="Why Savanna & Beyond" title="The Difference Is in the Details" center />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map(({ emoji, title, desc }) => (
                <div key={title} className="text-center p-6">
                  <div className="text-4xl mb-4">{emoji}</div>
                  <h3 className="font-serif text-[19px] text-forest mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="section bg-forest">
          <div className="container-main">
            <div className="text-center mb-12">
              <p className="text-gold-light text-[11px] tracking-[3px] uppercase mb-2">Traveller Stories</p>
              <h2 className="font-serif text-white text-[clamp(28px,4vw,46px)]">What Our Clients Say</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {testimonials.map(t => (
                <article key={t.name} className="rounded-2xl p-7" style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)'}}>
                  <div className="mb-3"><Stars rating={t.rating} /></div>
                  <p className="text-white/85 text-sm leading-relaxed italic mb-5">&ldquo;{t.text}&rdquo;</p>
                  <div className="border-t border-white/10 pt-4">
                    <div className="text-white font-semibold text-[15px]">{t.name}</div>
                    <div className="text-white/50 text-xs mt-0.5">{t.flag} {t.country} · {t.tour}</div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* NEWSLETTER */}
        <section className="bg-gold py-16 px-[5%] text-center">
          <h2 className="font-serif text-white text-[clamp(22px,4vw,36px)] mb-2">Get Inspired Monthly</h2>
          <p className="text-white/85 text-[15px] mb-6">Safari tips, seasonal highlights, and exclusive deals to your inbox.</p>
          <NewsletterForm />
        </section>

        <Footer />
      </main>
    </>
  )
}
