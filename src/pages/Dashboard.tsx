import { useState, useEffect, memo, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Calendar, Clock, CheckCircle, XCircle, AlertCircle, Play, Pause, Settings, Send, RefreshCw, FileText } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { PostModal } from '@/components/PostModal'
import { InstagramConnection } from '@/components/InstagramConnection'
import { useAuth } from '@/hooks/useAuth'
import { useScheduler } from '@/hooks/useScheduler'
import { useAutoPublisher } from '@/hooks/useAutoPublisher'
import { db } from '@/lib/supabase'
import { formatDate, formatRelativeTime } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { ScheduledPost } from '@/types/database'

type FilterType = 'all' | 'pending' | 'published' | 'failed'

const Dashboard = memo(() => {
  const { user } = useAuth()
  const { status, recentlyPublished, startScheduler, stopScheduler } = useScheduler()
  const { status: jobStatus, isPublishing, publishPostManually, runJobManually } = useAutoPublisher()
  const [posts, setPosts] = useState<ScheduledPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<FilterType>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<ScheduledPost | null>(null)

  const loadPosts = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const { data, error } = await db.getScheduledPosts(user.id)
      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error('Error loading posts:', error)
      toast.error('Error al cargar los posts')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadPosts()
    
    // Start scheduler when dashboard loads
    if (user) {
      startScheduler()
    }
    
    return () => {
      // Don't stop scheduler on unmount - let it run in background
    }
  }, [user, startScheduler])

  const handleDeletePost = useCallback(async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este post?')) return

    try {
      const { error } = await db.deleteScheduledPost(id)
      if (error) throw error
      
      setPosts(prevPosts => prevPosts.filter(post => post.id !== id))
      toast.success('Post eliminado correctamente')
    } catch (error) {
      console.error('Error deleting post:', error)
      toast.error('Error al eliminar el post')
    }
  }, [])

  const handlePublishNow = async (post: ScheduledPost) => {
    if (!confirm(`¿Publicar "${post.title}" ahora?`)) return
    
    await publishPostManually(post.id)
    // Reload posts to get updated status
    loadPosts()
  }

  const handleEditPost = (post: ScheduledPost) => {
    setEditingPost(post)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingPost(null)
  }

  const handleModalSuccess = () => {
    loadPosts()
  }

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      if (filter === 'all') return true
      return post.status === filter
    })
  }, [posts, filter])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return 'Publicado'
      case 'failed':
        return 'Fallido'
      case 'pending':
        return 'Programado'
      default:
        return 'Desconocido'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'text-green-400'
      case 'failed':
        return 'text-red-400'
      case 'pending':
        return 'text-yellow-400'
      default:
        return 'text-gray-400'
    }
  }

  const stats = {
    total: posts.length,
    pending: posts.filter(p => p.status === 'pending').length,
    published: posts.filter(p => p.status === 'published').length,
    failed: posts.filter(p => p.status === 'failed').length,
  }

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Dashboard
            </h1>
            <p className="text-white/70">
              Gestiona tus publicaciones programadas
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <InstagramConnection />
            <Button 
              variant="secondary" 
              onClick={runJobManually}
              disabled={isPublishing}
              loading={isPublishing}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Ejecutar Job
            </Button>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Post
            </Button>
          </div>
        </div>

        {/* Auto Publisher Status */}
        {jobStatus.running && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="glass p-4 border-cyan/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <div>
                    <span className="text-sm font-medium text-white">
                      Auto Publisher activo - Ejecutando cada {jobStatus.intervalMs / 1000}s
                    </span>
                    <div className="text-xs text-white/70">
                      Runs: {jobStatus.stats.totalRuns} | Exitosos: {jobStatus.stats.successfulRuns} | Fallidos: {jobStatus.stats.failedRuns}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={jobStatus.running ? stopScheduler : startScheduler}
                  >
                    {jobStatus.running ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Recently Published Notification */}
        {recentlyPublished.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6"
          >
            <Card className="glass p-4 border-green-500/20 bg-green-500/5">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-sm font-medium text-green-400">
                  {recentlyPublished.length} post{recentlyPublished.length > 1 ? 's' : ''} publicado{recentlyPublished.length > 1 ? 's' : ''} recientemente
                </span>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="glass p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
                <p className="text-sm text-white/70">Total Posts</p>
              </div>
              <div className="w-12 h-12 bg-cyan/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-cyan" />
              </div>
            </div>
          </Card>

          <Card className="glass p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
                <p className="text-sm text-white/70">Programados</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </Card>

          <Card className="glass p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-400">{stats.published}</p>
                <p className="text-sm text-white/70">Publicados</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </Card>

          <Card className="glass p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-red-400">{stats.failed}</p>
                <p className="text-sm text-white/70">Fallidos</p>
              </div>
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-500" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex space-x-2 mb-6">
          {[
            { key: 'all', label: 'Todos' },
            { key: 'pending', label: 'Programados' },
            { key: 'published', label: 'Publicados' },
            { key: 'failed', label: 'Fallidos' },
          ].map(({ key, label }) => (
            <Button
              key={key}
              variant={filter === key ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter(key as FilterType)}
            >
              {label}
            </Button>
          ))}
        </div>

        {/* Posts List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <Card className="glass p-12 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-white/50" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {filter === 'all' ? 'No tienes posts' : `No hay posts ${filter === 'pending' ? 'programados' : filter === 'published' ? 'publicados' : 'fallidos'}`}
            </h3>
            <p className="text-white/70 mb-6">
              {filter === 'all' 
                ? 'Crea tu primer post para empezar a programar publicaciones'
                : 'Los posts con este estado aparecerán aquí'
              }
            </p>
            {filter === 'all' && (
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Crear Primer Post
              </Button>
            )}
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="glass p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">
                          {post.title}
                        </h3>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(post.status)}
                          <span className={`text-sm font-medium ${getStatusColor(post.status)}`}>
                            {getStatusText(post.status)}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-white/70 mb-3 line-clamp-2">
                        {post.caption}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-sm text-white/50">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(post.scheduled_time)}</span>
                        </span>
                        <span className="capitalize">{post.platform}</span>
                        {post.hashtags && post.hashtags.length > 0 && (
                          <span>{post.hashtags.length} hashtags</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {post.status === 'pending' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePublishNow(post)}
                          disabled={isPublishing}
                          className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditPost(post)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePost(post.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Floating Action Button */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 }}
          className="fixed bottom-6 right-6 z-40"
        >
          <Button
            onClick={() => setIsModalOpen(true)}
            className="w-14 h-14 rounded-full shadow-lg glow-cyan"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </motion.div>
      </motion.div>

      {/* Post Modal */}
      <PostModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        editingPost={editingPost}
      />
    </div>
  )
})

Dashboard.displayName = 'Dashboard'

export { Dashboard }
