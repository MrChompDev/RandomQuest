export interface Quest {
  id: string
  title: string
  description: string
  category: string
  difficulty: number
  xp: number
  min_level: number
  tags: string[]
  ai_generated: boolean
}

export interface Category {
  id: string
  name: string
  icon: string
  description: string
  color: string
}

export interface Player {
  xp: number
  level: number
  title: string
  completed: CompletedQuest[]
  lastQuestDate: string | null
  streak: number
}

export interface CompletedQuest {
  id: string
  completedAt: string
  note?: string
  xp: number
  title: string
}

export interface QuestResponse {
  quest: Quest
  timestamp: string
}

export interface GenerateRequest {
  category: string
  location_hint?: string
  level: number
}
