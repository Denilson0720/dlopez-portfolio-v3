import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/blog/queries'
import { createPost } from '@/lib/blog/mutations'
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

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json(
      { data: null, error: 'Unauthorized' } satisfies ApiResponse<null>,
      { status: 401 }
    )
  }

  try {
    const body = await req.json()
    const { title, body: postBody, category, summary, slug, publishedAt } = body

    if (!title || !postBody || !category) {
      return NextResponse.json(
        { data: null, error: 'title, body, and category are required' } satisfies ApiResponse<null>,
        { status: 400 }
      )
    }

    const post = await createPost({ title, body: postBody, category, summary, slug, publishedAt })
    return NextResponse.json(
      { data: post, error: null } satisfies ApiResponse<Post>,
      { status: 201 }
    )
  } catch (err) {
    console.error('[POST /api/blog/posts]', err)
    return NextResponse.json(
      { data: null, error: 'Failed to create post' } satisfies ApiResponse<null>,
      { status: 500 }
    )
  }
}
