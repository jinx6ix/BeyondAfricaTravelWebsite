'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Spinner } from '@/components/ui'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const params = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await signIn('credentials', {
        email, password,
        redirect: false,
      })
      if (res?.error) {
        toast.error('Invalid email or password')
      } else {
        toast.success('Welcome back!')
        router.push(params.get('callbackUrl') || '/admin')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-forest flex items-center justify-center px-4">
      {/* Rings */}
      {[1,2,3].map(i=>(
        <div key={i} className="absolute rounded-full border border-gold/10 pointer-events-none"
          style={{width:i*200,height:i*200,top:'50%',left:'50%',transform:'translate(-50%,-50%)'}}/>
      ))}

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-5xl block mb-3">🌍</span>
          <h1 className="font-serif text-white text-2xl font-bold">Savanna & Beyond</h1>
          <p className="text-white/60 text-sm mt-1">Staff Management Portal</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-modal animate-fade-up">
          <h2 className="font-serif text-xl text-forest mb-6 text-center">Sign In</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <input
                type="email" required className="input"
                placeholder="admin@savannaandbeyond.co.ke"
                value={email} onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                type="password" required className="input"
                placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 mt-2">
              {loading ? <Spinner size={16} /> : 'Sign In to Dashboard'}
            </button>
          </form>
          <p className="text-xs text-gray-400 text-center mt-4">
            Default: admin@savannaandbeyond.co.ke / admin123
          </p>
        </div>

        <p className="text-white/40 text-xs text-center mt-5">
          <a href="/" className="hover:text-white/70 transition-colors">← Back to public website</a>
        </p>
      </div>
    </div>
  )
}
