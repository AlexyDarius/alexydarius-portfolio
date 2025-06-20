import { generateLegalPageMetadata } from '@/app/utils/metadata'
import type { Language } from '@/atoms/language'

// Mock the content imports
jest.mock('@/app/resources/content', () => ({
  person: { name: 'Alexy Roman' },
  legal: {
    cookiePolicy: { title: 'Cookie Policy' },
    legalNotice: { title: 'Legal Notice' },
    privacyPolicy: { title: 'Privacy Policy' }
  }
}))

jest.mock('@/app/resources/content.fr', () => ({
  person: { name: 'Alexy Roman' },
  legal: {
    cookiePolicy: { title: 'Politique de Cookies' },
    legalNotice: { title: 'Mentions Légales' },
    privacyPolicy: { title: 'Politique de Confidentialité' }
  }
}))

jest.mock('@/app/resources', () => ({
  baseURL: 'https://example.com'
}))

describe('metadata utils', () => {
  describe('generateLegalPageMetadata', () => {
    it('should generate metadata for cookie policy in English', async () => {
      const searchParams = Promise.resolve({ lang: 'EN' })
      const result = await generateLegalPageMetadata('cookiePolicy', searchParams)
      
      expect(result.title).toBe('Cookie Policy')
      expect(result.description).toBe('Cookie Policy - Alexy Roman')
      expect(result.openGraph.title).toBe('Cookie Policy')
      expect(result.openGraph.url).toBe('https://example.com/cookie-policy?lang=EN')
      expect(result.openGraph.locale).toBe('en_US')
      expect(result.twitter.card).toBe('summary_large_image')
      expect(result.alternates.languages.en).toBe('https://example.com/cookie-policy?lang=EN')
      expect(result.alternates.languages.fr).toBe('https://example.com/cookie-policy?lang=FR')
      expect(result.alternates.languages['x-default']).toBe('https://example.com/cookie-policy?lang=EN')
    })

    it('should generate metadata for cookie policy in French', async () => {
      const searchParams = Promise.resolve({ lang: 'FR' })
      const result = await generateLegalPageMetadata('cookiePolicy', searchParams)
      
      expect(result.title).toBe('Politique de Cookies')
      expect(result.description).toBe('Politique de Cookies - Alexy Roman')
      expect(result.openGraph.title).toBe('Politique de Cookies')
      expect(result.openGraph.url).toBe('https://example.com/cookie-policy?lang=FR')
      expect(result.openGraph.locale).toBe('fr_FR')
      expect(result.twitter.card).toBe('summary_large_image')
    })

    it('should generate metadata for legal notice in English', async () => {
      const searchParams = Promise.resolve({ lang: 'EN' })
      const result = await generateLegalPageMetadata('legalNotice', searchParams)
      
      expect(result.title).toBe('Legal Notice')
      expect(result.description).toBe('Legal Notice - Alexy Roman')
      expect(result.openGraph.url).toBe('https://example.com/legal-notice?lang=EN')
    })

    it('should generate metadata for legal notice in French', async () => {
      const searchParams = Promise.resolve({ lang: 'FR' })
      const result = await generateLegalPageMetadata('legalNotice', searchParams)
      
      expect(result.title).toBe('Mentions Légales')
      expect(result.description).toBe('Mentions Légales - Alexy Roman')
      expect(result.openGraph.url).toBe('https://example.com/legal-notice?lang=FR')
    })

    it('should generate metadata for privacy policy in English', async () => {
      const searchParams = Promise.resolve({ lang: 'EN' })
      const result = await generateLegalPageMetadata('privacyPolicy', searchParams)
      
      expect(result.title).toBe('Privacy Policy')
      expect(result.description).toBe('Privacy Policy - Alexy Roman')
      expect(result.openGraph.url).toBe('https://example.com/privacy-policy?lang=EN')
    })

    it('should generate metadata for privacy policy in French', async () => {
      const searchParams = Promise.resolve({ lang: 'FR' })
      const result = await generateLegalPageMetadata('privacyPolicy', searchParams)
      
      expect(result.title).toBe('Politique de Confidentialité')
      expect(result.description).toBe('Politique de Confidentialité - Alexy Roman')
      expect(result.openGraph.url).toBe('https://example.com/privacy-policy?lang=FR')
    })

    it('should default to English when no language is specified', async () => {
      const searchParams = Promise.resolve({})
      const result = await generateLegalPageMetadata('cookiePolicy', searchParams)
      
      expect(result.title).toBe('Cookie Policy')
      expect(result.openGraph.locale).toBe('en_US')
    })

    it('should default to English when invalid language is specified', async () => {
      const searchParams = Promise.resolve({ lang: 'ES' })
      const result = await generateLegalPageMetadata('cookiePolicy', searchParams)
      
      expect(result.title).toBe('Cookie Policy')
      expect(result.openGraph.locale).toBe('en_US')
    })

    it('should generate correct Open Graph metadata', async () => {
      const searchParams = Promise.resolve({ lang: 'EN' })
      const result = await generateLegalPageMetadata('cookiePolicy', searchParams)
      
      expect(result.openGraph.type).toBe('website')
      expect(result.openGraph.siteName).toBe('Alexy Roman')
      expect(result.openGraph.images).toHaveLength(1)
      expect(result.openGraph.images[0].url).toContain('/og?title=')
      expect(result.openGraph.images[0].alt).toBe('Cookie Policy')
    })

    it('should generate correct Twitter Card metadata', async () => {
      const searchParams = Promise.resolve({ lang: 'EN' })
      const result = await generateLegalPageMetadata('cookiePolicy', searchParams)
      
      expect(result.twitter.card).toBe('summary_large_image')
      expect(result.twitter.title).toBe('Cookie Policy')
      expect(result.twitter.description).toBe('Cookie Policy - Alexy Roman')
      expect(result.twitter.images).toHaveLength(1)
      expect(result.twitter.images[0]).toContain('/og?title=')
    })

    it('should generate correct alternate language URLs', async () => {
      const searchParams = Promise.resolve({ lang: 'EN' })
      const result = await generateLegalPageMetadata('cookiePolicy', searchParams)
      
      expect(result.alternates.languages.en).toBe('https://example.com/cookie-policy?lang=EN')
      expect(result.alternates.languages.fr).toBe('https://example.com/cookie-policy?lang=FR')
      expect(result.alternates.languages['x-default']).toBe('https://example.com/cookie-policy?lang=EN')
    })

    it('should handle URL encoding for special characters in titles', async () => {
      const searchParams = Promise.resolve({ lang: 'EN' })
      const result = await generateLegalPageMetadata('cookiePolicy', searchParams)
      
      // Check that the OG image URL properly encodes the title
      expect(result.openGraph.images[0].url).toContain('Cookie%20Policy')
    })
  })
}) 