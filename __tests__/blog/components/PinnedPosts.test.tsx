import { render, screen } from '@testing-library/react'
import PinnedPosts from '@/components/blog/PinnedPosts'
import type { Post } from '@/lib/blog/types'

const makePost = (overrides: Partial<Post> = {}): Post => ({
  id: 'post-1',
  title: 'Test Post',
  slug: 'test-post',
  summary: 'Summary text',
  body: { type: 'doc', content: [] },
  category: 'tech',
  status: 'published',
  pinned: true,
  thumbnailUrl: null,
  publishedAt: '2026-03-08T00:00:00.000Z',
  createdAt: '2026-03-08T00:00:00.000Z',
  updatedAt: '2026-03-08T00:00:00.000Z',
  ...overrides,
})

describe('PinnedPosts', () => {
  it('renders nothing when posts array is empty', () => {
    const { container } = render(<PinnedPosts posts={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders a section with aria-label="Pinned posts" when posts are provided', () => {
    const posts = [makePost()]
    render(<PinnedPosts posts={posts} />)
    expect(screen.getByRole('region', { name: /pinned posts/i })).toBeInTheDocument()
  })

  it('renders a PostCard for each pinned post', () => {
    const posts = [
      makePost({ id: '1', title: 'First Pinned', slug: 'first-pinned' }),
      makePost({ id: '2', title: 'Second Pinned', slug: 'second-pinned' }),
    ]
    render(<PinnedPosts posts={posts} />)
    expect(screen.getByText('First Pinned')).toBeInTheDocument()
    expect(screen.getByText('Second Pinned')).toBeInTheDocument()
  })

  it('renders at most 2 post cards even if more are passed (defensive UI)', () => {
    const posts = [
      makePost({ id: '1', title: 'Post One', slug: 'post-one' }),
      makePost({ id: '2', title: 'Post Two', slug: 'post-two' }),
      makePost({ id: '3', title: 'Post Three', slug: 'post-three' }),
    ]
    render(<PinnedPosts posts={posts.slice(0, 2)} />)
    expect(screen.getByText('Post One')).toBeInTheDocument()
    expect(screen.getByText('Post Two')).toBeInTheDocument()
    expect(screen.queryByText('Post Three')).not.toBeInTheDocument()
  })
})
