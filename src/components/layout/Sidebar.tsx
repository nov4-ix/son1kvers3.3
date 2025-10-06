import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Calendar, BarChart3, CreditCard, Settings, ChevronLeft, ChevronRight, LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { useScheduler } from '@/hooks/useScheduler'
import { useAutoPublisher } from '@/hooks/useAutoPublisher'

interface SidebarProps {
  isCollapsed: boolean
  toggleSidebar: () => void
}

export function Sidebar({ isCollapsed, toggleSidebar }: SidebarProps) {
  const { signOut } = useAuth()
  const { status: schedulerStatus } = useScheduler()
  const { status: autoPublisherStatus } = useAutoPublisher()
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Facturación', href: '/billing', icon: CreditCard },
    { name: 'Configuración', href: '/settings', icon: Settings },
  ]

  const sidebarVariants = {
    expanded: { width: '250px', transition: { duration: 0.3 } },
    collapsed: { width: '80px', transition: { duration: 0.3 } },
  }

  return (
    <motion.aside
      initial={false}
      animate={isCollapsed ? 'collapsed' : 'expanded'}
      variants={sidebarVariants}
      className="fixed left-0 top-0 h-full glass border-r border-white/10 z-40"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center space-x-3"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-cyan to-magenta rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">N</span>
                </div>
                <span className="text-white font-bold text-lg">Nova Post Pilot</span>
              </motion.div>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="ml-auto"
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-cyan/20 text-cyan border border-cyan/30'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="ml-3 font-medium"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Status */}
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 border-t border-white/10"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/70">Scheduler</span>
                <div className={`w-2 h-2 rounded-full ${
                  schedulerStatus.running ? 'bg-green-400' : 'bg-gray-400'
                }`} />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/70">Auto Publisher</span>
                <div className={`w-2 h-2 rounded-full ${
                  autoPublisherStatus.isRunning ? 'bg-green-400' : 'bg-gray-400'
                }`} />
              </div>
            </div>
          </motion.div>
        )}

        {/* User Section */}
        <div className="p-4 border-t border-white/10">
          <Button
            variant="ghost"
            onClick={signOut}
            className="w-full justify-start"
          >
            <LogOut className="w-4 h-4" />
            {!isCollapsed && <span className="ml-3">Cerrar Sesión</span>}
          </Button>
        </div>
      </div>
    </motion.aside>
  )
}