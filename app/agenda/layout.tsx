import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

<<<<<<< HEAD
// Este layout só verifica se o usuário está logado.
// A verificação de cadastro completo e turma fica nas páginas.
=======
export const dynamic = 'force-dynamic'

const ADMIN_EMAIL = 'beatrimarcato@gmail.com'

>>>>>>> 69df8e35185937196dbd5775c87abd9c59859411
export default async function AgendaLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

<<<<<<< HEAD
  return <>{children}</>
=======
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
      <AlunaNav userEmail={user.email!} isAdmin={user.email === ADMIN_EMAIL} />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
>>>>>>> 69df8e35185937196dbd5775c87abd9c59859411
}
