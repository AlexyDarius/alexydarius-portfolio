import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { RouteGuard } from '@/components/RouteGuard'

// Mock usePathname
let mockPathname = '/test'
jest.mock('next/navigation', () => ({
  usePathname: () => mockPathname
}))

// Mock routes and protectedRoutes
jest.mock('@/app/resources', () => ({
  routes: {
    '/test': true,
    '/blog': true,
    '/notfound': false,
    '/protected': true,
  },
  protectedRoutes: {
    '/protected': true,
  },
}))

// Mock NotFound
jest.mock('@/app/not-found', () => () => <div data-testid="notfound" />)

// Mock Once UI components used in RouteGuard
jest.mock('@/once-ui/components', () => ({
  Flex: ({ children }: any) => <div data-testid="flex">{children}</div>,
  Spinner: () => <div data-testid="spinner">Spinner</div>,
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  Heading: ({ children }: any) => <h2>{children}</h2>,
  Column: ({ children }: any) => <div>{children}</div>,
  PasswordInput: (props: any) => <input {...props} aria-label="Password" />,
}))

// Mock child component
const Child = () => <div data-testid="child">Child Content</div>

global.fetch = jest.fn()

describe('RouteGuard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockPathname = '/test'
  })

  it('renders NotFound if route is not enabled', async () => {
    mockPathname = '/notfound'
    render(<RouteGuard><Child /></RouteGuard>)
    await waitFor(() => expect(screen.getByTestId('notfound')).toBeInTheDocument())
  })

  it('renders password form if route is protected and not authenticated', async () => {
    mockPathname = '/protected'
    ;(fetch as jest.Mock).mockResolvedValue({ ok: false })
    render(<RouteGuard><Child /></RouteGuard>)
    await waitFor(() => expect(screen.getByLabelText('Password')).toBeInTheDocument())
    expect(screen.getByText('This page is password protected')).toBeInTheDocument()
  })

  it('submits password and authenticates on success', async () => {
    mockPathname = '/protected'
    ;(fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: false }) // initial check-auth
      .mockResolvedValueOnce({ ok: true }) // authenticate
    render(<RouteGuard><Child /></RouteGuard>)
    await waitFor(() => expect(screen.getByLabelText('Password')).toBeInTheDocument())
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secret' } })
    fireEvent.click(screen.getByText('Submit'))
    await waitFor(() => expect(screen.getByTestId('child')).toBeInTheDocument())
  })

  it('shows error on failed password submit', async () => {
    mockPathname = '/protected'
    ;(fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: false }) // initial check-auth
      .mockResolvedValueOnce({ ok: false }) // authenticate
    render(<RouteGuard><Child /></RouteGuard>)
    await waitFor(() => expect(screen.getByLabelText('Password')).toBeInTheDocument())
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrong' } })
    fireEvent.click(screen.getByText('Submit'))
    await waitFor(() => expect(screen.getByLabelText('Password')).toHaveAttribute('errorMessage', 'Incorrect password'))
  })

  it('renders children if route is enabled and not protected', async () => {
    render(<RouteGuard><Child /></RouteGuard>)
    await waitFor(() => expect(screen.getByTestId('child')).toBeInTheDocument())
  })
}) 