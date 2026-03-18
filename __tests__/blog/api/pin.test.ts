/**
 * @jest-environment node
 */
import { PATCH } from '@/app/api/blog/posts/[id]/pin/route'
import { auth } from '@clerk/nextjs/server'
import { getPostById } from '@/lib/blog/queries'
import { togglePin } from '@/lib/blog/mutations'
import { revalidatePath } from 'next/cache'

jest.mock('@clerk/nextjs/server', () => ({ auth: jest.fn() }))
jest.mock('@/lib/blog/queries', () => ({ getPostById: jest.fn() }))
jest.mock('@/lib/blog/mutations', () => ({ togglePin: jest.fn() }))
jest.mock('next/cache', () => ({ revalidatePath: jest.fn() }))

const mockAuth = auth as jest.Mock
const mockGetPostById = getPostById as jest.Mock
const mockTogglePin = togglePin as jest.Mock
const mockRevalidatePath = revalidatePath as jest.Mock

const mockParams = { params: { id: 'post-123' } }

describe('PATCH /api/blog/posts/[id]/pin', () => {
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
  })

  it('pins a post and revalidates /blog only', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_abc' })
    mockGetPostById.mockResolvedValue({ id: 'post-123', pinned: false, slug: 'my-post' })
    mockTogglePin.mockResolvedValue({ id: 'post-123', pinned: true })

    const res = await PATCH(new Request('http://localhost'), mockParams)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.data.pinned).toBe(true)
    expect(json.error).toBeNull()
    expect(mockTogglePin).toHaveBeenCalledWith('post-123', false)
    expect(mockRevalidatePath).toHaveBeenCalledWith('/blog')
    expect(mockRevalidatePath).toHaveBeenCalledTimes(1)
  })

  it('returns 409 when pin limit reached', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_abc' })
    mockGetPostById.mockResolvedValue({ id: 'post-123', pinned: false, slug: 'my-post' })
    const pinLimitErr = new Error('Maximum 2 posts can be pinned. Unpin one first.')
    pinLimitErr.name = 'PinLimitError'
    mockTogglePin.mockRejectedValue(pinLimitErr)

    const res = await PATCH(new Request('http://localhost'), mockParams)
    expect(res.status).toBe(409)
    const json = await res.json()
    expect(json.error).toMatch(/Maximum 2 posts/)
    expect(json.data).toBeNull()
  })

  it('unpins a post regardless of pinned count', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_abc' })
    mockGetPostById.mockResolvedValue({ id: 'post-123', pinned: true, slug: 'my-post' })
    mockTogglePin.mockResolvedValue({ id: 'post-123', pinned: false })

    const res = await PATCH(new Request('http://localhost'), mockParams)
    expect(res.status).toBe(200)
    expect(mockTogglePin).toHaveBeenCalledWith('post-123', true)
  })

  it('returns 500 on unexpected DB error', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_abc' })
    mockGetPostById.mockResolvedValue({ id: 'post-123', pinned: false, slug: 'my-post' })
    mockTogglePin.mockRejectedValue(new Error('DB down'))

    const res = await PATCH(new Request('http://localhost'), mockParams)
    expect(res.status).toBe(500)
    const json = await res.json()
    expect(json.error).toBe('Failed to toggle pin')
  })
})
