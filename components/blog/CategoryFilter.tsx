'use client'
import type { PostCategory } from '@/lib/blog/types'

interface CategoryFilterProps {
  activeCategory: PostCategory | null
  onCategoryChange: (cat: PostCategory | null) => void
}

const FILTERS: { label: string; value: PostCategory | null }[] = [
  { label: 'All', value: null },
  { label: 'Tech', value: 'tech' },
  { label: 'Random', value: 'random' },
]

export default function CategoryFilter({ activeCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div role="group" aria-label="Filter by category" className="flex gap-2 mb-8">
      {FILTERS.map(({ label, value }) => {
        const isActive = activeCategory === value
        return (
          <button
            key={label}
            onClick={() => onCategoryChange(isActive ? null : value)}
            aria-pressed={isActive}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              isActive
                ? 'bg-white text-black'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
