import type { JSONContent } from '@tiptap/react'
import { generatePostHTML } from '@/lib/blog/tiptap'

interface RichTextRendererProps {
  content: JSONContent
}

export default function RichTextRenderer({ content }: RichTextRendererProps) {
  const html = generatePostHTML(content)

  return (
    <div
      className="text-gray-300 leading-relaxed [&_h1]:text-white [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-white [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:text-white [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mb-2 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_li]:mb-1 [&_code]:bg-gray-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono [&_pre]:bg-gray-900 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:mb-4 [&_pre]:overflow-x-auto [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_a]:text-blue-400 [&_a]:underline [&_a]:hover:text-blue-300 [&_strong]:text-white [&_strong]:font-semibold [&_em]:italic [&_blockquote]:border-l-4 [&_blockquote]:border-gray-600 [&_blockquote]:pl-4 [&_blockquote]:text-gray-400 [&_blockquote]:mb-4 [&_img]:rounded-lg [&_img]:mb-4 [&_img]:max-w-full"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
