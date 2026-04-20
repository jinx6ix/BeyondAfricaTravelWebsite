import { PrismaClient, Role, TourCategory, ClientStatus, BookingStatus, PaymentStatus, Department, FinanceType, FinanceStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // ── Admin user ──────────────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@savannaandbeyond.co.ke' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@savannaandbeyond.co.ke',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  })
  console.log('✅ Admin user:', admin.email)

  // ── Tours ───────────────────────────────────────────────────────────────────
  const tours = await Promise.all([
    prisma.tour.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        name: 'Masai Mara Safari',
        destination: 'Kenya',
        days: 5, nights: 4, price: 1850,
        category: TourCategory.SAFARI,
        rating: 4.9, reviewCount: 124,
        emoji: '🦁', color: '#2D5A3D', featured: true,
        description: "Experience the world-famous wildebeest migration and Big Five game viewing in Kenya's premier national reserve. Our expert guides know exactly where to find lion prides, leopard kills, and river crossings.",
        maxGroup: 12,
        highlights: ['Big Five Game Drives', 'Wildebeest Migration (Jul–Oct)', 'Maasai Village Visit', 'Hot Air Balloon Option'],
        includes: ['Lodge Accommodation (Full Board)', 'All Meals', 'Park Entry Fees', 'Expert Safari Guide', 'Airport Transfers'],
        excludes: ['International Flights', 'Travel Insurance', 'Visa Fees', 'Tips', 'Hot Air Balloon ($450/pp optional)'],
        itinerary: {
          create: [
            { day: 1, title: 'Arrival & Nairobi', description: 'Meet at JKIA, transfer to Nairobi hotel. Safari briefing and welcome dinner.' },
            { day: 2, title: 'Drive to Masai Mara', description: 'Scenic morning drive through the Rift Valley escarpment. Afternoon arrival and first game drive.' },
            { day: 3, title: 'Full Day Game Drives', description: 'Dawn-to-dusk exploration. Big Five pursuit with packed bush lunch in the savanna.' },
            { day: 4, title: 'Mara North Conservancy', description: 'Exclusive conservancy access. Fewer vehicles, more intimate encounters. Night drive option.' },
            { day: 5, title: 'Return to Nairobi', description: 'Final morning game drive, leisurely lunch, then drive back for airport drop-off.' },
          ],
        },
      },
    }),
    prisma.tour.upsert({
      where: { id: 2 },
      update: {},
      create: {
        id: 2,
        name: 'Zanzibar Beach Escape',
        destination: 'Tanzania',
        days: 7, nights: 6, price: 1200,
        category: TourCategory.BEACH,
        rating: 4.8, reviewCount: 98,
        emoji: '🏖️', color: '#1A5276', featured: true,
        description: "Pristine white-sand beaches, turquoise Indian Ocean, and the historic UNESCO-listed Stone Town. Zanzibar is where history, culture, and paradise collide.",
        maxGroup: 16,
        highlights: ['Stone Town UNESCO Walking Tour', 'Snorkelling at Mnemba Atoll', 'Spice Farm Tour', 'Sunset Dhow Cruise'],
        includes: ['Beachfront Resort', 'Breakfast & Dinner Daily', 'Guided Tours', 'Snorkelling Gear', 'Airport Transfers'],
        excludes: ['International Flights', 'Travel Insurance', 'Visa', 'Alcohol', 'Optional Diving'],
        itinerary: {
          create: [
            { day: 1, title: 'Arrival in Zanzibar', description: 'Welcome at Abeid Airport. Transfer to beachfront resort.' },
            { day: 2, title: 'Stone Town Exploration', description: 'Full-day guided walk through the UNESCO World Heritage Site.' },
            { day: 3, title: 'Spice Farm & Villages', description: 'Morning spice tour in lush countryside. Afternoon at leisure.' },
            { day: 4, title: 'Ocean Safari', description: 'Dolphin watching and snorkelling at Mnemba Atoll coral reef.' },
            { day: 5, title: 'Free Beach Day', description: 'Relax or join optional diving, kayaking, or kite-surfing.' },
            { day: 6, title: 'Sunset Dhow Cruise', description: 'Traditional dhow cruise with farewell BBQ dinner.' },
            { day: 7, title: 'Departure', description: 'Breakfast, last beach time, transfer to airport.' },
          ],
        },
      },
    }),
    prisma.tour.upsert({
      where: { id: 3 },
      update: {},
      create: {
        id: 3,
        name: 'Kilimanjaro Trek',
        destination: 'Tanzania',
        days: 8, nights: 7, price: 2800,
        category: TourCategory.ADVENTURE,
        rating: 4.7, reviewCount: 67,
        emoji: '🏔️', color: '#4A235A', featured: true,
        description: "Summit Africa's highest peak (5,895m) via the scenic 8-day Lemosho Route with accredited mountain guides. Our 94% summit success rate is among the highest in the industry.",
        maxGroup: 10,
        highlights: ['Uhuru Peak Summit (5,895m)', 'Scenic Lemosho Route', '5 Ecological Zones', 'Certificate of Ascent'],
        includes: ['Full Camping Equipment', 'All Mountain Meals & Water', 'Certified Guides & Porters', 'Park & Rescue Fees', 'Medical Oxygen'],
        excludes: ['International Flights', 'Travel Insurance (mandatory)', 'Personal Gear', 'Tips ($250 recommended)', 'Alcohol'],
        itinerary: {
          create: [
            { day: 1, title: 'Moshi Arrival & Briefing', description: 'Gear check, fitness assessment, route briefing, welcome dinner.' },
            { day: 2, title: 'Londorossi to Mti Mkubwa', description: 'Enter the lush rainforest zone. First day of trekking.' },
            { day: 3, title: 'Shira Plateau', description: 'Emerge from forest into open moorland. Volcanic plateau views.' },
            { day: 4, title: 'Lava Tower & Barranco', description: 'Acclimatisation walk to 4,600m. Walk high, sleep low.' },
            { day: 5, title: 'Barranco Wall', description: 'The famous hands-and-feet scramble with spectacular views.' },
            { day: 6, title: 'Barafu Base Camp', description: 'Rest and hydration day. Summit preparation briefing at dusk.' },
            { day: 7, title: 'SUMMIT NIGHT', description: 'Midnight ascent. Sunrise from Uhuru Peak — roof of Africa!' },
            { day: 8, title: 'Descent to Moshi', description: 'Descend to Mweka Gate. Certificates and celebrations.' },
          ],
        },
      },
    }),
    prisma.tour.upsert({
      where: { id: 4 },
      update: {},
      create: {
        id: 4,
        name: 'Rwanda Gorilla Trek',
        destination: 'Rwanda',
        days: 4, nights: 3, price: 3200,
        category: TourCategory.WILDLIFE,
        rating: 5.0, reviewCount: 45,
        emoji: '🦍', color: '#1E5631', featured: true,
        description: "A once-in-a-lifetime face-to-face encounter with endangered mountain gorillas in Volcanoes National Park. Rwanda gorilla permits are strictly limited — we secure them for you.",
        maxGroup: 8,
        highlights: ['Mountain Gorilla Permit (1-hr visit)', 'Golden Monkey Tracking', "Dian Fossey's Tomb Hike", 'Kigali City Tour'],
        includes: ['Gorilla Permit ($1,500 — included)', 'Boutique Lodge', 'All Meals', 'Expert Trackers', 'Airport Transfers'],
        excludes: ['International Flights', 'Travel Insurance', 'Visa', 'Tips', 'Optional 2nd Permit'],
        itinerary: {
          create: [
            { day: 1, title: 'Kigali Arrival', description: 'Airport pickup, Genocide Memorial, drive to Musanze.' },
            { day: 2, title: 'Gorilla Trekking', description: 'Full-day gorilla trek. Magical 1-hour family visit.' },
            { day: 3, title: 'Golden Monkeys & Dian Fossey', description: 'Morning golden monkey trek, afternoon tomb hike.' },
            { day: 4, title: 'Return to Kigali', description: 'Cultural village visit, city lunch, airport drop-off.' },
          ],
        },
      },
    }),
    prisma.tour.upsert({
      where: { id: 5 },
      update: {},
      create: {
        id: 5,
        name: 'Amboseli & Nakuru Circuit',
        destination: 'Kenya',
        days: 6, nights: 5, price: 1650,
        category: TourCategory.SAFARI,
        rating: 4.8, reviewCount: 83,
        emoji: '🐘', color: '#78410A',
        description: "Iconic elephants silhouetted against Kilimanjaro's peak in Amboseli, followed by millions of flamingos at Lake Nakuru. Two of Africa's most spectacular sights in one journey.",
        maxGroup: 14,
        highlights: ['Elephants with Kilimanjaro Backdrop', 'Lake Nakuru Flamingos', 'Rhino Sanctuary', 'Crescent Island Boat Safari'],
        includes: ['Lodge & Tented Camp', 'Full Board', 'All Game Drives', 'Park Fees', 'Transfers'],
        excludes: ['International Flights', 'Insurance', 'Visa', 'Tips', 'Optional Activities'],
        itinerary: {
          create: [
            { day: 1, title: 'Nairobi to Amboseli', description: 'Drive south to Amboseli. Afternoon game drive with Kilimanjaro backdrop.' },
            { day: 2, title: 'Amboseli Full Day', description: 'Dawn and dusk game drives. World-class elephant photography.' },
            { day: 3, title: 'Drive to Lake Nakuru', description: 'Scenic drive north through the Great Rift Valley.' },
            { day: 4, title: 'Lake Nakuru National Park', description: 'Full day — flamingos, rhinos, lions and panoramic views.' },
            { day: 5, title: 'Lake Naivasha', description: 'Boat safari and Crescent Island walking safari.' },
            { day: 6, title: 'Return to Nairobi', description: 'Morning at leisure, curio shopping, airport transfer.' },
          ],
        },
      },
    }),
    prisma.tour.upsert({
      where: { id: 6 },
      update: {},
      create: {
        id: 6,
        name: 'Ethiopia Historic Circuit',
        destination: 'Ethiopia',
        days: 10, nights: 9, price: 2100,
        category: TourCategory.CULTURAL,
        rating: 4.6, reviewCount: 39,
        emoji: '🏛️', color: '#7D3C0A',
        description: "Explore the ancient obelisks of Axum, the extraordinary rock-hewn churches of Lalibela, and Lake Tana's island monasteries in Africa's oldest Christian kingdom.",
        maxGroup: 16,
        highlights: ['Lalibela Rock-Hewn Churches', 'Axum Obelisks', 'Lake Tana Monasteries', 'Simien Mountains Trek'],
        includes: ['Hotels Throughout', 'All Internal Flights', 'Licensed Expert Guide', 'All Heritage Entrance Fees', 'Airport Transfers'],
        excludes: ['International Flights', 'Insurance', 'Visa ($52 on arrival)', 'Lunch & Dinner', 'Tips'],
        itinerary: {
          create: [
            { day: 1, title: 'Addis Ababa Arrival', description: 'National Museum, Mercato market, welcome dinner.' },
            { day: 2, title: 'Fly to Axum', description: 'Obelisks, Queen of Sheba\'s Bath, St Mary of Zion Church.' },
            { day: 3, title: 'Fly to Lalibela', description: 'Flight. First cluster of rock-hewn churches at golden hour.' },
            { day: 4, title: 'Lalibela Full Day', description: 'All 11 extraordinary underground churches.' },
            { day: 5, title: 'Fly to Bahir Dar', description: 'Flight and Blue Nile Falls excursion.' },
            { day: 6, title: 'Lake Tana Monasteries', description: 'Full-day boat tour visiting island monasteries.' },
            { day: 7, title: 'Gondar', description: 'Fasilidas Castle, Debre Berhan Selassie Church.' },
            { day: 8, title: 'Simien Mountains Day 1', description: 'Drive into mountains. Trek with gelada baboons.' },
            { day: 9, title: 'Simien Mountains Day 2', description: 'High-altitude escarpment trekking with panoramic views.' },
            { day: 10, title: 'Fly Back & Departure', description: 'Return flight, farewell coffee ceremony, international departure.' },
          ],
        },
      },
    }),
  ])
  console.log(`✅ ${tours.length} tours seeded`)

  // ── Staff ───────────────────────────────────────────────────────────────────
  const staffData = [
    { name: 'Wanjiku Kamau', role: 'Senior Safari Guide', department: Department.OPERATIONS, phone: '+254 712 001001', email: 'wanjiku@savannaandbeyond.co.ke', toursLed: 42, rating: 4.9 },
    { name: 'Baraka Mwangi', role: 'Tour Coordinator', department: Department.OPERATIONS, phone: '+254 722 002002', email: 'baraka@savannaandbeyond.co.ke', toursLed: 0, rating: 4.8 },
    { name: 'Fatuma Osman', role: 'Sales & Booking Agent', department: Department.SALES, phone: '+254 733 003003', email: 'fatuma@savannaandbeyond.co.ke', toursLed: 0, rating: 4.7 },
    { name: 'David Njoroge', role: 'Driver / Field Guide', department: Department.OPERATIONS, phone: '+254 744 004004', email: 'david@savannaandbeyond.co.ke', toursLed: 67, rating: 4.8 },
    { name: 'Grace Achieng', role: 'Finance & Admin', department: Department.FINANCE, phone: '+254 755 005005', email: 'grace@savannaandbeyond.co.ke', toursLed: 0, rating: 5.0 },
    { name: 'Omar Sheikh', role: 'Mountain Guide', department: Department.OPERATIONS, phone: '+255 688 006006', email: 'omar@savannaandbeyond.co.ke', toursLed: 28, rating: 4.9 },
  ]
  for (const s of staffData) {
    await prisma.staff.upsert({ where: { email: s.email }, update: {}, create: s })
  }
  console.log(`✅ ${staffData.length} staff seeded`)

  // ── Clients ─────────────────────────────────────────────────────────────────
  const clientsData = [
    { name: 'Sarah Mitchell', email: 'sarah@email.com', phone: '+44 7700 900123', nationality: 'British', status: ClientStatus.VIP, totalTrips: 3, totalSpent: 9200 },
    { name: 'James Okonkwo', email: 'j.okonkwo@mail.com', phone: '+1 555 0142', nationality: 'Nigerian-American', status: ClientStatus.ACTIVE, totalTrips: 1, totalSpent: 2400 },
    { name: 'Liu Wei', email: 'liu.wei@corp.cn', phone: '+86 138 0000', nationality: 'Chinese', status: ClientStatus.VIP, totalTrips: 2, totalSpent: 14000 },
    { name: 'Amira Hassan', email: 'amira@travel.ae', phone: '+971 55 123', nationality: 'Emirati', status: ClientStatus.ACTIVE, totalTrips: 2, totalSpent: 6400 },
    { name: 'The Brewster Family', email: 'brewsters@au.com', phone: '+61 400 555', nationality: 'Australian', status: ClientStatus.NEW, totalTrips: 1, totalSpent: 6600 },
    { name: 'Dr. Anand Patel', email: 'drpatel@hospital.in', phone: '+91 98765', nationality: 'Indian', status: ClientStatus.VIP, totalTrips: 3, totalSpent: 12400 },
    { name: 'Sophie Andersson', email: 'sophie.a@se.com', phone: '+46 70 123', nationality: 'Swedish', status: ClientStatus.ACTIVE, totalTrips: 1, totalSpent: 3700 },
    { name: 'Ahmed Al-Rashid', email: 'ahmed@sa.com', phone: '+966 50 777', nationality: 'Saudi', status: ClientStatus.VIP, totalTrips: 4, totalSpent: 18000 },
  ]
  const clients = []
  for (const c of clientsData) {
    const client = await prisma.client.upsert({ where: { email: c.email }, update: {}, create: c })
    clients.push(client)
  }
  console.log(`✅ ${clients.length} clients seeded`)

  // ── Bookings ────────────────────────────────────────────────────────────────
  const bookingsData = [
    { clientIdx: 0, tourId: 1, pax: 2, amount: 3700, status: BookingStatus.CONFIRMED, paymentStatus: PaymentStatus.PAID, travelDate: new Date('2024-03-15') },
    { clientIdx: 1, tourId: 2, pax: 2, amount: 2400, status: BookingStatus.CONFIRMED, paymentStatus: PaymentStatus.PARTIAL, travelDate: new Date('2024-03-20') },
    { clientIdx: 2, tourId: 3, pax: 4, amount: 11200, status: BookingStatus.PENDING, paymentStatus: PaymentStatus.DEPOSIT, travelDate: new Date('2024-04-02') },
    { clientIdx: 3, tourId: 4, pax: 1, amount: 3200, status: BookingStatus.CONFIRMED, paymentStatus: PaymentStatus.PAID, travelDate: new Date('2024-04-10') },
    { clientIdx: 4, tourId: 5, pax: 4, amount: 6600, status: BookingStatus.PENDING, paymentStatus: PaymentStatus.UNPAID, travelDate: new Date('2024-04-18') },
    { clientIdx: 5, tourId: 6, pax: 2, amount: 4200, status: BookingStatus.COMPLETED, paymentStatus: PaymentStatus.PAID, travelDate: new Date('2024-03-28') },
    { clientIdx: 6, tourId: 1, pax: 2, amount: 3700, status: BookingStatus.PENDING, paymentStatus: PaymentStatus.DEPOSIT, travelDate: new Date('2024-05-01') },
    { clientIdx: 7, tourId: 2, pax: 3, amount: 3600, status: BookingStatus.CONFIRMED, paymentStatus: PaymentStatus.PAID, travelDate: new Date('2024-05-10') },
  ]

  for (const b of bookingsData) {
    const client = clients[b.clientIdx]
    await prisma.booking.create({
      data: {
        clientId: client.id, tourId: b.tourId,
        clientName: client.name, clientEmail: client.email,
        clientPhone: client.phone || '', tourName: tours[b.tourId - 1].name,
        travelDate: b.travelDate, pax: b.pax, amount: b.amount,
        status: b.status, paymentStatus: b.paymentStatus,
      },
    })
  }
  console.log(`✅ ${bookingsData.length} bookings seeded`)

  // ── Finances ────────────────────────────────────────────────────────────────
  const financesData = [
    { type: FinanceType.INCOME, category: 'Booking', description: 'Sarah Mitchell – Masai Mara Safari', amount: 3700, date: new Date('2024-03-10'), status: FinanceStatus.RECEIVED },
    { type: FinanceType.INCOME, category: 'Booking', description: 'Amira Hassan – Rwanda Gorilla Trek', amount: 3200, date: new Date('2024-03-12'), status: FinanceStatus.RECEIVED },
    { type: FinanceType.EXPENSE, category: 'Accommodation', description: 'Mara Serena Lodge – March Allocation', amount: 2400, date: new Date('2024-03-13'), status: FinanceStatus.PAID },
    { type: FinanceType.INCOME, category: 'Booking', description: 'Dr. Patel – Ethiopia Historic Circuit', amount: 4200, date: new Date('2024-03-20'), status: FinanceStatus.RECEIVED },
    { type: FinanceType.EXPENSE, category: 'Park Fees', description: 'KWS Park Entry Fees – Q1', amount: 1800, date: new Date('2024-03-22'), status: FinanceStatus.PAID },
    { type: FinanceType.EXPENSE, category: 'Staff', description: 'Monthly Staff Salaries – March', amount: 3500, date: new Date('2024-03-31'), status: FinanceStatus.PAID },
    { type: FinanceType.INCOME, category: 'Booking', description: 'Okonkwo – Zanzibar (Deposit)', amount: 1200, date: new Date('2024-03-18'), status: FinanceStatus.RECEIVED },
    { type: FinanceType.EXPENSE, category: 'Transport', description: 'Vehicle Fuel & Maintenance', amount: 850, date: new Date('2024-03-25'), status: FinanceStatus.PAID },
    { type: FinanceType.INCOME, category: 'Booking', description: 'Carlos Rivera – Zanzibar Beach', amount: 3600, date: new Date('2024-04-02'), status: FinanceStatus.RECEIVED },
    { type: FinanceType.EXPENSE, category: 'Marketing', description: 'Google Ads – Q1 Campaign', amount: 600, date: new Date('2024-04-01'), status: FinanceStatus.PAID },
    { type: FinanceType.INCOME, category: 'Commission', description: 'Referral Agent Commission – UK Partner', amount: 450, date: new Date('2024-04-05'), status: FinanceStatus.RECEIVED },
    { type: FinanceType.EXPENSE, category: 'Insurance', description: 'Annual Business & Liability Insurance', amount: 1200, date: new Date('2024-04-01'), status: FinanceStatus.PAID },
  ]
  await prisma.finance.createMany({ data: financesData })
  console.log(`✅ ${financesData.length} finance entries seeded`)

  // ── Reviews ─────────────────────────────────────────────────────────────────
  await prisma.review.createMany({
    data: [
      { tourId: 1, clientId: clients[0].id, name: 'Sarah Mitchell', country: 'United Kingdom', rating: 5, text: "Witnessing the Great Migration was a bucket-list moment. The guides' knowledge was extraordinary — they knew every lion by name.", approved: true },
      { tourId: 3, clientId: clients[2].id, name: 'Liu Wei', country: 'China', rating: 5, text: "Reaching Uhuru Peak was the most challenging and rewarding experience of my life. I cried at the summit. The team was incredible.", approved: true },
      { tourId: 6, clientId: clients[5].id, name: 'Dr. Anand Patel', country: 'India', rating: 5, text: "A deeply spiritual and historically rich journey. Our guide brought each ancient site to life. Logistics were completely flawless.", approved: true },
      { tourId: 4, clientId: clients[3].id, name: 'Amira Hassan', country: 'UAE', rating: 5, text: "Meeting the mountain gorillas face-to-face was indescribable. Worth every penny and far more. Already planning my return trip.", approved: true },
    ],
  })
  console.log('✅ Reviews seeded')

  console.log('\n🌍 Database seeded successfully!')
  console.log('─────────────────────────────')
  console.log('Admin login:')
  console.log('  Email:    admin@savannaandbeyond.co.ke')
  console.log('  Password: admin123')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
