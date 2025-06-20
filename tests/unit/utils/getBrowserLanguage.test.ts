import { getBrowserLanguage } from '@/utils/getBrowserLanguage'
import type { Language } from '@/atoms/language'

describe('getBrowserLanguage', () => {
  // Store original navigator and window
  const originalNavigator = global.navigator
  const originalWindow = global.window

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks()
  })

  afterAll(() => {
    // Restore original objects
    global.navigator = originalNavigator
    global.window = originalWindow
  })

  describe('French language detection', () => {
    it('should return FR for fr-FR', () => {
      // Arrange
      Object.defineProperty(global, 'navigator', {
        value: {
          language: 'fr-FR',
        },
        writable: true,
      })

      // Act
      const result = getBrowserLanguage()

      // Assert
      expect(result).toBe('FR')
    })

    it('should return FR for fr-CA', () => {
      // Arrange
      Object.defineProperty(global, 'navigator', {
        value: {
          language: 'fr-CA',
        },
        writable: true,
      })

      // Act
      const result = getBrowserLanguage()

      // Assert
      expect(result).toBe('FR')
    })

    it('should return FR for fr-BE', () => {
      // Arrange
      Object.defineProperty(global, 'navigator', {
        value: {
          language: 'fr-BE',
        },
        writable: true,
      })

      // Act
      const result = getBrowserLanguage()

      // Assert
      expect(result).toBe('FR')
    })

    it('should return FR for fr-CH', () => {
      // Arrange
      Object.defineProperty(global, 'navigator', {
        value: {
          language: 'fr-CH',
        },
        writable: true,
      })

      // Act
      const result = getBrowserLanguage()

      // Assert
      expect(result).toBe('FR')
    })

    it('should return FR for fr-LU', () => {
      // Arrange
      Object.defineProperty(global, 'navigator', {
        value: {
          language: 'fr-LU',
        },
        writable: true,
      })

      // Act
      const result = getBrowserLanguage()

      // Assert
      expect(result).toBe('FR')
    })

    it('should return FR for lowercase fr-fr', () => {
      // Arrange
      Object.defineProperty(global, 'navigator', {
        value: {
          language: 'fr-fr',
        },
        writable: true,
      })

      // Act
      const result = getBrowserLanguage()

      // Assert
      expect(result).toBe('FR')
    })
  })

  describe('English language detection', () => {
    it('should return EN for en-US', () => {
      // Arrange
      Object.defineProperty(global, 'navigator', {
        value: {
          language: 'en-US',
        },
        writable: true,
      })

      // Act
      const result = getBrowserLanguage()

      // Assert
      expect(result).toBe('EN')
    })

    it('should return EN for en-GB', () => {
      // Arrange
      Object.defineProperty(global, 'navigator', {
        value: {
          language: 'en-GB',
        },
        writable: true,
      })

      // Act
      const result = getBrowserLanguage()

      // Assert
      expect(result).toBe('EN')
    })

    it('should return EN for en-CA', () => {
      // Arrange
      Object.defineProperty(global, 'navigator', {
        value: {
          language: 'en-CA',
        },
        writable: true,
      })

      // Act
      const result = getBrowserLanguage()

      // Assert
      expect(result).toBe('EN')
    })

    it('should return EN for en-AU', () => {
      // Arrange
      Object.defineProperty(global, 'navigator', {
        value: {
          language: 'en-AU',
        },
        writable: true,
      })

      // Act
      const result = getBrowserLanguage()

      // Assert
      expect(result).toBe('EN')
    })

    it('should return EN for lowercase en-us', () => {
      // Arrange
      Object.defineProperty(global, 'navigator', {
        value: {
          language: 'en-us',
        },
        writable: true,
      })

      // Act
      const result = getBrowserLanguage()

      // Assert
      expect(result).toBe('EN')
    })
  })

  describe('Fallback to English for unsupported languages', () => {
    it('should return EN for es-ES (Spanish)', () => {
      // Arrange
      Object.defineProperty(global, 'navigator', {
        value: {
          language: 'es-ES',
        },
        writable: true,
      })

      // Act
      const result = getBrowserLanguage()

      // Assert
      expect(result).toBe('EN')
    })

    it('should return EN for de-DE (German)', () => {
      // Arrange
      Object.defineProperty(global, 'navigator', {
        value: {
          language: 'de-DE',
        },
        writable: true,
      })

      // Act
      const result = getBrowserLanguage()

      // Assert
      expect(result).toBe('EN')
    })

    it('should return EN for it-IT (Italian)', () => {
      // Arrange
      Object.defineProperty(global, 'navigator', {
        value: {
          language: 'it-IT',
        },
        writable: true,
      })

      // Act
      const result = getBrowserLanguage()

      // Assert
      expect(result).toBe('EN')
    })

    it('should return EN for pt-BR (Portuguese)', () => {
      // Arrange
      Object.defineProperty(global, 'navigator', {
        value: {
          language: 'pt-BR',
        },
        writable: true,
      })

      // Act
      const result = getBrowserLanguage()

      // Assert
      expect(result).toBe('EN')
    })

    it('should return EN for ja-JP (Japanese)', () => {
      // Arrange
      Object.defineProperty(global, 'navigator', {
        value: {
          language: 'ja-JP',
        },
        writable: true,
      })

      // Act
      const result = getBrowserLanguage()

      // Assert
      expect(result).toBe('EN')
    })

    it('should return EN for zh-CN (Chinese)', () => {
      // Arrange
      Object.defineProperty(global, 'navigator', {
        value: {
          language: 'zh-CN',
        },
        writable: true,
      })

      // Act
      const result = getBrowserLanguage()

      // Assert
      expect(result).toBe('EN')
    })

    it('should return EN for ko-KR (Korean)', () => {
      // Arrange
      Object.defineProperty(global, 'navigator', {
        value: {
          language: 'ko-KR',
        },
        writable: true,
      })

      // Act
      const result = getBrowserLanguage()

      // Assert
      expect(result).toBe('EN')
    })
  })

  describe('Server-side rendering behavior', () => {
    it('should return EN when window is undefined (SSR)', () => {
      // Arrange
      const originalWindow = global.window
      delete (global as any).window

      // Act
      const result = getBrowserLanguage()

      // Assert
      expect(result).toBe('EN')

      // Cleanup
      global.window = originalWindow
    })

    it('should return EN when navigator is undefined', () => {
      // Arrange
      Object.defineProperty(global, 'navigator', {
        value: undefined,
        writable: true,
      })

      // Act
      const result = getBrowserLanguage()

      // Assert
      expect(result).toBe('EN')
    })
  })

  describe('Edge cases', () => {
    it('should return EN for empty navigator.language', () => {
      // Arrange
      Object.defineProperty(global, 'navigator', {
        value: {
          language: '',
        },
        writable: true,
      })

      // Act
      const result = getBrowserLanguage()

      // Assert
      expect(result).toBe('EN')
    })

    it('should return EN for null navigator.language', () => {
      // Arrange
      Object.defineProperty(global, 'navigator', {
        value: {
          language: null,
        },
        writable: true,
      })

      // Act
      const result = getBrowserLanguage()

      // Assert
      expect(result).toBe('EN')
    })

    it('should return EN for undefined navigator.language', () => {
      // Arrange
      Object.defineProperty(global, 'navigator', {
        value: {
          language: undefined,
        },
        writable: true,
      })

      // Act
      const result = getBrowserLanguage()

      // Assert
      expect(result).toBe('EN')
    })

    it('should return EN for navigator.language with only language code (no region)', () => {
      // Arrange
      Object.defineProperty(global, 'navigator', {
        value: {
          language: 'fr',
        },
        writable: true,
      })

      // Act
      const result = getBrowserLanguage()

      // Assert
      expect(result).toBe('FR')
    })

    it('should return EN for navigator.language with only language code (no region) - English', () => {
      // Arrange
      Object.defineProperty(global, 'navigator', {
        value: {
          language: 'en',
        },
        writable: true,
      })

      // Act
      const result = getBrowserLanguage()

      // Assert
      expect(result).toBe('EN')
    })

    it('should return EN for navigator.language with only language code (no region) - other language', () => {
      // Arrange
      Object.defineProperty(global, 'navigator', {
        value: {
          language: 'es',
        },
        writable: true,
      })

      // Act
      const result = getBrowserLanguage()

      // Assert
      expect(result).toBe('EN')
    })
  })

  describe('Type safety', () => {
    it('should return a valid Language type', () => {
      // Arrange
      Object.defineProperty(global, 'navigator', {
        value: {
          language: 'fr-FR',
        },
        writable: true,
      })

      // Act
      const result = getBrowserLanguage()

      // Assert
      expect(['EN', 'FR']).toContain(result)
      expect(typeof result).toBe('string')
    })

    it('should return EN as default for any non-French language', () => {
      // Arrange
      Object.defineProperty(global, 'navigator', {
        value: {
          language: 'xyz-ABC',
        },
        writable: true,
      })

      // Act
      const result = getBrowserLanguage()

      // Assert
      expect(result).toBe('EN')
    })
  })
}) 