import { generatePostHTML } from '@/lib/blog/tiptap'
import type { JSONContent } from '@tiptap/react'

const emptyDoc: JSONContent = { type: 'doc', content: [] }

const simpleDoc: JSONContent = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [{ type: 'text', text: 'Hello world' }],
    },
  ],
}

const headingDoc: JSONContent = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'My Heading' }],
    },
  ],
}

describe('generatePostHTML', () => {
  it('returns a string for a simple paragraph doc', () => {
    const html = generatePostHTML(simpleDoc)
    expect(typeof html).toBe('string')
    expect(html.length).toBeGreaterThan(0)
  })

  it('includes the paragraph text in the output', () => {
    const html = generatePostHTML(simpleDoc)
    expect(html).toContain('Hello world')
  })

  it('wraps paragraphs in <p> tags', () => {
    const html = generatePostHTML(simpleDoc)
    expect(html).toContain('<p>')
  })

  it('renders headings as heading tags', () => {
    const html = generatePostHTML(headingDoc)
    expect(html).toContain('<h2>')
    expect(html).toContain('My Heading')
  })

  it('does not throw for an empty doc', () => {
    expect(() => generatePostHTML(emptyDoc)).not.toThrow()
  })
})
