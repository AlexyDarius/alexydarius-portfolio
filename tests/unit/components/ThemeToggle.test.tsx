import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeToggle } from '@/components/ThemeToggle'

// Mock once-ui components
jest.mock('@/once-ui/components', () => ({
  ToggleButton: ({ onClick, prefixIcon, ariaLabel, ...props }: any) => (
    <button 
      data-testid="toggle-button" 
      onClick={onClick}
      aria-label={ariaLabel}
      {...props}
    >
      {prefixIcon}
    </button>
  ),
  useTheme: jest.fn()
}))

// Import the mocked useTheme
import { useTheme } from '@/once-ui/components'

describe('ThemeToggle', () => {
  const mockSetTheme = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme
    })
  })

  it('renders toggle button with moon icon when theme is light', () => {
    render(<ThemeToggle />)
    
    const button = screen.getByTestId('toggle-button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('moon')
  })

  it('renders toggle button with sun icon when theme is dark', () => {
    ;(useTheme as jest.Mock).mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme
    })
    
    render(<ThemeToggle />)
    
    const button = screen.getByTestId('toggle-button')
    expect(button).toHaveTextContent('sun')
  })

  it('calls setTheme with dark when clicking from light theme', () => {
    render(<ThemeToggle />)
    
    const button = screen.getByTestId('toggle-button')
    fireEvent.click(button)
    
    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })

  it('calls setTheme with light when clicking from dark theme', () => {
    ;(useTheme as jest.Mock).mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme
    })
    
    render(<ThemeToggle />)
    
    const button = screen.getByTestId('toggle-button')
    fireEvent.click(button)
    
    expect(mockSetTheme).toHaveBeenCalledWith('light')
  })

  it('has correct aria-label for light theme', () => {
    render(<ThemeToggle />)
    
    const button = screen.getByTestId('toggle-button')
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode')
  })

  it('has correct aria-label for dark theme', () => {
    ;(useTheme as jest.Mock).mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme
    })
    
    render(<ThemeToggle />)
    
    const button = screen.getByTestId('toggle-button')
    expect(button).toHaveAttribute('aria-label', 'Switch to light mode')
  })

  it('updates icon when theme changes', () => {
    const { rerender } = render(<ThemeToggle />)
    
    // Initially light theme
    expect(screen.getByTestId('toggle-button')).toHaveTextContent('moon')
    
    // Change to dark theme
    ;(useTheme as jest.Mock).mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme
    })
    
    rerender(<ThemeToggle />)
    expect(screen.getByTestId('toggle-button')).toHaveTextContent('sun')
  })

  it('maintains selected state as false', () => {
    render(<ThemeToggle />)
    
    const button = screen.getByTestId('toggle-button')
    expect(button).not.toHaveAttribute('aria-pressed', 'true')
  })

  it('handles multiple rapid clicks', () => {
    render(<ThemeToggle />)
    
    const button = screen.getByTestId('toggle-button')
    
    fireEvent.click(button)
    fireEvent.click(button)
    fireEvent.click(button)
    
    expect(mockSetTheme).toHaveBeenCalledTimes(3)
    expect(mockSetTheme).toHaveBeenNthCalledWith(1, 'dark')
    expect(mockSetTheme).toHaveBeenNthCalledWith(2, 'dark')
    expect(mockSetTheme).toHaveBeenNthCalledWith(3, 'dark')
  })

  it('handles edge case when theme is undefined', () => {
    ;(useTheme as jest.Mock).mockReturnValue({
      theme: undefined,
      setTheme: mockSetTheme
    })
    
    render(<ThemeToggle />)
    
    const button = screen.getByTestId('toggle-button')
    expect(button).toHaveTextContent('moon') // Default to moon for undefined
    expect(button).toHaveAttribute('aria-label', 'Switch to light mode')
  })

  it('handles edge case when theme is null', () => {
    ;(useTheme as jest.Mock).mockReturnValue({
      theme: null,
      setTheme: mockSetTheme
    })
    
    render(<ThemeToggle />)
    
    const button = screen.getByTestId('toggle-button')
    expect(button).toHaveTextContent('moon') // Default to moon for null
    expect(button).toHaveAttribute('aria-label', 'Switch to light mode')
  })
}) 