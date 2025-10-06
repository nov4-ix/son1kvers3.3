import { motion } from 'framer-motion'
import { Instagram } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useInstagramAuth } from '@/hooks/useInstagramAuth'

export function InstagramConnection() {
  const { instagramConnection, isConnecting, connectInstagram, disconnectInstagram } = useInstagramAuth()

  if (instagramConnection) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center space-x-2"
      >
        <div className="flex items-center space-x-2 text-green-400">
          <Instagram className="w-4 h-4" />
          <span className="text-sm font-medium">Conectado</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={disconnectInstagram}
          disabled={isConnecting}
        >
          Desconectar
        </Button>
      </motion.div>
    )
  }

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={connectInstagram}
      loading={isConnecting}
      icon={<Instagram className="w-4 h-4" />}
    >
      Conectar Instagram
    </Button>
  )
}