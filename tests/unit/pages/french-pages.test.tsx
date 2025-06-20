import React from 'react';
import { render, screen } from '@testing-library/react';
import { redirect } from 'next/navigation';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

// Mock content imports
jest.mock('@/app/resources/content', () => ({
  home: {
    title: 'Home Page',
    description: 'Welcome to my portfolio',
    path: '/',
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
    path: '/',
  },
  person: {
    name: 'Alexy Darius',
    avatar: '/images/avatar.webp',
  },
}));

// Import the component after all mocks are set up
import FrenchHome from '@/app/fr/page';

describe('French Pages (6.6)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('French Home Page', () => {
    it('should redirect to home page with French language parameter', () => {
      FrenchHome();
      
      expect(redirect).toHaveBeenCalledWith('/?lang=FR');
    });

    it('should call redirect function', () => {
      FrenchHome();
      
      expect(redirect).toHaveBeenCalledTimes(1);
    });
  });
}); 