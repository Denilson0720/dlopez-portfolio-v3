import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getPostById } from '@/lib/blog/queries'
import { togglePublish } from '@/lib/blog/mutations'
import type { ApiResponse, Post } from '@/lib/blog/types'

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json(
      { data: null, error: 'Unauthorized' } satisfies ApiResponse<null>,
      { status: 401 }
    )
  }

  try {
    const post = await getPostById(id)
    if (!post) {
      return NextResponse.json(
        { data: null, error: 'Post not found' } satisfies ApiResponse<null>,
        { status: 404 }
      )
    }

    const updated = await togglePublish(id, post.status)

    revalidatePath('/blog')
    revalidatePath(`/blog/${post.slug}`)

    return NextResponse.json({ data: updated, error: null } satisfies ApiResponse<Post>)
  } catch (err) {
    console.error(`[PATCH /api/blog/posts/${id}/publish]`, err)
    return NextResponse.json(
      { data: null, error: 'Failed to toggle publish status' } satisfies ApiResponse<null>,
      { status: 500 }
    )
  }
}
