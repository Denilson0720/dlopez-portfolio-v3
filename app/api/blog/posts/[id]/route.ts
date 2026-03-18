import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { updatePost } from '@/lib/blog/mutations'
import type { ApiResponse, Post } from '@/lib/blog/types'

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json(
      { data: null, error: 'Unauthorized' } satisfies ApiResponse<null>,
      { status: 401 }
    )
  }

  try {
    const body = await req.json()
    const post = await updatePost(params.id, body)
    return NextResponse.json({ data: post, error: null } satisfies ApiResponse<Post>)
  } catch (err) {
    console.error(`[PUT /api/blog/posts/${params.id}]`, err)
    return NextResponse.json(
      { data: null, error: 'Failed to update post' } satisfies ApiResponse<null>,
      { status: 500 }
    )
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  // Stub — implemented in Story 2.7
  return NextResponse.json(
    { data: null, error: 'Not implemented' } satisfies ApiResponse<null>,
    { status: 501 }
  )
}
