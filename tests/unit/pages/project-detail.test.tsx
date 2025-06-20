import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockCookies, mockHeaders, mockGetProjectInBothLanguages } from './__mocks__/testUtils';

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
jest.mock('@/app/utils/projects', () => ({
  getProjectInBothLanguages: mockGetProjectInBothLanguages,
}));

// Mock components
jest.mock('@/components/work/ProjectDetailWithLanguages', () => ({
  ProjectDetailWithLanguages: () => <div data-testid="project-detail-with-languages" />,
}));

jest.mock('@/components/mdx', () => ({
  CustomMDX: ({ source }: any) => <div data-testid="custom-mdx">{source}</div>,
}));

jest.mock('@/components/ScrollToHash', () => ({
  __esModule: true,
  default: () => <div data-testid="scroll-to-hash" />,
}));

// Mock baseURL
jest.mock('@/app/resources', () => ({
  baseURL: 'https://example.com',
}));

// Import the component after all mocks are set up
import Project from '@/app/work/[slug]/page';

describe('Project component', () => {
  const { headers, cookies } = require('next/headers');

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetProjectInBothLanguages.mockReturnValue({
      en: {
        slug: 'test-project',
        metadata: {
          title: 'Test Project',
          summary: 'A test project',
          publishedAt: '2024-01-01',
          image: '/images/test.webp',
        },
        content: '# Test Project\n\nThis is a test project.',
      },
      fr: {
        slug: 'test-project',
        metadata: {
          title: 'Projet de Test',
          summary: 'Un projet de test',
          publishedAt: '2024-01-01',
          image: '/images/test.webp',
        },
        content: '# Projet de Test\n\nCeci est un projet de test.',
      },
    });
  });

  it('should render ProjectDetailWithLanguages component', async () => {
    const mockCookiesInstance = mockCookies('EN');
    const mockHeadersInstance = mockHeaders();
    
    cookies.mockReturnValue(mockCookiesInstance);
    headers.mockReturnValue(mockHeadersInstance);

    const params = Promise.resolve({ slug: 'test-project' });
    const { container } = render(await Project({ params }));

    expect(container).toBeInTheDocument();
    expect(screen.getByTestId('project-detail-with-languages')).toBeInTheDocument();
    expect(screen.getByTestId('scroll-to-hash')).toBeInTheDocument();
  });
}); 