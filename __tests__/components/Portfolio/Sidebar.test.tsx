import { render, screen } from '@testing-library/react'
import Sidebar from '@/app/components/Portfolio/Sidebar'
import { useAuth } from '@clerk/nextjs'

jest.mock('@/lib/hooks/useActiveSection', () => ({
  __esModule: true,
  useActiveSection: () => 'about',
}))

jest.mock('@/app/components/Portfolio/AnimatedName', () => ({
  __esModule: true,
  default: () => null,
}))

jest.mock('@clerk/nextjs', () => ({
  __esModule: true,
  useAuth: jest.fn(),
}))

const mockUseAuth = useAuth as jest.Mock

describe('Sidebar', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({ userId: null })
  })

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

  it('does not render Admin link when unauthenticated', () => {
    mockUseAuth.mockReturnValue({ userId: null })
    render(<Sidebar onSectionClick={jest.fn()} />)
    expect(screen.queryByRole('link', { name: 'Admin' })).not.toBeInTheDocument()
  })

  it('renders Admin link to /blog/admin when authenticated', () => {
    mockUseAuth.mockReturnValue({ userId: 'user_abc123' })
    render(<Sidebar onSectionClick={jest.fn()} />)
    const adminLinks = screen.getAllByRole('link', { name: 'Admin' })
    expect(adminLinks.length).toBeGreaterThanOrEqual(1)
    adminLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', '/blog/admin')
    })
  })

  it('renders Admin link in both desktop and mobile nav when authenticated', () => {
    mockUseAuth.mockReturnValue({ userId: 'user_abc123' })
    render(<Sidebar onSectionClick={jest.fn()} />)
    const adminLinks = screen.getAllByRole('link', { name: 'Admin' })
    expect(adminLinks.length).toBe(2)
  })
})
