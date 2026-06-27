'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function confirmarPagamento(pecaId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('pecas')
    .update({ status: 'confirmado' })
    .eq('id', pecaId)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/pecas')
}

export async function deletarPeca(pecaId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('pecas')
    .delete()
    .eq('id', pecaId)
    .eq('status', 'pendente')

  if (error) throw new Error(error.message)

  revalidatePath('/admin/pecas')
}
