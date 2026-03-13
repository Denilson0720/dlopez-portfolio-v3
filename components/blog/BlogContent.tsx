'use client'
import { useState } from 'react'
import type { Post, PostCategory } from '@/lib/blog/types'
import CategoryFilter from './CategoryFilter'
import PinnedPosts from './PinnedPosts'
import PostList from './PostList'

interface BlogContentProps {
  pinnedPosts: Post[]
  posts: Post[]
}

export default function BlogContent({ pinnedPosts, posts }: BlogContentProps) {
  const [activeCategory, setActiveCategory] = useState<PostCategory | null>(null)

  const filteredPinned = activeCategory
    ? pinnedPosts.filter((p) => p.category === activeCategory)
    : pinnedPosts

  const filteredPosts = activeCategory
    ? posts.filter((p) => p.category === activeCategory)
    : posts

  return (
    <>
      <CategoryFilter
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <PinnedPosts posts={filteredPinned} />
      <PostList posts={filteredPosts} />
    </>
  )
}
