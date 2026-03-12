'use client'

import { useState, useEffect } from 'react'
import { Player, CompletedQuest } from '@/types/quest'

const PLAYER_STORAGE_KEY = 'random-quest-player'

const titles = [
  'Wanderer',
  'Explorer', 
  'Adventurer',
  'Pathfinder',
  'Trailblazer',
  'Legend',
  'Mythic',
  'Transcendent',
  'Cosmic',
  'Eternal'
]

const levelThresholds = [0, 300, 800, 1800, 3500, 6000, 10000, 15000, 22000, 30000]

function getDefaultPlayer(): Player {
  return {
    xp: 0,
    level: 1,
    title: titles[0],
    completed: [],
    lastQuestDate: null,
    streak: 0
  }
}

export function usePlayer() {
  const [player, setPlayer] = useState<Player>(getDefaultPlayer)
  const [isHydrated, setIsHydrated] = useState(false)

  // Load player data from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(PLAYER_STORAGE_KEY)
      if (stored) {
        const parsedPlayer = JSON.parse(stored)
        setPlayer(parsedPlayer)
      }
    } catch (error) {
      console.error('Failed to load player data:', error)
    } finally {
      setIsHydrated(true)
    }
  }, [])

  const updatePlayer = (updates: Partial<Player>) => {
    const newPlayer = { ...player, ...updates }
    setPlayer(newPlayer)
    
    try {
      localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(newPlayer))
    } catch (error) {
      console.error('Failed to save player data:', error)
    }
  }

  const completeQuest = (questId: string, questTitle: string, xp: number, note?: string) => {
    const completedQuest: CompletedQuest = {
      id: questId,
      completedAt: new Date().toISOString(),
      note,
      xp,
      title: questTitle
    }

    const newXP = player.xp + xp
    const newLevel = calculateLevel(newXP)
    const leveledUp = newLevel > player.level
    
    // Check for streak bonus
    const today = new Date().toDateString()
    const lastQuestDate = player.lastQuestDate ? new Date(player.lastQuestDate).toDateString() : null
    const streakBonus = (lastQuestDate !== today) ? 50 : 0
    
    const totalXP = newXP + streakBonus
    const finalLevel = calculateLevel(totalXP)

    updatePlayer({
      xp: totalXP,
      level: finalLevel,
      title: titles[finalLevel - 1] || titles[titles.length - 1],
      completed: [...player.completed, completedQuest],
      lastQuestDate: today,
      streak: lastQuestDate !== today ? player.streak + 1 : player.streak
    })

    return { leveledUp: finalLevel > player.level, streakBonus }
  }

  return { player, updatePlayer, completeQuest, isHydrated }
}

function calculateLevel(xp: number): number {
  for (let i = levelThresholds.length - 1; i >= 0; i--) {
    if (xp >= levelThresholds[i]) {
      return i + 1
    }
  }
  return 1
}
