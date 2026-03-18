import { notFound } from 'next/navigation'
import { getPostById } from '@/lib/blog/queries'
import PostEditor from '@/components/blog/PostEditor'

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const post = await getPostById(params.id)
  if (!post) notFound()
  return <PostEditor post={post} />
}
