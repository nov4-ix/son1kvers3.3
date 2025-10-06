import { motion } from 'framer-motion'
import { Bell, Search, User } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/hooks/useAuth'

interface HeaderProps {
  title: string
}

export function Header({ title }: HeaderProps) {
  const { user } = useAuth()

  return (
    <header className="h-16 glass border-b border-white/10 flex items-center justify-between px-6 sticky top-0 z-30">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-white">{title}</h1>
      </motion.div>

      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="hidden md:block">
          <Input
            placeholder="Buscar..."
            className="w-64"
            icon={<Search className="w-4 h-4" />}
          />
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="sm">
          <Bell className="w-4 h-4" />
        </Button>

        {/* User Menu */}
        <div className="flex items-center space-x-3">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-medium text-white">
              {user?.email?.split('@')[0] || 'Usuario'}
            </div>
            <div className="text-xs text-white/60">
              {user?.email || 'usuario@ejemplo.com'}
            </div>
          </div>
          
          <Button variant="ghost" size="sm" className="p-2">
            <User className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}