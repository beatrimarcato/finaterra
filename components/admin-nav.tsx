'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ViewModeSwitch } from '@/components/view-mode-switch'

const LINKS = [
  { href: '/admin', label: 'Aulas', exact: true },
  { href: '/admin/turmas', label: 'Turmas', exact: false },
  { href: '/admin/alunas', label: 'Alunas', exact: false },
  { href: '/admin/pecas', label: 'Peças', exact: false },
]

export function AdminNav({ userEmail }: { userEmail: string }) {
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
          <span className="font-bold text-rose-700 text-lg">Finaterra Admin</span>
          {LINKS.map(({ href, label, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={`text-sm font-medium transition-colors ${active ? 'text-rose-600' : 'text-gray-600 hover:text-rose-600'}`}
              >
                {label}
              </Link>
            )
          })}
        </div>
        <div className="flex items-center gap-3">
          <ViewModeSwitch />
          <span className="text-sm text-muted-foreground hidden sm:block">{userEmail}</span>
          <Link href="/agenda">
            <Button variant="outline" size="sm">Ver agenda</Button>
          </Link>
          <Button variant="outline" size="sm" onClick={handleLogout}>Sair</Button>
        </div>
      </div>
    </nav>
  )
}
