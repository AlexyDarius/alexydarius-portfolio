import { render, screen } from '@testing-library/react'
import { useAtom } from 'jotai'
import { ProjectCard } from '@/components/ProjectCard'

// Mock Jotai
jest.mock('jotai', () => ({
  useAtom: jest.fn(() => ['EN', jest.fn()])
}))

// Mock once-ui components
jest.mock('@/once-ui/components', () => ({
  Column: ({ children, ...props }: any) => <div data-testid="column" {...props}>{children}</div>,
  Flex: ({ children, ...props }: any) => <div data-testid="flex" {...props}>{children}</div>,
  Text: ({ children, ...props }: any) => <span data-testid="text" {...props}>{children}</span>,
  Heading: ({ children, ...props }: any) => <h2 data-testid="heading" {...props}>{children}</h2>,
  Carousel: ({ images, ...props }: any) => (
    <div data-testid="carousel" {...props}>
      {images.map((img: any, i: number) => (
        <img key={i} data-testid="carousel-image" src={img.src} alt={img.alt} />
      ))}
    </div>
  ),
  SmartLink: ({ href, children, ...props }: any) => <a data-testid="link" href={href} {...props}>{children}</a>,
  AvatarGroup: ({ avatars, ...props }: any) => (
    <div data-testid="avatar-group" {...props}>
      {avatars.map((avatar: any, i: number) => (
        <img key={i} data-testid="avatar" src={avatar.src} />
      ))}
    </div>
  )
}))

describe('ProjectCard', () => {
  const mockProps = {
    href: '/work/test-project',
    images: ['/test1.jpg', '/test2.jpg'],
    title: 'Test Project',
    content: 'Test content',
    description: 'A test project description',
    avatars: [{ src: '/avatar1.jpg' }, { src: '/avatar2.jpg' }],
    link: 'https://test-project.com'
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useAtom as jest.Mock).mockReturnValue(['EN', jest.fn()])
  })

  it('renders project card with title', () => {
    render(<ProjectCard {...mockProps} />)
    
    expect(screen.getByText('Test Project')).toBeInTheDocument()
  })

  it('renders project description', () => {
    render(<ProjectCard {...mockProps} />)
    
    expect(screen.getByText('A test project description')).toBeInTheDocument()
  })

  it('renders project images in carousel', () => {
    render(<ProjectCard {...mockProps} />)
    
    const carouselImages = screen.getAllByTestId('carousel-image')
    expect(carouselImages).toHaveLength(2)
    expect(carouselImages[0]).toHaveAttribute('src', '/test1.jpg')
    expect(carouselImages[1]).toHaveAttribute('src', '/test2.jpg')
  })

  it('renders avatars when provided', () => {
    render(<ProjectCard {...mockProps} />)
    
    const avatars = screen.getAllByTestId('avatar')
    expect(avatars).toHaveLength(2)
    expect(avatars[0]).toHaveAttribute('src', '/avatar1.jpg')
  })

  it('renders case study link when content is provided', () => {
    render(<ProjectCard {...mockProps} />)
    
    const links = screen.getAllByTestId('link')
    expect(links[0]).toHaveAttribute('href', '/work/test-project')
    expect(screen.getByText('Read case study')).toBeInTheDocument()
  })

  it('renders project link when link is provided', () => {
    render(<ProjectCard {...mockProps} />)
    
    const links = screen.getAllByTestId('link')
    expect(links[1]).toHaveAttribute('href', 'https://test-project.com')
    expect(screen.getByText('View project')).toBeInTheDocument()
  })

  it('renders French translations when language is FR', () => {
    ;(useAtom as jest.Mock).mockReturnValue(['FR', jest.fn()])
    render(<ProjectCard {...mockProps} />)
    
    expect(screen.getByText('Lire l\'étude de cas')).toBeInTheDocument()
    expect(screen.getByText('Voir le projet')).toBeInTheDocument()
  })

  it('handles missing content gracefully', () => {
    const propsWithoutContent = { ...mockProps, content: '' }
    render(<ProjectCard {...propsWithoutContent} />)
    
    expect(screen.getByText('Test Project')).toBeInTheDocument()
    expect(screen.queryByText('Read case study')).not.toBeInTheDocument()
  })

  it('handles missing description gracefully', () => {
    const propsWithoutDescription = { ...mockProps, description: '' }
    render(<ProjectCard {...propsWithoutDescription} />)
    
    expect(screen.getByText('Test Project')).toBeInTheDocument()
  })

  it('handles missing avatars gracefully', () => {
    const propsWithoutAvatars = { ...mockProps, avatars: [] }
    render(<ProjectCard {...propsWithoutAvatars} />)
    
    expect(screen.getByText('Test Project')).toBeInTheDocument()
    expect(screen.queryByTestId('avatar-group')).not.toBeInTheDocument()
  })

  it('handles missing link gracefully', () => {
    const propsWithoutLink = { ...mockProps, link: '' }
    render(<ProjectCard {...propsWithoutLink} />)
    
    expect(screen.getByText('Test Project')).toBeInTheDocument()
    expect(screen.queryByText('View project')).not.toBeInTheDocument()
  })

  it('applies data-testid when provided', () => {
    render(<ProjectCard {...mockProps} data-testid="custom-test-id" />)
    
    expect(screen.getByTestId('custom-test-id')).toBeInTheDocument()
  })

  it('renders responsive layout structure', () => {
    render(<ProjectCard {...mockProps} />)
    
    const flexElements = screen.getAllByTestId('flex')
    expect(flexElements.length).toBeGreaterThan(0)
  })

  it('renders column layout structure', () => {
    render(<ProjectCard {...mockProps} />)
    
    const columnElements = screen.getAllByTestId('column')
    expect(columnElements.length).toBeGreaterThan(0)
  })
}) 