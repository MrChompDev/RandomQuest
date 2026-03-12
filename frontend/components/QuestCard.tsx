'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Quest } from '@/types/quest'

interface QuestCardProps {
  quest: Quest
  onComplete: (note?: string) => void
  onSkip: () => void
  isLoading?: boolean
}

export function QuestCard({ quest, onComplete, onSkip, isLoading }: QuestCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [showCompleteOptions, setShowCompleteOptions] = useState(false)
  const [note, setNote] = useState('')

  const handleComplete = () => {
    setShowCompleteOptions(true)
  }

  const confirmComplete = () => {
    onComplete(note.trim() || undefined)
  }

  const handleCardClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
    if (isLoading || showCompleteOptions) return
    const target = event.target as HTMLElement
    if (target.closest('button, textarea, input, a')) return
    setIsFlipped(!isFlipped)
  }

  const difficultyStars = Array.from({ length: 5 }, (_, i) => i < quest.difficulty)

  return (
    <div className="w-full max-w-md mx-auto perspective-1000">
      <AnimatePresence>
        {!showCompleteOptions ? (
          <motion.div
            key="card"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="relative h-96"
          >
            <motion.div
              className={`absolute inset-0 w-full h-full quest-card ${isFlipped ? 'flipped' : ''}`}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6 }}
              style={{ transformStyle: 'preserve-3d' }}
              onClick={handleCardClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="quest-card-inner">
                {/* Front of card */}
                <div className="quest-card-front">
                  <div className="h-full flex flex-col justify-between p-8">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="difficulty-stars">
                          {difficultyStars.map((filled, i) => (
                            <span key={i} className={`star ${filled ? '' : 'empty'}`}>
                              {filled ? '\u2B50' : '\u2606'}
                            </span>
                          ))}
                        </div>
                        {quest.ai_generated && (
                          <div className="level-badge">AI</div>
                        )}
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {quest.title}
                      </h3>
                      
                      <div className="flex items-center gap-3 mb-4">
                        <div className="xp-badge">
                          +{quest.xp} XP
                        </div>
                        <div className="text-sm text-gray-500">
                          Level {quest.min_level}+
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-6xl mb-3 float-animation">
                        {'\u{1F5FA}\u{FE0F}'}
                      </div>
                      <p className="text-gray-600 font-medium">
                        Tap to reveal quest
                      </p>
                    </div>
                  </div>
                </div>

                {/* Back of card */}
                <div className="quest-card-back">
                  <div className="h-full flex flex-col justify-between p-8">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="difficulty-stars">
                          {difficultyStars.map((filled, i) => (
                            <span key={i} className={`star ${filled ? '' : 'empty'}`}>
                              {filled ? '\u2B50' : '\u2606'}
                            </span>
                          ))}
                        </div>
                        {quest.ai_generated && (
                          <div className="level-badge">AI</div>
                        )}
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        {quest.title}
                      </h3>
                      
                      <p className="text-gray-700 leading-relaxed text-lg mb-6">
                        {quest.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {quest.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="xp-badge">
                          +{quest.xp} XP
                        </div>
                        <div className="text-sm text-gray-500">
                          Level {quest.min_level}+
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleComplete()
                        }}
                        className="success-button flex-1"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={isLoading}
                      >
                        I did it! {'\u{1F389}'}
                      </motion.button>
                      
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation()
                          onSkip()
                        }}
                        className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={isLoading}
                      >
                        Skip
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="complete"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="quest-card"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              How did it go?
            </h3>
            
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note (optional)..."
              className="form-textarea mb-4"
              rows={4}
            />
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowCompleteOptions(false)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition-all duration-200"
              >
                Back
              </button>
              <button
                onClick={confirmComplete}
                className="flex-1 success-button"
              >
                Complete Quest {'\u{1F389}'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}



