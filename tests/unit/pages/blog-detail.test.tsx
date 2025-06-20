import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockCookies, mockHeaders, mockGetBlogPostInBothLanguages } from './__mocks__/testUtils';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}));

// Mock Next.js server components
jest.mock('next/headers', () => ({
  headers: jest.fn(),
  cookies: jest.fn(),
}));

// Mock utility functions
jest.mock('@/app/utils/blog', () => ({
  getBlogPosts: jest.fn(),
  getBlogPostInBothLanguages: mockGetBlogPostInBothLanguages,
}));

// Mock components
jest.mock('@/components/blog/BlogDetailWithLanguages', () => ({
  BlogDetailWithLanguages: () => <div data-testid="blog-detail-with-languages" />,
}));

jest.mock('@/components/blog/BlogSidebarClient', () => ({
  BlogSidebarClient: () => <div data-testid="blog-sidebar-client" />,
}));

jest.mock('@/components/mdx', () => ({
  CustomMDX: ({ source }: any) => <div data-testid="custom-mdx">{source}</div>,
}));

jest.mock('@/components/ScrollToHash', () => ({
  __esModule: true,
  default: () => <div data-testid="scroll-to-hash" />,
}));

// Mock once-ui components
jest.mock('@/once-ui/components', () => ({
  Row: ({ children }: any) => <div data-testid="row">{children}</div>,
}));

jest.mock('@/once-ui/modules', () => ({
  Meta: {
    generate: jest.fn(),
  },
  Schema: () => <div data-testid="schema" />,
}));

// Mock baseURL and content
jest.mock('@/app/resources', () => ({
  baseURL: 'https://example.com',
  about: {
    path: '/about',
  },
  blog: {
    path: '/blog',
  },
  person: {
    name: 'Alexy Darius',
    avatar: '/images/avatar.webp',
  },
}));

// Import the component after all mocks are set up
import Blog from '@/app/blog/[slug]/page';

describe('Blog component', () => {
  const { headers, cookies } = require('next/headers');

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetBlogPostInBothLanguages.mockReturnValue({
      en: {
        slug: 'test-post',
        metadata: {
          title: 'Test Post',
          summary: 'A test blog post',
          publishedAt: '2024-01-01',
          image: '/images/post.webp',
        },
        content: '# Test Post\n\nThis is a test blog post.',
      },
      fr: {
        slug: 'test-post',
        metadata: {
          title: 'Article de Test',
          summary: 'Un article de test',
          publishedAt: '2024-01-01',
          image: '/images/post.webp',
        },
        content: '# Article de Test\n\nCeci est un article de test.',
      },
    });
  });

  it('should render BlogDetailWithLanguages component', async () => {
    const mockCookiesInstance = mockCookies('EN');
    const mockHeadersInstance = mockHeaders();
    
    cookies.mockReturnValue(mockCookiesInstance);
    headers.mockReturnValue(mockHeadersInstance);

    const params = Promise.resolve({ slug: 'test-post' });
    const { container } = render(await Blog({ params }));

    expect(container).toBeInTheDocument();
    expect(screen.getByTestId('blog-detail-with-languages')).toBeInTheDocument();
    expect(screen.getByTestId('blog-sidebar-client')).toBeInTheDocument();
    expect(screen.getByTestId('scroll-to-hash')).toBeInTheDocument();
  });
}); 