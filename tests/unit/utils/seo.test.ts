import { generateLanguageMetadata } from '@/app/utils/seo'
import type { Language } from '@/atoms/language'

// Mock the content imports
jest.mock('@/app/resources/content', () => ({
  person: { name: 'Alexy Roman' },
  home: { 
    title: 'Home Page', 
    description: 'Welcome to my portfolio',
    image: '/images/home.jpg'
  },
  about: { 
    title: 'About Me', 
    description: 'Learn more about me'
  },
  work: { 
    title: 'My Work', 
    description: 'Check out my projects'
  },
  blog: { 
    title: 'Blog', 
    description: 'Read my latest posts'
  }
}))

jest.mock('@/app/resources/content.fr', () => ({
  person: { name: 'Alexy Roman' },
  home: { 
    title: 'Page d\'Accueil', 
    description: 'Bienvenue sur mon portfolio',
    image: '/images/home.jpg'
  },
  about: { 
    title: 'À Propos', 
    description: 'En savoir plus sur moi'
  },
  work: { 
    title: 'Mon Travail', 
    description: 'Découvrez mes projets'
  },
  blog: { 
    title: 'Blog', 
    description: 'Lisez mes derniers articles'
  }
}))

// Mock environment variables
const originalEnv = process.env

describe('seo utils', () => {
  beforeEach(() => {
    jest.resetModules()
    process.env = { ...originalEnv }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  describe('generateLanguageMetadata', () => {
    it('should generate metadata for home page in English', async () => {
      const result = await generateLanguageMetadata('EN', '/', 'https://example.com')
      
      expect(result.title).toBe('Home Page')
      expect(result.description).toBe('Welcome to my portfolio')
      expect(result.openGraph?.title).toBe('Home Page')
      expect(result.openGraph?.url).toBe('https://example.com/?lang=EN')
      expect(result.openGraph?.locale).toBe('en_US')
      expect((result.twitter as any)?.card).toBe('summary_large_image')
      expect(result.alternates?.languages?.en).toBe('https://example.com/?lang=EN')
      expect(result.alternates?.languages?.fr).toBe('https://example.com/?lang=FR')
      expect(result.alternates?.languages?.['x-default']).toBe('https://example.com/?lang=EN')
    })

    it('should generate metadata for home page in French', async () => {
      const result = await generateLanguageMetadata('FR', '/', 'https://example.com')
      
      expect(result.title).toBe('Page d\'Accueil')
      expect(result.description).toBe('Bienvenue sur mon portfolio')
      expect(result.openGraph?.title).toBe('Page d\'Accueil')
      expect(result.openGraph?.url).toBe('https://example.com/?lang=FR')
      expect(result.openGraph?.locale).toBe('fr_FR')
    })

    it('should generate metadata for about page in English', async () => {
      const result = await generateLanguageMetadata('EN', '/about', 'https://example.com')
      
      expect(result.title).toBe('About Me')
      expect(result.description).toBe('Learn more about me')
      expect(result.openGraph?.url).toBe('https://example.com/about?lang=EN')
    })

    it('should generate metadata for about page in French', async () => {
      const result = await generateLanguageMetadata('FR', '/about', 'https://example.com')
      
      expect(result.title).toBe('À Propos')
      expect(result.description).toBe('En savoir plus sur moi')
      expect(result.openGraph?.url).toBe('https://example.com/about?lang=FR')
    })

    it('should generate metadata for work page in English', async () => {
      const result = await generateLanguageMetadata('EN', '/work', 'https://example.com')
      
      expect(result.title).toBe('My Work')
      expect(result.description).toBe('Check out my projects')
      expect(result.openGraph?.url).toBe('https://example.com/work?lang=EN')
    })

    it('should generate metadata for work page in French', async () => {
      const result = await generateLanguageMetadata('FR', '/work', 'https://example.com')
      
      expect(result.title).toBe('Mon Travail')
      expect(result.description).toBe('Découvrez mes projets')
      expect(result.openGraph?.url).toBe('https://example.com/work?lang=FR')
    })

    it('should generate metadata for blog page in English', async () => {
      const result = await generateLanguageMetadata('EN', '/blog', 'https://example.com')
      
      expect(result.title).toBe('Blog')
      expect(result.description).toBe('Read my latest posts')
      expect(result.openGraph?.url).toBe('https://example.com/blog?lang=EN')
    })

    it('should generate metadata for blog page in French', async () => {
      const result = await generateLanguageMetadata('FR', '/blog', 'https://example.com')
      
      expect(result.title).toBe('Blog')
      expect(result.description).toBe('Lisez mes derniers articles')
      expect(result.openGraph?.url).toBe('https://example.com/blog?lang=FR')
    })

    it('should default to home page metadata for unknown paths', async () => {
      const result = await generateLanguageMetadata('EN', '/unknown', 'https://example.com')
      
      expect(result.title).toBe('Home Page')
      expect(result.description).toBe('Welcome to my portfolio')
    })

    it('should generate correct Open Graph metadata', async () => {
      const result = await generateLanguageMetadata('EN', '/', 'https://example.com')
      
      expect((result.openGraph as any)?.type).toBe('website')
      expect(result.openGraph?.siteName).toBe('Alexy Roman')
      expect((result.openGraph?.images as any[])?.length).toBe(1)
      expect((result.openGraph?.images as any[])[0]).toBe('https://example.com/images/home.jpg')
    })

    it('should generate correct Twitter Card metadata', async () => {
      const result = await generateLanguageMetadata('EN', '/', 'https://example.com')
      
      expect((result.twitter as any)?.card).toBe('summary_large_image')
      expect((result.twitter as any)?.title).toBe('Home Page')
      expect((result.twitter as any)?.description).toBe('Welcome to my portfolio')
      expect((result.twitter as any)?.images?.length).toBe(1)
      expect((result.twitter as any)?.images?.[0]).toBe('https://example.com/images/home.jpg')
    })

    it('should generate correct robots metadata', async () => {
      const result = await generateLanguageMetadata('EN', '/', 'https://example.com')
      
      expect((result.robots as any)?.index).toBe(true)
      expect((result.robots as any)?.follow).toBe(true)
      expect((result.robots as any)?.googleBot?.index).toBe(true)
      expect((result.robots as any)?.googleBot?.follow).toBe(true)
      expect((result.robots as any)?.googleBot?.['max-video-preview']).toBe(-1)
      expect((result.robots as any)?.googleBot?.['max-image-preview']).toBe('large')
      expect((result.robots as any)?.googleBot?.['max-snippet']).toBe(-1)
    })

    it('should generate correct alternate language URLs', async () => {
      const result = await generateLanguageMetadata('EN', '/about', 'https://example.com')
      
      expect(result.alternates?.languages?.en).toBe('https://example.com/about?lang=EN')
      expect(result.alternates?.languages?.fr).toBe('https://example.com/about?lang=FR')
      expect(result.alternates?.languages?.['x-default']).toBe('https://example.com/about?lang=EN')
    })

    it('should use OG image when page has no specific image', async () => {
      const result = await generateLanguageMetadata('EN', '/about', 'https://example.com')
      
      expect(((result.openGraph?.images as any[])?.[0])).toContain('/og?title=')
      expect(((result.twitter as any)?.images?.[0])).toContain('/og?title=')
    })

    it('should use page image when available', async () => {
      const result = await generateLanguageMetadata('EN', '/', 'https://example.com')
      
      expect(((result.openGraph?.images as any[])?.[0])).toBe('https://example.com/images/home.jpg')
      expect(((result.twitter as any)?.images?.[0])).toBe('https://example.com/images/home.jpg')
    })

    it('should include Google site verification when environment variable is set', async () => {
      process.env.GOOGLE_SITE_VERIFICATION = 'test-verification-code'
      const result = await generateLanguageMetadata('EN', '/', 'https://example.com')
      
      expect(result.other?.['google-site-verification']).toBe('test-verification-code')
    })

    it('should not include Google site verification when environment variable is not set', async () => {
      delete process.env.GOOGLE_SITE_VERIFICATION
      const result = await generateLanguageMetadata('EN', '/', 'https://example.com')
      
      expect(result.other).toBeUndefined()
    })

    it('should handle URL encoding for special characters in titles', async () => {
      const result = await generateLanguageMetadata('EN', '/about', 'https://example.com')
      
      // Check that the OG image URL properly encodes the title
      expect(((result.openGraph?.images as any[])?.[0])).toContain('About%20Me')
    })
  })
}) 