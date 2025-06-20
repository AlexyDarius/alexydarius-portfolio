let mockLanguage = 'EN'
jest.mock('jotai', () => ({
  useAtom: () => [mockLanguage, jest.fn()]
}))

import { renderHook, act } from '@testing-library/react'
import { useProject } from '@/hooks/useProject'

(global as any).fetch = jest.fn()

// Helper to wait for a condition
const waitFor = async (fn: () => boolean, timeout = 1000) => {
  const start = Date.now()
  while (!fn()) {
    if (Date.now() - start > timeout) throw new Error('Timeout')
    await act(async () => {
      await new Promise(res => setTimeout(res, 10))
    })
  }
}

describe('useProject', () => {
  const mockProject = {
    slug: 'test-project',
    title: 'Test Project',
    description: 'Test description',
    publishedAt: '2024-01-01',
    summary: 'Test summary',
    image: '/test.jpg',
    images: ['/test1.jpg'],
    tag: 'Test',
    team: [{ name: 'John', role: 'Dev', avatar: '/avatar.jpg', linkedIn: 'https://linkedin.com' }],
    link: 'https://test.com',
    content: '# Test Project\n\nThis is test content.',
    metadata: { 
      title: 'Test Project', 
      publishedAt: '2024-01-01', 
      summary: 'Test summary',
      image: '/test.jpg',
      images: ['/test1.jpg'],
      tag: ['Test'],
      team: [{ avatar: '/avatar.jpg' }],
      link: 'https://test.com'
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockLanguage = 'EN'
  })

  it('returns null and loading true initially', () => {
    const { result } = renderHook(() => useProject('test-slug'))
    expect(result.current.project).toBeNull()
    expect(result.current.loading).toBe(true)
  })

  it('uses initialProject if provided', () => {
    const { result } = renderHook(() => useProject('test-slug', mockProject))
    expect(result.current.project).toEqual(mockProject)
    expect(result.current.loading).toBe(true) // Still loading because it fetches
  })

  it('fetches project from API and updates state', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ project: mockProject })
    })
    const { result } = renderHook(() => useProject('test-slug'))
    await waitFor(() => result.current.loading === false)
    expect(result.current.project).toEqual(mockProject)
    expect(result.current.loading).toBe(false)
  })

  it('handles fetch errors gracefully', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))
    const { result } = renderHook(() => useProject('test-slug'))
    await waitFor(() => result.current.loading === false)
    expect(result.current.project).toBeNull()
    expect(result.current.loading).toBe(false)
  })

  it('sets loading true while fetching', async () => {
    let resolve: any
    (fetch as jest.Mock).mockImplementationOnce(() => new Promise(r => { resolve = r }))
    const { result } = renderHook(() => useProject('test-slug'))
    expect(result.current.loading).toBe(true)
    act(() => resolve({ ok: true, json: async () => ({ project: mockProject }) }))
    await waitFor(() => result.current.loading === false)
    expect(result.current.loading).toBe(false)
  })

  it('refetches when slug changes', async () => {
    (fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => ({ project: mockProject }) })
    const { result, rerender } = renderHook(({ slug }) => useProject(slug), { initialProps: { slug: 'slug1' } })
    await waitFor(() => result.current.loading === false)
    expect(fetch).toHaveBeenCalledWith('/api/project?language=EN&slug=slug1')
    
    rerender({ slug: 'slug2' })
    await waitFor(() => result.current.loading === false)
    expect(fetch).toHaveBeenCalledWith('/api/project?language=EN&slug=slug2')
  })

  it('refetches when language changes', async () => {
    (fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => ({ project: mockProject }) })
    const { result, rerender } = renderHook(() => useProject('test-slug'))
    await waitFor(() => result.current.loading === false)
    expect(fetch).toHaveBeenCalledWith('/api/project?language=EN&slug=test-slug')
    
    mockLanguage = 'FR'
    rerender()
    await waitFor(() => result.current.loading === false)
    expect(fetch).toHaveBeenCalledWith('/api/project?language=FR&slug=test-slug')
  })

  it('constructs correct API URL with parameters', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ project: mockProject })
    })
    const { result } = renderHook(() => useProject('my-project'))
    await waitFor(() => result.current.loading === false)
    expect(fetch).toHaveBeenCalledWith('/api/project?language=EN&slug=my-project')
  })

  it('handles non-ok response', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404
    })
    const { result } = renderHook(() => useProject('non-existent'))
    await waitFor(() => result.current.loading === false)
    expect(result.current.project).toBeNull()
    expect(result.current.loading).toBe(false)
  })
}) 