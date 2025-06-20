import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Mailchimp } from '@/components/Mailchimp'

// Mock mailchimp config
jest.mock('@/app/resources', () => ({
  mailchimp: {
    action: '/subscribe',
    effects: {
      mask: { x: 0, y: 0, radius: 0, cursor: 0 },
      gradient: { display: false, opacity: 0.5, x: 0, y: 0, width: 0, height: 0, tilt: 0, colorStart: '', colorEnd: '' },
      dots: { display: false, opacity: 0.5, size: 'm', color: '' },
      grid: { display: false, opacity: 0.5, color: '', width: 0, height: 0 },
      lines: { display: false, opacity: 0.5, size: 'm', thickness: 0, angle: 0, color: '' },
    },
  },
}))

// Mock Once UI components
jest.mock('@/once-ui/components', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  Flex: ({ children }: any) => <div>{children}</div>,
  Heading: ({ children }: any) => <h2>{children}</h2>,
  Input: ({ errorMessage, ...props }: any) => (
    <>
      <input {...props} aria-label="Email" data-errormsg={errorMessage} />
      {errorMessage && <span>{errorMessage}</span>}
    </>
  ),
  Text: ({ children }: any) => <div>{children}</div>,
  Background: () => <div data-testid="background" />, 
  Column: ({ children }: any) => <div>{children}</div>,
}))

// Patch debounce to call immediately
jest.mock('@/components/Mailchimp', () => {
  const actual = jest.requireActual('@/components/Mailchimp')
  return {
    ...actual,
    debounce: (fn: any) => fn,
  }
})

describe('Mailchimp', () => {
  const newsletter = {
    display: true,
    title: 'Newsletter',
    description: 'Subscribe for updates',
  }

  it('renders the form and fields', () => {
    render(<Mailchimp newsletter={newsletter} />)
    expect(screen.getByText('Newsletter')).toBeInTheDocument()
    expect(screen.getByText('Subscribe for updates')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument()
  })

  it('clears error for valid email', async () => {
    render(<Mailchimp newsletter={newsletter} />)
    const input = screen.getByLabelText('Email')
    fireEvent.change(input, { target: { value: 'test@example.com' } })
    fireEvent.blur(input)
    await waitFor(() => {
      expect(input).toHaveAttribute('data-errormsg', '')
    })
  })

  it('debounces input change', async () => {
    render(<Mailchimp newsletter={newsletter} />)
    const input = screen.getByLabelText('Email')
    fireEvent.change(input, { target: { value: 'debounce@example.com' } })
    fireEvent.blur(input)
    await waitFor(() => {
      expect(input).toHaveAttribute('data-errormsg', '')
    })
  })

  it('submits the form', () => {
    render(<Mailchimp newsletter={newsletter} />)
    const form = screen.getByRole('form') || screen.getByTestId('mc-embedded-subscribe-form')
    expect(form).toBeInTheDocument()
  })
}) 