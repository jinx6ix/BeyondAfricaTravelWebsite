import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import Navbar from '@/components/layout/Navbar'
import AdminSidebar from '@/components/admin/Sidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  return (
    <>
      <Navbar isAdmin />
      <div className="flex" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <AdminSidebar />
        <main className="flex-1 bg-cream overflow-auto p-7 min-w-0">
          {children}
        </main>
      </div>
    </>
  )
}
