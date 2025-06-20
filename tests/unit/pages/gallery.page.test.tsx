import React from 'react';
import { render, screen } from '@testing-library/react';
import type { Language } from '@/atoms/language';

// Import test utilities first
import { 
  mockSearchParams, 
  mockMasonryGrid,
  testMetadataGeneration
} from './__mocks__/testUtils';

// Mock content imports
jest.mock('@/app/resources/content', () => ({
  gallery: {
    title: 'Gallery',
    description: 'View my work',
    path: '/gallery',
  },
  person: {
    name: 'Alexy Darius',
    avatar: '/images/avatar.webp',
  },
}));

jest.mock('@/app/resources/content.fr', () => ({
  gallery: {
    title: 'Galerie',
    description: 'Voir mon travail',
    path: '/gallery',
  },
  person: {
    name: 'Alexy Darius',
    avatar: '/images/avatar.webp',
  },
}));

// Mock MasonryGrid component
jest.mock('@/components/gallery/MasonryGrid', () => ({
  __esModule: true,
  default: mockMasonryGrid,
}));

// Mock once-ui components
jest.mock('@/once-ui/components', () => ({
  Flex: ({ children, ...props }: any) => <div data-testid="flex" {...props}>{children}</div>,
}));

// Mock once-ui modules
jest.mock('@/once-ui/modules', () => ({
  Meta: {
    generate: jest.fn(),
  },
  Schema: ({ children, ...props }: any) => <div data-testid="schema" {...props}>{children}</div>,
}));

// Mock baseURL
jest.mock('@/app/resources', () => ({
  baseURL: 'https://example.com',
}));

// Import the component after all mocks are set up
import Gallery, { generateMetadata } from '@/app/gallery/page';

describe('Gallery component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockMasonryGrid.mockReturnValue(<div data-testid="masonry-grid">Masonry Grid</div>);
  });

  it('should render MasonryGrid component', async () => {
    const { container } = render(await Gallery());
    expect(mockMasonryGrid).toHaveBeenCalled();
    expect(container).toBeInTheDocument();
    expect(screen.getByTestId('masonry-grid')).toBeInTheDocument();
  });
}); 