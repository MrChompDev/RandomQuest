'use client'

import { motion } from 'framer-motion'
import { Category } from '@/types/quest'

const categories: Category[] = [
  { id: 'explore', name: 'Explore', icon: '\u{1F9ED}', description: 'Discover new places', color: 'bg-blue-100' },
  { id: 'nature', name: 'Nature', icon: '\u{1F33F}', description: 'Engage with nature', color: 'bg-green-100' },
  { id: 'social', name: 'Social', icon: '\u{1F91D}', description: 'Connect with others', color: 'bg-yellow-100' },
  { id: 'challenge', name: 'Challenge', icon: '\u{1F9E0}', description: 'Test your limits', color: 'bg-emerald-100' },
  { id: 'capture', name: 'Capture', icon: '\u{1F4F8}', description: 'Document moments', color: 'bg-pink-100' },
]

interface CategoryPickerProps {
  selectedCategory: string | null
  onCategorySelect: (category: string) => void
}

export function CategoryPicker({ selectedCategory, onCategorySelect }: CategoryPickerProps) {
  return (
    <div className="grid grid-cols-2 gap-4 category-grid">
      {categories.map((category, index) => (
        <motion.button
          key={category.id}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: index * 0.08, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onCategorySelect(selectedCategory === category.id ? null : category.id)}
          className={`
            p-5 rounded-2xl border-2 transition-all relative overflow-hidden category-card
            ${selectedCategory === category.id 
              ? 'border-quest-blue bg-gradient-to-br from-quest-blue to-blue-600 text-white shadow-lg is-selected' 
              : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
            }
          `}
        >
          {/* Background decoration */}
          {selectedCategory === category.id && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              className="absolute inset-0 bg-white"
            />
          )}
          
          <div className="relative z-10">
            <div className="text-3xl mb-2">{category.icon}</div>
            <div className="font-bold text-base mb-1">{category.name}</div>
            <div className={`text-xs ${selectedCategory === category.id ? 'text-white/90' : 'text-gray-500'}`}>
              {category.description}
            </div>
          </div>
          
          {/* Selection indicator */}
          {selectedCategory === category.id && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center"
            >
              <span className="text-quest-blue text-xs">{'\u2713'}</span>
            </motion.div>
          )}
        </motion.button>
      ))}
    </div>
  )
}
