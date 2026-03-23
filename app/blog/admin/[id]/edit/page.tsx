import { notFound } from 'next/navigation'
import { getPostById } from '@/lib/blog/queries'
import PostEditor from '@/components/blog/PostEditor'

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await getPostById(id)
  if (!post) notFound()
  return <PostEditor post={post} />
}
