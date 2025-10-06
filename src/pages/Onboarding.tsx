import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { 
  User, 
  Instagram, 
  Twitter, 
  Facebook, 
  Target, 
  Calendar,
  CheckCircle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'

const onboardingSchema = z.object({
  fullName: z.string().min(2, 'El nombre es requerido'),
  businessType: z.string().min(1, 'Selecciona un tipo de negocio'),
  goals: z.array(z.string()).min(1, 'Selecciona al menos un objetivo'),
  platforms: z.array(z.string()).min(1, 'Selecciona al menos una plataforma'),
})

type OnboardingData = z.infer<typeof onboardingSchema>

const businessTypes = [
  { id: 'creator', label: 'Creador de Contenido', icon: User },
  { id: 'business', label: 'Empresa', icon: Target },
  { id: 'agency', label: 'Agencia', icon: Calendar },
  { id: 'influencer', label: 'Influencer', icon: Instagram },
]

const goals = [
  { id: 'brand-awareness', label: 'Aumentar reconocimiento de marca' },
  { id: 'engagement', label: 'Mejorar engagement' },
  { id: 'sales', label: 'Generar ventas' },
  { id: 'community', label: 'Construir comunidad' },
  { id: 'content', label: 'Automatizar contenido' },
]

const platforms = [
  { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-500' },
  { id: 'twitter', label: 'Twitter', icon: Twitter, color: 'text-blue-400' },
  { id: 'facebook', label: 'Facebook', icon: Facebook, color: 'text-blue-600' },
]

export function Onboarding() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OnboardingData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      fullName: '',
      businessType: '',
      goals: [],
      platforms: [],
    },
  })

  const watchedGoals = watch('goals')
  const watchedPlatforms = watch('platforms')

  const onSubmit = async (data: OnboardingData) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('¡Onboarding completado! Bienvenido a Nova Post Pilot')
      navigate('/dashboard')
    } catch (error) {
      toast.error('Error al completar el onboarding')
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const toggleGoal = (goalId: string) => {
    const currentGoals = watchedGoals || []
    const newGoals = currentGoals.includes(goalId)
      ? currentGoals.filter(id => id !== goalId)
      : [...currentGoals, goalId]
    setValue('goals', newGoals)
  }

  const togglePlatform = (platformId: string) => {
    const currentPlatforms = watchedPlatforms || []
    const newPlatforms = currentPlatforms.includes(platformId)
      ? currentPlatforms.filter(id => id !== platformId)
      : [...currentPlatforms, platformId]
    setValue('platforms', newPlatforms)
  }

  const steps = [
    { title: 'Información Personal', icon: User },
    { title: 'Tipo de Negocio', icon: Target },
    { title: 'Objetivos', icon: Calendar },
    { title: 'Plataformas', icon: Instagram },
  ]

  return (
    <div className="min-h-screen bg-carbon flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep > index + 1 
                      ? 'bg-green-500 text-white' 
                      : currentStep === index + 1 
                        ? 'bg-cyan text-carbon' 
                        : 'bg-white/10 text-white/50'
                  }`}>
                    {currentStep > index + 1 ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-1 mx-2 ${
                      currentStep > index + 1 ? 'bg-green-500' : 'bg-white/10'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <h1 className="text-2xl font-bold text-white text-center">
              {steps[currentStep - 1].title}
            </h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              {/* Step 1: Personal Info */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold text-white mb-2">
                      ¡Hola {user?.email?.split('@')[0]}! 👋
                    </h2>
                    <p className="text-white/70">
                      Cuéntanos un poco sobre ti para personalizar tu experiencia
                    </p>
                  </div>

                  <Input
                    label="Nombre completo"
                    {...register('fullName')}
                    error={errors.fullName?.message}
                    placeholder="Tu nombre completo"
                  />
                </motion.div>
              )}

              {/* Step 2: Business Type */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold text-white mb-2">
                      ¿Qué tipo de negocio tienes?
                    </h2>
                    <p className="text-white/70">
                      Esto nos ayuda a recomendarte las mejores funciones
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {businessTypes.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setValue('businessType', type.id)}
                        className={`p-4 rounded-lg border transition-all duration-200 ${
                          watch('businessType') === type.id
                            ? 'border-cyan bg-cyan/10 text-cyan'
                            : 'border-white/20 bg-white/5 text-white/70 hover:border-white/40'
                        }`}
                      >
                        <type.icon className="w-8 h-8 mx-auto mb-2" />
                        <div className="font-medium">{type.label}</div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Goals */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold text-white mb-2">
                      ¿Cuáles son tus objetivos?
                    </h2>
                    <p className="text-white/70">
                      Selecciona todos los que apliquen
                    </p>
                  </div>

                  <div className="space-y-3">
                    {goals.map((goal) => (
                      <button
                        key={goal.id}
                        type="button"
                        onClick={() => toggleGoal(goal.id)}
                        className={`w-full p-4 rounded-lg border transition-all duration-200 text-left ${
                          watchedGoals?.includes(goal.id)
                            ? 'border-cyan bg-cyan/10 text-cyan'
                            : 'border-white/20 bg-white/5 text-white/70 hover:border-white/40'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded border mr-3 flex items-center justify-center ${
                            watchedGoals?.includes(goal.id)
                              ? 'border-cyan bg-cyan'
                              : 'border-white/40'
                          }`}>
                            {watchedGoals?.includes(goal.id) && (
                              <CheckCircle className="w-3 h-3 text-carbon" />
                            )}
                          </div>
                          {goal.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 4: Platforms */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold text-white mb-2">
                      ¿En qué plataformas quieres publicar?
                    </h2>
                    <p className="text-white/70">
                      Puedes agregar más después
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {platforms.map((platform) => (
                      <button
                        key={platform.id}
                        type="button"
                        onClick={() => togglePlatform(platform.id)}
                        className={`p-6 rounded-lg border transition-all duration-200 ${
                          watchedPlatforms?.includes(platform.id)
                            ? 'border-cyan bg-cyan/10 text-cyan'
                            : 'border-white/20 bg-white/5 text-white/70 hover:border-white/40'
                        }`}
                      >
                        <platform.icon className={`w-8 h-8 mx-auto mb-3 ${platform.color}`} />
                        <div className="font-medium">{platform.label}</div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="ghost"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>

              {currentStep < 4 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={
                    (currentStep === 1 && !watch('fullName')) ||
                    (currentStep === 2 && !watch('businessType')) ||
                    (currentStep === 3 && (!watchedGoals || watchedGoals.length === 0)) ||
                    (currentStep === 4 && (!watchedPlatforms || watchedPlatforms.length === 0))
                  }
                >
                  Siguiente
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  loading={isLoading}
                >
                  Completar Setup
                </Button>
              )}
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
