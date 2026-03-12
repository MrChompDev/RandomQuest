'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { usePlayer } from '@/hooks/usePlayer'
import { XPBar } from '@/components/XPBar'
import { getCategoryIcon, getCategoryColor } from '@/lib/utils'

const categories = ['explore', 'nature', 'social', 'challenge', 'capture']

export default function Profile() {
  const { player } = usePlayer()
  const router = useRouter()

  const categoryStats = categories.map(category => {
    const categoryQuests = player.completed.filter(q => 
      q.id.includes(category) || (!q.id.startsWith('ai_') && category === 'explore')
    )
    return {
      category,
      count: categoryQuests.length,
      xp: categoryQuests.reduce((sum, q) => sum + q.xp, 0)
    }
  })

  const maxCategoryXP = Math.max(...categoryStats.map(stat => stat.xp), 1)

  const getNextLevelXP = (level: number): number => {
    const thresholds = [0, 300, 800, 1800, 3500, 6000, 10000, 15000, 22000, 30000]
    return thresholds[level] || thresholds[thresholds.length - 1] * 2
  }

  const getTotalNextLevelXP = (): number => {
    const currentLevel = player.level
    const currentXP = player.xp
    const nextLevelThreshold = getNextLevelXP(currentLevel)
    const prevLevelThreshold = getNextLevelXP(currentLevel - 1)
    return nextLevelThreshold - prevLevelThreshold
  }

  const getCurrentLevelProgress = (): number => {
    const currentLevel = player.level
    const currentXP = player.xp
    const prevLevelThreshold = getNextLevelXP(currentLevel - 1)
    return currentXP - prevLevelThreshold
  }

  return (
    <div className="min-h-screen bg-transparent p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-deep-navy mb-2">
            Adventurer Profile
          </h1>
          <p className="text-gray-600">
            Your journey through Random Quest
          </p>
        </motion.div>

        {/* Level & XP Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="quest-card mb-6"
        >
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-16 h-16 bg-quest-blue rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {player.level}
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-bold text-deep-navy">
                  {player.title}
                </h2>
                <p className="text-gray-600">Level {player.level}</p>
              </div>
            </div>
            
            <div className="mb-4">
              <XPBar 
                current={getCurrentLevelProgress()} 
                nextLevel={getTotalNextLevelXP()} 
              />
            </div>
            
            <div className="flex justify-center gap-6 text-sm">
              <div>
                <span className="text-quest-blue font-bold">{player.xp}</span>
                <span className="text-gray-600 ml-1">Total XP</span>
              </div>
              <div>
                <span className="text-adventure-gold font-bold">{player.completed.length}</span>
                <span className="text-gray-600 ml-1">Quests</span>
              </div>
              <div>
                <span className="text-success-green font-bold">{player.streak}</span>
                <span className="text-gray-600 ml-1">Day Streak</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="quest-card mb-6"
        >
          <h3 className="text-lg font-semibold text-deep-navy mb-4">
            Quest Categories
          </h3>
          
          <div className="space-y-3">
            {categoryStats.map((stat, index) => (
              <motion.div
                key={stat.category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 flex items-center justify-center text-lg">
                  {getCategoryIcon(stat.category)}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium capitalize text-deep-navy">
                      {stat.category}
                    </span>
                    <span className="text-sm text-gray-600">
                      {stat.count} quests {'\u2022'} {stat.xp} XP
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(stat.xp / maxCategoryXP) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                      className={`h-full ${getCategoryColor(stat.category).replace('bg-', 'bg-')} rounded-full`}
                      style={{ 
                        backgroundColor: stat.category === 'explore' ? '#4B7BF5' :
                                      stat.category === 'nature' ? '#22C55E' :
                                      stat.category === 'social' ? '#F5A623' :
                                      stat.category === 'challenge' ? '#8B5CF6' :
                                      stat.category === 'capture' ? '#EC4899' : '#6B7280'
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="quest-card mb-6"
        >
          <h3 className="text-lg font-semibold text-deep-navy mb-4">
            Achievements
          </h3>
          
          <div className="grid grid-cols-3 gap-4">
            <div className={`text-center p-3 rounded-lg ${
              player.completed.length >= 1 ? 'bg-success-green/10 border border-success-green/30' : 'bg-gray-100'
            }`}>
              <div className="text-2xl mb-1">{'\u{1F31F}'}</div>
              <div className="text-xs font-medium">First Quest</div>
            </div>
            
            <div className={`text-center p-3 rounded-lg ${
              player.streak >= 3 ? 'bg-success-green/10 border border-success-green/30' : 'bg-gray-100'
            }`}>
              <div className="text-2xl mb-1">{'\u{1F525}'}</div>
              <div className="text-xs font-medium">3-Day Streak</div>
            </div>
            
            <div className={`text-center p-3 rounded-lg ${
              player.completed.length >= 10 ? 'bg-success-green/10 border border-success-green/30' : 'bg-gray-100'
            }`}>
              <div className="text-2xl mb-1">{'\u{1F3C6}'}</div>
              <div className="text-xs font-medium">10 Quests</div>
            </div>
            
            <div className={`text-center p-3 rounded-lg ${
              player.completed.some(q => q.id.startsWith('ai_')) ? 'bg-success-green/10 border border-success-green/30' : 'bg-gray-100'
            }`}>
              <div className="text-2xl mb-1">{'\u2728'}</div>
              <div className="text-xs font-medium">AI Explorer</div>
            </div>
            
            <div className={`text-center p-3 rounded-lg ${
              player.level >= 5 ? 'bg-success-green/10 border border-success-green/30' : 'bg-gray-100'
            }`}>
              <div className="text-2xl mb-1">{'\u{1F396}\u{FE0F}'}</div>
              <div className="text-xs font-medium">Level 5</div>
            </div>
            
            <div className={`text-center p-3 rounded-lg ${
              player.completed.length >= 25 ? 'bg-success-green/10 border border-success-green/30' : 'bg-gray-100'
            }`}>
              <div className="text-2xl mb-1">{'\u{1F48E}'}</div>
              <div className="text-xs font-medium">25 Quests</div>
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex gap-3 justify-center"
        >
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
          >
            Home
          </button>
          <button
            onClick={() => router.push('/log')}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
          >
            Quest Log
          </button>
        </motion.div>
      </div>
    </div>
  )
}
