import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/blog/queries'
import type { ApiResponse, Post } from '@/lib/blog/types'

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json(
      { data: null, error: 'Unauthorized' } satisfies ApiResponse<null>,
      { status: 401 }
    )
  }

  try {
    const posts = await getAllPosts()
    return NextResponse.json({ data: posts, error: null } satisfies ApiResponse<Post[]>)
  } catch (err) {
    console.error('[GET /api/blog/posts]', err)
    return NextResponse.json(
      { data: null, error: 'Failed to fetch posts' } satisfies ApiResponse<null>,
      { status: 500 }
    )
  }
}
