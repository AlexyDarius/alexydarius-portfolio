import robots from '@/app/robots';

jest.mock('@/app/resources', () => ({
  baseURL: 'https://example.com',
}));

describe('Robots.txt (8.3)', () => {
  it('should return correct robots.txt rules and sitemap', () => {
    const result = robots();
    expect(result).toHaveProperty('rules');
    expect(result.rules).toEqual([
      { userAgent: '*' },
    ]);
    expect(result).toHaveProperty('sitemap', 'https://example.com/sitemap.xml');
  });
}); 