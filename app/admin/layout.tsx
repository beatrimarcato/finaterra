import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminNav } from '@/components/admin-nav'
import { ViewModeProvider } from '@/components/view-mode-context'

const ADMIN_EMAILS = ['beatrimarcato@gmail.com', 'administrativo@finaterraceramica.com.br']

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !ADMIN_EMAILS.includes(user.email ?? '')) redirect('/')

  return (
    <ViewModeProvider defaultMode="desktop">
      <div className="min-h-screen bg-gray-50">
        <AdminNav userEmail={user.email!} />
        <main className="container mx-auto px-4 py-8">{children}</main>
      </div>
    </ViewModeProvider>
  )
}
