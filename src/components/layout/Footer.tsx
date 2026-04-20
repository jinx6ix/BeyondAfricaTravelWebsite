import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-forest-ink pt-14 pb-6 px-[5%]">
      <div className="container-main">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="text-xl">🌍</span>
              <span className="font-serif text-white text-[17px] font-bold">Savanna & Beyond</span>
            </div>
            <p className="text-white/50 text-sm leading-loose">East Africa's most trusted travel agency. Crafting unforgettable journeys since 2009.</p>
          </div>
          <div>
            <h4 className="text-white text-[10px] tracking-[1.5px] uppercase font-semibold mb-3">Quick Links</h4>
            {[{href:'/',l:'Home'},{href:'/tours',l:'Tours'},{href:'/about',l:'About Us'},{href:'/contact',l:'Contact'}].map(({href,l})=>(
              <Link key={href} href={href} className="text-white/50 text-sm leading-loose block hover:text-white/90 transition-colors">{l}</Link>
            ))}
          </div>
          <div>
            <h4 className="text-white text-[10px] tracking-[1.5px] uppercase font-semibold mb-3">Destinations</h4>
            {['Kenya','Tanzania','Rwanda','Uganda','Ethiopia','Seychelles'].map(d=>(
              <Link key={d} href="/tours" className="text-white/50 text-sm leading-loose block hover:text-white/90 transition-colors">{d}</Link>
            ))}
          </div>
          <div>
            <h4 className="text-white text-[10px] tracking-[1.5px] uppercase font-semibold mb-3">Contact</h4>
            <p className="text-white/50 text-sm leading-loose">📍 Westlands, Nairobi, Kenya</p>
            <p className="text-white/50 text-sm leading-loose">📞 +254 700 SAFARI</p>
            <p className="text-white/50 text-sm leading-loose">✉️ hello@savannaandbeyond.co.ke</p>
            <p className="text-white/50 text-sm leading-loose">🕐 Mon–Sat, 8am–6pm EAT</p>
          </div>
        </div>
        <div className="border-t border-white/10 pt-5 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-white/30">
          <span>© {new Date().getFullYear()} Savanna & Beyond Travel Agency · All Rights Reserved</span>
          <div className="flex gap-4">
            <Link href="/contact" className="hover:text-white/60">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-white/60">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
