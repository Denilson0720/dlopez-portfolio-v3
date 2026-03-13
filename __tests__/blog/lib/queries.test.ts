import { toPost, getPinnedPosts } from '@/lib/blog/queries'

// ── Supabase mock for getPinnedPosts ──────────────────────────────────────────
const mockLimitFn = jest.fn()
const mockOrderFn = jest.fn(() => ({ limit: mockLimitFn }))
const mockEqPinnedFn = jest.fn(() => ({ order: mockOrderFn }))
const mockEqStatusFn = jest.fn(() => ({ eq: mockEqPinnedFn }))
const mockSelectFn = jest.fn(() => ({ eq: mockEqStatusFn }))
const mockFromFn = jest.fn(() => ({ select: mockSelectFn }))

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => Promise.resolve({ from: mockFromFn })),
}))

const mockRow = {
  id: 'abc-123',
  title: 'Test Post',
  slug: 'test-post',
  summary: 'A summary',
  body: { type: 'doc', content: [] },
  category: 'tech',
  status: 'published',
  pinned: false,
  thumbnail_url: 'https://example.com/thumb.jpg',
  published_at: '2026-03-08T00:00:00.000Z',
  created_at: '2026-03-01T00:00:00.000Z',
  updated_at: '2026-03-07T00:00:00.000Z',
}

describe('toPost', () => {
  it('maps thumbnail_url to thumbnailUrl', () => {
    const post = toPost(mockRow)
    expect(post.thumbnailUrl).toBe('https://example.com/thumb.jpg')
    expect((post as any).thumbnail_url).toBeUndefined()
  })

  it('maps published_at to publishedAt', () => {
    const post = toPost(mockRow)
    expect(post.publishedAt).toBe('2026-03-08T00:00:00.000Z')
    expect((post as any).published_at).toBeUndefined()
  })

  it('maps created_at to createdAt', () => {
    const post = toPost(mockRow)
    expect(post.createdAt).toBe('2026-03-01T00:00:00.000Z')
    expect((post as any).created_at).toBeUndefined()
  })

  it('maps updated_at to updatedAt', () => {
    const post = toPost(mockRow)
    expect(post.updatedAt).toBe('2026-03-07T00:00:00.000Z')
    expect((post as any).updated_at).toBeUndefined()
  })

  it('casts category to PostCategory type', () => {
    const post = toPost(mockRow)
    expect(post.category).toBe('tech')
  })

  it('casts status to PostStatus type', () => {
    const post = toPost(mockRow)
    expect(post.status).toBe('published')
  })

  it('handles null nullable fields', () => {
    const rowWithNulls = {
      ...mockRow,
      summary: null,
      thumbnail_url: null,
      published_at: null,
    }
    const post = toPost(rowWithNulls)
    expect(post.summary).toBeNull()
    expect(post.thumbnailUrl).toBeNull()
    expect(post.publishedAt).toBeNull()
  })

  it('preserves all non-transformed fields correctly', () => {
    const post = toPost(mockRow)
    expect(post.id).toBe('abc-123')
    expect(post.title).toBe('Test Post')
    expect(post.slug).toBe('test-post')
    expect(post.pinned).toBe(false)
  })
})

describe('getPinnedPosts', () => {
  const pinnedRow = {
    ...mockRow,
    pinned: true,
    id: 'pinned-1',
    slug: 'pinned-post',
    title: 'Pinned Post',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns transformed pinned posts when Supabase returns data', async () => {
    mockLimitFn.mockResolvedValueOnce({ data: [pinnedRow], error: null })
    const posts = await getPinnedPosts()
    expect(posts).toHaveLength(1)
    expect(posts[0].pinned).toBe(true)
    expect(posts[0].id).toBe('pinned-1')
  })

  it('returns empty array when Supabase returns no rows', async () => {
    mockLimitFn.mockResolvedValueOnce({ data: [], error: null })
    const posts = await getPinnedPosts()
    expect(posts).toEqual([])
  })

  it('throws when Supabase returns an error', async () => {
    mockLimitFn.mockResolvedValueOnce({ data: null, error: { message: 'DB error' } })
    await expect(getPinnedPosts()).rejects.toThrow('DB error')
  })

  it('filters by pinned = true (calls .eq with pinned, true)', async () => {
    mockLimitFn.mockResolvedValueOnce({ data: [], error: null })
    await getPinnedPosts()
    expect(mockEqPinnedFn).toHaveBeenCalledWith('pinned', true)
  })

  it('applies a limit of 2', async () => {
    mockLimitFn.mockResolvedValueOnce({ data: [], error: null })
    await getPinnedPosts()
    expect(mockLimitFn).toHaveBeenCalledWith(2)
  })
})
