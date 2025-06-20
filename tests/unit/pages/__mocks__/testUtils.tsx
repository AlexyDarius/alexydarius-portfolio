import React from 'react';
import { render } from '@testing-library/react';
import type { Language } from '@/atoms/language';

// Mock Next.js server components
export const mockCookies = (language?: Language) => {
  return {
    get: jest.fn().mockReturnValue(language ? { value: language } : undefined),
  };
};

export const mockHeaders = (acceptLanguage?: string) => {
  return {
    get: jest.fn().mockReturnValue(acceptLanguage || 'en-US,en;q=0.9'),
  };
};

export const mockSearchParams = (lang?: string) => {
  return Promise.resolve({ lang });
};

// Mock content imports
export const mockContent = {
  home: {
    title: 'Home Page',
    description: 'Welcome to my portfolio',
    image: '/images/home.webp',
  },
  about: {
    title: 'About Me',
    description: 'Learn more about me',
    path: '/about',
  },
  work: {
    title: 'My Work',
    description: 'Check out my projects',
    path: '/work',
  },
  blog: {
    title: 'Blog',
    description: 'Read my latest posts',
    path: '/blog',
  },
  gallery: {
    title: 'Gallery',
    description: 'View my work',
    path: '/gallery',
  },
  person: {
    name: 'Alexy Darius',
    avatar: '/images/avatar.webp',
  },
};

export const mockContentFr = {
  home: {
    title: 'Page d\'accueil',
    description: 'Bienvenue sur mon portfolio',
    image: '/images/home.webp',
  },
  about: {
    title: 'À propos',
    description: 'En savoir plus sur moi',
    path: '/about',
  },
  work: {
    title: 'Mon travail',
    description: 'Découvrez mes projets',
    path: '/work',
  },
  blog: {
    title: 'Blog',
    description: 'Lisez mes derniers articles',
    path: '/blog',
  },
  gallery: {
    title: 'Galerie',
    description: 'Voir mon travail',
    path: '/gallery',
  },
  person: {
    name: 'Alexy Darius',
    avatar: '/images/avatar.webp',
  },
};

// Mock utility functions
export const mockGetProjects = jest.fn();
export const mockGetStarredProjects = jest.fn();
export const mockGetBlogPosts = jest.fn();
export const mockGetProjectInBothLanguages = jest.fn();
export const mockGetBlogPostInBothLanguages = jest.fn();

// Mock components
export const mockHomeContent = jest.fn();
export const mockAboutContent = jest.fn();
export const mockWorkContent = jest.fn();
export const mockBlogPageHeader = jest.fn();
export const mockBlogPostsGridClient = jest.fn();
export const mockMasonryGrid = jest.fn();
export const mockMailchimp = jest.fn();

// Test data
export const mockProjects = [
  {
    slug: 'project-1',
    title: 'Project 1',
    description: 'Description 1',
    publishedAt: '2024-01-01',
    tags: ['react', 'typescript'],
    image: '/images/project1.webp',
  },
  {
    slug: 'project-2',
    title: 'Project 2',
    description: 'Description 2',
    publishedAt: '2024-02-01',
    tags: ['nextjs', 'tailwind'],
    image: '/images/project2.webp',
  },
];

export const mockBlogPosts = [
  {
    slug: 'post-1',
    title: 'Blog Post 1',
    description: 'Description 1',
    publishedAt: '2024-01-01',
    tags: ['react', 'typescript'],
    image: '/images/post1.webp',
  },
  {
    slug: 'post-2',
    title: 'Blog Post 2',
    description: 'Description 2',
    publishedAt: '2024-02-01',
    tags: ['nextjs', 'tailwind'],
    image: '/images/post2.webp',
  },
];

// Custom render function for server components
export const renderServerComponent = (Component: React.ComponentType<any>, props: any = {}) => {
  return render(<Component {...props} />);
};

// Helper to test metadata generation
export const testMetadataGeneration = async (
  generateMetadata: Function,
  searchParams: any,
  expectedLanguage: Language
) => {
  const metadata = await generateMetadata({ searchParams });
  
  expect(metadata).toBeDefined();
  expect(metadata.title).toBeDefined();
  expect(metadata.description).toBeDefined();
  expect(metadata.openGraph).toBeDefined();
  expect(metadata.twitter).toBeDefined();
  expect(metadata.alternates).toBeDefined();
  
  // Test language-specific alternates
  expect(metadata.alternates.languages.en).toContain('lang=EN');
  expect(metadata.alternates.languages.fr).toContain('lang=FR');
  expect(metadata.alternates.languages['x-default']).toContain('lang=EN');
  
  return metadata;
}; 