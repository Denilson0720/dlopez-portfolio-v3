import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getPostById } from '@/lib/blog/queries'
import { togglePin } from '@/lib/blog/mutations'
import type { ApiResponse, Post } from '@/lib/blog/types'

export async function PATCH(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json(
      { data: null, error: 'Unauthorized' } satisfies ApiResponse<null>,
      { status: 401 }
    )
  }

  try {
    const post = await getPostById(params.id)
    if (!post) {
      return NextResponse.json(
        { data: null, error: 'Post not found' } satisfies ApiResponse<null>,
        { status: 404 }
      )
    }

    const updated = await togglePin(params.id, post.pinned)
    revalidatePath('/blog')

    return NextResponse.json({ data: updated, error: null } satisfies ApiResponse<Post>)
  } catch (err) {
    if (err instanceof Error && err.name === 'PinLimitError') {
      return NextResponse.json(
        { data: null, error: err.message } satisfies ApiResponse<null>,
        { status: 409 }
      )
    }
    console.error(`[PATCH /api/blog/posts/${params.id}/pin]`, err)
    return NextResponse.json(
      { data: null, error: 'Failed to toggle pin' } satisfies ApiResponse<null>,
      { status: 500 }
    )
  }
}
