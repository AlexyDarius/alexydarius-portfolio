import sitemap from '@/app/sitemap';

jest.mock('@/app/utils/utils', () => ({
  getPosts: jest.fn(),
}));

jest.mock('@/app/resources', () => ({
  baseURL: 'https://example.com',
  routes: {
    '/': true,
    '/about': true,
    '/work': true,
    '/privacy-policy': true,
    '/legal-notice': true,
    '/cookie-policy': true,
    '/blog': true,
    '/gallery': false,
  },
}));

describe('Sitemap (8.2)', () => {
  const { getPosts } = require('@/app/utils/utils');

  beforeEach(() => {
    jest.clearAllMocks();
    getPosts.mockImplementation((customPath: string[]) => {
      if (customPath.includes('blog')) {
        return [
          { slug: 'post-1', metadata: { publishedAt: '2024-01-01' } },
        ];
      }
      if (customPath.includes('work')) {
        return [
          { slug: 'project-1', metadata: { publishedAt: '2024-02-01' } },
        ];
      }
      return [];
    });
  });

  it('should generate correct sitemap entries for EN/FR, blog, work, and French aliases', async () => {
    const result = await sitemap();
    // Blog URLs
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ url: 'https://example.com/blog/post-1?lang=EN', lastModified: '2024-01-01' }),
        expect.objectContaining({ url: 'https://example.com/blog/post-1?lang=FR', lastModified: '2024-01-01' }),
      ])
    );
    // Work URLs
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ url: 'https://example.com/work/project-1?lang=EN', lastModified: '2024-02-01' }),
        expect.objectContaining({ url: 'https://example.com/work/project-1?lang=FR', lastModified: '2024-02-01' }),
      ])
    );
    // Main page URLs
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ url: expect.stringContaining('https://example.com/about?lang=EN') }),
        expect.objectContaining({ url: expect.stringContaining('https://example.com/about?lang=FR') }),
      ])
    );
    // French aliases
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ url: 'https://example.com/fr' }),
        expect.objectContaining({ url: 'https://example.com/fr/about' }),
        expect.objectContaining({ url: 'https://example.com/fr/work' }),
        expect.objectContaining({ url: 'https://example.com/fr/blog' }),
        expect.objectContaining({ url: 'https://example.com/fr/gallery' }),
        expect.objectContaining({ url: 'https://example.com/fr/cookie-policy' }),
        expect.objectContaining({ url: 'https://example.com/fr/legal-notice' }),
        expect.objectContaining({ url: 'https://example.com/fr/privacy-policy' }),
      ])
    );
  });
}); 