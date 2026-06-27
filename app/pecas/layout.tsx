import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AlunaNav } from '@/components/aluna-nav'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'beatrimarcato@gmail.com'

export default async function PecasLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('nome')
    .eq('id', user.id)
    .single()

  if (!profile?.nome) redirect('/agenda/cadastro')

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
      <AlunaNav userEmail={user.email!} isAdmin={user.email === ADMIN_EMAIL} />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
