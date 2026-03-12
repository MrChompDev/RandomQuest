'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { QuestCard } from '@/components/QuestCard'
import { usePlayer } from '@/hooks/usePlayer'
import { api } from '@/lib/api'
import { Quest } from '@/types/quest'
import { useRouter } from 'next/navigation'

export default function QuestPage() {
  const [quest, setQuest] = useState<Quest | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCompleting, setIsCompleting] = useState(false)
  
  const { player, completeQuest, isHydrated } = usePlayer()
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const category = searchParams.get('category')
  const isAI = searchParams.get('ai') === 'true'

  useEffect(() => {
    if (!isHydrated) return
    loadQuest()
  }, [category, isAI, isHydrated])

  const loadQuest = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      let response
      
      if (isAI) {
        // Generate AI quest
        response = await api.generateQuest({
          category: category || 'explore',
          level: player.level,
          location_hint: null
        })
      } else {
        // Get regular quest
        response = await api.getQuest(category || undefined, player.level)
      }
      
      setQuest(response.quest)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load quest')
    } finally {
      setIsLoading(false)
    }
  }

  const handleComplete = async (note?: string) => {
    if (!quest) return
    
    setIsCompleting(true)
    
    try {
      const { leveledUp, streakBonus } = completeQuest(
        quest.id,
        quest.title,
        quest.xp,
        note
      )
      
      // Show completion animation
      if (leveledUp) {
        // Level up animation would go here
        console.log('LEVEL UP!')
      }
      
      if (streakBonus > 0) {
        console.log('Streak bonus:', streakBonus)
      }
      
      // Redirect back to home after a short delay
      setTimeout(() => {
        router.push('/')
      }, 2000)
      
    } catch (err) {
      console.error('Failed to complete quest:', err)
      setIsCompleting(false)
    }
  }

  const handleSkip = () => {
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-quest-blue border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
        <div className="quest-card text-center">
          <h2 className="text-xl font-bold text-deep-navy mb-2">Oops!</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="cta-button"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  if (!quest) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
        <div className="quest-card text-center">
          <h2 className="text-xl font-bold text-deep-navy mb-2">No Quest Found</h2>
          <button
            onClick={() => router.push('/')}
            className="cta-button"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-deep-navy mb-2">
            Your Quest Awaits
          </h1>
          <p className="text-gray-600">
            {isAI ? '\u2728 AI-Generated Adventure' : `${category} Quest`}
          </p>
        </div>
        
        <QuestCard
          quest={quest}
          onComplete={handleComplete}
          onSkip={handleSkip}
          isLoading={isCompleting}
        />
      </motion.div>
    </div>
  )
}
