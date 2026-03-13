import { notFound } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import Image from 'next/image'
import Link from 'next/link'
import { getPostBySlug } from '@/lib/blog/queries'
import PostMeta from '@/components/blog/PostMeta'
import RichTextRenderer from '@/components/blog/RichTextRenderer'

export const revalidate = false

interface Props {
  params: Promise<{ slug: string }>
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  if (post.status === 'draft') {
    const { userId } = await auth()
    if (!userId) notFound()
  }

  return (
    <main className="min-h-screen bg-black text-white px-8 py-16 max-w-3xl mx-auto">
      <Link
        href="/blog"
        className="text-gray-500 hover:text-white text-sm mb-8 inline-block transition-colors"
      >
        ← Back to Blog
      </Link>

      {post.thumbnailUrl && (
        <div className="relative aspect-video mb-8 rounded-lg overflow-hidden">
          <Image
            src={post.thumbnailUrl}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <h1 className="text-4xl font-bold text-white mb-4">{post.title}</h1>
      <PostMeta post={post} />
      <RichTextRenderer content={post.body} />
    </main>
  )
}
