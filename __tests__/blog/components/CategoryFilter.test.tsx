import { render, screen, fireEvent } from '@testing-library/react'
import CategoryFilter from '@/components/blog/CategoryFilter'
import type { PostCategory } from '@/lib/blog/types'

describe('CategoryFilter', () => {
  const onCategoryChange = jest.fn()

  beforeEach(() => {
    onCategoryChange.mockClear()
  })

  it('renders All, Tech, and Random buttons', () => {
    render(<CategoryFilter activeCategory={null} onCategoryChange={onCategoryChange} />)
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Tech' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Random' })).toBeInTheDocument()
  })

  it('renders a group container with aria-label="Filter by category"', () => {
    render(<CategoryFilter activeCategory={null} onCategoryChange={onCategoryChange} />)
    expect(screen.getByRole('group', { name: /filter by category/i })).toBeInTheDocument()
  })

  it('sets aria-pressed="true" on the active filter and false on others', () => {
    render(<CategoryFilter activeCategory={'tech'} onCategoryChange={onCategoryChange} />)
    expect(screen.getByRole('button', { name: 'Tech' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: 'Random' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('sets aria-pressed="true" on All when activeCategory is null', () => {
    render(<CategoryFilter activeCategory={null} onCategoryChange={onCategoryChange} />)
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('calls onCategoryChange with "tech" when Tech is clicked', () => {
    render(<CategoryFilter activeCategory={null} onCategoryChange={onCategoryChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'Tech' }))
    expect(onCategoryChange).toHaveBeenCalledWith('tech')
  })

  it('calls onCategoryChange with "random" when Random is clicked', () => {
    render(<CategoryFilter activeCategory={null} onCategoryChange={onCategoryChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'Random' }))
    expect(onCategoryChange).toHaveBeenCalledWith('random')
  })

  it('calls onCategoryChange with null when the active filter is clicked (deselect)', () => {
    render(<CategoryFilter activeCategory={'tech'} onCategoryChange={onCategoryChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'Tech' }))
    expect(onCategoryChange).toHaveBeenCalledWith(null)
  })

  it('calls onCategoryChange with null when All is clicked', () => {
    render(<CategoryFilter activeCategory={'tech'} onCategoryChange={onCategoryChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'All' }))
    expect(onCategoryChange).toHaveBeenCalledWith(null)
  })
})
