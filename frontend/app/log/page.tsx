'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { usePlayer } from '@/hooks/usePlayer'
import { getCategoryIcon } from '@/lib/utils'

export default function QuestLog() {
  const { player } = usePlayer()
  const router = useRouter()

  const sortedQuests = [...player.completed].sort((a, b) => 
    new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      })
    }
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    })
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
            Quest Log
          </h1>
          <p className="text-gray-600">
            Your adventure history
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="quest-card mb-6"
        >
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-quest-blue">
                {player.completed.length}
              </div>
              <div className="text-sm text-gray-600">Quests Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-adventure-gold">
                {player.streak}
              </div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-success-green">
                {player.completed.reduce((sum, q) => sum + q.xp, 0)}
              </div>
              <div className="text-sm text-gray-600">Total XP</div>
            </div>
          </div>
        </motion.div>

        {/* Quest List */}
        {sortedQuests.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="quest-card text-center py-8"
          >
            <div className="text-4xl mb-4">{'\u{1F5FA}\u{FE0F}'}</div>
            <h3 className="text-xl font-semibold text-deep-navy mb-2">
              No quests completed yet
            </h3>
            <p className="text-gray-600 mb-4">
              Start your adventure and come back here to see your progress!
            </p>
            <button
              onClick={() => router.push('/')}
              className="cta-button"
            >
              Get Your First Quest
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {sortedQuests.map((quest, index) => (
              <motion.div
                key={quest.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="quest-card"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-deep-navy mb-1">
                      {quest.title}
                    </h3>
                    {quest.note && (
                      <p className="text-sm text-gray-600 mb-2 italic">
                        "{quest.note}"
                      </p>
                    )}
                  </div>
                  <div className="xp-badge ml-4">
                    +{quest.xp} XP
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{formatDate(quest.completedAt)} at {formatTime(quest.completedAt)}</span>
                  <div className="w-6 h-6">
                    {getCategoryIcon(quest.id.startsWith('ai_') ? 'ai' : 'explore')}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-8"
        >
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
          >
            {'\u2190'} Back to Home
          </button>
        </motion.div>
      </div>
    </div>
  )
}
