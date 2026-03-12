import { Quest, QuestResponse, GenerateRequest } from '@/types/quest'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export class APIError extends Error {
  constructor(message: string, public status?: number) {
    super(message)
    this.name = 'APIError'
  }
}

async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new APIError(
        errorData.detail || `HTTP ${response.status}: ${response.statusText}`,
        response.status
      )
    }

    return await response.json()
  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }
    throw new APIError('Network error occurred')
  }
}

export const api = {
  async getQuest(category?: string, level?: number): Promise<QuestResponse> {
    const params = new URLSearchParams()
    if (category) params.append('category', category)
    if (level) params.append('level', level.toString())
    
    const query = params.toString() ? `?${params.toString()}` : ''
    return apiRequest<QuestResponse>(`/quest${query}`)
  },

  async generateQuest(request: GenerateRequest): Promise<Quest> {
    return apiRequest<Quest>('/generate', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  },

  async getCategories() {
    return apiRequest('/categories')
  },

  async healthCheck() {
    return apiRequest('/health')
  },
}
