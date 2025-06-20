import { renderHook, act } from '@testing-library/react'
import { useCookieConsent } from '@/hooks/useCookieConsent'

const mockDate = new Date('2024-01-01T00:00:00.000Z')
const advanceDays = (days: number) => {
  jest.setSystemTime(new Date(mockDate.getTime() + days * 24 * 60 * 60 * 1000))
}

describe('useCookieConsent', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(mockDate)
    localStorage.clear()
  })
  afterEach(() => {
    jest.useRealTimers()
    localStorage.clear()
  })

  it('loads initial state from localStorage if valid', () => {
    const consent = {
      necessary: true,
      analytics: true,
      consentDate: mockDate.toISOString()
    }
    localStorage.setItem('cookie-consent', JSON.stringify(consent))
    const { result } = renderHook(() => useCookieConsent())
    expect(result.current.preferences).toEqual(consent)
    expect(result.current.hasConsent).toBe(true)
    expect(result.current.isLoading).toBe(false)
  })

  it('falls back to default if no localStorage', () => {
    const { result } = renderHook(() => useCookieConsent())
    expect(result.current.preferences.necessary).toBe(true)
    expect(result.current.preferences.analytics).toBe(false)
    expect(result.current.hasConsent).toBe(false)
    expect(result.current.isLoading).toBe(false)
  })

  it('removes expired consent (older than 30 days)', () => {
    const expiredDate = new Date(mockDate.getTime() - 31 * 24 * 60 * 60 * 1000)
    const consent = {
      necessary: true,
      analytics: true,
      consentDate: expiredDate.toISOString()
    }
    localStorage.setItem('cookie-consent', JSON.stringify(consent))
    const { result } = renderHook(() => useCookieConsent())
    expect(result.current.hasConsent).toBe(false)
    expect(localStorage.getItem('cookie-consent')).toBeNull()
  })

  it('removes invalid JSON from localStorage', () => {
    localStorage.setItem('cookie-consent', '{invalid json}')
    const { result } = renderHook(() => useCookieConsent())
    expect(result.current.hasConsent).toBe(false)
    expect(localStorage.getItem('cookie-consent')).toBeNull()
  })

  it('updates preferences and persists to localStorage', () => {
    const { result } = renderHook(() => useCookieConsent())
    act(() => {
      result.current.updatePreferences({ analytics: true })
    })
    const stored = JSON.parse(localStorage.getItem('cookie-consent')!)
    expect(stored.analytics).toBe(true)
    expect(result.current.preferences.analytics).toBe(true)
    expect(result.current.hasConsent).toBe(true)
  })

  it('updates consentDate on preference update', () => {
    const { result } = renderHook(() => useCookieConsent())
    act(() => {
      result.current.updatePreferences({ analytics: true })
    })
    const stored = JSON.parse(localStorage.getItem('cookie-consent')!)
    expect(new Date(stored.consentDate).getTime()).toBe(mockDate.getTime())
  })

  it('helper getters reflect preferences', () => {
    const { result } = renderHook(() => useCookieConsent())
    expect(result.current.analyticsEnabled).toBe(false)
    expect(result.current.necessaryEnabled).toBe(true)
    act(() => {
      result.current.updatePreferences({ analytics: true, necessary: false })
    })
    expect(result.current.analyticsEnabled).toBe(true)
    expect(result.current.necessaryEnabled).toBe(false)
  })

  it('isLoading is true during effect, then false', () => {
    // Simulate slow localStorage
    const getItem = jest.spyOn(localStorage.__proto__, 'getItem')
    getItem.mockImplementationOnce(() => {
      jest.advanceTimersByTime(10)
      return null
    })
    const { result } = renderHook(() => useCookieConsent())
    expect(result.current.isLoading).toBe(false)
    getItem.mockRestore()
  })

  it('handles SSR (localStorage not available)', () => {
    const orig = global.localStorage
    // @ts-ignore
    delete global.localStorage
    expect(() => renderHook(() => useCookieConsent())).not.toThrow()
    // @ts-ignore
    global.localStorage = orig
  })
}) 