import { createClient } from '@/lib/supabase/server'
import { toPost } from '@/lib/blog/queries'
import { ensureUniqueSlug, generateSlug } from '@/lib/blog/slug'
import type { Post, PostCategory, PostStatus } from '@/lib/blog/types'
import type { JSONContent } from '@tiptap/react'

export interface CreatePostInput {
  title: string
  body: JSONContent
  category: PostCategory
  summary?: string | null
  slug?: string
  publishedAt?: string | null
}

export async function createPost(input: CreatePostInput): Promise<Post> {
  const supabase = await createClient()
  const baseSlug = input.slug?.trim() || generateSlug(input.title)
  const slug = await ensureUniqueSlug(baseSlug)

  const { data, error } = await supabase
    .from('posts')
    .insert({
      title: input.title,
      slug,
      summary: input.summary ?? null,
      body: input.body,
      category: input.category,
      status: 'draft' as PostStatus,
      pinned: false,
      published_at: input.publishedAt ?? null,
    })
    .select()
    .single()

  if (error || !data) throw new Error(error?.message ?? 'Insert failed')
  return toPost(data)
}

export interface UpdatePostInput {
  title?: string
  body?: JSONContent
  category?: PostCategory
  summary?: string | null
  slug?: string
  publishedAt?: string | null
}

export async function updatePost(id: string, input: UpdatePostInput): Promise<Post> {
  const supabase = await createClient()

  const updates: Record<string, unknown> = {}
  if (input.title !== undefined) updates.title = input.title
  if (input.body !== undefined) updates.body = input.body
  if (input.category !== undefined) updates.category = input.category
  if (input.summary !== undefined) updates.summary = input.summary
  if (input.publishedAt !== undefined) updates.published_at = input.publishedAt

  if (input.slug !== undefined) {
    updates.slug = await ensureUniqueSlug(generateSlug(input.slug), id)
  }

  const { data, error } = await supabase
    .from('posts')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error || !data) throw new Error(error?.message ?? 'Update failed')
  return toPost(data)
}

export async function togglePublish(id: string, currentStatus: PostStatus): Promise<Post> {
  const supabase = await createClient()

  const updates =
    currentStatus === 'draft'
      ? { status: 'published' as PostStatus, published_at: new Date().toISOString() }
      : { status: 'draft' as PostStatus, published_at: null }

  const { data, error } = await supabase
    .from('posts')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error || !data) throw new Error(error?.message ?? 'Toggle failed')
  return toPost(data)
}

export class PinLimitError extends Error {
  constructor() {
    super('Maximum 2 posts can be pinned. Unpin one first.')
    this.name = 'PinLimitError'
  }
}

export async function togglePin(id: string, currentPinned: boolean): Promise<Post> {
  const supabase = await createClient()

  if (!currentPinned) {
    const { count, error: countError } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('pinned', true)

    if (countError) throw new Error(countError.message)
    if ((count ?? 0) >= 2) throw new PinLimitError()
  }

  const { data, error } = await supabase
    .from('posts')
    .update({ pinned: !currentPinned })
    .eq('id', id)
    .select()
    .single()

  if (error || !data) throw new Error(error?.message ?? 'Pin update failed')
  return toPost(data)
}

export async function deletePost(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from('posts').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
