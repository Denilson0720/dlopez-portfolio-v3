import { renderToHTMLString } from '@tiptap/static-renderer'
import StarterKit from '@tiptap/starter-kit'
import ImageExtension from '@tiptap/extension-image'
import LinkExtension from '@tiptap/extension-link'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { createLowlight, common } from 'lowlight'
import type { JSONContent } from '@tiptap/react'

const lowlight = createLowlight(common)

// StarterKit v3 includes Link — disable it and supply our own so there's no duplicate.
export const editorExtensions = [
  StarterKit.configure({ codeBlock: false, link: false }),
  ImageExtension,
  LinkExtension.configure({ openOnClick: false }),
  CodeBlockLowlight.configure({ lowlight }),
]

// Server-safe render extensions — @tiptap/static-renderer works without a browser.
// StarterKit's built-in codeBlock renders stored CodeBlockLowlight JSON correctly.
const renderExtensions = [
  StarterKit.configure({ link: false }),
  ImageExtension,
  LinkExtension,
]

export function generatePostHTML(content: JSONContent): string {
  return renderToHTMLString({ content, extensions: renderExtensions })
}
