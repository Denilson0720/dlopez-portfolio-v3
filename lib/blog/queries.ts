import { createClient } from '@/lib/supabase/server'
import type { Post, PostCategory, PostStatus } from './types'
import type { JSONContent } from '@tiptap/react'

// Internal type matching DB snake_case shape
interface PostRow {
  id: string
  title: string
  slug: string
  summary: string | null
  body: JSONContent
  category: string
  status: string
  pinned: boolean
  thumbnail_url: string | null
  published_at: string | null
  created_at: string
  updated_at: string
}

// CRITICAL: All DB rows MUST go through this transform before leaving this file
export function toPost(row: PostRow): Post {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    summary: row.summary,
    body: row.body,
    category: row.category as PostCategory,
    status: row.status as PostStatus,
    pinned: row.pinned,
    thumbnailUrl: row.thumbnail_url,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function getPublishedPosts(): Promise<Post[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data as PostRow[]).map(toPost)
}

export async function getPinnedPosts(): Promise<Post[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .eq('pinned', true)
    .order('published_at', { ascending: false })
    .limit(2)

  if (error) throw new Error(error.message)
  return (data as PostRow[]).map(toPost)
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) return null
  return toPost(data as PostRow)
}
