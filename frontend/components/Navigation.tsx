'use client'

import { useRouter } from 'next/navigation'
import { usePlayer } from '@/hooks/usePlayer'

export function Navigation() {
  const { player } = usePlayer()
  const router = useRouter()

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-effect border-t border-white/20 px-4 py-2 z-50 nav-bar">
      <div className="max-w-md mx-auto flex justify-around items-center nav-inner">
        <button
          onClick={() => router.push('/')}
          className="nav-item active"
        >
          <div className="text-2xl mb-1">{'\u{1F5FA}\u{FE0F}'}</div>
          <div className="text-xs font-medium">Home</div>
        </button>
        
        <button
          onClick={() => router.push('/quest')}
          className="nav-item"
        >
          <div className="text-2xl mb-1">{'\u26A1'}</div>
          <div className="text-xs font-medium">Quest</div>
        </button>
        
        <button
          onClick={() => router.push('/log')}
          className="nav-item"
        >
          <div className="text-2xl mb-1">{'\u{1F4DC}'}</div>
          <div className="text-xs font-medium">Log</div>
        </button>
        
        <button
          onClick={() => router.push('/profile')}
          className="nav-item"
        >
          <div className="text-2xl mb-1">{'\u{1F464}'}</div>
          <div className="text-xs font-medium">Profile</div>
        </button>
      </div>
    </nav>
  )
}
