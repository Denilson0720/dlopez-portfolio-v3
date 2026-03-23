'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import { editorExtensions } from '@/lib/blog/tiptap'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Post, PostCategory } from '@/lib/blog/types'
import type { ApiResponse } from '@/lib/blog/types'

// Inline slug generator — do NOT import from lib/blog/slug.ts (server-only file)
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

interface PostEditorProps {
  post?: Post
}

export default function PostEditor({ post }: PostEditorProps) {
  const router = useRouter()
  const isEditMode = !!post

  const [title, setTitle] = useState(post?.title ?? '')
  const [summary, setSummary] = useState(post?.summary ?? '')
  const [category, setCategory] = useState<PostCategory>(post?.category ?? 'tech')
  const [slug, setSlug] = useState(post?.slug ?? '')
  const [isSlugManual, setIsSlugManual] = useState(!!post)
  const [publishedAt, setPublishedAt] = useState<string | null>(post?.publishedAt ?? null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const editor = useEditor({
    extensions: editorExtensions,
    content: post?.body ?? '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'min-h-[300px] p-4 focus:outline-none text-gray-300 leading-relaxed',
      },
    },
  })

  function handleTitleBlur() {
    if (!isSlugManual && title) {
      setSlug(generateSlug(title))
    }
  }

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSlug(e.target.value)
    setIsSlugManual(true)
  }

  function handleSlugBlur() {
    if (slug.trim() === '') {
      setIsSlugManual(false)
      if (title) setSlug(generateSlug(title))
    }
  }

  async function handlePublishToggle() {
    if (!post) return
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/blog/posts/${post.id}/publish`, { method: 'PATCH' })
      const json: ApiResponse<Post> = await res.json()
      if (json.error) throw new Error(json.error)
      router.push('/blog/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSave() {
    if (!editor) return
    setIsLoading(true)
    setError(null)
    try {
      const payload = {
        title,
        summary: summary || null,
        category,
        slug: slug || undefined,
        body: editor.getJSON(),
        publishedAt: publishedAt || null,
      }

      const url = isEditMode ? `/api/blog/posts/${post.id}` : '/api/blog/posts'
      const method = isEditMode ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json: ApiResponse<Post> = await res.json()
      if (json.error) throw new Error(json.error)
      router.push('/blog/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const inputClass =
    'w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-gray-500'

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">{isEditMode ? 'Edit Post' : 'New Post'}</h1>
          <a href="/blog/admin" className="text-sm text-gray-400 hover:text-white transition-colors">
            ← Back to Admin
          </a>
        </div>

        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleBlur}
              placeholder="Post title"
              className={inputClass}
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Slug</label>
            <div className="relative">
              <input
                type="text"
                value={slug}
                onChange={handleSlugChange}
                onBlur={handleSlugBlur}
                placeholder="auto-generated-from-title"
                className={inputClass}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                {isSlugManual ? 'Custom' : 'Auto'}
              </span>
            </div>
          </div>

          {/* Summary */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Summary</label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Brief excerpt shown on the blog index"
              rows={3}
              className={inputClass}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as PostCategory)}
              className={inputClass}
            >
              <option value="tech">Tech</option>
              <option value="random">Random</option>
            </select>
          </div>

          {/* Publish Date */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Publish Date (optional)</label>
            <input
              type="datetime-local"
              value={publishedAt ? publishedAt.slice(0, 16) : ''}
              onChange={(e) =>
                setPublishedAt(e.target.value ? new Date(e.target.value).toISOString() : null)
              }
              className={inputClass}
            />
            <p className="text-xs text-gray-500 mt-1">
              Leave empty to use current time when publishing
            </p>
          </div>

          {/* Body */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Content *</label>
            <div className="border border-gray-700 rounded overflow-hidden">
              {/* Minimal toolbar */}
              {editor && (
                <div className="flex gap-1 p-2 border-b border-gray-700 bg-gray-900">
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`px-2 py-1 text-xs rounded ${editor.isActive('bold') ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    B
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`px-2 py-1 text-xs rounded italic ${editor.isActive('italic') ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    I
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`px-2 py-1 text-xs rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    H2
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={`px-2 py-1 text-xs rounded ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    H3
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`px-2 py-1 text-xs rounded ${editor.isActive('bulletList') ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    UL
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`px-2 py-1 text-xs rounded ${editor.isActive('orderedList') ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    OL
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={`px-2 py-1 text-xs rounded font-mono ${editor.isActive('codeBlock') ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    {'</>'}
                  </button>
                </div>
              )}
              <EditorContent editor={editor} className="bg-gray-950" />
            </div>
          </div>

          {/* Error */}
          {error && <p className="text-red-400 text-sm">{error}</p>}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={isLoading || !title}
              className="bg-white text-black text-sm font-medium px-6 py-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : isEditMode ? 'Save Changes' : 'Save as Draft'}
            </button>
            {isEditMode && post && (
              <button
                onClick={handlePublishToggle}
                disabled={isLoading}
                className={`px-4 py-2 rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                  post.status === 'published'
                    ? 'bg-yellow-700 hover:bg-yellow-600 text-white'
                    : 'bg-green-700 hover:bg-green-600 text-white'
                }`}
              >
                {post.status === 'published' ? 'Unpublish' : 'Publish'}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
