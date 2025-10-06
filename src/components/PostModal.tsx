import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Calendar, Clock, Hash, Image, Send } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { useAIContent } from '@/hooks/useAIContent'
import { db } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'
import type { ScheduledPost } from '@/types/database'

const postSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  caption: z.string().min(1, 'El contenido es requerido'),
  scheduled_time: z.string().min(1, 'La fecha es requerida'),
  platform: z.string().min(1, 'La plataforma es requerida'),
  network: z.string().min(1, 'La red es requerida'),
  media_url: z.string().optional(),
  hashtags: z.string().optional(),
})

type PostFormData = z.infer<typeof postSchema>

interface PostModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  editingPost?: ScheduledPost | null
}

export function PostModal({ isOpen, onClose, onSuccess, editingPost }: PostModalProps) {
  const { user } = useAuth()
  const { generateAISuggestion, clearAISuggestion, aiSuggestion } = useAIContent()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      caption: '',
      scheduled_time: '',
      platform: 'instagram',
      network: 'instagram',
      media_url: '',
      hashtags: '',
    },
  })

  const watchedCaption = watch('caption')

  useEffect(() => {
    if (editingPost) {
      setValue('title', editingPost.title)
      setValue('caption', editingPost.caption)
      setValue('scheduled_time', editingPost.scheduled_time)
      setValue('platform', editingPost.platform)
      setValue('network', editingPost.network)
      setValue('media_url', editingPost.media_url || '')
      setValue('hashtags', editingPost.hashtags?.join(', ') || '')
    } else {
      reset()
    }
  }, [editingPost, setValue, reset])

  const onSubmit = async (data: PostFormData) => {
    if (!user) return

    setIsLoading(true)
    try {
      const postData = {
        ...data,
        user_id: user.id,
        hashtags: data.hashtags ? data.hashtags.split(',').map(tag => tag.trim()) : [],
        ai_suggestion: aiSuggestion,
        retry_count: 0,
        max_retries: 3,
      }

      if (editingPost) {
        await db.updateScheduledPost(editingPost.id, postData)
        toast.success('Post actualizado correctamente')
      } else {
        await db.createScheduledPost(postData)
        toast.success('Post creado correctamente')
      }

      onSuccess()
      onClose()
      clearAISuggestion()
    } catch (error) {
      console.error('Error saving post:', error)
      toast.error('Error al guardar el post')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAISuggestion = async () => {
    const currentCaption = watchedCaption || 'Post sobre marketing digital'
    await generateAISuggestion(currentCaption)
  }

  const handleClose = () => {
    onClose()
    clearAISuggestion()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">
                  {editingPost ? 'Editar Post' : 'Nuevo Post'}
                </h2>
                <Button variant="ghost" size="sm" onClick={handleClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                  label="Título"
                  {...register('title')}
                  error={errors.title?.message}
                  placeholder="Título del post"
                />

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Contenido
                  </label>
                  <textarea
                    {...register('caption')}
                    className="w-full px-4 py-3 rounded-lg glass border border-white/10 bg-white/5 backdrop-blur-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan/50 focus:border-cyan/50 transition-all duration-200 resize-none"
                    rows={4}
                    placeholder="Escribe el contenido de tu post..."
                  />
                  {errors.caption && (
                    <p className="text-sm text-red-400 mt-1">{errors.caption.message}</p>
                  )}
                </div>

                {aiSuggestion && (
                  <div className="p-4 bg-cyan/10 border border-cyan/30 rounded-lg">
                    <h4 className="text-sm font-medium text-cyan mb-2">Sugerencia de IA:</h4>
                    <p className="text-sm text-white/80">{aiSuggestion}</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setValue('caption', aiSuggestion)}
                      className="mt-2"
                    >
                      Usar sugerencia
                    </Button>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Fecha y Hora
                    </label>
                    <input
                      type="datetime-local"
                      {...register('scheduled_time')}
                      className="w-full px-4 py-3 rounded-lg glass border border-white/10 bg-white/5 backdrop-blur-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan/50 focus:border-cyan/50 transition-all duration-200"
                    />
                    {errors.scheduled_time && (
                      <p className="text-sm text-red-400 mt-1">{errors.scheduled_time.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Plataforma
                    </label>
                    <select
                      {...register('platform')}
                      className="w-full px-4 py-3 rounded-lg glass border border-white/10 bg-white/5 backdrop-blur-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan/50 focus:border-cyan/50 transition-all duration-200"
                    >
                      <option value="instagram">Instagram</option>
                      <option value="twitter">Twitter</option>
                      <option value="facebook">Facebook</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="URL de Media"
                    {...register('media_url')}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />

                  <Input
                    label="Hashtags"
                    {...register('hashtags')}
                    placeholder="#marketing #digital #social"
                  />
                </div>

                <div className="flex items-center justify-between pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleAISuggestion}
                    icon={<Send className="w-4 h-4" />}
                  >
                    Generar Sugerencia IA
                  </Button>

                  <div className="flex space-x-3">
                    <Button type="button" variant="ghost" onClick={handleClose}>
                      Cancelar
                    </Button>
                    <Button type="submit" loading={isLoading}>
                      {editingPost ? 'Actualizar' : 'Crear'} Post
                    </Button>
                  </div>
                </div>
              </form>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}