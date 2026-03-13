import { render, screen } from '@testing-library/react'
import PostMeta from '@/components/blog/PostMeta'
import type { Post } from '@/lib/blog/types'

const basePost: Post = {
  id: 'test-id',
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
}

describe('PostMeta', () => {
  it('renders the category badge', () => {
    render(<PostMeta post={basePost} />)
    expect(screen.getByText('tech')).toBeInTheDocument()
  })

  it('renders the publish date in a <time> element', () => {
    render(<PostMeta post={basePost} />)
    const timeEl = screen.getByRole('time')
    expect(timeEl).toBeInTheDocument()
    expect(timeEl).toHaveAttribute('dateTime', '2026-03-08T00:00:00.000Z')
  })

  it('does not render a <time> element when publishedAt is null', () => {
    render(<PostMeta post={{ ...basePost, publishedAt: null }} />)
    expect(screen.queryByRole('time')).not.toBeInTheDocument()
  })

  it('renders the random category correctly', () => {
    render(<PostMeta post={{ ...basePost, category: 'random' }} />)
    expect(screen.getByText('random')).toBeInTheDocument()
  })
})
