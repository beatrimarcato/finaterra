import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminNav } from '@/components/admin-nav'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'beatrimarcato@gmail.com'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== ADMIN_EMAIL) redirect('/')

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav userEmail={user.email} />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
