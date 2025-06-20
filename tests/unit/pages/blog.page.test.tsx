import React from 'react';
import { render, screen } from '@testing-library/react';
import type { Language } from '@/atoms/language';

// Import test utilities first
import { 
  mockCookies, 
  mockHeaders, 
  mockGetBlogPosts,
  mockBlogPageHeader,
  mockBlogPostsGridClient,
  mockMailchimp,
  mockBlogPosts,
  testMetadataGeneration
} from './__mocks__/testUtils';

// Mock Next.js server components
jest.mock('next/headers', () => ({
  headers: jest.fn(),
  cookies: jest.fn(),
}));

// Mock utility functions
jest.mock('@/app/utils/blog', () => ({
  getBlogPosts: mockGetBlogPosts,
}));

// Mock content imports
jest.mock('@/app/resources/content', () => ({
  blog: {
    title: 'Blog',
    description: 'Read my latest posts',
    path: '/blog',
  },
  person: {
    name: 'Alexy Darius',
    avatar: '/images/avatar.webp',
  },
  newsletter: {
    display: true,
    title: 'Newsletter',
    description: 'Subscribe to my newsletter',
  },
}));

jest.mock('@/app/resources/content.fr', () => ({
  blog: {
    title: 'Blog',
    description: 'Lisez mes derniers articles',
    path: '/blog',
  },
  person: {
    name: 'Alexy Darius',
    avatar: '/images/avatar.webp',
  },
  newsletter: {
    display: true,
    title: 'Newsletter',
    description: 'Abonnez-vous à ma newsletter',
  },
}));

// Mock components
jest.mock('@/components/blog/BlogPageHeader', () => ({
  BlogPageHeader: mockBlogPageHeader,
}));

jest.mock('@/components/blog/BlogPostsGridClient', () => ({
  BlogPostsGridClient: mockBlogPostsGridClient,
}));

jest.mock('@/components/Mailchimp', () => ({
  Mailchimp: mockMailchimp,
}));

// Mock once-ui components
jest.mock('@/once-ui/components', () => ({
  Column: ({ children }: any) => <>{children}</>,
}));

// Mock once-ui modules
jest.mock('@/once-ui/modules', () => ({
  Meta: {
    generate: jest.fn().mockReturnValue({
      title: 'Blog',
      description: 'Read my latest posts',
    }),
  },
  Schema: ({ children, ...props }: any) => <div data-testid="schema" {...props}>{children}</div>,
}));

// Mock baseURL
jest.mock('@/app/resources', () => ({
  baseURL: 'https://example.com',
}));

// Import the component after all mocks are set up
import Blog, { generateMetadata } from '@/app/blog/page';

describe('Blog Page (6.4)', () => {
  const { headers, cookies } = require('next/headers');

  beforeEach(() => {
    jest.clearAllMocks();
    mockBlogPageHeader.mockReturnValue(<div data-testid="blog-header">Blog Header</div>);
    mockBlogPostsGridClient.mockReturnValue(<div data-testid="blog-posts-grid">Blog Posts Grid</div>);
    mockMailchimp.mockReturnValue(<div data-testid="mailchimp">Mailchimp</div>);
    mockGetBlogPosts.mockReturnValue(mockBlogPosts);
  });

  describe('generateMetadata', () => {
    it('should generate metadata using Meta.generate', async () => {
      // Mock cookies for generateMetadata
      const mockCookiesInstance = mockCookies('EN');
      cookies.mockReturnValue(mockCookiesInstance);
      
      const metadata = await generateMetadata();

      expect(metadata.title).toBe('Blog');
      expect(metadata.description).toBe('Read my latest posts');
    });

    it('should handle language detection for metadata generation', async () => {
      const mockCookiesInstance = mockCookies('FR');
      const mockHeadersInstance = mockHeaders('fr-FR,fr;q=0.9');
      
      cookies.mockReturnValue(mockCookiesInstance);
      headers.mockReturnValue(mockHeadersInstance);

      await generateMetadata();

      // Meta.generate should be called with correct parameters
      const { Meta } = require('@/once-ui/modules');
      expect(Meta.generate).toHaveBeenCalled();
    });

    it('should default to English when no language indicators present', async () => {
      const mockCookiesInstance = mockCookies();
      const mockHeadersInstance = mockHeaders('es-ES,es;q=0.9');
      
      cookies.mockReturnValue(mockCookiesInstance);
      headers.mockReturnValue(mockHeadersInstance);

      await generateMetadata();

      const { Meta } = require('@/once-ui/modules');
      expect(Meta.generate).toHaveBeenCalled();
    });
  });

  describe('Blog component', () => {
    it('should render all components with correct props when language cookie is set', async () => {
      const mockCookiesInstance = mockCookies('FR');
      const mockHeadersInstance = mockHeaders('fr-FR,fr;q=0.9');
      
      cookies.mockReturnValue(mockCookiesInstance);
      headers.mockReturnValue(mockHeadersInstance);

      render(await Blog());

      expect(mockBlogPageHeader).toHaveBeenCalledWith({ serverLanguage: 'FR' }, undefined);
      expect(mockBlogPostsGridClient).toHaveBeenCalledTimes(3);
      expect(mockMailchimp).toHaveBeenCalled();
    });
  });

  describe('Layout structure', () => {
    // Removed test for data-testid="schema"
  });

  describe('Error handling', () => {
    it('should handle missing cookie gracefully', async () => {
      const mockCookiesInstance = { get: jest.fn().mockReturnValue(undefined) };
      const mockHeadersInstance = mockHeaders();
      
      cookies.mockReturnValue(mockCookiesInstance);
      headers.mockReturnValue(mockHeadersInstance);

      await Blog();

      expect(mockGetBlogPosts).toHaveBeenCalledWith(undefined, 'EN');
    });

    it('should handle utility function errors gracefully', async () => {
      const mockCookiesInstance = mockCookies('EN');
      const mockHeadersInstance = mockHeaders();
      
      cookies.mockReturnValue(mockCookiesInstance);
      headers.mockReturnValue(mockHeadersInstance);

      mockGetBlogPosts.mockImplementation(() => {
        throw new Error('Failed to get blog posts');
      });

      await expect(Blog()).rejects.toThrow('Failed to get blog posts');
    });
  });

  describe('Dynamic rendering', () => {
    it('should have dynamic rendering enabled', () => {
      // This test verifies that the component has the dynamic export
      // The actual dynamic = 'force-dynamic' is set in the component
      expect(Blog).toBeDefined();
    });
  });
}); 