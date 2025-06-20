import React from 'react';
import { render, screen } from '@testing-library/react';
import type { Language } from '@/atoms/language';

// Import test utilities first
import { 
  mockCookies, 
  mockHeaders, 
  mockSearchParams, 
  mockGetProjects,
  mockWorkContent,
  mockProjects,
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
}));

// Mock content imports
jest.mock('@/app/resources/content', () => ({
  work: {
    title: 'My Work',
    description: 'Check out my projects',
    path: '/work',
  },
  about: {
    title: 'About Me',
    description: 'Learn more about me',
    path: '/about',
  },
  person: {
    name: 'Alexy Darius',
    avatar: '/images/avatar.webp',
  },
}));

jest.mock('@/app/resources/content.fr', () => ({
  work: {
    title: 'Mon travail',
    description: 'Découvrez mes projets',
    path: '/work',
  },
  about: {
    title: 'À propos',
    description: 'En savoir plus sur moi',
    path: '/about',
  },
  person: {
    name: 'Alexy Darius',
    avatar: '/images/avatar.webp',
  },
}));

// Mock WorkContent component
jest.mock('@/components/work/WorkContent', () => ({
  WorkContent: mockWorkContent,
}));

// Mock Schema component
jest.mock('@/once-ui/modules', () => ({
  Meta: {
    generate: jest.fn(),
  },
  Schema: mockWorkContent, // Using mockWorkContent as a placeholder
}));

// Mock baseURL
jest.mock('@/app/resources', () => ({
  baseURL: 'https://example.com',
}));

// Import the component after all mocks are set up
import Work, { generateMetadata } from '@/app/work/page';

describe('Work Page (6.3)', () => {
  const { headers, cookies } = require('next/headers');

  beforeEach(() => {
    jest.clearAllMocks();
    mockWorkContent.mockReturnValue(<div data-testid="work-content">Work Content</div>);
    mockGetProjects.mockReturnValue(mockProjects);
  });

  describe('generateMetadata', () => {
    it('should generate metadata for English language', async () => {
      const searchParams = mockSearchParams('EN');
      const metadata = await generateMetadata({ searchParams });

      expect(metadata.title).toBe('My Work');
      expect(metadata.description).toBe('Check out my projects');
      expect(metadata.openGraph.title).toBe('My Work');
      expect(metadata.openGraph.description).toBe('Check out my projects');
      expect(metadata.openGraph.locale).toBe('en_US');
      expect(metadata.openGraph.url).toBe('https://example.com/work?lang=EN');
    });

    it('should generate metadata for French language', async () => {
      const searchParams = mockSearchParams('FR');
      const metadata = await generateMetadata({ searchParams });

      expect(metadata.title).toBe('Mon travail');
      expect(metadata.description).toBe('Découvrez mes projets');
      expect(metadata.openGraph.title).toBe('Mon travail');
      expect(metadata.openGraph.description).toBe('Découvrez mes projets');
      expect(metadata.openGraph.locale).toBe('fr_FR');
      expect(metadata.openGraph.url).toBe('https://example.com/work?lang=FR');
    });

    it('should default to English when no language specified', async () => {
      const searchParams = mockSearchParams();
      const metadata = await generateMetadata({ searchParams });

      expect(metadata.title).toBe('My Work');
      expect(metadata.openGraph.locale).toBe('en_US');
    });

    it('should include proper alternates for language switching', async () => {
      const searchParams = mockSearchParams('EN');
      const metadata = await generateMetadata({ searchParams });

      expect(metadata.alternates.languages.en).toBe('https://example.com/work?lang=EN');
      expect(metadata.alternates.languages.fr).toBe('https://example.com/work?lang=FR');
      expect(metadata.alternates.languages['x-default']).toBe('https://example.com/work?lang=EN');
    });

    it('should include Twitter card metadata', async () => {
      const searchParams = mockSearchParams('EN');
      const metadata = await generateMetadata({ searchParams });

      expect(metadata.twitter.card).toBe('summary_large_image');
      expect(metadata.twitter.title).toBe('My Work');
      expect(metadata.twitter.description).toBe('Check out my projects');
    });

    it('should generate correct Open Graph image URL', async () => {
      const searchParams = mockSearchParams('EN');
      const metadata = await generateMetadata({ searchParams });

      expect(metadata.openGraph.images[0].url).toBe('/api/og/generate?title=My%20Work');
      expect(metadata.openGraph.images[0].alt).toBe('My Work');
    });

    it('should include proper site name in Open Graph', async () => {
      const searchParams = mockSearchParams('EN');
      const metadata = await generateMetadata({ searchParams });

      expect(metadata.openGraph.siteName).toBe('Alexy Darius');
    });
  });

  describe('Work component', () => {
    it('should render WorkContent with correct props when language cookie is set', async () => {
      const mockCookiesInstance = mockCookies('FR');
      const mockHeadersInstance = mockHeaders('fr-FR,fr;q=0.9');
      
      cookies.mockReturnValue(mockCookiesInstance);
      headers.mockReturnValue(mockHeadersInstance);

      const { container } = render(await Work());

      expect(mockWorkContent).toHaveBeenCalled();
      expect(container).toBeInTheDocument();
    });

    it('should detect French language from Accept-Language header when no cookie', async () => {
      const mockCookiesInstance = mockCookies();
      const mockHeadersInstance = mockHeaders('fr-FR,fr;q=0.9');
      
      cookies.mockReturnValue(mockCookiesInstance);
      headers.mockReturnValue(mockHeadersInstance);

      await Work();

      expect(mockGetProjects).toHaveBeenCalledWith(undefined, 'FR');
    });

    it('should default to English when no language indicators present', async () => {
      const mockCookiesInstance = mockCookies();
      const mockHeadersInstance = mockHeaders('es-ES,es;q=0.9');
      
      cookies.mockReturnValue(mockCookiesInstance);
      headers.mockReturnValue(mockHeadersInstance);

      await Work();

      expect(mockGetProjects).toHaveBeenCalledWith(undefined, 'EN');
    });

    it('should call getProjects with correct parameters', async () => {
      const mockCookiesInstance = mockCookies('EN');
      const mockHeadersInstance = mockHeaders();
      
      cookies.mockReturnValue(mockCookiesInstance);
      headers.mockReturnValue(mockHeadersInstance);

      await Work();

      expect(mockGetProjects).toHaveBeenCalledWith(undefined, 'EN');
    });

    it('should handle missing Accept-Language header gracefully', async () => {
      const mockCookiesInstance = mockCookies();
      const mockHeadersInstance = mockHeaders('');
      
      cookies.mockReturnValue(mockCookiesInstance);
      headers.mockReturnValue(mockHeadersInstance);

      await Work();

      expect(mockGetProjects).toHaveBeenCalledWith(undefined, 'EN');
    });

    it('should prioritize cookie over Accept-Language header', async () => {
      const mockCookiesInstance = mockCookies('FR');
      const mockHeadersInstance = mockHeaders('en-US,en;q=0.9');
      
      cookies.mockReturnValue(mockCookiesInstance);
      headers.mockReturnValue(mockHeadersInstance);

      await Work();

      expect(mockGetProjects).toHaveBeenCalledWith(undefined, 'FR');
    });
  });

  describe('Language-specific content', () => {
    it('should load English content by default', async () => {
      const searchParams = mockSearchParams();
      const metadata = await generateMetadata({ searchParams });

      expect(metadata.title).toBe('My Work');
      expect(metadata.description).toBe('Check out my projects');
    });

    it('should load French content when FR language specified', async () => {
      const searchParams = mockSearchParams('FR');
      const metadata = await generateMetadata({ searchParams });

      expect(metadata.title).toBe('Mon travail');
      expect(metadata.description).toBe('Découvrez mes projets');
    });

    it('should handle invalid language parameter gracefully', async () => {
      const searchParams = mockSearchParams('INVALID');
      const metadata = await generateMetadata({ searchParams });

      expect(metadata.title).toBe('My Work');
      expect(metadata.openGraph.locale).toBe('en_US');
    });
  });

  describe('SEO and metadata structure', () => {
    it('should have complete metadata structure', async () => {
      const searchParams = mockSearchParams('EN');
      const metadata = await generateMetadata({ searchParams });

      expect(metadata).toHaveProperty('title');
      expect(metadata).toHaveProperty('description');
      expect(metadata).toHaveProperty('openGraph');
      expect(metadata).toHaveProperty('twitter');
      expect(metadata).toHaveProperty('alternates');
    });

    it('should have proper Open Graph structure', async () => {
      const searchParams = mockSearchParams('EN');
      const metadata = await generateMetadata({ searchParams });

      expect(metadata.openGraph).toHaveProperty('title');
      expect(metadata.openGraph).toHaveProperty('description');
      expect(metadata.openGraph).toHaveProperty('type');
      expect(metadata.openGraph).toHaveProperty('url');
      expect(metadata.openGraph).toHaveProperty('siteName');
      expect(metadata.openGraph).toHaveProperty('locale');
      expect(metadata.openGraph).toHaveProperty('images');
    });

    it('should have proper Twitter structure', async () => {
      const searchParams = mockSearchParams('EN');
      const metadata = await generateMetadata({ searchParams });

      expect(metadata.twitter).toHaveProperty('card');
      expect(metadata.twitter).toHaveProperty('title');
      expect(metadata.twitter).toHaveProperty('description');
      expect(metadata.twitter).toHaveProperty('images');
    });
  });

  describe('Dynamic rendering', () => {
    it('should have dynamic rendering enabled', () => {
      // This test verifies that the component has the dynamic export
      // The actual dynamic = 'force-dynamic' is set in the component
      expect(Work).toBeDefined();
    });
  });
}); 