import { getPinnedPosts, getPublishedPosts } from '@/lib/blog/queries'
import type { Post } from '@/lib/blog/types'
import PinnedPosts from '@/components/blog/PinnedPosts'
import PostList from '@/components/blog/PostList'

// ISR — revalidated on-demand by Route Handlers (publish/pin/delete)
export const revalidate = false

export default async function BlogPage() {
  let pinnedPosts: Post[]
  let posts: Post[]

  try {
    ;[pinnedPosts, posts] = await Promise.all([getPinnedPosts(), getPublishedPosts()])
  } catch {
    return (
      <main className="min-h-screen bg-black text-white px-8 py-16 max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold mb-4">Blog</h1>
        <p className="text-red-400">
          Unable to load posts at this time. Please try again later.
        </p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white px-8 py-16 max-w-5xl mx-auto">
      <h1 className="text-5xl font-bold mb-12">Blog</h1>
      <PinnedPosts posts={pinnedPosts} />
      <PostList posts={posts} />
    </main>
  )
}
