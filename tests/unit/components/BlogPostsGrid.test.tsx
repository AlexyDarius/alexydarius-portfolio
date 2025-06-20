import React from 'react'
import { render, screen } from '@testing-library/react'
import { BlogPostsGrid } from '@/components/blog/BlogPostsGrid'
import Post from '@/components/blog/Post'

// Mock the Post component
jest.mock('@/components/blog/Post', () => {
  return function MockPost({ post, thumbnail, direction }: any) {
    return (
      <div data-testid="blog-post" data-slug={post.slug} data-thumbnail={thumbnail} data-direction={direction}>
        <h3>{post.metadata.title}</h3>
        <p>{post.metadata.summary}</p>
      </div>
    )
  }
})

// Mock once-ui Grid component
jest.mock('@/once-ui/components', () => ({
  Grid: ({ children, columns, mobileColumns, fillWidth, marginBottom, gap, ...props }: any) => (
    <div 
      data-testid="grid" 
      data-columns={columns}
      data-mobile-columns={mobileColumns}
      data-fill-width={fillWidth}
      data-margin-bottom={marginBottom}
      data-gap={gap}
      {...props}
    >
      {children}
    </div>
  )
}))

describe('BlogPostsGrid', () => {
  const mockPosts = [
    {
      slug: 'test-post-1',
      metadata: {
        title: 'Test Post 1',
        summary: 'This is a test post summary',
        publishedAt: '2024-01-01',
        tags: ['test', 'blog']
      },
      content: 'Test content 1'
    },
    {
      slug: 'test-post-2',
      metadata: {
        title: 'Test Post 2',
        summary: 'This is another test post summary',
        publishedAt: '2024-01-02',
        tags: ['test', 'article']
      },
      content: 'Test content 2'
    },
    {
      slug: 'test-post-3',
      metadata: {
        title: 'Test Post 3',
        summary: 'This is the third test post summary',
        publishedAt: '2024-01-03',
        tags: ['blog', 'article']
      },
      content: 'Test content 3'
    }
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders nothing when posts array is empty', () => {
      const { container } = render(<BlogPostsGrid posts={[]} />)
      
      expect(container.firstChild).toBeNull()
    })

    it('renders nothing when posts is null', () => {
      const { container } = render(<BlogPostsGrid posts={null as any} />)
      
      expect(container.firstChild).toBeNull()
    })

    it('renders nothing when posts is undefined', () => {
      const { container } = render(<BlogPostsGrid posts={undefined as any} />)
      
      expect(container.firstChild).toBeNull()
    })

    it('renders grid with posts when posts are provided', () => {
      render(<BlogPostsGrid posts={mockPosts} />)
      
      const grid = screen.getByTestId('grid')
      expect(grid).toBeInTheDocument()
      
      const posts = screen.getAllByTestId('blog-post')
      expect(posts).toHaveLength(3)
    })

    it('renders all posts with correct data', () => {
      render(<BlogPostsGrid posts={mockPosts} />)
      
      const posts = screen.getAllByTestId('blog-post')
      
      expect(posts[0]).toHaveAttribute('data-slug', 'test-post-1')
      expect(posts[1]).toHaveAttribute('data-slug', 'test-post-2')
      expect(posts[2]).toHaveAttribute('data-slug', 'test-post-3')
    })
  })

  describe('Grid Layout', () => {
    it('uses default columns value of 1', () => {
      render(<BlogPostsGrid posts={mockPosts} />)
      
      const grid = screen.getByTestId('grid')
      expect(grid).toHaveAttribute('data-columns', '1')
    })

    it('uses custom columns value when provided', () => {
      render(<BlogPostsGrid posts={mockPosts} columns="2" />)
      
      const grid = screen.getByTestId('grid')
      expect(grid).toHaveAttribute('data-columns', '2')
    })

    it('uses custom columns value of 3 when provided', () => {
      render(<BlogPostsGrid posts={mockPosts} columns="3" />)
      
      const grid = screen.getByTestId('grid')
      expect(grid).toHaveAttribute('data-columns', '3')
    })

    it('always uses mobile columns of 1', () => {
      render(<BlogPostsGrid posts={mockPosts} columns="3" />)
      
      const grid = screen.getByTestId('grid')
      expect(grid).toHaveAttribute('data-mobile-columns', '1')
    })

    it('applies fillWidth prop', () => {
      render(<BlogPostsGrid posts={mockPosts} />)
      
      const grid = screen.getByTestId('grid')
      expect(grid).toHaveAttribute('data-fill-width', 'true')
    })

    it('applies default margin bottom', () => {
      render(<BlogPostsGrid posts={mockPosts} />)
      
      const grid = screen.getByTestId('grid')
      expect(grid).toHaveAttribute('data-margin-bottom', '40')
    })

    it('applies default gap', () => {
      render(<BlogPostsGrid posts={mockPosts} />)
      
      const grid = screen.getByTestId('grid')
      expect(grid).toHaveAttribute('data-gap', '12')
    })
  })

  describe('Post Rendering', () => {
    it('passes correct props to Post components', () => {
      render(<BlogPostsGrid posts={mockPosts} />)
      
      const posts = screen.getAllByTestId('blog-post')
      
      posts.forEach((post, index) => {
        expect(post).toHaveAttribute('data-slug', mockPosts[index].slug)
      })
    })

    it('passes thumbnail prop to Post components', () => {
      render(<BlogPostsGrid posts={mockPosts} thumbnail={true} />)
      
      const posts = screen.getAllByTestId('blog-post')
      
      posts.forEach(post => {
        expect(post).toHaveAttribute('data-thumbnail', 'true')
      })
    })

    it('passes direction prop to Post components', () => {
      render(<BlogPostsGrid posts={mockPosts} direction="column" />)
      
      const posts = screen.getAllByTestId('blog-post')
      
      posts.forEach(post => {
        expect(post).toHaveAttribute('data-direction', 'column')
      })
    })

    it('passes row direction prop to Post components', () => {
      render(<BlogPostsGrid posts={mockPosts} direction="row" />)
      
      const posts = screen.getAllByTestId('blog-post')
      
      posts.forEach(post => {
        expect(post).toHaveAttribute('data-direction', 'row')
      })
    })

    it('renders post titles correctly', () => {
      render(<BlogPostsGrid posts={mockPosts} />)
      
      expect(screen.getByText('Test Post 1')).toBeInTheDocument()
      expect(screen.getByText('Test Post 2')).toBeInTheDocument()
      expect(screen.getByText('Test Post 3')).toBeInTheDocument()
    })

    it('renders post summaries correctly', () => {
      render(<BlogPostsGrid posts={mockPosts} />)
      
      expect(screen.getByText('This is a test post summary')).toBeInTheDocument()
      expect(screen.getByText('This is another test post summary')).toBeInTheDocument()
      expect(screen.getByText('This is the third test post summary')).toBeInTheDocument()
    })
  })

  describe('Props Handling', () => {
    it('handles all props combinations', () => {
      render(
        <BlogPostsGrid 
          posts={mockPosts} 
          columns="3" 
          thumbnail={true} 
          direction="column" 
        />
      )
      
      const grid = screen.getByTestId('grid')
      expect(grid).toHaveAttribute('data-columns', '3')
      
      const posts = screen.getAllByTestId('blog-post')
      posts.forEach(post => {
        expect(post).toHaveAttribute('data-thumbnail', 'true')
        expect(post).toHaveAttribute('data-direction', 'column')
      })
    })

    it('handles thumbnail false', () => {
      render(<BlogPostsGrid posts={mockPosts} thumbnail={false} />)
      
      const posts = screen.getAllByTestId('blog-post')
      posts.forEach(post => {
        expect(post).toHaveAttribute('data-thumbnail', 'false')
      })
    })

    it('handles undefined direction', () => {
      render(<BlogPostsGrid posts={mockPosts} direction={undefined} />)
      
      const posts = screen.getAllByTestId('blog-post')
      posts.forEach(post => {
        expect(post.getAttribute('data-direction')).toBeNull()
      })
    })
  })

  describe('Edge Cases', () => {
    it('handles single post', () => {
      const singlePost = [mockPosts[0]]
      render(<BlogPostsGrid posts={singlePost} />)
      
      const posts = screen.getAllByTestId('blog-post')
      expect(posts).toHaveLength(1)
      expect(posts[0]).toHaveAttribute('data-slug', 'test-post-1')
    })

    it('handles posts with missing metadata', () => {
      const postsWithMissingData = [
        {
          slug: 'incomplete-post',
          metadata: {
            title: 'Incomplete Post',
            summary: 'This post has incomplete metadata',
            publishedAt: '2024-01-01'
          },
          content: 'Test content'
        }
      ]
      
      render(<BlogPostsGrid posts={postsWithMissingData} />)
      
      const posts = screen.getAllByTestId('blog-post')
      expect(posts).toHaveLength(1)
      expect(posts[0]).toHaveAttribute('data-slug', 'incomplete-post')
    })

    it('handles posts with missing content', () => {
      const postsWithMissingContent = [
        {
          slug: 'no-content-post',
          metadata: {
            title: 'No Content Post',
            summary: 'This post has no content',
            publishedAt: '2024-01-01'
          },
          content: ''
        }
      ]
      
      render(<BlogPostsGrid posts={postsWithMissingContent} />)
      
      const posts = screen.getAllByTestId('blog-post')
      expect(posts).toHaveLength(1)
      expect(posts[0]).toHaveAttribute('data-slug', 'no-content-post')
    })

    it('handles large number of posts', () => {
      const manyPosts = Array.from({ length: 50 }, (_, i) => ({
        slug: `post-${i}`,
        metadata: {
          title: `Post ${i}`,
          summary: `Summary for post ${i}`,
          publishedAt: '2024-01-01',
          tags: ['test']
        },
        content: `Content for post ${i}`
      }))
      
      render(<BlogPostsGrid posts={manyPosts} />)
      
      const posts = screen.getAllByTestId('blog-post')
      expect(posts).toHaveLength(50)
    })
  })

  describe('Accessibility', () => {
    it('renders posts with proper structure', () => {
      render(<BlogPostsGrid posts={mockPosts} />)
      
      const posts = screen.getAllByTestId('blog-post')
      expect(posts).toHaveLength(3)
      
      // Check that each post has a heading
      expect(screen.getByText('Test Post 1')).toBeInTheDocument()
      expect(screen.getByText('Test Post 2')).toBeInTheDocument()
      expect(screen.getByText('Test Post 3')).toBeInTheDocument()
    })

    it('maintains proper grid structure', () => {
      render(<BlogPostsGrid posts={mockPosts} />)
      
      const grid = screen.getByTestId('grid')
      expect(grid).toBeInTheDocument()
      
      const posts = screen.getAllByTestId('blog-post')
      expect(posts.length).toBeGreaterThan(0)
    })
  })
}) 