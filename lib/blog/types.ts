import type { JSONContent } from '@tiptap/react'

export type PostStatus = 'draft' | 'published'
export type PostCategory = 'tech' | 'random'

export interface Post {
  id: string
  title: string
  slug: string
  summary: string | null
  body: JSONContent
  category: PostCategory
  status: PostStatus
  pinned: boolean
  thumbnailUrl: string | null
  publishedAt: string | null // ISO 8601
  createdAt: string
  updatedAt: string
}

export type ApiResponse<T> =
  | { data: T; error: null }
  | { data: null; error: string }
