'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

interface LevelUpModalProps {
  show: boolean
  newLevel: number
  title: string
  onClose: () => void
}

export function LevelUpModal({ show, newLevel, title, onClose }: LevelUpModalProps) {
  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; color: string }>>([])

  useEffect(() => {
    if (show) {
      // Generate confetti
      const colors = ['#4B7BF5', '#F5A623', '#22C55E', '#EC4899', '#8B5CF6']
      const newConfetti = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)]
      }))
      setConfetti(newConfetti)

      // Auto close after 3 seconds
      const timer = setTimeout(() => {
        onClose()
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Confetti */}
          {confetti.map((piece) => (
            <motion.div
              key={piece.id}
              initial={{ 
                x: `${piece.x}%`, 
                y: '-10px',
                rotate: 0,
                scale: 0
              }}
              animate={{ 
                x: `${piece.x + (Math.random() - 0.5) * 20}%`, 
                y: '100vh',
                rotate: Math.random() * 720,
                scale: 1
              }}
              transition={{ 
                duration: 2 + Math.random(),
                ease: 'linear'
              }}
              className="fixed w-3 h-3 rounded-full z-50 pointer-events-none"
              style={{ backgroundColor: piece.color }}
            />
          ))}
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: 2 }}
                className="text-6xl mb-4"
              >
                {'\u{1F389}'}
              </motion.div>
              
              <h2 className="text-3xl font-bold text-deep-navy mb-2">
                LEVEL UP!
              </h2>
              
              <div className="text-xl mb-4">
                <span className="text-quest-blue font-bold">Level {newLevel}</span>
                <span className="text-gray-600 mx-2">{'\u2022'}</span>
                <span className="text-adventure-gold font-semibold">{title}</span>
              </div>
              
              <p className="text-gray-600 mb-6">
                New adventures await! You've unlocked harder quests.
              </p>
              
              <button
                onClick={onClose}
                className="cta-button w-full"
              >
                Continue Questing
              </button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
