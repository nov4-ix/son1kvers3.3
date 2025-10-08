import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  Calendar, 
  Plus, 
  Settings, 
  Bell,
  User,
  LogOut,
  TrendingUp,
  Users,
  Clock
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'

export function Dashboard() {
  const navigate = useNavigate()
  const { user, signOut } = useAuthStore()

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const stats = [
    { label: 'Posts Published', value: '24', icon: TrendingUp, change: '+12%' },
    { label: 'Engagement Rate', value: '8.4%', icon: Users, change: '+3.2%' },
    { label: 'Scheduled Posts', value: '7', icon: Clock, change: '+2' },
    { label: 'Active Campaigns', value: '3', icon: BarChart3, change: '+1' },
  ]

  const recentPosts = [
    { id: 1, title: 'Welcome to Son1kVerse', platform: 'Instagram', status: 'Published', time: '2h ago' },
    { id: 2, title: 'Ghost Studio Update', platform: 'Twitter', status: 'Scheduled', time: 'Tomorrow' },
    { id: 3, title: 'Nexus Visual Demo', platform: 'LinkedIn', status: 'Draft', time: '1d ago' },
  ]

  return (
    <div className="min-h-screen bg-[#0A0C10] text-white">
      {/* Header */}
      <header className="bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-[#00FFE7] to-[#B84DFF] rounded-lg flex items-center justify-center">
                <span className="text-[#0A0C10] font-bold text-sm">N</span>
              </div>
              <h1 className="text-xl font-bold">Nova Post Pilot</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-[#00FFE7] to-[#B84DFF] rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-[#0A0C10]" />
                </div>
                <span className="text-sm">{user?.email || 'Admin'}</span>
              </div>
              <button 
                onClick={handleSignOut}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-[#00FFE7] to-[#B84DFF] rounded-lg">
                  <stat.icon className="w-6 h-6 text-[#0A0C10]" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-green-400 text-sm font-medium">{stat.change}</span>
                <span className="text-white/50 text-sm ml-2">vs last month</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Posts */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Recent Posts</h2>
                <button className="flex items-center space-x-2 bg-gradient-to-r from-[#00FFE7] to-[#B84DFF] text-[#0A0C10] px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
                  <Plus className="w-4 h-4" />
                  <span>New Post</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <div key={post.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{post.title}</h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-white/70 text-sm">{post.platform}</span>
                        <span className={`text-sm px-2 py-1 rounded ${
                          post.status === 'Published' ? 'bg-green-500/20 text-green-400' :
                          post.status === 'Scheduled' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {post.status}
                        </span>
                      </div>
                    </div>
                    <span className="text-white/50 text-sm">{post.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                  <Plus className="w-5 h-5 text-[#00FFE7]" />
                  <span className="text-white">Create Post</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                  <Calendar className="w-5 h-5 text-[#B84DFF]" />
                  <span className="text-white">Schedule Post</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                  <BarChart3 className="w-5 h-5 text-[#00FFE7]" />
                  <span className="text-white">View Analytics</span>
                </button>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Campaigns</h2>
              <div className="space-y-3">
                <div className="p-3 bg-white/5 rounded-lg">
                  <h3 className="text-white font-medium text-sm">Summer Campaign</h3>
                  <p className="text-white/70 text-xs mt-1">3 posts scheduled</p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg">
                  <h3 className="text-white font-medium text-sm">Product Launch</h3>
                  <p className="text-white/70 text-xs mt-1">5 posts scheduled</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
