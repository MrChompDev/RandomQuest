'use client'

import { motion } from 'framer-motion'

interface XPBarProps {
  current: number
  nextLevel: number
}

export function XPBar({ current, nextLevel }: XPBarProps) {
  const progress = Math.min((current / nextLevel) * 100, 100)
  
  return (
    <div className="relative">
      <div className="progress-bar">
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="progress-fill shimmer"
          style={{ '--target-width': `${progress}%` } as any}
        />
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-500 font-medium">
        <span>{current} XP</span>
        <span>{nextLevel} XP</span>
      </div>
    </div>
  )
}
