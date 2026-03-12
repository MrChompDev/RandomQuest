export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    explore: '\u{1F9ED}',
    nature: '\u{1F33F}',
    social: '\u{1F91D}',
    challenge: '\u{1F9E0}',
    capture: '\u{1F4F8}',
    ai: '\u2728'
  }
  return icons[category] || '\u{1F5FA}\u{FE0F}'
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    explore: 'bg-blue-100',
    nature: 'bg-green-100',
    social: 'bg-yellow-100',
    challenge: 'bg-emerald-100',
    capture: 'bg-pink-100',
    ai: 'bg-sky-100'
  }
  return colors[category] || 'bg-gray-100'
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}
