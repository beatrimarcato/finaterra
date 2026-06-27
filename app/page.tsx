import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

const ADMIN_EMAILS = ['beatrimarcato@gmail.com', 'administrativo@finaterraceramica.com.br', 'm.annegallant@gmail.com']

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')
  if (ADMIN_EMAILS.includes(user.email ?? '')) redirect('/admin')
  redirect('/agenda')
}
