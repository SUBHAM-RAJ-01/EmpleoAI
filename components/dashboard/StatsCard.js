'use client'

import { motion } from 'framer-motion'

export default function StatsCard({ title, value, icon, color = 'blue', index = 0 }) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="card hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <motion.p
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.2, type: 'spring' }}
            className="text-3xl font-bold text-gray-900"
          >
            {value}
          </motion.p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]} transition-transform hover:scale-110`}>
          {icon}
        </div>
      </div>
    </motion.div>
  )
}
