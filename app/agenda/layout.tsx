import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AlunaNav } from '@/components/aluna-nav'

const ADMIN_EMAIL = 'beatrimarcato@gmail.com'

export default async function AgendaLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
      <AlunaNav userEmail={user.email!} isAdmin={user.email === ADMIN_EMAIL} />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
