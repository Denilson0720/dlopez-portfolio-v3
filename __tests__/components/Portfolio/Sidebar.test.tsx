import { render, screen } from '@testing-library/react'
import Sidebar from '@/app/components/Portfolio/Sidebar'

jest.mock('@/lib/hooks/useActiveSection', () => ({
  __esModule: true,
  useActiveSection: () => 'about',
}))

jest.mock('@/app/components/Portfolio/AnimatedName', () => ({
  __esModule: true,
  default: () => null,
}))

describe('Sidebar', () => {
  it('renders a Blog link pointing to /blog', () => {
    render(<Sidebar onSectionClick={jest.fn()} />)
    const blogLinks = screen.getAllByRole('link', { name: 'Blog' })
    expect(blogLinks.length).toBeGreaterThanOrEqual(1)
    blogLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', '/blog')
    })
  })

  it('renders the Blog link in both desktop and mobile nav', () => {
    render(<Sidebar onSectionClick={jest.fn()} />)
    // Both desktop and mobile render Blog — getAllByRole returns both
    const blogLinks = screen.getAllByRole('link', { name: 'Blog' })
    expect(blogLinks.length).toBe(2)
  })

  it('Blog link is keyboard accessible (is an <a> element)', () => {
    render(<Sidebar onSectionClick={jest.fn()} />)
    const blogLinks = screen.getAllByRole('link', { name: 'Blog' })
    blogLinks.forEach((link) => {
      expect(link.tagName).toBe('A')
    })
  })
})
