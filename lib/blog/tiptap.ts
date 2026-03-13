import { generateHTML } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import ImageExtension from '@tiptap/extension-image'
import LinkExtension from '@tiptap/extension-link'
import type { JSONContent } from '@tiptap/react'

// CodeBlockLowlight (syntax highlighting) will be added in Story 2.3 alongside the editor.
// StarterKit includes a basic CodeBlock that renders correctly without highlighting.
export function generatePostHTML(content: JSONContent): string {
  return generateHTML(content, [
    StarterKit,
    ImageExtension,
    LinkExtension,
  ])
}
