/**
 * @jest-environment node
 */
import { DELETE } from '@/app/api/blog/posts/[id]/route'
import { auth } from '@clerk/nextjs/server'
import { getPostById } from '@/lib/blog/queries'
import { deletePost } from '@/lib/blog/mutations'
import { revalidatePath } from 'next/cache'

jest.mock('@clerk/nextjs/server', () => ({ auth: jest.fn() }))
jest.mock('@/lib/blog/queries', () => ({ getPostById: jest.fn() }))
jest.mock('@/lib/blog/mutations', () => ({ deletePost: jest.fn() }))
jest.mock('next/cache', () => ({ revalidatePath: jest.fn() }))

const mockAuth = auth as jest.Mock
const mockGetPostById = getPostById as jest.Mock
const mockDeletePost = deletePost as jest.Mock
const mockRevalidatePath = revalidatePath as jest.Mock

const mockParams = { params: { id: 'post-123' } }

describe('DELETE /api/blog/posts/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns 401 when unauthenticated', async () => {
    mockAuth.mockResolvedValue({ userId: null })
    const res = await DELETE(new Request('http://localhost'), mockParams)
    expect(res.status).toBe(401)
    const json = await res.json()
    expect(json.error).toBe('Unauthorized')
  })

  it('returns 404 when post not found', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_abc' })
    mockGetPostById.mockResolvedValue(null)
    const res = await DELETE(new Request('http://localhost'), mockParams)
    expect(res.status).toBe(404)
    const json = await res.json()
    expect(json.error).toBe('Post not found')
  })

  it('deletes post and revalidates /blog and /blog/[slug]', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_abc' })
    mockGetPostById.mockResolvedValue({ id: 'post-123', slug: 'my-post' })
    mockDeletePost.mockResolvedValue(undefined)

    const res = await DELETE(new Request('http://localhost'), mockParams)
    expect(res.status).toBe(200)
    expect(mockDeletePost).toHaveBeenCalledWith('post-123')
    expect(mockRevalidatePath).toHaveBeenCalledWith('/blog')
    expect(mockRevalidatePath).toHaveBeenCalledWith('/blog/my-post')
    const json = await res.json()
    expect(json.data).toBeNull()
    expect(json.error).toBeNull()
  })

  it('returns 500 on DB error', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_abc' })
    mockGetPostById.mockResolvedValue({ id: 'post-123', slug: 'my-post' })
    mockDeletePost.mockRejectedValue(new Error('DB error'))

    const res = await DELETE(new Request('http://localhost'), mockParams)
    expect(res.status).toBe(500)
    const json = await res.json()
    expect(json.error).toBe('Failed to delete post')
  })
})
