import React from 'react';
import { render, screen } from '@testing-library/react';
import type { Language } from '@/atoms/language';

// Import test utilities first
import { 
  mockCookies, 
  mockHeaders, 
  mockSearchParams, 
  mockGetProjects, 
  mockGetStarredProjects, 
  mockGetBlogPosts,
  mockHomeContent,
  mockProjects,
  mockBlogPosts,
  testMetadataGeneration
} from './__mocks__/testUtils';

// Mock Next.js server components
jest.mock('next/headers', () => ({
  headers: jest.fn(),
  cookies: jest.fn(),
}));

// Mock utility functions
jest.mock('@/app/utils/projects', () => ({
  getProjects: mockGetProjects,
  getStarredProjects: mockGetStarredProjects,
}));

jest.mock('@/app/utils/blog', () => ({
  getBlogPosts: mockGetBlogPosts,
}));

// Mock content imports
jest.mock('@/app/resources/content', () => ({
  home: {
    title: 'Home Page',
    description: 'Welcome to my portfolio',
    image: '/images/home.webp',
  },
  person: {
    name: 'Alexy Darius',
    avatar: '/images/avatar.webp',
  },
}));

jest.mock('@/app/resources/content.fr', () => ({
  home: {
    title: 'Page d\'accueil',
    description: 'Bienvenue sur mon portfolio',
    image: '/images/home.webp',
  },
  person: {
    name: 'Alexy Darius',
    avatar: '/images/avatar.webp',
  },
}));

// Mock HomeContent component
jest.mock('@/components/home/HomeContent', () => ({
  HomeContent: mockHomeContent,
}));

// Mock baseURL
jest.mock('@/app/resources', () => ({
  baseURL: 'https://example.com',
}));

// Import the component after all mocks are set up
import Home, { generateMetadata } from '@/app/page';

describe('Home component', () => {
  const { cookies, headers } = require('next/headers');

  beforeEach(() => {
    jest.clearAllMocks();
    mockHomeContent.mockReturnValue(<div data-testid="home-content">Home Content</div>);
  });

  it('should render HomeContent with correct props when language cookie is set', async () => {
    const mockCookiesInstance = mockCookies('FR');
    const mockHeadersInstance = mockHeaders('fr-FR,fr;q=0.9');
    cookies.mockReturnValue(mockCookiesInstance);
    headers.mockReturnValue(mockHeadersInstance);
    const { container } = render(await Home());
    expect(mockHomeContent).toHaveBeenCalled();
    expect(container).toBeInTheDocument();
    expect(screen.getByTestId('home-content')).toBeInTheDocument();
  });
}); 