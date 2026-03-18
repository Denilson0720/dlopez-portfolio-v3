/**
 * @jest-environment node
 */
import { PATCH } from '@/app/api/blog/posts/[id]/publish/route'
import { auth } from '@clerk/nextjs/server'
import { getPostById } from '@/lib/blog/queries'
import { togglePublish } from '@/lib/blog/mutations'
import { revalidatePath } from 'next/cache'

jest.mock('@clerk/nextjs/server', () => ({ auth: jest.fn() }))
jest.mock('@/lib/blog/queries', () => ({ getPostById: jest.fn() }))
jest.mock('@/lib/blog/mutations', () => ({ togglePublish: jest.fn() }))
jest.mock('next/cache', () => ({ revalidatePath: jest.fn() }))

const mockAuth = auth as jest.Mock
const mockGetPostById = getPostById as jest.Mock
const mockTogglePublish = togglePublish as jest.Mock
const mockRevalidatePath = revalidatePath as jest.Mock

const mockParams = { params: { id: 'post-123' } }

describe('PATCH /api/blog/posts/[id]/publish', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns 401 when unauthenticated', async () => {
    mockAuth.mockResolvedValue({ userId: null })
    const res = await PATCH(new Request('http://localhost'), mockParams)
    expect(res.status).toBe(401)
    const json = await res.json()
    expect(json.error).toBe('Unauthorized')
  })

  it('returns 404 when post not found', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_abc' })
    mockGetPostById.mockResolvedValue(null)
    const res = await PATCH(new Request('http://localhost'), mockParams)
    expect(res.status).toBe(404)
    const json = await res.json()
    expect(json.error).toBe('Post not found')
  })

  it('publishes a draft post and revalidates paths', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_abc' })
    mockGetPostById.mockResolvedValue({ id: 'post-123', status: 'draft', slug: 'my-post' })
    const published = { id: 'post-123', status: 'published', slug: 'my-post' }
    mockTogglePublish.mockResolvedValue(published)

    const res = await PATCH(new Request('http://localhost'), mockParams)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.data).toEqual(published)
    expect(json.error).toBeNull()
    expect(mockTogglePublish).toHaveBeenCalledWith('post-123', 'draft')
    expect(mockRevalidatePath).toHaveBeenCalledWith('/blog')
    expect(mockRevalidatePath).toHaveBeenCalledWith('/blog/my-post')
  })

  it('unpublishes a published post and revalidates paths', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_abc' })
    mockGetPostById.mockResolvedValue({ id: 'post-123', status: 'published', slug: 'my-post' })
    const unpublished = { id: 'post-123', status: 'draft', slug: 'my-post' }
    mockTogglePublish.mockResolvedValue(unpublished)

    const res = await PATCH(new Request('http://localhost'), mockParams)
    expect(res.status).toBe(200)
    expect(mockTogglePublish).toHaveBeenCalledWith('post-123', 'published')
    expect(mockRevalidatePath).toHaveBeenCalledWith('/blog')
    expect(mockRevalidatePath).toHaveBeenCalledWith('/blog/my-post')
  })

  it('returns 500 on DB error', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_abc' })
    mockGetPostById.mockResolvedValue({ id: 'post-123', status: 'draft', slug: 'my-post' })
    mockTogglePublish.mockRejectedValue(new Error('DB error'))

    const res = await PATCH(new Request('http://localhost'), mockParams)
    expect(res.status).toBe(500)
    const json = await res.json()
    expect(json.error).toBe('Failed to toggle publish status')
    expect(json.data).toBeNull()
  })
})
