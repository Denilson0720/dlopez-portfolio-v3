import Image from 'next/image'
import Link from 'next/link'
import type { Post } from '@/lib/blog/types'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const formattedDate = post.publishedAt
    ? new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(
        new Date(post.publishedAt)
      )
    : null

  return (
    <article className="border border-gray-800 rounded-lg overflow-hidden hover:border-gray-600 transition-colors">
      {post.thumbnailUrl && (
        <div className="relative aspect-video">
          <Image
            src={post.thumbnailUrl}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs font-medium px-2 py-1 rounded bg-gray-800 text-gray-300 uppercase tracking-wide">
            {post.category}
          </span>
          {formattedDate && (
            <time
              className="text-sm text-gray-500"
              dateTime={post.publishedAt ?? ''}
            >
              {formattedDate}
            </time>
          )}
        </div>
        <Link href={`/blog/${post.slug}`}>
          <h2 className="text-xl font-bold text-white mb-2 hover:text-gray-300 transition-colors">
            {post.title}
          </h2>
        </Link>
        {post.summary && (
          <p className="text-gray-400 text-sm leading-relaxed">{post.summary}</p>
        )}
      </div>
    </article>
  )
}
