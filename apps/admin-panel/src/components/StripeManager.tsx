// src/components/StripeManager.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { stripeService, PRICING_PLANS } from '../services/stripe';
import { useAdminStore } from '../store/useAdminStore';

interface StripeStats {
  totalRevenue: number;
  activeSubscriptions: number;
  monthlyRecurringRevenue: number;
  churnRate: number;
  averageRevenuePerUser: number;
}

interface Subscription {
  id: string;
  customerId: string;
  status: string;
  plan: string;
  amount: number;
  currency: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export const StripeManager: React.FC = () => {
  const [stats, setStats] = useState<StripeStats | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('pro');
  const { addLog } = useAdminStore();

  useEffect(() => {
    loadStripeData();
  }, []);

  const loadStripeData = async () => {
    setIsLoading(true);
    try {
      // Simular carga de datos de Stripe
      const mockStats: StripeStats = {
        totalRevenue: 15420.50,
        activeSubscriptions: 127,
        monthlyRecurringRevenue: 3683.00,
        churnRate: 2.3,
        averageRevenuePerUser: 29.00
      };

      const mockSubscriptions: Subscription[] = [
        {
          id: 'sub_1234567890',
          customerId: 'cus_1234567890',
          status: 'active',
          plan: 'pro',
          amount: 2900,
          currency: 'usd',
          currentPeriodStart: '2024-01-01T00:00:00Z',
          currentPeriodEnd: '2024-02-01T00:00:00Z',
          cancelAtPeriodEnd: false
        },
        {
          id: 'sub_0987654321',
          customerId: 'cus_0987654321',
          status: 'active',
          plan: 'enterprise',
          amount: 9900,
          currency: 'usd',
          currentPeriodStart: '2024-01-15T00:00:00Z',
          currentPeriodEnd: '2024-02-15T00:00:00Z',
          cancelAtPeriodEnd: false
        }
      ];

      setStats(mockStats);
      setSubscriptions(mockSubscriptions);

      addLog({
        level: 'success',
        message: 'Datos de Stripe cargados exitosamente',
        source: 'StripeManager'
      });
    } catch (error) {
      addLog({
        level: 'error',
        message: `Error cargando datos de Stripe: ${error}`,
        source: 'StripeManager'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSubscription = async (customerEmail: string, plan: string) => {
    setIsLoading(true);
    try {
      const customer = await stripeService.createCustomer(customerEmail);
      const subscription = await stripeService.createSubscription(
        customer.id,
        `price_${plan}`,
        7 // 7 días de prueba
      );

      addLog({
        level: 'success',
        message: `Suscripción ${plan} creada para ${customerEmail}`,
        source: 'StripeManager',
        data: { subscriptionId: subscription.id }
      });

      await loadStripeData(); // Recargar datos
    } catch (error) {
      addLog({
        level: 'error',
        message: `Error creando suscripción: ${error}`,
        source: 'StripeManager'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    setIsLoading(true);
    try {
      await stripeService.cancelSubscription(subscriptionId, false);
      
      addLog({
        level: 'warning',
        message: `Suscripción ${subscriptionId} cancelada`,
        source: 'StripeManager'
      });

      await loadStripeData(); // Recargar datos
    } catch (error) {
      addLog({
        level: 'error',
        message: `Error cancelando suscripción: ${error}`,
        source: 'StripeManager'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency = 'usd') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'canceled': return 'text-red-400';
      case 'past_due': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-cyan">💳 Gestión de Stripe</h2>
        <button
          onClick={loadStripeData}
          disabled={isLoading}
          className="px-4 py-2 bg-cyan/20 text-cyan border border-cyan/30 rounded-lg hover:bg-cyan/30 transition-colors disabled:opacity-50"
        >
          {isLoading ? '🔄' : '🔄'} Actualizar
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Ingresos Totales</p>
                <p className="text-2xl font-bold text-green-400">
                  ${stats.totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="text-2xl">💰</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Suscripciones Activas</p>
                <p className="text-2xl font-bold text-cyan">
                  {stats.activeSubscriptions}
                </p>
              </div>
              <div className="text-2xl">👥</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">MRR</p>
                <p className="text-2xl font-bold text-blue-400">
                  ${stats.monthlyRecurringRevenue.toLocaleString()}
                </p>
              </div>
              <div className="text-2xl">📈</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Churn Rate</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {stats.churnRate}%
                </p>
              </div>
              <div className="text-2xl">⚠️</div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Planes de Precios */}
      <div className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">📋 Planes de Precios</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(PRICING_PLANS).map(([key, plan]) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-4 rounded-lg border ${
                selectedPlan === key
                  ? 'border-cyan/50 bg-cyan/10'
                  : 'border-white/10 bg-gray-700/30'
              }`}
            >
              <div className="text-center">
                <h4 className="text-lg font-semibold text-white">{plan.name}</h4>
                <p className="text-3xl font-bold text-cyan mt-2">
                  ${plan.price}
                  <span className="text-sm text-gray-400">/{plan.interval}</span>
                </p>
                <ul className="mt-4 space-y-2 text-sm text-gray-300">
                  {plan.features.map((feature, index) => (
                    <li key={index}>✓ {feature}</li>
                  ))}
                </ul>
                <button
                  onClick={() => setSelectedPlan(key)}
                  className={`mt-4 w-full py-2 px-4 rounded-lg transition-colors ${
                    selectedPlan === key
                      ? 'bg-cyan text-black'
                      : 'bg-gray-600 text-white hover:bg-gray-500'
                  }`}
                >
                  {selectedPlan === key ? 'Seleccionado' : 'Seleccionar'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Suscripciones Activas */}
      <div className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">📊 Suscripciones Activas</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 text-gray-400">ID</th>
                <th className="text-left py-3 text-gray-400">Plan</th>
                <th className="text-left py-3 text-gray-400">Estado</th>
                <th className="text-left py-3 text-gray-400">Monto</th>
                <th className="text-left py-3 text-gray-400">Próximo Pago</th>
                <th className="text-left py-3 text-gray-400">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((sub) => (
                <tr key={sub.id} className="border-b border-white/5">
                  <td className="py-3 text-gray-300 font-mono text-xs">
                    {sub.id.substring(0, 12)}...
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-1 bg-gray-600 rounded text-xs">
                      {sub.plan.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={getStatusColor(sub.status)}>
                      {sub.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 text-gray-300">
                    {formatCurrency(sub.amount, sub.currency)}
                  </td>
                  <td className="py-3 text-gray-300">
                    {formatDate(sub.currentPeriodEnd)}
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => handleCancelSubscription(sub.id)}
                      className="px-3 py-1 bg-red-600/20 text-red-400 border border-red-600/30 rounded text-xs hover:bg-red-600/30 transition-colors"
                    >
                      Cancelar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">⚡ Acciones Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Email del Cliente</label>
            <input
              type="email"
              placeholder="cliente@ejemplo.com"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Plan</label>
            <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
              <option value="pro">Pro - $29/mes</option>
              <option value="enterprise">Enterprise - $99/mes</option>
            </select>
          </div>
        </div>
        <button
          onClick={() => handleCreateSubscription('test@example.com', selectedPlan)}
          disabled={isLoading}
          className="mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          {isLoading ? '🔄 Creando...' : '➕ Crear Suscripción'}
        </button>
      </div>
    </div>
  );
};
