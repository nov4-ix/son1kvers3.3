import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Check, 
  X, 
  CreditCard, 
  Calendar, 
  AlertCircle,
  Crown,
  Zap,
  Building,
  ArrowRight,
  Loader
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useAuth } from '@/hooks/useAuth'
import { useAnalytics } from '@/hooks/useAnalytics'
import { stripeService, PRICING_PLANS } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'
import { SubscriptionPlan, SubscriptionStatus, Subscription } from '@/types/database'
import toast from 'react-hot-toast'

export function Billing() {
  const { user } = useAuth()
  const { trackSubscriptionChanged } = useAnalytics()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null)

  useEffect(() => {
    if (user) {
      loadSubscription()
    }
  }, [user])

  const loadSubscription = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') { // Not found error
        throw error
      }

      setSubscription(data)
    } catch (error) {
      console.error('Error loading subscription:', error)
      toast.error('Error al cargar suscripción')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpgrade = async (plan: SubscriptionPlan) => {
    if (!user) return

    setIsUpgrading(true)
    setSelectedPlan(plan)

    try {
      // Create or get customer
      const customer = await stripeService.createCustomer(user.email || '', user.user_metadata?.full_name)

      // Create checkout session
      const priceId = stripeService.getPriceId(plan)
      const successUrl = `${window.location.origin}/billing/success?session_id={CHECKOUT_SESSION_ID}`
      const cancelUrl = `${window.location.origin}/billing`

      const { url } = await stripeService.createCheckoutSession(
        customer.id,
        priceId,
        successUrl,
        cancelUrl
      )

      // Redirect to Stripe Checkout
      window.location.href = url

    } catch (error) {
      console.error('Error upgrading subscription:', error)
      toast.error('Error al procesar la actualización')
      setIsUpgrading(false)
      setSelectedPlan(null)
    }
  }

  const handleCancelSubscription = async () => {
    if (!subscription || !subscription.stripe_subscription_id) return

    if (!confirm('¿Estás seguro de que quieres cancelar tu suscripción?')) return

    try {
      await stripeService.cancelSubscription(subscription.stripe_subscription_id, true)
      
      // Update local subscription
      const { error } = await supabase
        .from('subscriptions')
        .update({ 
          cancel_at_period_end: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', subscription.id)

      if (error) throw error

      setSubscription({
        ...subscription,
        cancel_at_period_end: true
      })

      toast.success('Suscripción cancelada al final del período actual')
      trackSubscriptionChanged(subscription.plan, 'free')

    } catch (error) {
      console.error('Error canceling subscription:', error)
      toast.error('Error al cancelar suscripción')
    }
  }

  const getCurrentPlan = (): SubscriptionPlan => {
    return subscription?.plan as SubscriptionPlan || SubscriptionPlan.FREE
  }

  const getPlanIcon = (plan: SubscriptionPlan) => {
    switch (plan) {
      case SubscriptionPlan.FREE:
        return <Zap className="w-6 h-6" />
      case SubscriptionPlan.PRO:
        return <Crown className="w-6 h-6" />
      case SubscriptionPlan.ENTERPRISE:
        return <Building className="w-6 h-6" />
      default:
        return <Zap className="w-6 h-6" />
    }
  }

  const getPlanColor = (plan: SubscriptionPlan) => {
    switch (plan) {
      case SubscriptionPlan.FREE:
        return 'text-gray-400'
      case SubscriptionPlan.PRO:
        return 'text-cyan'
      case SubscriptionPlan.ENTERPRISE:
        return 'text-magenta'
      default:
        return 'text-gray-400'
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('es-ES')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Facturación</h1>
            <p className="text-white/70">Gestiona tu suscripción y método de pago</p>
          </div>
        </div>

        {/* Current Subscription */}
        {subscription && (
          <Card className="glass p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Suscripción Actual</h2>
              <div className={`flex items-center space-x-2 ${getPlanColor(getCurrentPlan())}`}>
                {getPlanIcon(getCurrentPlan())}
                <span className="font-semibold capitalize">{getCurrentPlan()}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <p className="text-white/70 text-sm">Estado</p>
                <p className={`font-semibold ${
                  subscription.status === SubscriptionStatus.ACTIVE ? 'text-green-400' : 'text-red-400'
                }`}>
                  {subscription.status === SubscriptionStatus.ACTIVE ? 'Activa' : subscription.status}
                </p>
              </div>
              <div>
                <p className="text-white/70 text-sm">Próximo pago</p>
                <p className="text-white font-semibold">
                  {formatDate(subscription.current_period_end)}
                </p>
              </div>
              <div>
                <p className="text-white/70 text-sm">Cancelación</p>
                <p className={`font-semibold ${
                  subscription.cancel_at_period_end ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {subscription.cancel_at_period_end ? 'Al final del período' : 'No programada'}
                </p>
              </div>
            </div>

            {subscription.cancel_at_period_end && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                  <p className="text-yellow-400 font-medium">
                    Tu suscripción se cancelará el {formatDate(subscription.current_period_end)}
                  </p>
                </div>
              </div>
            )}

            <div className="flex space-x-4">
              {subscription.cancel_at_period_end ? (
                <Button variant="secondary" onClick={() => {
                  // Reactivate subscription logic would go here
                  toast.success('Suscripción reactivada')
                }}>
                  Reactivar Suscripción
                </Button>
              ) : (
                <Button variant="danger" onClick={handleCancelSubscription}>
                  Cancelar Suscripción
                </Button>
              )}
            </div>
          </Card>
        )}

        {/* Pricing Plans */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Planes Disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(PRICING_PLANS).map(([key, plan]) => {
              const planKey = key as SubscriptionPlan
              const isCurrentPlan = getCurrentPlan() === planKey
              const isUpgradingToThis = selectedPlan === planKey && isUpgrading

              return (
                <Card 
                  key={key} 
                  className={`glass p-6 relative ${
                    isCurrentPlan ? 'border-cyan/50 bg-cyan/5' : ''
                  }`}
                >
                  {isCurrentPlan && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <div className="bg-cyan text-black px-3 py-1 rounded-full text-sm font-semibold">
                        Plan Actual
                      </div>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${
                      planKey === SubscriptionPlan.FREE ? 'bg-gray-500/20' :
                      planKey === SubscriptionPlan.PRO ? 'bg-cyan/20' : 'bg-magenta/20'
                    }`}>
                      {getPlanIcon(planKey)}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                    <div className="text-3xl font-bold text-white mb-2">
                      ${plan.price}
                      <span className="text-white/70 text-lg">/mes</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <span className="text-white/80">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full"
                    variant={isCurrentPlan ? 'secondary' : 'primary'}
                    disabled={isCurrentPlan || isUpgrading}
                    loading={isUpgradingToThis}
                    onClick={() => handleUpgrade(planKey)}
                  >
                    {isCurrentPlan ? 'Plan Actual' : 
                     isUpgradingToThis ? 'Procesando...' :
                     `Actualizar a ${plan.name}`}
                    {!isCurrentPlan && !isUpgradingToThis && (
                      <ArrowRight className="w-4 h-4 ml-2" />
                    )}
                  </Button>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Payment Method */}
        <Card className="glass p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Método de Pago</h2>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-8 bg-gray-600 rounded flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-medium">•••• •••• •••• 4242</p>
              <p className="text-white/70 text-sm">Expira 12/25</p>
            </div>
            <Button variant="ghost" size="sm">
              Actualizar
            </Button>
          </div>
        </Card>

        {/* Billing History */}
        <Card className="glass p-6 mt-8">
          <h2 className="text-xl font-semibold text-white mb-4">Historial de Facturación</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-white/10">
              <div>
                <p className="text-white font-medium">Nova Post Pilot Pro</p>
                <p className="text-white/70 text-sm">Diciembre 2024</p>
              </div>
              <div className="text-right">
                <p className="text-white font-medium">$29.00</p>
                <p className="text-green-400 text-sm">Pagado</p>
              </div>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-white/10">
              <div>
                <p className="text-white font-medium">Nova Post Pilot Pro</p>
                <p className="text-white/70 text-sm">Noviembre 2024</p>
              </div>
              <div className="text-right">
                <p className="text-white font-medium">$29.00</p>
                <p className="text-green-400 text-sm">Pagado</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
