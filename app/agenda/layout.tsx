import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// Este layout só verifica se o usuário está logado.
// A verificação de cadastro completo e turma fica nas páginas.
export default async function AgendaLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return <>{children}</>
}
