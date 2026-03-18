import { generateHTML } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import ImageExtension from '@tiptap/extension-image'
import LinkExtension from '@tiptap/extension-link'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { createLowlight, common } from 'lowlight'
import type { JSONContent } from '@tiptap/react'

const lowlight = createLowlight(common)

// Shared extension set — used by both PostEditor (write) and generatePostHTML (read).
// Keeping them identical guarantees JSON round-trip fidelity.
export const editorExtensions = [
  StarterKit.configure({ codeBlock: false }), // disabled — CodeBlockLowlight replaces it
  ImageExtension,
  LinkExtension.configure({ openOnClick: false }),
  CodeBlockLowlight.configure({ lowlight }),
]

export function generatePostHTML(content: JSONContent): string {
  return generateHTML(content, editorExtensions)
}
