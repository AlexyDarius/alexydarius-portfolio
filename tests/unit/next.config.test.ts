let config: any;

beforeAll(async () => {
  config = (await import('../../next.config.mjs')).default;
});

describe('Next.js Configuration (8.1)', () => {
  it('should export an object', () => {
    expect(typeof config).toBe('object');
    expect(config).not.toBeNull();
  });

  it('should have expected keys', () => {
    expect(config).toHaveProperty('pageExtensions');
    expect(config).toHaveProperty('transpilePackages');
    expect(config).toHaveProperty('sassOptions');
    expect(config).toHaveProperty('images');
  });
}); 