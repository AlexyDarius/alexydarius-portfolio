import { NextRequest, NextResponse } from 'next/server'
import { middleware } from '@/app/middleware'

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    next: jest.fn(() => ({
      headers: {
        set: jest.fn()
      }
    })),
    redirect: jest.fn((url) => ({
      url,
      status: 302
    }))
  }
}))

describe('middleware', () => {
  let mockNextResponse: any
  let mockHeaders: any

  beforeEach(() => {
    jest.clearAllMocks()
    mockHeaders = {
      set: jest.fn()
    }
    mockNextResponse = {
      headers: mockHeaders
    }
    ;(NextResponse.next as jest.Mock).mockReturnValue(mockNextResponse)
  })

  const createMockRequest = (overrides: any = {}) => {
    const mockSearchParams = {
      get: jest.fn(),
      set: jest.fn()
    }
    
    const mockUrl = {
      searchParams: mockSearchParams
    }
    
    const defaultRequest = {
      nextUrl: {
        pathname: '/',
        search: '',
        clone: jest.fn(() => mockUrl)
      },
      headers: {
        get: jest.fn()
      },
      cookies: {
        get: jest.fn()
      }
    }
    return { ...defaultRequest, ...overrides }
  }

  describe('Path exclusions', () => {
    it('should skip API routes', () => {
      const request = createMockRequest({
        nextUrl: { pathname: '/api/projects', search: '' }
      })
      
      const result = middleware(request as any)
      
      expect(NextResponse.next).toHaveBeenCalled()
      expect(NextResponse.redirect).not.toHaveBeenCalled()
    })

    it('should skip Next.js static files', () => {
      const request = createMockRequest({
        nextUrl: { pathname: '/_next/static/chunks/main.js', search: '' }
      })
      
      const result = middleware(request as any)
      
      expect(NextResponse.next).toHaveBeenCalled()
      expect(NextResponse.redirect).not.toHaveBeenCalled()
    })

    it('should skip files with extensions', () => {
      const request = createMockRequest({
        nextUrl: { pathname: '/image.jpg', search: '' }
      })
      
      const result = middleware(request as any)
      
      expect(NextResponse.next).toHaveBeenCalled()
      expect(NextResponse.redirect).not.toHaveBeenCalled()
    })

    it('should skip favicon', () => {
      const request = createMockRequest({
        nextUrl: { pathname: '/favicon.ico', search: '' }
      })
      
      const result = middleware(request as any)
      
      expect(NextResponse.next).toHaveBeenCalled()
      expect(NextResponse.redirect).not.toHaveBeenCalled()
    })

    it('should skip images directory', () => {
      const request = createMockRequest({
        nextUrl: { pathname: '/images/avatar.jpg', search: '' }
      })
      
      const result = middleware(request as any)
      
      expect(NextResponse.next).toHaveBeenCalled()
      expect(NextResponse.redirect).not.toHaveBeenCalled()
    })

    it('should skip trademark directory', () => {
      const request = createMockRequest({
        nextUrl: { pathname: '/trademark/logo.svg', search: '' }
      })
      
      const result = middleware(request as any)
      
      expect(NextResponse.next).toHaveBeenCalled()
      expect(NextResponse.redirect).not.toHaveBeenCalled()
    })
  })

  describe('Bot detection and handling', () => {
    it('should detect Googlebot and set language header', () => {
      const request = createMockRequest({
        headers: {
          get: jest.fn((key) => {
            if (key === 'user-agent') return 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
            return null
          })
        }
      })
      
      const result = middleware(request as any)
      
      expect(NextResponse.next).toHaveBeenCalled()
      expect(mockHeaders.set).toHaveBeenCalledWith('x-language', 'EN')
    })

    it('should detect Bingbot and set language header', () => {
      const request = createMockRequest({
        headers: {
          get: jest.fn((key) => {
            if (key === 'user-agent') return 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)'
            return null
          })
        }
      })
      
      const result = middleware(request as any)
      
      expect(NextResponse.next).toHaveBeenCalled()
      expect(mockHeaders.set).toHaveBeenCalledWith('x-language', 'EN')
    })

    it('should detect Facebook crawler and set language header', () => {
      const request = createMockRequest({
        headers: {
          get: jest.fn((key) => {
            if (key === 'user-agent') return 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)'
            return null
          })
        }
      })
      
      const result = middleware(request as any)
      
      expect(NextResponse.next).toHaveBeenCalled()
      expect(mockHeaders.set).toHaveBeenCalledWith('x-language', 'EN')
    })

    it('should not redirect bots', () => {
      const request = createMockRequest({
        headers: {
          get: jest.fn((key) => {
            if (key === 'user-agent') return 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
            return null
          })
        }
      })
      
      const result = middleware(request as any)
      
      expect(NextResponse.redirect).not.toHaveBeenCalled()
    })
  })

  describe('Language detection from URL path', () => {
    it('should detect French from path ending with -fr and redirect with lang parameter', () => {
      const mockUrl = {
        searchParams: {
          get: jest.fn(() => null),
          set: jest.fn()
        }
      }
      const request = createMockRequest({
        nextUrl: { 
          pathname: '/about-fr', 
          search: '',
          clone: jest.fn(() => mockUrl)
        }
      })
      
      const result = middleware(request as any)
      
      expect(NextResponse.redirect).toHaveBeenCalledWith(mockUrl)
      expect(mockUrl.searchParams.set).toHaveBeenCalledWith('lang', 'FR')
    })

    it('should detect French from path containing -fr/ and redirect with lang parameter', () => {
      const mockUrl = {
        searchParams: {
          get: jest.fn(() => null),
          set: jest.fn()
        }
      }
      const request = createMockRequest({
        nextUrl: { 
          pathname: '/work-fr/project', 
          search: '',
          clone: jest.fn(() => mockUrl)
        }
      })
      
      const result = middleware(request as any)
      
      expect(NextResponse.redirect).toHaveBeenCalledWith(mockUrl)
      expect(mockUrl.searchParams.set).toHaveBeenCalledWith('lang', 'FR')
    })
  })

  describe('Language detection from query parameters', () => {
    it('should detect French from lang=fr and redirect with lang parameter', () => {
      const mockUrl = {
        searchParams: {
          get: jest.fn(() => 'fr'),
          set: jest.fn()
        }
      }
      const request = createMockRequest({
        nextUrl: { 
          pathname: '/about', 
          search: '?lang=fr',
          clone: jest.fn(() => mockUrl)
        }
      })
      
      const result = middleware(request as any)
      
      expect(NextResponse.redirect).toHaveBeenCalledWith(mockUrl)
      expect(mockUrl.searchParams.set).toHaveBeenCalledWith('lang', 'FR')
    })

    it('should detect French from lang=FR and set language header', () => {
      const mockUrl = {
        searchParams: {
          get: jest.fn(() => 'FR'),
          set: jest.fn()
        }
      }
      const request = createMockRequest({
        nextUrl: { 
          pathname: '/about', 
          search: '?lang=FR',
          clone: jest.fn(() => mockUrl)
        }
      })
      
      const result = middleware(request as any)
      
      expect(mockHeaders.set).toHaveBeenCalledWith('x-language', 'FR')
    })
  })

  describe('Language detection from cookies', () => {
    it('should detect French from language cookie and redirect with lang parameter', () => {
      const mockUrl = {
        searchParams: {
          get: jest.fn(() => null),
          set: jest.fn()
        }
      }
      const request = createMockRequest({
        nextUrl: {
          pathname: '/about',
          search: '',
          clone: jest.fn(() => mockUrl)
        },
        cookies: {
          get: jest.fn((name) => {
            if (name === 'language') return { value: 'FR' }
            return null
          })
        }
      })
      
      const result = middleware(request as any)
      
      expect(NextResponse.redirect).toHaveBeenCalledWith(mockUrl)
      expect(mockUrl.searchParams.set).toHaveBeenCalledWith('lang', 'FR')
    })

    it('should fallback to Accept-Language when cookie is not French and redirect', () => {
      const mockUrl = {
        searchParams: {
          get: jest.fn(() => null),
          set: jest.fn()
        }
      }
      const request = createMockRequest({
        nextUrl: {
          pathname: '/about',
          search: '',
          clone: jest.fn(() => mockUrl)
        },
        cookies: {
          get: jest.fn((name) => {
            if (name === 'language') return { value: 'EN' }
            return null
          })
        },
        headers: {
          get: jest.fn((key) => {
            if (key === 'accept-language') return 'fr-FR,fr;q=0.9,en;q=0.8'
            return null
          })
        }
      })
      
      const result = middleware(request as any)
      
      expect(NextResponse.redirect).toHaveBeenCalledWith(mockUrl)
      expect(mockUrl.searchParams.set).toHaveBeenCalledWith('lang', 'FR')
    })
  })

  describe('Language detection from Accept-Language header', () => {
    it('should detect French from Accept-Language header and redirect', () => {
      const mockUrl = {
        searchParams: {
          get: jest.fn(() => null),
          set: jest.fn()
        }
      }
      const request = createMockRequest({
        nextUrl: {
          pathname: '/about',
          search: '',
          clone: jest.fn(() => mockUrl)
        },
        headers: {
          get: jest.fn((key) => {
            if (key === 'accept-language') return 'fr-FR,fr;q=0.9,en;q=0.8'
            return null
          })
        }
      })
      
      const result = middleware(request as any)
      
      expect(NextResponse.redirect).toHaveBeenCalledWith(mockUrl)
      expect(mockUrl.searchParams.set).toHaveBeenCalledWith('lang', 'FR')
    })

    it('should detect French from lowercase Accept-Language and redirect', () => {
      const mockUrl = {
        searchParams: {
          get: jest.fn(() => null),
          set: jest.fn()
        }
      }
      const request = createMockRequest({
        nextUrl: {
          pathname: '/about',
          search: '',
          clone: jest.fn(() => mockUrl)
        },
        headers: {
          get: jest.fn((key) => {
            if (key === 'accept-language') return 'fr-ca,fr;q=0.9'
            return null
          })
        }
      })
      
      const result = middleware(request as any)
      
      expect(NextResponse.redirect).toHaveBeenCalledWith(mockUrl)
      expect(mockUrl.searchParams.set).toHaveBeenCalledWith('lang', 'FR')
    })

    it('should default to English for non-French Accept-Language and redirect', () => {
      const mockUrl = {
        searchParams: {
          get: jest.fn(() => null),
          set: jest.fn()
        }
      }
      const request = createMockRequest({
        nextUrl: {
          pathname: '/about',
          search: '',
          clone: jest.fn(() => mockUrl)
        },
        headers: {
          get: jest.fn((key) => {
            if (key === 'accept-language') return 'en-US,en;q=0.9,es;q=0.8'
            return null
          })
        }
      })
      
      const result = middleware(request as any)
      
      expect(NextResponse.redirect).toHaveBeenCalledWith(mockUrl)
      expect(mockUrl.searchParams.set).toHaveBeenCalledWith('lang', 'EN')
    })
  })

  describe('URL parameter management', () => {
    it('should redirect when no language parameter is present', () => {
      const mockUrl = {
        searchParams: {
          get: jest.fn(() => null),
          set: jest.fn()
        }
      }
      const request = createMockRequest({
        nextUrl: {
          pathname: '/about',
          search: '',
          clone: jest.fn(() => mockUrl)
        }
      })
      
      const result = middleware(request as any)
      
      expect(NextResponse.redirect).toHaveBeenCalledWith(mockUrl)
      expect(mockUrl.searchParams.set).toHaveBeenCalledWith('lang', 'EN')
    })

    it('should redirect when invalid language parameter is present', () => {
      const mockUrl = {
        searchParams: {
          get: jest.fn(() => 'ES'),
          set: jest.fn()
        }
      }
      const request = createMockRequest({
        nextUrl: {
          pathname: '/about',
          search: '?lang=ES',
          clone: jest.fn(() => mockUrl)
        }
      })
      
      const result = middleware(request as any)
      
      expect(NextResponse.redirect).toHaveBeenCalledWith(mockUrl)
      expect(mockUrl.searchParams.set).toHaveBeenCalledWith('lang', 'EN')
    })

    it('should not redirect when valid EN language parameter is present', () => {
      const mockUrl = {
        searchParams: {
          get: jest.fn(() => 'EN'),
          set: jest.fn()
        }
      }
      const request = createMockRequest({
        nextUrl: {
          pathname: '/about',
          search: '?lang=EN',
          clone: jest.fn(() => mockUrl)
        }
      })
      
      const result = middleware(request as any)
      
      expect(NextResponse.redirect).not.toHaveBeenCalled()
      expect(mockHeaders.set).toHaveBeenCalledWith('x-language', 'EN')
    })

    it('should not redirect when valid FR language parameter is present', () => {
      const mockUrl = {
        searchParams: {
          get: jest.fn(() => 'FR'),
          set: jest.fn()
        }
      }
      const request = createMockRequest({
        nextUrl: {
          pathname: '/about',
          search: '?lang=FR',
          clone: jest.fn(() => mockUrl)
        }
      })
      
      const result = middleware(request as any)
      
      expect(NextResponse.redirect).not.toHaveBeenCalled()
      expect(mockHeaders.set).toHaveBeenCalledWith('x-language', 'FR')
    })
  })

  describe('Language priority order', () => {
    it('should prioritize URL path over query parameters and set language header from query param if valid', () => {
      const mockUrl = {
        searchParams: {
          get: jest.fn(() => 'EN'),
          set: jest.fn()
        }
      }
      const request = createMockRequest({
        nextUrl: { 
          pathname: '/about-fr', 
          search: '?lang=EN',
          clone: jest.fn(() => mockUrl)
        }
      })
      
      const result = middleware(request as any)
      
      expect(NextResponse.redirect).not.toHaveBeenCalled()
      expect(mockHeaders.set).toHaveBeenCalledWith('x-language', 'EN')
    })

    it('should prioritize query parameters over cookies', () => {
      const mockUrl = {
        searchParams: {
          get: jest.fn(() => 'FR'),
          set: jest.fn()
        }
      }
      const request = createMockRequest({
        nextUrl: { 
          pathname: '/about', 
          search: '?lang=FR',
          clone: jest.fn(() => mockUrl)
        },
        cookies: {
          get: jest.fn((name) => {
            if (name === 'language') return { value: 'EN' }
            return null
          })
        }
      })
      
      const result = middleware(request as any)
      
      expect(mockHeaders.set).toHaveBeenCalledWith('x-language', 'FR')
    })

    it('should prioritize cookies over Accept-Language header', () => {
      const mockUrl = {
        searchParams: {
          get: jest.fn(() => null),
          set: jest.fn()
        }
      }
      const request = createMockRequest({
        nextUrl: {
          pathname: '/about',
          search: '',
          clone: jest.fn(() => mockUrl)
        },
        cookies: {
          get: jest.fn((name) => {
            if (name === 'language') return { value: 'FR' }
            return null
          })
        },
        headers: {
          get: jest.fn((key) => {
            if (key === 'accept-language') return 'en-US,en;q=0.9'
            return null
          })
        }
      })
      
      const result = middleware(request as any)
      
      expect(NextResponse.redirect).toHaveBeenCalledWith(mockUrl)
      expect(mockUrl.searchParams.set).toHaveBeenCalledWith('lang', 'FR')
    })
  })

  describe('Edge cases', () => {
    it('should handle empty user agent', () => {
      const mockUrl = {
        searchParams: {
          get: jest.fn(() => null),
          set: jest.fn()
        }
      }
      const request = createMockRequest({
        nextUrl: {
          pathname: '/about',
          search: '',
          clone: jest.fn(() => mockUrl)
        },
        headers: {
          get: jest.fn((key) => {
            if (key === 'user-agent') return ''
            return null
          })
        }
      })
      
      const result = middleware(request as any)
      
      expect(NextResponse.redirect).toHaveBeenCalledWith(mockUrl)
      expect(mockUrl.searchParams.set).toHaveBeenCalledWith('lang', 'EN')
    })

    it('should handle missing Accept-Language header', () => {
      const mockUrl = {
        searchParams: {
          get: jest.fn(() => null),
          set: jest.fn()
        }
      }
      const request = createMockRequest({
        nextUrl: {
          pathname: '/about',
          search: '',
          clone: jest.fn(() => mockUrl)
        },
        headers: {
          get: jest.fn((key) => {
            if (key === 'accept-language') return null
            return null
          })
        }
      })
      
      const result = middleware(request as any)
      
      expect(NextResponse.redirect).toHaveBeenCalledWith(mockUrl)
      expect(mockUrl.searchParams.set).toHaveBeenCalledWith('lang', 'EN')
    })

    it('should handle malformed URLs', () => {
      const mockUrl = {
        searchParams: {
          get: jest.fn(() => null),
          set: jest.fn()
        }
      }
      const request = createMockRequest({
        nextUrl: { 
          pathname: '/about', 
          search: 'invalid',
          clone: jest.fn(() => mockUrl)
        }
      })
      
      const result = middleware(request as any)
      
      expect(NextResponse.redirect).toHaveBeenCalledWith(mockUrl)
      expect(mockUrl.searchParams.set).toHaveBeenCalledWith('lang', 'EN')
    })

    it('should handle missing cookies', () => {
      const mockUrl = {
        searchParams: {
          get: jest.fn(() => null),
          set: jest.fn()
        }
      }
      const request = createMockRequest({
        nextUrl: {
          pathname: '/about',
          search: '',
          clone: jest.fn(() => mockUrl)
        },
        cookies: {
          get: jest.fn(() => null)
        }
      })
      
      const result = middleware(request as any)
      
      expect(NextResponse.redirect).toHaveBeenCalledWith(mockUrl)
      expect(mockUrl.searchParams.set).toHaveBeenCalledWith('lang', 'EN')
    })
  })
}) 