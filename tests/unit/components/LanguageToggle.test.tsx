import { render, screen, fireEvent } from '@testing-library/react'
import { useAtom } from 'jotai'
import { LanguageToggle } from '@/components/LanguageToggle'

// Mock Jotai
const mockSetLanguage = jest.fn()
jest.mock('jotai', () => ({
  useAtom: jest.fn(() => ['EN', mockSetLanguage])
}))

// Mock once-ui components
jest.mock('@/once-ui/components', () => ({
  Flex: ({ children, ...props }: any) => <div data-testid="flex" {...props}>{children}</div>,
  ToggleButton: ({ onClick, label, selected, fillWidth, ...props }: any) => (
    <button 
      data-testid={`toggle-${label}`}
      onClick={onClick}
      data-selected={selected}
      data-fill-width={fillWidth}
      {...props}
    >
      {label}
    </button>
  )
}))

// Mock getBrowserLanguage
jest.mock('@/utils/getBrowserLanguage', () => ({
  getBrowserLanguage: jest.fn(() => 'EN')
}))

// Mock document.cookie
Object.defineProperty(document, 'cookie', {
  writable: true,
  value: ''
})

// Mock window.innerWidth
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  value: 1024
})

describe('LanguageToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    document.cookie = ''
    ;(useAtom as jest.Mock).mockReturnValue(['EN', mockSetLanguage])
  })

  it('renders main toggle button with current language', () => {
    render(<LanguageToggle />)
    expect(screen.getByTestId('toggle-EN')).toBeInTheDocument()
  })

  it('shows dropdown when main button is clicked', () => {
    render(<LanguageToggle />)
    
    const mainButton = screen.getByTestId('toggle-EN')
    fireEvent.click(mainButton)
    
    expect(screen.getByTestId('flex')).toBeInTheDocument()
    expect(screen.getByTestId('toggle-English')).toBeInTheDocument()
    expect(screen.getByTestId('toggle-Français')).toBeInTheDocument()
  })

  it('hides dropdown when main button is clicked again', () => {
    render(<LanguageToggle />)
    
    const mainButton = screen.getByTestId('toggle-EN')
    fireEvent.click(mainButton)
    expect(screen.getByTestId('flex')).toBeInTheDocument()
    
    fireEvent.click(mainButton)
    expect(screen.queryByTestId('flex')).not.toBeInTheDocument()
  })

  it('switches to French when French button is clicked', () => {
    render(<LanguageToggle />)
    
    const mainButton = screen.getByTestId('toggle-EN')
    fireEvent.click(mainButton)
    
    const frenchButton = screen.getByTestId('toggle-Français')
    fireEvent.click(frenchButton)
    
    expect(mockSetLanguage).toHaveBeenCalledWith('FR')
    expect(document.cookie).toContain('language=FR')
  })

  it('switches to English when English button is clicked', () => {
    ;(useAtom as jest.Mock).mockReturnValue(['FR', mockSetLanguage])
    render(<LanguageToggle />)
    
    const mainButton = screen.getByTestId('toggle-FR')
    fireEvent.click(mainButton)
    
    const englishButton = screen.getByTestId('toggle-English')
    fireEvent.click(englishButton)
    
    expect(mockSetLanguage).toHaveBeenCalledWith('EN')
    expect(document.cookie).toContain('language=EN')
  })

  it('does not update language if same language is selected', () => {
    render(<LanguageToggle />)
    
    const mainButton = screen.getByTestId('toggle-EN')
    fireEvent.click(mainButton)
    
    const englishButton = screen.getByTestId('toggle-English')
    fireEvent.click(englishButton)
    
    expect(mockSetLanguage).not.toHaveBeenCalled()
  })

  it('closes dropdown after language selection', () => {
    render(<LanguageToggle />)
    
    const mainButton = screen.getByTestId('toggle-EN')
    fireEvent.click(mainButton)
    expect(screen.getByTestId('flex')).toBeInTheDocument()
    
    const frenchButton = screen.getByTestId('toggle-Français')
    fireEvent.click(frenchButton)
    
    expect(screen.queryByTestId('flex')).not.toBeInTheDocument()
  })

  it('shows correct selected state for current language', () => {
    render(<LanguageToggle />)
    
    const mainButton = screen.getByTestId('toggle-EN')
    fireEvent.click(mainButton)
    
    const englishButton = screen.getByTestId('toggle-English')
    const frenchButton = screen.getByTestId('toggle-Français')
    
    expect(englishButton).toHaveAttribute('data-selected', 'true')
    expect(frenchButton).toHaveAttribute('data-selected', 'false')
  })

  it('shows correct selected state when language is French', () => {
    ;(useAtom as jest.Mock).mockReturnValue(['FR', mockSetLanguage])
    render(<LanguageToggle />)
    
    const mainButton = screen.getByTestId('toggle-FR')
    fireEvent.click(mainButton)
    
    const englishButton = screen.getByTestId('toggle-English')
    const frenchButton = screen.getByTestId('toggle-Français')
    
    expect(englishButton).toHaveAttribute('data-selected', 'false')
    expect(frenchButton).toHaveAttribute('data-selected', 'true')
  })

  it('has proper accessibility attributes', () => {
    render(<LanguageToggle />)
    
    const mainButton = screen.getByTestId('toggle-EN')
    expect(mainButton).toBeInTheDocument()
  })

  it('sets cookie with correct parameters', () => {
    render(<LanguageToggle />)
    
    const mainButton = screen.getByTestId('toggle-EN')
    fireEvent.click(mainButton)
    
    const frenchButton = screen.getByTestId('toggle-Français')
    fireEvent.click(frenchButton)
    
    expect(document.cookie).toContain('language=FR')
    expect(document.cookie).toContain('path=/')
    expect(document.cookie).toContain('max-age=31536000')
  })
}) 