import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AguardandoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('nome, turma_id')
    .eq('id', user.id)
    .single()

  // Se já foi aprovada, manda direto pra agenda
  if (profile?.turma_id) redirect('/agenda')
  // Se ainda não preencheu o cadastro, manda preencher
  if (!profile?.nome) redirect('/agenda/cadastro')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 to-accent-100 px-4">
      <div className="w-full max-w-md text-center space-y-4">
        <div className="text-5xl">⏳</div>
        <h1 className="text-2xl font-bold text-brand-700">Cadastro recebido!</h1>
        <p className="text-gray-600">
          Olá, <strong>{profile?.nome}</strong>! Seu cadastro foi enviado e está aguardando aprovação da professora.
        </p>
        <p className="text-sm text-muted-foreground">
          Você receberá acesso assim que a professora confirmar sua turma. Tente entrar novamente em breve.
        </p>
        <a
          href="/agenda"
          className="inline-block mt-4 text-sm text-brand-600 underline hover:text-brand-700"
        >
          Verificar novamente
        </a>
      </div>
    </div>
  )
}
