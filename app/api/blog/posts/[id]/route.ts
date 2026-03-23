import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { updatePost, deletePost } from '@/lib/blog/mutations'
import { getPostById } from '@/lib/blog/queries'
import type { ApiResponse, Post } from '@/lib/blog/types'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json(
      { data: null, error: 'Unauthorized' } satisfies ApiResponse<null>,
      { status: 401 }
    )
  }

  try {
    const body = await req.json()
    const post = await updatePost(id, body)
    return NextResponse.json({ data: post, error: null } satisfies ApiResponse<Post>)
  } catch (err) {
    console.error(`[PUT /api/blog/posts/${id}]`, err)
    return NextResponse.json(
      { data: null, error: 'Failed to update post' } satisfies ApiResponse<null>,
      { status: 500 }
    )
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
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

    await deletePost(id)

    revalidatePath('/blog')
    revalidatePath(`/blog/${post.slug}`)

    return NextResponse.json({ data: null, error: null } satisfies ApiResponse<null>)
  } catch (err) {
    console.error(`[DELETE /api/blog/posts/${id}]`, err)
    return NextResponse.json(
      { data: null, error: 'Failed to delete post' } satisfies ApiResponse<null>,
      { status: 500 }
    )
  }
}
