import type { Post } from '@/lib/blog/types'

interface PostMetaProps {
  post: Post
}

export default function PostMeta({ post }: PostMetaProps) {
  const formattedDate = post.publishedAt
    ? new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(
        new Date(post.publishedAt)
      )
    : null

  return (
    <div className="flex items-center gap-3 mb-8">
      <span className="text-xs font-medium px-2 py-1 rounded bg-gray-800 text-gray-300 uppercase tracking-wide">
        {post.category}
      </span>
      {formattedDate && (
        <time className="text-sm text-gray-500" dateTime={post.publishedAt ?? ''}>
          {formattedDate}
        </time>
      )}
    </div>
  )
}
