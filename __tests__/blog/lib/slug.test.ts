/**
 * @jest-environment node
 */
import { generateSlug, ensureUniqueSlug } from '@/lib/blog/slug'

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
}))

import { createClient } from '@/lib/supabase/server'
const mockCreateClient = createClient as jest.Mock

const mockMaybeSingle = jest.fn()
const mockSupabase = {
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  neq: jest.fn().mockReturnThis(),
  maybeSingle: mockMaybeSingle,
}

beforeEach(() => {
  jest.clearAllMocks()
  mockCreateClient.mockResolvedValue(mockSupabase)
})

describe('generateSlug', () => {
  it('lowercases and hyphenates', () => {
    expect(generateSlug('Hello World')).toBe('hello-world')
  })

  it('strips special characters', () => {
    expect(generateSlug('Hello, World!')).toBe('hello-world')
  })

  it('collapses multiple spaces', () => {
    expect(generateSlug('Hello   World')).toBe('hello-world')
  })

  it('collapses multiple hyphens', () => {
    expect(generateSlug('Hello--World')).toBe('hello-world')
  })

  it('handles empty string', () => {
    expect(generateSlug('')).toBe('')
  })
})

describe('ensureUniqueSlug', () => {
  it('returns base slug when no collision', async () => {
    mockMaybeSingle.mockResolvedValue({ data: null })
    expect(await ensureUniqueSlug('my-post')).toBe('my-post')
  })

  it('appends -2 on first collision', async () => {
    mockMaybeSingle
      .mockResolvedValueOnce({ data: { id: 'existing' } }) // 'my-post' taken
      .mockResolvedValueOnce({ data: null })                // 'my-post-2' free
    expect(await ensureUniqueSlug('my-post')).toBe('my-post-2')
  })

  it('appends -3 on second collision', async () => {
    mockMaybeSingle
      .mockResolvedValueOnce({ data: { id: 'a' } })  // 'my-post' taken
      .mockResolvedValueOnce({ data: { id: 'b' } })  // 'my-post-2' taken
      .mockResolvedValueOnce({ data: null })           // 'my-post-3' free
    expect(await ensureUniqueSlug('my-post')).toBe('my-post-3')
  })

  it('with excludeId — does not collide with own post', async () => {
    mockMaybeSingle.mockResolvedValue({ data: null })
    const result = await ensureUniqueSlug('my-post', 'own-id')
    expect(result).toBe('my-post')
    expect(mockSupabase.neq).toHaveBeenCalledWith('id', 'own-id')
  })
})
