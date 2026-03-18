'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Post } from '@/lib/blog/types'
import type { ApiResponse } from '@/lib/blog/types'

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(iso))
}

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pinErrors, setPinErrors] = useState<Record<string, string>>({})

  async function handleDelete(post: Post) {
    const confirmed = window.confirm(`Delete "${post.title}"? This cannot be undone.`)
    if (!confirmed) return
    try {
      const res = await fetch(`/api/blog/posts/${post.id}`, { method: 'DELETE' })
      const json: ApiResponse<null> = await res.json()
      if (json.error) throw new Error(json.error)
      setPosts((prev) => prev.filter((p) => p.id !== post.id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  async function handleTogglePin(post: Post) {
    setPinErrors((prev) => ({ ...prev, [post.id]: '' }))
    try {
      const res = await fetch(`/api/blog/posts/${post.id}/pin`, { method: 'PATCH' })
      const json: ApiResponse<Post> = await res.json()
      if (json.error) throw new Error(json.error)
      setPosts((prev) => prev.map((p) => (p.id === post.id ? json.data! : p)))
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Pin toggle failed'
      setPinErrors((prev) => ({ ...prev, [post.id]: msg }))
    }
  }

  async function handleTogglePublish(post: Post) {
    try {
      const res = await fetch(`/api/blog/posts/${post.id}/publish`, { method: 'PATCH' })
      const json: ApiResponse<Post> = await res.json()
      if (json.error) throw new Error(json.error)
      setPosts((prev) => prev.map((p) => (p.id === post.id ? json.data! : p)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Publish toggle failed')
    }
  }

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch('/api/blog/posts')
        const json: ApiResponse<Post[]> = await res.json()
        if (json.error) throw new Error(json.error)
        setPosts(json.data ?? [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load posts')
      } finally {
        setIsLoading(false)
      }
    }
    fetchPosts()
  }, [])

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Blog Admin</h1>
          <Link
            href="/blog/admin/new"
            className="bg-white text-black text-sm font-medium px-4 py-2 rounded hover:bg-gray-200 transition-colors"
          >
            New Post
          </Link>
        </div>

        {isLoading && (
          <p className="text-gray-400">Loading posts...</p>
        )}

        {error && (
          <p className="text-red-400">{error}</p>
        )}

        {!isLoading && !error && posts.length === 0 && (
          <p className="text-gray-400">No posts yet. Create your first post!</p>
        )}

        {!isLoading && !error && posts.length > 0 && (
          <div className="space-y-0 border border-gray-800 rounded-lg overflow-hidden">
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex items-center gap-4 px-6 py-4 border-b border-gray-800 last:border-b-0 hover:bg-gray-900/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-white truncate">{post.title}</span>
                    {post.pinned && <span className="text-base" title="Pinned">📌</span>}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <span
                      className={
                        post.status === 'published'
                          ? 'bg-green-900/50 text-green-300 text-xs px-2 py-0.5 rounded'
                          : 'bg-yellow-900/50 text-yellow-300 text-xs px-2 py-0.5 rounded'
                      }
                    >
                      {post.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                    <span className="capitalize">{post.category}</span>
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>
                  {pinErrors[post.id] && (
                    <p className="text-red-400 text-xs mt-1">{pinErrors[post.id]}</p>
                  )}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => handleTogglePin(post)}
                    className={`text-xs px-3 py-1 rounded font-medium transition-colors ${
                      post.pinned
                        ? 'bg-blue-900/50 text-blue-300 hover:bg-blue-800/50'
                        : 'text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500'
                    }`}
                  >
                    {post.pinned ? '📌 Unpin' : 'Pin'}
                  </button>
                  <button
                    onClick={() => handleTogglePublish(post)}
                    className={`text-xs px-3 py-1 rounded font-medium transition-colors ${
                      post.status === 'published'
                        ? 'bg-yellow-900/50 text-yellow-300 hover:bg-yellow-800/50'
                        : 'bg-green-900/50 text-green-300 hover:bg-green-800/50'
                    }`}
                  >
                    {post.status === 'published' ? 'Unpublish' : 'Publish'}
                  </button>
                  <Link
                    href={`/blog/admin/${post.id}/edit`}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(post)}
                    className="text-sm text-red-400 hover:text-red-300 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
