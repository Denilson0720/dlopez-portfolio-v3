import type { Post } from '@/lib/blog/types'
import PostCard from './PostCard'

interface PinnedPostsProps {
  posts: Post[]
}

export default function PinnedPosts({ posts }: PinnedPostsProps) {
  if (posts.length === 0) return null

  return (
    <section aria-label="Pinned posts" className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-gray-400 text-sm font-medium uppercase tracking-widest">
          Pinned
        </span>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  )
}
