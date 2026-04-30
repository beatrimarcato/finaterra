'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export function AlunaNav({ userEmail }: { userEmail: string }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-bold text-rose-700 text-lg">Finaterra Agenda</span>
          <Link href="/agenda" className={`text-sm font-medium ${pathname === '/agenda' ? 'text-rose-600' : 'text-gray-600 hover:text-rose-600'}`}>
            Agenda
          </Link>
          <Link href="/agenda/minhas-aulas" className={`text-sm font-medium ${pathname === '/agenda/minhas-aulas' ? 'text-rose-600' : 'text-gray-600 hover:text-rose-600'}`}>
            Minhas Aulas
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground hidden sm:block">{userEmail}</span>
          <Button variant="outline" size="sm" onClick={handleLogout}>Sair</Button>
        </div>
      </div>
    </nav>
  )
}
