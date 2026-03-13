import { createClient } from '@/lib/supabase/server'

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export async function ensureUniqueSlug(
  baseSlug: string,
  excludeId?: string
): Promise<string> {
  const supabase = await createClient()
  let slug = baseSlug
  let counter = 1

  while (true) {
    let query = supabase.from('posts').select('id').eq('slug', slug)
    if (excludeId) query = query.neq('id', excludeId)
    const { data } = await query.maybeSingle()
    if (!data) return slug
    slug = `${baseSlug}-${++counter}`
  }
}
