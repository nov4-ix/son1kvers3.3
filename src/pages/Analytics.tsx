import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts'
import { 
  TrendingUp, 
  Users, 
  Zap, 
  Calendar, 
  Activity,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useAnalytics } from '@/hooks/useAnalytics'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'

export function Analytics() {
  const { user } = useAuth()
  const { 
    analyticsData, 
    isLoading, 
    getAnalyticsData, 
    getChartData, 
    getDailyActivity 
  } = useAnalytics()
  
  const [dailyActivity, setDailyActivity] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'details'>('overview')

  useEffect(() => {
    if (user) {
      getAnalyticsData()
      loadDailyActivity()
    }
  }, [user, getAnalyticsData])

  const loadDailyActivity = async () => {
    try {
      const activity = await getDailyActivity()
      setDailyActivity(activity)
    } catch (error) {
      console.error('Error loading daily activity:', error)
    }
  }

  const chartData = getChartData()
  const pieData = chartData.map(item => ({
    name: item.name,
    value: item.value,
    color: item.color
  }))

  const COLORS = ['#00FFE7', '#B84DFF', '#9AF7EE', '#FF6B6B', '#4ECDC4', '#45B7D1']

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
            <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
            <p className="text-white/70">Insights y estadísticas de tu actividad</p>
          </div>
          <Button 
            variant="secondary" 
            onClick={() => {
              getAnalyticsData()
              loadDailyActivity()
              toast.success('Analytics actualizados')
            }}
          >
            <Activity className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-8">
          {[
            { id: 'overview', label: 'Resumen', icon: BarChart3 },
            { id: 'activity', label: 'Actividad', icon: Calendar },
            { id: 'details', label: 'Detalles', icon: PieChartIcon }
          ].map(tab => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'primary' : 'ghost'}
              onClick={() => setActiveTab(tab.id as any)}
              className="flex items-center space-x-2"
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </Button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="glass p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">Posts Creados</p>
                    <p className="text-2xl font-bold text-white">{analyticsData.postsCreated}</p>
                  </div>
                  <div className="w-12 h-12 bg-cyan/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-cyan" />
                  </div>
                </div>
              </Card>

              <Card className="glass p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">Posts Publicados</p>
                    <p className="text-2xl font-bold text-white">{analyticsData.postsPublished}</p>
                  </div>
                  <div className="w-12 h-12 bg-magenta/20 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-magenta" />
                  </div>
                </div>
              </Card>

              <Card className="glass p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">IA Usada</p>
                    <p className="text-2xl font-bold text-white">{analyticsData.aiUsed}</p>
                  </div>
                  <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-accent" />
                  </div>
                </div>
              </Card>

              <Card className="glass p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">Sesiones</p>
                    <p className="text-2xl font-bold text-white">{analyticsData.sessions}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </Card>

              <Card className="glass p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">Logins</p>
                    <p className="text-2xl font-bold text-white">{analyticsData.loginCount}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </Card>

              <Card className="glass p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">Integraciones</p>
                    <p className="text-2xl font-bold text-white">{analyticsData.integrationConnections}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Bar Chart */}
              <Card className="glass p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Actividad por Tipo</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#9CA3AF"
                      fontSize={12}
                    />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#FFFFFF'
                      }}
                    />
                    <Bar dataKey="value" fill="#00FFE7" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* Pie Chart */}
              <Card className="glass p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Distribución de Actividad</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#FFFFFF'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="space-y-8">
            <Card className="glass p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Actividad Diaria (Últimos 7 días)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="day" 
                    stroke="#9CA3AF"
                    fontSize={12}
                  />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#FFFFFF'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#00FFE7" 
                    strokeWidth={2}
                    dot={{ fill: '#00FFE7', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}

        {/* Details Tab */}
        {activeTab === 'details' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Métricas Clave</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Tasa de Publicación</span>
                    <span className="text-white font-semibold">
                      {analyticsData.postsCreated > 0 
                        ? `${((analyticsData.postsPublished / analyticsData.postsCreated) * 100).toFixed(1)}%`
                        : '0%'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Promedio IA por Post</span>
                    <span className="text-white font-semibold">
                      {analyticsData.postsCreated > 0 
                        ? (analyticsData.aiUsed / analyticsData.postsCreated).toFixed(1)
                        : '0'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Sesiones por Login</span>
                    <span className="text-white font-semibold">
                      {analyticsData.loginCount > 0 
                        ? (analyticsData.sessions / analyticsData.loginCount).toFixed(1)
                        : '0'
                      }
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="glass p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Resumen de Actividad</h3>
                <div className="space-y-3">
                  <div className="text-white/70">
                    <strong className="text-white">Total de eventos:</strong> {chartData.reduce((sum, item) => sum + item.value, 0)}
                  </div>
                  <div className="text-white/70">
                    <strong className="text-white">Período:</strong> Últimos 30 días
                  </div>
                  <div className="text-white/70">
                    <strong className="text-white">Actividad más frecuente:</strong> {
                      chartData.reduce((max, item) => item.value > max.value ? item : max, chartData[0])?.name || 'N/A'
                    }
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
