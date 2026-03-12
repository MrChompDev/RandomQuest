'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { CategoryPicker } from '@/components/CategoryPicker'
import { XPBar } from '@/components/XPBar'
import { Navigation } from '@/components/Navigation'
import { usePlayer } from '@/hooks/usePlayer'

export default function HomeClient() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const { player } = usePlayer()
  const router = useRouter()

  const handleGetQuest = () => {
    const params = new URLSearchParams()
    if (selectedCategory) {
      params.append('category', selectedCategory)
    }
    router.push(`/quest?${params.toString()}`)
  }

  const handleAIQuest = () => {
    const params = new URLSearchParams()
    params.append('ai', 'true')
    if (selectedCategory) {
      params.append('category', selectedCategory)
    }
    router.push(`/quest?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-transparent p-4 pb-24 app-shell">
      <div className="max-w-md mx-auto app-container">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 hero-section"
        >
          <div className="mb-6 hero-card">
            <div className="text-7xl mb-4 float-animation">{'\u{1F5FA}\u{FE0F}'}</div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-quest-blue to-adventure-gold bg-clip-text text-transparent mb-4 leading-tight hero-title">
              Random Quest
            </h1>
            <p className="text-xl text-gray-700 font-medium leading-relaxed hero-subtitle">
              Your screen gives you a quest.<br/>
              <span className="text-gradient">The world is the game.</span>
            </p>
          </div>
        </motion.div>

        {/* Player XP Summary */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="mb-8"
        >
          <div className="glass-card panel-card">
            <div className="flex justify-between items-center mb-6">
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-1 stat-title">
                  Level {player.level}
                </div>
                <div className="text-sm font-medium text-gray-600">
                  {player.title}
                </div>
              </div>
              <div className="text-right">
                <div className="xp-badge text-xl px-4 py-2 mb-2">{player.xp} XP</div>
                {player.streak > 0 && (
                  <div className="streak-badge">
                    {'\u{1F525}'} {player.streak} day streak
                  </div>
                )}
              </div>
            </div>
            <XPBar current={player.xp} nextLevel={getNextLevelXP(player.level)} />
            <div className="text-xs text-gray-500 mt-3 text-center font-medium">
              {getNextLevelXP(player.level) - player.xp} XP to next level
            </div>
          </div>
        </motion.div>

        {/* Category Picker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center section-title">
            Choose Your Adventure
          </h2>
          <CategoryPicker 
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
        </motion.div>

        {/* Get Quest Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 120 }}
          className="space-y-6"
        >
          <motion.button
            onClick={handleGetQuest}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cta-button text-2xl px-10 py-6 w-full max-w-xs shadow-2xl"
          >
            <span className="text-3xl mr-3">{'\u{1F5FA}\u{FE0F}'}</span>
            Get Quest
          </motion.button>
          
          {player.level >= 4 && (
            <motion.button
              onClick={handleAIQuest}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="ai-button text-xl px-8 py-5 w-full max-w-xs shadow-2xl"
            >
              <span className="text-2xl mr-2">{'\u2728'}</span>
              Surprise me with AI
            </motion.button>
          )}
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <p className="text-lg text-gray-700 font-medium">
              {selectedCategory ? (
                <span className="text-gradient">
                  {'\u{1F3AF}'} {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} adventure awaits!
                </span>
              ) : (
                <span>Pick a category or go random {'\u{1F3B2}'}</span>
              )}
            </p>
          </motion.div>
        </motion.div>
      </div>
      
      <Navigation />
    </div>
  )
}

function getNextLevelXP(level: number): number {
  const thresholds = [0, 300, 800, 1800, 3500]
  return thresholds[level] || thresholds[thresholds.length - 1] * 2
}
