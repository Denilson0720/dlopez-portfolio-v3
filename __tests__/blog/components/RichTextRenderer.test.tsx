import { render, screen } from '@testing-library/react'
import RichTextRenderer from '@/components/blog/RichTextRenderer'

jest.mock('@/lib/blog/tiptap', () => ({
  generatePostHTML: jest.fn(() => '<p>Mocked content</p>'),
}))

describe('RichTextRenderer', () => {
  it('renders the generated HTML into the DOM', () => {
    render(<RichTextRenderer content={{ type: 'doc', content: [] }} />)
    expect(screen.getByText('Mocked content')).toBeInTheDocument()
  })

  it('wraps content in a div container', () => {
    const { container } = render(<RichTextRenderer content={{ type: 'doc', content: [] }} />)
    expect(container.querySelector('div')).toBeInTheDocument()
  })

  it('does not crash when generatePostHTML returns empty string', () => {
    const { generatePostHTML } = require('@/lib/blog/tiptap')
    generatePostHTML.mockReturnValueOnce('')
    expect(() =>
      render(<RichTextRenderer content={{ type: 'doc', content: [] }} />)
    ).not.toThrow()
  })
})
