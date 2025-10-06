import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

interface LayoutProps {
  children: ReactNode
  title: string
}

export function Layout({ children, title }: LayoutProps) {
  return (
    <div className="min-h-screen bg-carbon">
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] min-h-screen">
        <Sidebar />
        
        <div className="flex flex-col">
          <Header title={title} />
          
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 p-6 overflow-auto"
          >
            {children}
          </motion.main>
        </div>
      </div>
    </div>
  )
}