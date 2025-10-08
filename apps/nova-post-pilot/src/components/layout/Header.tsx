import { Menu } from 'lucide-react'

interface HeaderProps {
  title?: string
  onMenuClick: () => void
}

export function Header({ title = 'Dashboard', onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-carbon/80 backdrop-blur-xl border-b border-white/10">
      <div className="flex items-center justify-between p-4 md:p-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-white/60 hover:text-white transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
        </div>
      </div>
    </header>
  )
}

