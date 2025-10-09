import { SubscriptionPlan, SubscriptionStatus, SubscriptionInsert, SubscriptionUpdate } from '@/types/database'

// Mock Stripe configuration
const STRIPE_CONFIG = {
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_mock',
  secretKey: import.meta.env.VITE_STRIPE_SECRET_KEY || 'sk_test_mock',
  webhookSecret: import.meta.env.VITE_STRIPE_WEBHOOK_SECRET || 'whsec_mock'
}

// Mock pricing plans
export const PRICING_PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'usd',
    interval: 'month',
    features: [
      '5 posts por mes',
      '1 red social',
      'IA básica',
      'Soporte por email'
    ],
    limits: {
      postsPerMonth: 5,
      socialNetworks: 1,
      aiGenerations: 10
    }
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 29,
    currency: 'usd',
    interval: 'month',
    features: [
      'Posts ilimitados',
      'Todas las redes sociales',
      'IA avanzada',
      'Analytics detallados',
      'Soporte prioritario',
      'API access'
    ],
    limits: {
      postsPerMonth: -1, // unlimited
      socialNetworks: -1, // unlimited
      aiGenerations: -1 // unlimited
    }
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    currency: 'usd',
    interval: 'month',
    features: [
      'Todo de Pro',
      'Múltiples usuarios',
      'White-label',
      'Soporte dedicado',
      'Custom integrations',
      'SLA garantizado'
    ],
    limits: {
      postsPerMonth: -1,
      socialNetworks: -1,
      aiGenerations: -1,
      teamMembers: -1
    }
  }
}

interface StripeCustomer {
  id: string
  email: string
  name?: string
}

interface StripeSubscription {
  id: string
  customer: string
  status: string
  current_period_start: number
  current_period_end: number
  cancel_at_period_end: boolean
  items: {
    data: Array<{
      price: {
        id: string
        unit_amount: number
        currency: string
        recurring: {
          interval: string
        }
      }
    }>
  }
}

interface StripePrice {
  id: string
  unit_amount: number
  currency: string
  recurring: {
    interval: string
  }
  product: string
}

class StripeService {
  private isMockMode: boolean

  constructor() {
    this.isMockMode = !import.meta.env.VITE_STRIPE_SECRET_KEY || 
                     import.meta.env.VITE_STRIPE_SECRET_KEY.includes('mock')
  }

  // Create or get customer
  async createCustomer(email: string, name?: string): Promise<StripeCustomer> {
    if (this.isMockMode) {
      return {
        id: `cus_mock_${Date.now()}`,
        email,
        name
      }
    }

    // Real Stripe API call (commented for now)
    /*
    const response = await fetch('https://api.stripe.com/v1/customers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_CONFIG.secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        email,
        name: name || ''
      })
    })

    if (!response.ok) {
      throw new Error('Failed to create customer')
    }

    return await response.json()
    */

    throw new Error('Stripe integration not implemented yet')
  }

  // Create subscription
  async createSubscription(
    customerId: string, 
    priceId: string, 
    trialDays?: number
  ): Promise<StripeSubscription> {
    if (this.isMockMode) {
      const plan = Object.values(PRICING_PLANS).find(p => p.id === priceId.replace('price_', ''))
      if (!plan) throw new Error('Invalid plan')

      return {
        id: `sub_mock_${Date.now()}`,
        customer: customerId,
        status: 'active',
        current_period_start: Math.floor(Date.now() / 1000),
        current_period_end: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days
        cancel_at_period_end: false,
        items: {
          data: [{
            price: {
              id: priceId,
              unit_amount: plan.price * 100, // Convert to cents
              currency: plan.currency,
              recurring: {
                interval: plan.interval
              }
            }
          }]
        }
      }
    }

    // Real Stripe API call (commented for now)
    /*
    const response = await fetch('https://api.stripe.com/v1/subscriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_CONFIG.secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        customer: customerId,
        items: JSON.stringify([{ price: priceId }]),
        trial_period_days: trialDays?.toString() || '0'
      })
    })

    if (!response.ok) {
      throw new Error('Failed to create subscription')
    }

    return await response.json()
    */

    throw new Error('Stripe integration not implemented yet')
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId: string, atPeriodEnd: boolean = true): Promise<StripeSubscription> {
    if (this.isMockMode) {
      return {
        id: subscriptionId,
        customer: 'cus_mock',
        status: atPeriodEnd ? 'active' : 'canceled',
        current_period_start: Math.floor(Date.now() / 1000),
        current_period_end: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60),
        cancel_at_period_end: atPeriodEnd,
        items: {
          data: [{
            price: {
              id: 'price_mock',
              unit_amount: 2900,
              currency: 'usd',
              recurring: {
                interval: 'month'
              }
            }
          }]
        }
      }
    }

    // Real Stripe API call (commented for now)
    /*
    const response = await fetch(`https://api.stripe.com/v1/subscriptions/${subscriptionId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_CONFIG.secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        cancel_at_period_end: atPeriodEnd.toString()
      })
    })

    if (!response.ok) {
      throw new Error('Failed to cancel subscription')
    }

    return await response.json()
    */

    throw new Error('Stripe integration not implemented yet')
  }

  // Get subscription
  async getSubscription(subscriptionId: string): Promise<StripeSubscription> {
    if (this.isMockMode) {
      return {
        id: subscriptionId,
        customer: 'cus_mock',
        status: 'active',
        current_period_start: Math.floor(Date.now() / 1000),
        current_period_end: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60),
        cancel_at_period_end: false,
        items: {
          data: [{
            price: {
              id: 'price_mock',
              unit_amount: 2900,
              currency: 'usd',
              recurring: {
                interval: 'month'
              }
            }
          }]
        }
      }
    }

    // Real Stripe API call (commented for now)
    /*
    const response = await fetch(`https://api.stripe.com/v1/subscriptions/${subscriptionId}`, {
      headers: {
        'Authorization': `Bearer ${STRIPE_CONFIG.secretKey}`
      }
    })

    if (!response.ok) {
      throw new Error('Failed to get subscription')
    }

    return await response.json()
    */

    throw new Error('Stripe integration not implemented yet')
  }

  // Create checkout session
  async createCheckoutSession(
    customerId: string,
    priceId: string,
    successUrl: string,
    cancelUrl: string
  ): Promise<{ url: string }> {
    if (this.isMockMode) {
      return {
        url: `${window.location.origin}/billing/success?session_id=mock_session_${Date.now()}`
      }
    }

    // Real Stripe API call (commented for now)
    /*
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_CONFIG.secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        customer: customerId,
        payment_method_types: 'card',
        line_items: JSON.stringify([{
          price: priceId,
          quantity: 1
        }]),
        mode: 'subscription',
        success_url: successUrl,
        cancel_url: cancelUrl
      })
    })

    if (!response.ok) {
      throw new Error('Failed to create checkout session')
    }

    const session = await response.json()
    return { url: session.url }
    */

    throw new Error('Stripe integration not implemented yet')
  }

  // Verify webhook signature
  verifyWebhookSignature(payload: string, signature: string): boolean {
    if (this.isMockMode) {
      return signature === 'mock_signature'
    }

    // Real webhook verification (commented for now)
    /*
    const crypto = require('crypto')
    const expectedSignature = crypto
      .createHmac('sha256', STRIPE_CONFIG.webhookSecret)
      .update(payload)
      .digest('hex')
    
    return signature === expectedSignature
    */

    return false
  }

  // Process webhook event
  async processWebhookEvent(event: any): Promise<{ success: boolean; data?: any }> {
    try {
      switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          return {
            success: true,
            data: {
              type: 'subscription_updated',
              subscription: event.data.object
            }
          }

        case 'customer.subscription.deleted':
          return {
            success: true,
            data: {
              type: 'subscription_canceled',
              subscription: event.data.object
            }
          }

        case 'invoice.payment_succeeded':
          return {
            success: true,
            data: {
              type: 'payment_succeeded',
              invoice: event.data.object
            }
          }

        case 'invoice.payment_failed':
          return {
            success: true,
            data: {
              type: 'payment_failed',
              invoice: event.data.object
            }
          }

        default:
          return { success: true, data: { type: 'unknown', event } }
      }
    } catch (error) {
      console.error('Error processing webhook:', error)
      return { success: false }
    }
  }

  // Get price ID for plan
  getPriceId(plan: SubscriptionPlan): string {
    return `price_${plan}`
  }

  // Check if user has access to feature
  hasFeatureAccess(userPlan: SubscriptionPlan, feature: string): boolean {
    const plan = PRICING_PLANS[userPlan]
    if (!plan) return false

    return plan.features.includes(feature)
  }

  // Check if user is within limits
  isWithinLimits(userPlan: SubscriptionPlan, usage: Record<string, number>): boolean {
    const plan = PRICING_PLANS[userPlan]
    if (!plan) return false

    for (const [key, limit] of Object.entries(plan.limits)) {
      if (limit === -1) continue // unlimited
      
      const currentUsage = usage[key] || 0
      if (currentUsage >= limit) {
        return false
      }
    }

    return true
  }
}

// Export singleton instance
export const stripeService = new StripeService()

// Export types
export type { StripeCustomer, StripeSubscription, StripePrice }
