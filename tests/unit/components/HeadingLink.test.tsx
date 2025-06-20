import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { HeadingLink } from '@/components/HeadingLink'

// Mock useToast
const addToast = jest.fn()
jest.mock('@/once-ui/components', () => ({
  Heading: ({ children, id, variant, as, ...props }: any) => (
    React.createElement(as || 'h2', { 'data-testid': 'heading', id, ...props }, children)
  ),
  Flex: ({ children, ...props }: any) => <div data-testid="flex" {...props}>{children}</div>,
  IconButton: (props: any) => <button data-testid="icon-btn" {...props} />,
  useToast: () => ({ addToast })
}))

// Mock clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(() => Promise.resolve()),
  },
})

describe('HeadingLink', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the correct heading level and text', () => {
    render(<HeadingLink id="test-id" level={2}>Test Heading</HeadingLink>)
    const heading = screen.getByTestId('heading')
    expect(heading.tagName).toBe('H2')
    expect(heading).toHaveTextContent('Test Heading')
    expect(heading).toHaveAttribute('id', 'test-id')
  })

  it('renders the copy icon button', () => {
    render(<HeadingLink id="test-id" level={2}>Test Heading</HeadingLink>)
    expect(screen.getByTestId('icon-btn')).toBeInTheDocument()
  })

  it('copies URL to clipboard and shows success toast on click', async () => {
    render(<HeadingLink id="copy-id" level={3}>Copy Me</HeadingLink>)
    fireEvent.click(screen.getByTestId('flex'))
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      `${window.location.origin}${window.location.pathname}#copy-id`
    )
    // Wait for promise
    await Promise.resolve()
    expect(addToast).toHaveBeenCalledWith({
      variant: 'success',
      message: 'Link copied to clipboard.',
    })
  })

  it('shows danger toast if clipboard fails', async () => {
    (navigator.clipboard.writeText as jest.Mock).mockImplementationOnce(() => Promise.reject())
    render(<HeadingLink id="fail-id" level={4}>Fail Copy</HeadingLink>)
    fireEvent.click(screen.getByTestId('flex'))
    // Wait for promise
    await Promise.resolve()
    expect(addToast).toHaveBeenCalledWith({
      variant: 'danger',
      message: 'Failed to copy link.',
    })
  })

  it('applies custom style', () => {
    render(<HeadingLink id="styled" level={5} style={{ color: 'red' }}>Styled</HeadingLink>)
    expect(screen.getByTestId('flex')).toHaveStyle({ color: 'red' })
  })
}) 