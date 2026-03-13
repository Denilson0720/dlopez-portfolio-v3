import { render, screen, fireEvent } from '@testing-library/react'
import BlogContent from '@/components/blog/BlogContent'
import type { Post } from '@/lib/blog/types'

const makePost = (overrides: Partial<Post> = {}): Post => ({
  id: 'post-1',
  title: 'Test Post',
  slug: 'test-post',
  summary: 'Summary',
  body: { type: 'doc', content: [] },
  category: 'tech',
  status: 'published',
  pinned: false,
  thumbnailUrl: null,
  publishedAt: '2026-03-08T00:00:00.000Z',
  createdAt: '2026-03-08T00:00:00.000Z',
  updatedAt: '2026-03-08T00:00:00.000Z',
  ...overrides,
})

const techPost = makePost({ id: '1', title: 'Tech Article', slug: 'tech-article', category: 'tech' })
const randomPost = makePost({ id: '2', title: 'Random Thought', slug: 'random-thought', category: 'random' })
const pinnedTech = makePost({ id: '3', title: 'Pinned Tech', slug: 'pinned-tech', category: 'tech', pinned: true })
const pinnedRandom = makePost({ id: '4', title: 'Pinned Random', slug: 'pinned-random', category: 'random', pinned: true })

describe('BlogContent', () => {
  it('renders all posts and pinned posts when no filter active', () => {
    render(
      <BlogContent
        pinnedPosts={[pinnedTech, pinnedRandom]}
        posts={[techPost, randomPost]}
      />
    )
    expect(screen.getByText('Tech Article')).toBeInTheDocument()
    expect(screen.getByText('Random Thought')).toBeInTheDocument()
    expect(screen.getByText('Pinned Tech')).toBeInTheDocument()
    expect(screen.getByText('Pinned Random')).toBeInTheDocument()
  })

  it('shows only Tech posts when Tech filter is selected', () => {
    render(
      <BlogContent
        pinnedPosts={[pinnedTech, pinnedRandom]}
        posts={[techPost, randomPost]}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Tech' }))
    expect(screen.getByText('Tech Article')).toBeInTheDocument()
    expect(screen.queryByText('Random Thought')).not.toBeInTheDocument()
  })

  it('shows only Random posts when Random filter is selected', () => {
    render(
      <BlogContent
        pinnedPosts={[pinnedTech, pinnedRandom]}
        posts={[techPost, randomPost]}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Random' }))
    expect(screen.getByText('Random Thought')).toBeInTheDocument()
    expect(screen.queryByText('Tech Article')).not.toBeInTheDocument()
  })

  it('filters pinned posts by category too', () => {
    render(
      <BlogContent
        pinnedPosts={[pinnedTech, pinnedRandom]}
        posts={[techPost, randomPost]}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Tech' }))
    expect(screen.getByText('Pinned Tech')).toBeInTheDocument()
    expect(screen.queryByText('Pinned Random')).not.toBeInTheDocument()
  })

  it('restores all posts when All is clicked after filtering', () => {
    render(
      <BlogContent
        pinnedPosts={[pinnedTech]}
        posts={[techPost, randomPost]}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Random' }))
    expect(screen.queryByText('Tech Article')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'All' }))
    expect(screen.getByText('Tech Article')).toBeInTheDocument()
    expect(screen.getByText('Random Thought')).toBeInTheDocument()
  })

  it('shows PostList empty state when no posts match the filter', () => {
    render(
      <BlogContent
        pinnedPosts={[]}
        posts={[techPost]}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Random' }))
    expect(screen.getByText('No posts published yet.')).toBeInTheDocument()
  })
})
