/**
 * @jest-environment node
 */
import { GET, POST } from '@/app/api/blog/posts/route'
import { auth } from '@clerk/nextjs/server'
import { getAllPosts } from '@/lib/blog/queries'
import { createPost } from '@/lib/blog/mutations'

jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn(),
}))

jest.mock('@/lib/blog/queries', () => ({
  getAllPosts: jest.fn(),
}))

jest.mock('@/lib/blog/mutations', () => ({
  createPost: jest.fn(),
}))

const mockAuth = auth as jest.Mock
const mockGetAllPosts = getAllPosts as jest.Mock
const mockCreatePost = createPost as jest.Mock

describe('GET /api/blog/posts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns 401 when unauthenticated', async () => {
    mockAuth.mockResolvedValue({ userId: null })
    const res = await GET()
    expect(res.status).toBe(401)
    const json = await res.json()
    expect(json.error).toBe('Unauthorized')
    expect(json.data).toBeNull()
  })

  it('returns all posts when authenticated', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_abc' })
    const fakePosts = [
      { id: '1', title: 'Draft Post', status: 'draft' },
      { id: '2', title: 'Published Post', status: 'published' },
    ]
    mockGetAllPosts.mockResolvedValue(fakePosts)
    const res = await GET()
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.data).toEqual(fakePosts)
    expect(json.error).toBeNull()
  })

  it('returns 500 when DB throws', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_abc' })
    mockGetAllPosts.mockRejectedValue(new Error('DB down'))
    const res = await GET()
    expect(res.status).toBe(500)
    const json = await res.json()
    expect(json.data).toBeNull()
    expect(json.error).toBe('Failed to fetch posts')
  })
})

describe('POST /api/blog/posts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns 401 when unauthenticated', async () => {
    mockAuth.mockResolvedValue({ userId: null })
    const req = new Request('http://localhost/api/blog/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Test', body: {}, category: 'tech' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(401)
    const json = await res.json()
    expect(json.error).toBe('Unauthorized')
    expect(json.data).toBeNull()
  })

  it('returns 400 when required fields missing', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_abc' })
    const req = new Request('http://localhost/api/blog/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Test' }), // missing body and category
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toContain('required')
    expect(json.data).toBeNull()
  })

  it('returns 201 with created post when valid', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_abc' })
    const fakePost = { id: '1', title: 'Test', status: 'draft', slug: 'test' }
    mockCreatePost.mockResolvedValue(fakePost)
    const req = new Request('http://localhost/api/blog/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Test',
        body: { type: 'doc', content: [] },
        category: 'tech',
      }),
    })
    const res = await POST(req)
    expect(res.status).toBe(201)
    const json = await res.json()
    expect(json.data).toEqual(fakePost)
    expect(json.error).toBeNull()
  })

  it('returns 500 when createPost throws', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_abc' })
    mockCreatePost.mockRejectedValue(new Error('DB error'))
    const req = new Request('http://localhost/api/blog/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Test',
        body: { type: 'doc', content: [] },
        category: 'tech',
      }),
    })
    const res = await POST(req)
    expect(res.status).toBe(500)
    const json = await res.json()
    expect(json.data).toBeNull()
    expect(json.error).toBe('Failed to create post')
  })
})
