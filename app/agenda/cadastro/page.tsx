'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function CadastroPage() {
  const [form, setForm] = useState({ nome: '', celular: '' })
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErro('')

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { error } = await supabase
      .from('profiles')
      .update({ nome: form.nome.trim(), celular: form.celular.trim() })
      .eq('id', user.id)

    if (error) {
      setErro('Erro ao salvar. Tente novamente.')
    } else {
      router.push('/agenda/aguardando')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-rose-700">Bem-vinda!</CardTitle>
          <CardDescription>
            Complete seu cadastro para solicitar acesso às aulas da Finaterra.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome completo</Label>
              <Input
                id="nome"
                placeholder="Seu nome"
                value={form.nome}
                onChange={e => setForm({ ...form, nome: e.target.value })}
                required
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="celular">Celular (WhatsApp)</Label>
              <Input
                id="celular"
                placeholder="(11) 99999-9999"
                value={form.celular}
                onChange={e => setForm({ ...form, celular: e.target.value })}
                required
              />
            </div>
            {erro && <p className="text-sm text-red-500">{erro}</p>}
            <Button
              type="submit"
              className="w-full bg-rose-600 hover:bg-rose-700"
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Enviar cadastro'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
