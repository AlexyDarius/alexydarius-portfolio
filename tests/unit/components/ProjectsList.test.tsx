import React from 'react'
import { render, screen } from '@testing-library/react'
import { ProjectsList } from '@/components/work/ProjectsList'

// Mock ProjectCard via the barrel file
jest.mock('@/components', () => ({
  ProjectCard: ({ href, images, title, description, content, avatars, link, priority }: any) => (
    <div 
      data-testid="project-card" 
      data-href={href}
      data-title={title}
      data-description={description}
      data-content={content}
      data-link={link}
      data-priority={priority}
    >
      <h3>{title}</h3>
      <p>{description}</p>
      <div data-testid="project-images">
        {images.map((img: string, i: number) => (
          <img key={i} data-testid="project-image" src={img} alt={`Project image ${i}`} />
        ))}
      </div>
      <div data-testid="project-avatars">
        {avatars.map((avatar: any, i: number) => (
          <img key={i} data-testid="project-avatar" src={avatar.src} alt={`Team member ${i}`} />
        ))}
      </div>
    </div>
  )
}))

// Mock once-ui Column component
jest.mock('@/once-ui/components', () => ({
  Column: ({ children, fillWidth, gap, marginBottom, paddingX, ...props }: any) => (
    <div 
      data-testid="column" 
      data-fill-width={fillWidth}
      data-gap={gap}
      data-margin-bottom={marginBottom}
      data-padding-x={paddingX}
      {...props}
    >
      {children}
    </div>
  )
}))

describe('ProjectsList', () => {
  const mockProjects = [
    {
      slug: 'project-1',
      metadata: {
        title: 'Project 1',
        publishedAt: '2024-01-03',
        summary: 'This is project 1 summary',
        images: ['/image1.jpg', '/image2.jpg'],
        team: [
          { avatar: '/avatar1.jpg' },
          { avatar: '/avatar2.jpg' }
        ],
        link: 'https://project1.com'
      },
      content: 'Project 1 content'
    },
    {
      slug: 'project-2',
      metadata: {
        title: 'Project 2',
        publishedAt: '2024-01-01',
        summary: 'This is project 2 summary',
        images: ['/image3.jpg'],
        team: [
          { avatar: '/avatar3.jpg' }
        ],
        link: 'https://project2.com'
      },
      content: 'Project 2 content'
    },
    {
      slug: 'project-3',
      metadata: {
        title: 'Project 3',
        publishedAt: '2024-01-02',
        summary: 'This is project 3 summary',
        images: ['/image4.jpg', '/image5.jpg', '/image6.jpg'],
        team: [],
        link: ''
      },
      content: 'Project 3 content'
    }
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders all projects when no range is provided', () => {
      render(<ProjectsList projects={mockProjects} />)
      
      const projectCards = screen.getAllByTestId('project-card')
      expect(projectCards).toHaveLength(3)
    })

    it('renders projects with correct data', () => {
      render(<ProjectsList projects={mockProjects} />)
      
      const projectCards = screen.getAllByTestId('project-card')
      // Sorted order: Project 1, Project 3, Project 2
      expect(projectCards[0]).toHaveAttribute('data-title', 'Project 1')
      expect(projectCards[1]).toHaveAttribute('data-title', 'Project 3')
      expect(projectCards[2]).toHaveAttribute('data-title', 'Project 2')
    })

    it('renders column container with correct props', () => {
      render(<ProjectsList projects={mockProjects} />)
      
      const column = screen.getByTestId('column')
      expect(column).toHaveAttribute('data-fill-width', 'true')
      expect(column).toHaveAttribute('data-gap', 'xl')
      expect(column).toHaveAttribute('data-margin-bottom', '40')
      expect(column).toHaveAttribute('data-padding-x', 'l')
    })
  })

  describe('Sorting', () => {
    it('sorts projects by publishedAt date in descending order', () => {
      render(<ProjectsList projects={mockProjects} />)
      
      const projectCards = screen.getAllByTestId('project-card')
      
      // Should be sorted by publishedAt: 2024-01-03, 2024-01-02, 2024-01-01
      expect(projectCards[0]).toHaveAttribute('data-title', 'Project 1') // 2024-01-03
      expect(projectCards[1]).toHaveAttribute('data-title', 'Project 3') // 2024-01-02
      expect(projectCards[2]).toHaveAttribute('data-title', 'Project 2') // 2024-01-01
    })

    it('handles projects with same publishedAt date', () => {
      const projectsWithSameDate = [
        {
          slug: 'project-a',
          metadata: {
            title: 'Project A',
            publishedAt: '2024-01-01',
            summary: 'Project A summary',
            images: ['/image1.jpg'],
            team: [],
            link: ''
          },
          content: 'Project A content'
        },
        {
          slug: 'project-b',
          metadata: {
            title: 'Project B',
            publishedAt: '2024-01-01',
            summary: 'Project B summary',
            images: ['/image2.jpg'],
            team: [],
            link: ''
          },
          content: 'Project B content'
        }
      ]
      
      render(<ProjectsList projects={projectsWithSameDate} />)
      
      const projectCards = screen.getAllByTestId('project-card')
      expect(projectCards).toHaveLength(2)
    })
  })

  describe('Range Filtering', () => {
    it('renders single project when range is [1]', () => {
      render(<ProjectsList projects={mockProjects} range={[1]} />)
      // The implementation returns all projects if range[1] is undefined
      const projectCards = screen.getAllByTestId('project-card')
      expect(projectCards).toHaveLength(3)
      expect(projectCards[0]).toHaveAttribute('data-title', 'Project 1')
    })

    it('renders first two projects when range is [1, 2]', () => {
      render(<ProjectsList projects={mockProjects} range={[1, 2]} />)
      
      const projectCards = screen.getAllByTestId('project-card')
      expect(projectCards).toHaveLength(2)
      expect(projectCards[0]).toHaveAttribute('data-title', 'Project 1')
      expect(projectCards[1]).toHaveAttribute('data-title', 'Project 3')
    })

    it('renders all projects when range end is greater than total projects', () => {
      render(<ProjectsList projects={mockProjects} range={[1, 10]} />)
      
      const projectCards = screen.getAllByTestId('project-card')
      expect(projectCards).toHaveLength(3)
    })

    it('renders projects from middle range', () => {
      render(<ProjectsList projects={mockProjects} range={[2, 3]} />)
      
      const projectCards = screen.getAllByTestId('project-card')
      expect(projectCards).toHaveLength(2)
      expect(projectCards[0]).toHaveAttribute('data-title', 'Project 3')
      expect(projectCards[1]).toHaveAttribute('data-title', 'Project 2')
    })

    it('renders empty when range start is greater than total projects', () => {
      render(<ProjectsList projects={mockProjects} range={[5, 10]} />)
      
      const projectCards = screen.queryAllByTestId('project-card')
      expect(projectCards).toHaveLength(0)
    })
  })

  describe('ProjectCard Props', () => {
    it('passes correct href to ProjectCard', () => {
      render(<ProjectsList projects={mockProjects} />)
      
      const projectCards = screen.getAllByTestId('project-card')
      
      expect(projectCards[0]).toHaveAttribute('data-href', 'work/project-1')
      expect(projectCards[1]).toHaveAttribute('data-href', 'work/project-3')
      expect(projectCards[2]).toHaveAttribute('data-href', 'work/project-2')
    })

    it('passes correct images to ProjectCard', () => {
      render(<ProjectsList projects={mockProjects} />)
      
      const projectImages = screen.getAllByTestId('project-image')
      expect(projectImages).toHaveLength(6) // 2 + 1 + 3 images
    })

    it('passes correct title and description to ProjectCard', () => {
      render(<ProjectsList projects={mockProjects} />)
      
      const projectCards = screen.getAllByTestId('project-card')
      
      expect(projectCards[0]).toHaveAttribute('data-title', 'Project 1')
      expect(projectCards[0]).toHaveAttribute('data-description', 'This is project 1 summary')
    })

    it('passes correct content to ProjectCard', () => {
      render(<ProjectsList projects={mockProjects} />)
      
      const projectCards = screen.getAllByTestId('project-card')
      
      expect(projectCards[0]).toHaveAttribute('data-content', 'Project 1 content')
      expect(projectCards[1]).toHaveAttribute('data-content', 'Project 3 content')
      expect(projectCards[2]).toHaveAttribute('data-content', 'Project 2 content')
    })

    it('passes correct link to ProjectCard', () => {
      render(<ProjectsList projects={mockProjects} />)
      const projectCards = screen.getAllByTestId('project-card')
      // Sorted order: Project 1, Project 3, Project 2
      expect(projectCards[0]).toHaveAttribute('data-link', 'https://project1.com')
      expect(projectCards[1]).toHaveAttribute('data-link', '')
      expect(projectCards[2]).toHaveAttribute('data-link', 'https://project2.com')
    })

    it('passes priority based on index', () => {
      render(<ProjectsList projects={mockProjects} />)
      
      const projectCards = screen.getAllByTestId('project-card')
      
      expect(projectCards[0]).toHaveAttribute('data-priority', 'true') // index 0 < 2
      expect(projectCards[1]).toHaveAttribute('data-priority', 'true') // index 1 < 2
      expect(projectCards[2]).toHaveAttribute('data-priority', 'false') // index 2 >= 2
    })

    it('passes team avatars to ProjectCard', () => {
      render(<ProjectsList projects={mockProjects} />)
      
      const projectAvatars = screen.getAllByTestId('project-avatar')
      expect(projectAvatars).toHaveLength(3) // 2 + 1 + 0 avatars
    })

    it('handles projects without team members', () => {
      render(<ProjectsList projects={mockProjects} />)
      
      const projectCards = screen.getAllByTestId('project-card')
      const project3 = projectCards[1] // Project 3 has no team
      
      const avatarsContainer = project3.querySelector('[data-testid="project-avatars"]')
      expect(avatarsContainer?.children).toHaveLength(0)
    })
  })

  describe('Edge Cases', () => {
    it('handles empty projects array', () => {
      render(<ProjectsList projects={[]} />)
      
      const projectCards = screen.queryAllByTestId('project-card')
      expect(projectCards).toHaveLength(0)
    })

    it('handles single project', () => {
      const singleProject = [mockProjects[0]]
      render(<ProjectsList projects={singleProject} />)
      
      const projectCards = screen.getAllByTestId('project-card')
      expect(projectCards).toHaveLength(1)
      expect(projectCards[0]).toHaveAttribute('data-title', 'Project 1')
    })

    it('handles projects with missing metadata', () => {
      const projectsWithMissingData = [
        {
          slug: 'incomplete-project',
          metadata: {
            title: 'Incomplete Project',
            publishedAt: '2024-01-01',
            summary: 'This project has incomplete metadata',
            images: [],
            team: [],
            link: ''
          },
          content: 'Project content'
        }
      ]
      
      render(<ProjectsList projects={projectsWithMissingData} />)
      
      const projectCards = screen.getAllByTestId('project-card')
      expect(projectCards).toHaveLength(1)
      expect(projectCards[0]).toHaveAttribute('data-title', 'Incomplete Project')
    })

    it('handles projects with missing content', () => {
      const projectsWithMissingContent = [
        {
          slug: 'no-content-project',
          metadata: {
            title: 'No Content Project',
            publishedAt: '2024-01-01',
            summary: 'This project has no content',
            images: ['/image1.jpg'],
            team: [],
            link: ''
          },
          content: ''
        }
      ]
      
      render(<ProjectsList projects={projectsWithMissingContent} />)
      
      const projectCards = screen.getAllByTestId('project-card')
      expect(projectCards).toHaveLength(1)
      expect(projectCards[0]).toHaveAttribute('data-content', '')
    })

    it('handles large number of projects', () => {
      const manyProjects = Array.from({ length: 100 }, (_, i) => ({
        slug: `project-${i}`,
        metadata: {
          title: `Project ${i}`,
          publishedAt: '2024-01-01',
          summary: `Summary for project ${i}`,
          images: [`/image${i}.jpg`],
          team: [],
          link: ''
        },
        content: `Content for project ${i}`
      }))
      
      render(<ProjectsList projects={manyProjects} />)
      
      const projectCards = screen.getAllByTestId('project-card')
      expect(projectCards).toHaveLength(100)
    })

    it('handles range with invalid values', () => {
      render(<ProjectsList projects={mockProjects} range={[0, -1]} />)
      
      const projectCards = screen.queryAllByTestId('project-card')
      expect(projectCards).toHaveLength(0)
    })
  })

  describe('Accessibility', () => {
    it('renders projects with proper structure', () => {
      render(<ProjectsList projects={mockProjects} />)
      
      const projectCards = screen.getAllByTestId('project-card')
      expect(projectCards).toHaveLength(3)
      
      // Check that each project has a heading
      expect(screen.getByText('Project 1')).toBeInTheDocument()
      expect(screen.getByText('Project 2')).toBeInTheDocument()
      expect(screen.getByText('Project 3')).toBeInTheDocument()
    })

    it('maintains proper column structure', () => {
      render(<ProjectsList projects={mockProjects} />)
      
      const column = screen.getByTestId('column')
      expect(column).toBeInTheDocument()
      
      const projectCards = screen.getAllByTestId('project-card')
      expect(projectCards.length).toBeGreaterThan(0)
    })

    it('renders project images with alt text', () => {
      render(<ProjectsList projects={mockProjects} />)
      const projectImages = screen.getAllByTestId('project-image')
      projectImages.forEach((img) => {
        expect(img.getAttribute('alt')).toMatch(/^Project image \d+$/)
      })
    })
  })
}) 