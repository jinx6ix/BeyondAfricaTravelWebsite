// src/app/about/page.tsx
import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { SectionHeader, Avatar } from '@/components/ui'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Us',
  description: "Learn about Savanna & Beyond — East Africa's most trusted travel agency, founded in Nairobi in 2009.",
}

const values = [
  { emoji: '🌿', title: 'Conservation First', desc: '10% of all profits fund community wildlife conservancies across East Africa.' },
  { emoji: '🤝', title: 'Community Rooted', desc: 'Over 80% of our staff and suppliers are local Kenyans and East Africans.' },
  { emoji: '🎯', title: 'Authentic Experiences', desc: "We don't do cookie-cutter tours. Every trip is genuinely and uniquely yours." },
  { emoji: '🔬', title: 'Expert Knowledge', desc: 'Our guides hold professional credentials from Kenya Wildlife Service.' },
]

export default async function AboutPage() {
  const staff = await prisma.staff.findMany({ where: { active: true }, orderBy: { joinedAt: 'asc' } })
  return (
    <>
      <Navbar />
      <main>
        <div className="page-hero">
          <h1 className="font-serif text-white text-[clamp(30px,5vw,52px)]">About Savanna & Beyond</h1>
          <p className="text-white/70 mt-3 text-base max-w-xl mx-auto leading-relaxed">Born from a deep love for Africa's wild places and a belief that travel should change you.</p>
        </div>
        <section className="section bg-white">
          <div className="container-main">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
              <div>
                <p className="section-label mb-2">Our Story</p>
                <h2 className="font-serif text-4xl text-forest mb-5">Rooted in Africa,<br />Passionate About People</h2>
                <p className="text-gray-600 leading-relaxed mb-4 text-[15px]">Founded in 2009 in Nairobi, Savanna & Beyond began with a single vehicle, two passionate guides, and a shared dream: to show the world the Africa we grew up loving.</p>
                <p className="text-gray-600 leading-relaxed text-[15px]">Today we are a 20-person team of naturalists, cultural experts, logistics professionals, and storytellers — all committed to crafting journeys that go beyond the postcard.</p>
              </div>
              <div className="h-96 rounded-2xl flex items-center justify-center text-[96px]" style={{ background: 'linear-gradient(135deg,#1B3A2D,#2E6B52)' }}>🌅</div>
            </div>
            <SectionHeader title="What We Stand For" center />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
              {values.map(({ emoji, title, desc }) => (
                <div key={title} className="card text-center">
                  <div className="text-4xl mb-3">{emoji}</div>
                  <h3 className="font-serif text-[18px] text-forest mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
            <SectionHeader title="Meet the Team" subtitle="The people who make every journey extraordinary." center />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {staff.map(m => (
                <div key={m.id} className="card text-center">
                  <div className="flex justify-center mb-3"><Avatar name={m.name} size={60} /></div>
                  <div className="font-semibold text-[15px]">{m.name}</div>
                  <div className="text-xs text-gold mt-1">{m.role}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{m.department}</div>
                  {m.toursLed > 0 && <div className="text-xs text-gray-400 mt-1.5">★ {m.rating} · {m.toursLed} tours led</div>}
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="bg-gold py-16 px-[5%] text-center">
          <h2 className="font-serif text-white text-[clamp(24px,4vw,40px)] mb-3">Ready to See Africa Through Our Eyes?</h2>
          <p className="text-white/85 mb-6 text-[15px]">Let us craft your perfect East African journey.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/tours" className="btn-primary py-3 px-8">Browse All Tours</Link>
            <Link href="/contact" className="btn-ghost py-3 px-8">Contact Us</Link>
          </div>
        </section>
        <Footer />
      </main>
    </>
  )
}
