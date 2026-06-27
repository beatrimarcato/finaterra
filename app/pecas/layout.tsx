import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AlunaNav } from '@/components/aluna-nav'
import { ViewModeProvider } from '@/components/view-mode-context'

const ADMIN_EMAILS = ['beatrimarcato@gmail.com', 'administrativo@finaterraceramica.com.br']

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
    <ViewModeProvider defaultMode="mobile">
      <div className="min-h-screen bg-gradient-to-br from-brand-50 to-accent-50">
        <AlunaNav userEmail={user.email!} isAdmin={ADMIN_EMAILS.includes(user.email ?? '')} />
        <main className="container mx-auto px-4 py-8">{children}</main>
      </div>
    </ViewModeProvider>
  )
}
