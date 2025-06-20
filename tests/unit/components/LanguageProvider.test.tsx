import { render, screen } from '@testing-library/react'
import { useAtom } from 'jotai'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import LanguageProvider from '@/components/LanguageProvider'

// Mock Jotai
const mockSetLanguage = jest.fn()
jest.mock('jotai', () => ({
  useAtom: jest.fn(() => ['EN', mockSetLanguage])
}))

// Mock Next.js navigation
const mockReplace = jest.fn()
const mockRouter = {
  replace: mockReplace
}

const mockSearchParams = {
  get: jest.fn(),
  toString: jest.fn(() => ''),
  set: jest.fn()
}

const mockPathname = '/test'

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(() => mockSearchParams),
  useRouter: jest.fn(() => mockRouter),
  usePathname: jest.fn(() => mockPathname)
}))

// Mock document.cookie
Object.defineProperty(document, 'cookie', {
  writable: true,
  value: ''
})

describe('LanguageProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    document.cookie = ''
    mockSearchParams.get.mockReturnValue(null)
    mockSearchParams.toString.mockReturnValue('')
    ;(useAtom as jest.Mock).mockReturnValue(['EN', mockSetLanguage])
  })

  it('renders children without crashing', () => {
    render(
      <LanguageProvider>
        <div data-testid="child">Test Child</div>
      </LanguageProvider>
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('initializes language from URL parameter', () => {
    mockSearchParams.get.mockReturnValue('FR')
    ;(useAtom as jest.Mock).mockReturnValue(['EN', mockSetLanguage])
    
    render(<LanguageProvider>Test</LanguageProvider>)
    
    expect(mockSetLanguage).toHaveBeenCalledWith('FR')
  })

  it('uses initialLanguage when no URL parameter', () => {
    mockSearchParams.get.mockReturnValue(null)
    ;(useAtom as jest.Mock).mockReturnValue(['EN', mockSetLanguage])
    
    render(<LanguageProvider initialLanguage="FR">Test</LanguageProvider>)
    
    expect(mockSetLanguage).toHaveBeenCalledWith('FR')
  })

  it('prioritizes URL parameter over initialLanguage', () => {
    mockSearchParams.get.mockReturnValue('FR')
    ;(useAtom as jest.Mock).mockReturnValue(['EN', mockSetLanguage])
    
    render(<LanguageProvider initialLanguage="EN">Test</LanguageProvider>)
    
    expect(mockSetLanguage).toHaveBeenCalledWith('FR')
  })

  it('sets cookie when language changes', () => {
    mockSearchParams.get.mockReturnValue('FR')
    ;(useAtom as jest.Mock).mockReturnValue(['EN', mockSetLanguage])
    
    render(<LanguageProvider>Test</LanguageProvider>)
    
    expect(document.cookie).toContain('language=FR')
  })

  it('adds lang parameter to URL when missing', () => {
    mockSearchParams.get.mockReturnValue(null)
    ;(useAtom as jest.Mock).mockReturnValue(['EN', mockSetLanguage])
    
    render(<LanguageProvider>Test</LanguageProvider>)
    
    expect(mockReplace).toHaveBeenCalledWith(
      '/test?lang=EN',
      { scroll: false }
    )
  })

  it('updates URL when language atom changes', () => {
    mockSearchParams.get.mockReturnValue('EN')
    const mockSetLanguageLocal = jest.fn()
    // First render with EN
    ;(useAtom as jest.Mock).mockReturnValue(['EN', mockSetLanguageLocal])
    const { rerender } = render(<LanguageProvider>Test</LanguageProvider>)
    // Now simulate language atom change to FR
    ;(useAtom as jest.Mock).mockReturnValue(['FR', mockSetLanguageLocal])
    rerender(<LanguageProvider>Test</LanguageProvider>)
    // The component should update the URL when atom language differs from URL lang
    expect(mockReplace).toHaveBeenCalledWith(
      '/test?lang=FR',
      { scroll: false }
    )
  })

  it('handles invalid language parameters gracefully', () => {
    mockSearchParams.get.mockReturnValue('INVALID')
    ;(useAtom as jest.Mock).mockReturnValue(['EN', mockSetLanguage])
    
    render(<LanguageProvider>Test</LanguageProvider>)
    
    expect(mockSetLanguage).not.toHaveBeenCalled()
  })

  it('preserves existing URL parameters when adding lang', () => {
    mockSearchParams.get.mockReturnValue(null)
    mockSearchParams.toString.mockReturnValue('param=value')
    ;(useAtom as jest.Mock).mockReturnValue(['FR', mockSetLanguage])
    
    render(<LanguageProvider>Test</LanguageProvider>)
    
    expect(mockReplace).toHaveBeenCalledWith(
      '/test?param=value&lang=FR',
      { scroll: false }
    )
  })

  it('does not update when language is already correct', () => {
    mockSearchParams.get.mockReturnValue('EN')
    ;(useAtom as jest.Mock).mockReturnValue(['EN', mockSetLanguage])
    
    render(<LanguageProvider>Test</LanguageProvider>)
    
    expect(mockSetLanguage).not.toHaveBeenCalled()
    expect(mockReplace).not.toHaveBeenCalled()
  })

  it('handles pathname changes and updates URL', () => {
    mockSearchParams.get.mockReturnValue(null)
    ;(useAtom as jest.Mock).mockReturnValue(['EN', mockSetLanguage])
    
    render(<LanguageProvider>Test</LanguageProvider>)
    
    expect(mockReplace).toHaveBeenCalledWith(
      '/test?lang=EN',
      { scroll: false }
    )
  })
}) 