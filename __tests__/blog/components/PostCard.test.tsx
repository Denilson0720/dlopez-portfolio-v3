import { render, screen } from '@testing-library/react'
import PostCard from '@/components/blog/PostCard'
import type { Post } from '@/lib/blog/types'

const basePost: Post = {
  id: 'test-id',
  title: 'My Test Post',
  slug: 'my-test-post',
  summary: 'A brief summary of the post.',
  body: { type: 'doc', content: [] },
  category: 'tech',
  status: 'published',
  pinned: false,
  thumbnailUrl: null,
  publishedAt: '2026-03-08T00:00:00.000Z',
  createdAt: '2026-03-08T00:00:00.000Z',
  updatedAt: '2026-03-08T00:00:00.000Z',
}

describe('PostCard', () => {
  it('renders the post title as a link to the post page', () => {
    render(<PostCard post={basePost} />)
    const link = screen.getByRole('link', { name: /my test post/i })
    expect(link).toHaveAttribute('href', '/blog/my-test-post')
  })

  it('renders the post summary', () => {
    render(<PostCard post={basePost} />)
    expect(screen.getByText('A brief summary of the post.')).toBeInTheDocument()
  })

  it('renders the category badge', () => {
    render(<PostCard post={basePost} />)
    expect(screen.getByText('tech')).toBeInTheDocument()
  })

  it('renders the publish date in a <time> element', () => {
    render(<PostCard post={basePost} />)
    const timeEl = screen.getByRole('time')
    expect(timeEl).toBeInTheDocument()
    expect(timeEl).toHaveAttribute('dateTime', '2026-03-08T00:00:00.000Z')
  })

  it('does not render an image when thumbnailUrl is null', () => {
    render(<PostCard post={basePost} />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('renders a thumbnail image with alt text equal to post title when thumbnailUrl is set', () => {
    const postWithThumb: Post = { ...basePost, thumbnailUrl: 'https://example.com/thumb.jpg' }
    render(<PostCard post={postWithThumb} />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('alt', 'My Test Post')
  })

  it('does not render summary when summary is null', () => {
    const postNoSummary: Post = { ...basePost, summary: null }
    render(<PostCard post={postNoSummary} />)
    expect(screen.queryByText('A brief summary of the post.')).not.toBeInTheDocument()
  })

  it('does not render date when publishedAt is null', () => {
    const postNoDdate: Post = { ...basePost, publishedAt: null }
    render(<PostCard post={postNoDdate} />)
    expect(screen.queryByRole('time')).not.toBeInTheDocument()
  })
})
