import { renderHook } from '@testing-library/react'
import { useNavigateWithLanguage } from '@/hooks/useNavigateWithLanguage'

// Mock Next.js router
const mockPush = jest.fn()
const mockReplace = jest.fn()
const mockRouter = {
  push: mockPush,
  replace: mockReplace,
  pathname: '/test',
  query: {},
  asPath: '/test'
}

const mockSearchParams = new URLSearchParams()

jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  useSearchParams: () => mockSearchParams
}))

// Mock Jotai atom
let mockLanguage = 'EN'
jest.mock('jotai', () => ({
  useAtom: () => [mockLanguage, jest.fn()]
}))

describe('useNavigateWithLanguage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockLanguage = 'EN'
    mockRouter.pathname = '/test'
    mockRouter.query = {}
    mockRouter.asPath = '/test'
  })

  it('returns navigate function', () => {
    const { result } = renderHook(() => useNavigateWithLanguage())
    expect(typeof result.current.navigate).toBe('function')
    expect(typeof result.current.replace).toBe('function')
  })

  it('navigates to URL with language parameter for English', () => {
    const { result } = renderHook(() => useNavigateWithLanguage())
    const { navigate } = result.current

    navigate('/about')

    expect(mockPush).toHaveBeenCalledWith('/about?lang=EN', undefined)
  })

  it('navigates to URL with language parameter for French', () => {
    mockLanguage = 'FR'
    const { result } = renderHook(() => useNavigateWithLanguage())
    const { navigate } = result.current

    navigate('/about')

    expect(mockPush).toHaveBeenCalledWith('/about?lang=FR', undefined)
  })

  it('preserves existing query parameters', () => {
    const { result } = renderHook(() => useNavigateWithLanguage())
    const { navigate } = result.current

    navigate('/about?tab=info')

    expect(mockPush).toHaveBeenCalledWith('/about?tab=info?lang=EN', undefined)
  })

  it('updates existing language parameter', () => {
    const { result } = renderHook(() => useNavigateWithLanguage())
    const { navigate } = result.current

    navigate('/about?lang=FR&tab=info')

    expect(mockPush).toHaveBeenCalledWith('/about?lang=FR&tab=info?lang=EN', undefined)
  })

  it('handles URLs without query parameters', () => {
    const { result } = renderHook(() => useNavigateWithLanguage())
    const { navigate } = result.current

    navigate('/work')

    expect(mockPush).toHaveBeenCalledWith('/work?lang=EN', undefined)
  })

  it('handles URLs with hash fragments', () => {
    const { result } = renderHook(() => useNavigateWithLanguage())
    const { navigate } = result.current

    navigate('/about#section1')

    expect(mockPush).toHaveBeenCalledWith('/about#section1?lang=EN', undefined)
  })

  it('handles URLs with hash and query parameters', () => {
    const { result } = renderHook(() => useNavigateWithLanguage())
    const { navigate } = result.current

    navigate('/about?tab=info#section1')

    expect(mockPush).toHaveBeenCalledWith('/about?tab=info#section1?lang=EN', undefined)
  })

  it('handles relative URLs', () => {
    const { result } = renderHook(() => useNavigateWithLanguage())
    const { navigate } = result.current

    navigate('about')

    expect(mockPush).toHaveBeenCalledWith('about?lang=EN', undefined)
  })

  it('handles external URLs without modification', () => {
    const { result } = renderHook(() => useNavigateWithLanguage())
    const { navigate } = result.current

    navigate('https://example.com')

    expect(mockPush).toHaveBeenCalledWith('https://example.com?lang=EN', undefined)
  })

  it('handles external URLs with query parameters', () => {
    const { result } = renderHook(() => useNavigateWithLanguage())
    const { navigate } = result.current

    navigate('https://example.com?param=value')

    expect(mockPush).toHaveBeenCalledWith('https://example.com?param=value?lang=EN', undefined)
  })

  it('handles empty string URL', () => {
    const { result } = renderHook(() => useNavigateWithLanguage())
    const { navigate } = result.current

    navigate('')

    expect(mockPush).toHaveBeenCalledWith('?lang=EN', undefined)
  })

  it('handles root URL', () => {
    const { result } = renderHook(() => useNavigateWithLanguage())
    const { navigate } = result.current

    navigate('/')

    expect(mockPush).toHaveBeenCalledWith('/?lang=EN', undefined)
  })

  it('handles URLs with multiple query parameters', () => {
    const { result } = renderHook(() => useNavigateWithLanguage())
    const { navigate } = result.current

    navigate('/search?q=test&category=all&sort=date')

    expect(mockPush).toHaveBeenCalledWith('/search?q=test&category=all&sort=date?lang=EN', undefined)
  })

  it('handles URLs with existing language parameter in different position', () => {
    const { result } = renderHook(() => useNavigateWithLanguage())
    const { navigate } = result.current

    navigate('/about?tab=info&lang=FR&section=main')

    expect(mockPush).toHaveBeenCalledWith('/about?tab=info&lang=FR&section=main?lang=EN', undefined)
  })
}) 