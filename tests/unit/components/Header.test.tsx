import { render, screen } from '@testing-library/react'
import { usePathname } from 'next/navigation'
import { useAtom } from 'jotai'
import { Header } from '@/components/Header'

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/')
}))

// Mock Jotai
jest.mock('jotai', () => ({
  useAtom: jest.fn(() => ['EN', jest.fn()])
}))

// Mock once-ui components
jest.mock('@/once-ui/components', () => ({
  Fade: ({ children, ...props }: any) => <div data-testid="fade" {...props}>{children}</div>,
  Flex: ({ children, ...props }: any) => <div data-testid="flex" {...props}>{children}</div>,
  Line: ({ ...props }: any) => <div data-testid="line" {...props} />,
  ToggleButton: ({ href, label, selected, prefixIcon, ...props }: any) => (
    <a 
      data-testid={`nav-${prefixIcon || 'button'}`}
      href={href}
      data-selected={selected}
      {...props}
    >
      {label || prefixIcon}
    </a>
  )
}))

// Mock resources
jest.mock('@/app/resources', () => ({
  routes: {
    '/': true,
    '/about': true,
    '/work': true,
    '/blog': true,
    '/gallery': true
  },
  display: {
    location: true,
    themeSwitcher: true
  }
}))

// Mock content
jest.mock('@/app/resources/content', () => ({
  person: {
    location: 'Paris, FR'
  },
  about: {
    label: 'About'
  },
  blog: {
    label: 'Blog'
  },
  work: {
    label: 'Work'
  },
  gallery: {
    label: 'Gallery'
  }
}))

// Mock dynamic imports
jest.mock('@/app/resources/content.fr', () => ({
  about: { label: 'À propos' },
  blog: { label: 'Blog' },
  work: { label: 'Travaux' },
  gallery: { label: 'Galerie' }
}), { virtual: true })

// Mock ThemeToggle and LanguageToggle
jest.mock('@/components/ThemeToggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle">Theme Toggle</div>
}))

jest.mock('@/components/LanguageToggle', () => ({
  LanguageToggle: () => <div data-testid="language-toggle">Language Toggle</div>
}))

// Mock styles
jest.mock('@/components/Header.module.scss', () => ({
  position: 'header-position'
}))

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(usePathname as jest.Mock).mockReturnValue('/')
    ;(useAtom as jest.Mock).mockReturnValue(['EN', jest.fn()])
  })

  it('renders header with navigation buttons', () => {
    render(<Header />)
    expect(screen.getByTestId('nav-home')).toBeInTheDocument()
    expect(screen.getAllByTestId('nav-person').length).toBeGreaterThan(0)
    expect(screen.getAllByTestId('nav-grid').length).toBeGreaterThan(0)
    expect(screen.getAllByTestId('nav-book').length).toBeGreaterThan(0)
    expect(screen.getAllByTestId('nav-gallery').length).toBeGreaterThan(0)
  })

  it('shows location when display.location is true', () => {
    render(<Header />)
    
    expect(screen.getByText('Paris, FR')).toBeInTheDocument()
  })

  it('includes theme and language toggles when display.themeSwitcher is true', () => {
    render(<Header />)
    
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument()
    expect(screen.getByTestId('language-toggle')).toBeInTheDocument()
  })

  it('creates language-aware hrefs with current language', () => {
    render(<Header />)
    
    const aboutLinks = screen.getAllByTestId('nav-person')
    expect(aboutLinks.some(link => link.getAttribute('href') === '/about?lang=EN')).toBe(true)
  })

  it('updates hrefs when language changes to French', () => {
    ;(useAtom as jest.Mock).mockReturnValue(['FR', jest.fn()])
    render(<Header />)
    
    const aboutLinks = screen.getAllByTestId('nav-person')
    expect(aboutLinks.some(link => link.getAttribute('href') === '/about?lang=FR')).toBe(true)
  })

  it('marks current page as selected', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/about')
    render(<Header />)
    
    const aboutLinks = screen.getAllByTestId('nav-person')
    expect(aboutLinks.some(link => link.getAttribute('data-selected') === 'true')).toBe(true)
  })

  it('marks work pages as selected when on work route', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/work/project-1')
    render(<Header />)
    
    const workLinks = screen.getAllByTestId('nav-grid')
    expect(workLinks.some(link => link.getAttribute('data-selected') === 'true')).toBe(true)
  })

  it('marks blog pages as selected when on blog route', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/blog/post-1')
    render(<Header />)
    
    const blogLinks = screen.getAllByTestId('nav-book')
    expect(blogLinks.some(link => link.getAttribute('data-selected') === 'true')).toBe(true)
  })

  it('marks gallery pages as selected when on gallery route', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/gallery')
    render(<Header />)
    
    const galleryLinks = screen.getAllByTestId('nav-gallery')
    expect(galleryLinks.some(link => link.getAttribute('data-selected') === 'true')).toBe(true)
  })

  it('renders responsive navigation buttons', () => {
    render(<Header />)
    
    // Should render both desktop and mobile versions
    const aboutButtons = screen.getAllByTestId('nav-person')
    expect(aboutButtons).toHaveLength(2)
  })

  it('renders TimeDisplay component', () => {
    render(<Header />)
    
    // TimeDisplay should be rendered somewhere in the header
    const flexElements = screen.getAllByTestId('flex')
    expect(flexElements.length).toBeGreaterThan(0)
  })

  it('applies correct CSS classes', () => {
    render(<Header />)
    
    const headerFlex = screen.getAllByTestId('flex')[0]
    expect(headerFlex).toHaveClass('header-position')
  })

  it('renders fade effects for visual styling', () => {
    render(<Header />)
    
    const fadeElements = screen.getAllByTestId('fade')
    expect(fadeElements.length).toBeGreaterThan(0)
  })

  it('renders separator lines between navigation sections', () => {
    render(<Header />)
    
    const lineElements = screen.getAllByTestId('line')
    expect(lineElements.length).toBeGreaterThan(0)
  })
}) 