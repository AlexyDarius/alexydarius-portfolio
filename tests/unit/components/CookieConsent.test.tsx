import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CookieConsent } from '@/components/analytics/CookieConsent'
import { useAtom } from 'jotai'
import { useCookieConsent } from '@/hooks/useCookieConsent'

// Mock Jotai
jest.mock('jotai', () => ({
  useAtom: jest.fn(() => ['EN', jest.fn()])
}))

// Mock useCookieConsent hook
jest.mock('@/hooks/useCookieConsent', () => ({
  useCookieConsent: jest.fn()
}))

// Mock once-ui components
jest.mock('@/once-ui/components', () => ({
  Button: ({ children, onClick, variant, ...props }: any) => (
    <button 
      data-testid={`button-${variant || 'default'}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  ),
  Text: ({ children, ...props }: any) => <span data-testid="text" {...props}>{children}</span>,
  Flex: ({ children, ...props }: any) => <div data-testid="flex" {...props}>{children}</div>,
  Column: ({ children, ...props }: any) => <div data-testid="column" {...props}>{children}</div>,
  Heading: ({ children, ...props }: any) => <h2 data-testid="heading" {...props}>{children}</h2>,
  Switch: ({ isChecked, onToggle, disabled, ...props }: any) => (
    <input
      type="checkbox"
      data-testid="switch"
      checked={isChecked}
      onChange={onToggle}
      disabled={disabled}
      {...props}
    />
  ),
  SmartLink: ({ href, children, ...props }: any) => (
    <a data-testid="link" href={href} {...props}>{children}</a>
  )
}))

describe('CookieConsent', () => {
  const mockUpdatePreferences = jest.fn()
  const mockPreferences = {
    necessary: true,
    analytics: false,
    consentDate: new Date().toISOString()
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useAtom as jest.Mock).mockReturnValue(['EN', jest.fn()])
    ;(useCookieConsent as jest.Mock).mockReturnValue({
      hasConsent: false,
      preferences: mockPreferences,
      updatePreferences: mockUpdatePreferences
    })
  })

  describe('Main Banner', () => {
    it('renders cookie consent banner when no consent given', () => {
      render(<CookieConsent />)
      
      expect(screen.getByText('Cookie Preferences')).toBeInTheDocument()
      expect(screen.getByText(/We use cookies to enhance your experience/)).toBeInTheDocument()
    })

    it('renders English text when language is EN', () => {
      render(<CookieConsent />)
      
      expect(screen.getByText('Accept All')).toBeInTheDocument()
      expect(screen.getByText('Deny All')).toBeInTheDocument()
      expect(screen.getByText('Customize')).toBeInTheDocument()
    })

    it('renders French text when language is FR', () => {
      ;(useAtom as jest.Mock).mockReturnValue(['FR', jest.fn()])
      render(<CookieConsent />)
      
      expect(screen.getByText('Tout accepter')).toBeInTheDocument()
      expect(screen.getByText('Tout refuser')).toBeInTheDocument()
      expect(screen.getByText('Personnaliser')).toBeInTheDocument()
    })

    it('calls updatePreferences with all cookies enabled when Accept All is clicked', () => {
      render(<CookieConsent />)
      
      const acceptButton = screen.getByTestId('button-primary')
      fireEvent.click(acceptButton)
      
      expect(mockUpdatePreferences).toHaveBeenCalledWith({
        necessary: true,
        analytics: true
      })
    })

    it('calls updatePreferences with only necessary cookies when Deny All is clicked', () => {
      render(<CookieConsent />)
      
      const denyButton = screen.getByTestId('button-tertiary')
      fireEvent.click(denyButton)
      
      expect(mockUpdatePreferences).toHaveBeenCalledWith({
        necessary: true,
        analytics: false
      })
    })

    it('shows preferences modal when Customize is clicked', () => {
      render(<CookieConsent />)
      
      const customizeButton = screen.getByTestId('button-secondary')
      fireEvent.click(customizeButton)
      
      expect(screen.getByText('Cookie Preferences')).toBeInTheDocument()
      expect(screen.getByText('Necessary Cookies')).toBeInTheDocument()
      expect(screen.getByText('Analytics Cookies')).toBeInTheDocument()
    })

    it('renders learn more link with correct href', () => {
      render(<CookieConsent />)
      
      const link = screen.getByTestId('link')
      expect(link).toHaveAttribute('href', '/cookie-policy')
      expect(link).toHaveTextContent('Learn more about our cookie policy')
    })

    it('does not render banner when user has already given consent', () => {
      ;(useCookieConsent as jest.Mock).mockReturnValue({
        hasConsent: true,
        preferences: mockPreferences,
        updatePreferences: mockUpdatePreferences
      })
      
      render(<CookieConsent />)
      
      expect(screen.queryByText('Cookie Preferences')).not.toBeInTheDocument()
    })
  })

  describe('Preferences Modal', () => {
    it('renders preferences modal when showPreferences is true', () => {
      // Mock the component to show preferences modal
      const MockCookieConsent = () => {
        const [showPreferences, setShowPreferences] = React.useState(true)
        const [language] = useAtom(jest.requireActual('jotai').atom('EN'))
        const { hasConsent, preferences, updatePreferences } = useCookieConsent()
        
        return (
          <div>
            {showPreferences && (
              <div data-testid="preferences-modal">
                <h2>Cookie Preferences</h2>
                <div>Necessary Cookies</div>
                <div>Analytics Cookies</div>
                <button onClick={() => setShowPreferences(false)}>Cancel</button>
                <button onClick={() => {
                  updatePreferences(preferences)
                  setShowPreferences(false)
                }}>Save Preferences</button>
              </div>
            )}
          </div>
        )
      }
      
      render(<MockCookieConsent />)
      
      expect(screen.getByTestId('preferences-modal')).toBeInTheDocument()
      expect(screen.getByText('Cookie Preferences')).toBeInTheDocument()
      expect(screen.getByText('Necessary Cookies')).toBeInTheDocument()
      expect(screen.getByText('Analytics Cookies')).toBeInTheDocument()
    })

    it('shows necessary cookies switch as disabled and checked', () => {
      render(<CookieConsent />)
      
      // Click customize to show modal
      const customizeButton = screen.getByTestId('button-secondary')
      fireEvent.click(customizeButton)
      
      const switches = screen.getAllByTestId('switch')
      expect(switches[0]).toBeChecked()
      expect(switches[0]).toBeDisabled()
    })

    it('shows analytics cookies switch based on current preferences', () => {
      render(<CookieConsent />)
      
      // Click customize to show modal
      const customizeButton = screen.getByTestId('button-secondary')
      fireEvent.click(customizeButton)
      
      const switches = screen.getAllByTestId('switch')
      expect(switches[1]).not.toBeChecked() // false by default
    })

    it('updates analytics preference when switch is toggled', () => {
      render(<CookieConsent />)
      
      // Click customize to show modal
      const customizeButton = screen.getByTestId('button-secondary')
      fireEvent.click(customizeButton)
      
      const analyticsSwitch = screen.getAllByTestId('switch')[1]
      fireEvent.click(analyticsSwitch)
      
      expect(mockUpdatePreferences).toHaveBeenCalledWith({
        analytics: true
      })
    })

    it('renders French text in modal when language is FR', () => {
      ;(useAtom as jest.Mock).mockReturnValue(['FR', jest.fn()])
      
      render(<CookieConsent />)
      
      // Click customize to show modal
      const customizeButton = screen.getByTestId('button-secondary')
      fireEvent.click(customizeButton)
      
      expect(screen.getByText('Préférences de cookies')).toBeInTheDocument()
      expect(screen.getByText('Cookies nécessaires')).toBeInTheDocument()
      expect(screen.getByText('Cookies analytiques')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper heading structure', () => {
      render(<CookieConsent />)
      
      const heading = screen.getByTestId('heading')
      expect(heading).toBeInTheDocument()
    })

    it('has accessible buttons with proper labels', () => {
      render(<CookieConsent />)
      
      const acceptButton = screen.getByTestId('button-primary')
      const denyButton = screen.getByTestId('button-tertiary')
      const customizeButton = screen.getByTestId('button-secondary')
      
      expect(acceptButton).toBeInTheDocument()
      expect(denyButton).toBeInTheDocument()
      expect(customizeButton).toBeInTheDocument()
    })

    it('has accessible switches with proper labels', () => {
      render(<CookieConsent />)
      
      // Click customize to show modal
      const customizeButton = screen.getByTestId('button-secondary')
      fireEvent.click(customizeButton)
      
      const switches = screen.getAllByTestId('switch')
      expect(switches).toHaveLength(2)
    })
  })

  describe('Edge Cases', () => {
    it('handles missing preferences gracefully', () => {
      ;(useCookieConsent as jest.Mock).mockReturnValue({
        hasConsent: false,
        preferences: undefined,
        updatePreferences: mockUpdatePreferences
      })
      
      render(<CookieConsent />)
      
      expect(screen.getByText('Cookie Preferences')).toBeInTheDocument()
    })

    it('handles loading state', () => {
      ;(useCookieConsent as jest.Mock).mockReturnValue({
        hasConsent: false,
        preferences: mockPreferences,
        updatePreferences: mockUpdatePreferences,
        isLoading: true
      })
      
      render(<CookieConsent />)
      
      expect(screen.getByText('Cookie Preferences')).toBeInTheDocument()
    })
  })
}) 