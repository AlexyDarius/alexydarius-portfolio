let mockLanguage = 'EN'
jest.mock('jotai', () => ({
  useAtom: () => [mockLanguage, jest.fn()]
}))

import { renderHook, act } from '@testing-library/react'
import { useProjects } from '@/hooks/useProjects'

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

describe('useProjects', () => {
  const mockProjects = [
    {
      slug: 'project-1',
      title: 'Project 1',
      description: 'Description 1',
      publishedAt: '2024-01-01',
      summary: 'Summary 1',
      image: '/image1.jpg',
      images: ['/image1.jpg'],
      tag: 'Tag1',
      team: [{ name: 'John', role: 'Dev', avatar: '/avatar1.jpg', linkedIn: 'https://linkedin.com' }],
      link: 'https://project1.com',
      content: '# Project 1\n\nContent 1',
      metadata: { 
        title: 'Project 1', 
        publishedAt: '2024-01-01', 
        summary: 'Summary 1',
        image: '/image1.jpg',
        images: ['/image1.jpg'],
        tag: ['Tag1'],
        team: [{ avatar: '/avatar1.jpg' }],
        link: 'https://project1.com'
      }
    },
    {
      slug: 'project-2',
      title: 'Project 2',
      description: 'Description 2',
      publishedAt: '2024-01-02',
      summary: 'Summary 2',
      image: '/image2.jpg',
      images: ['/image2.jpg'],
      tag: 'Tag2',
      team: [{ name: 'Jane', role: 'Designer', avatar: '/avatar2.jpg', linkedIn: 'https://linkedin.com' }],
      link: 'https://project2.com',
      content: '# Project 2\n\nContent 2',
      metadata: { 
        title: 'Project 2', 
        publishedAt: '2024-01-02', 
        summary: 'Summary 2',
        image: '/image2.jpg',
        images: ['/image2.jpg'],
        tag: ['Tag2'],
        team: [{ avatar: '/avatar2.jpg' }],
        link: 'https://project2.com'
      }
    }
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    mockLanguage = 'EN'
  })

  it('returns empty array and loading true initially', () => {
    const { result } = renderHook(() => useProjects())
    expect(result.current.projects).toEqual([])
    expect(result.current.loading).toBe(true)
  })

  it('uses initialProjects if provided', () => {
    const { result } = renderHook(() => useProjects(undefined, mockProjects))
    expect(result.current.projects).toEqual(mockProjects)
    expect(result.current.loading).toBe(true) // Still loading because it fetches
  })

  it('fetches projects from API and updates state', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ projects: mockProjects })
    })
    const { result } = renderHook(() => useProjects())
    await waitFor(() => result.current.loading === false)
    expect(result.current.projects).toEqual(mockProjects)
    expect(result.current.loading).toBe(false)
  })

  it('handles fetch errors gracefully', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))
    const { result } = renderHook(() => useProjects())
    await waitFor(() => result.current.loading === false)
    expect(result.current.projects).toEqual([])
    expect(result.current.loading).toBe(false)
  })

  it('sets loading true while fetching', async () => {
    let resolve: any
    (fetch as jest.Mock).mockImplementationOnce(() => new Promise(r => { resolve = r }))
    const { result } = renderHook(() => useProjects())
    expect(result.current.loading).toBe(true)
    act(() => resolve({ ok: true, json: async () => ({ projects: mockProjects }) }))
    await waitFor(() => result.current.loading === false)
    expect(result.current.loading).toBe(false)
  })

  it('constructs correct API URL without range parameters', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ projects: mockProjects })
    })
    const { result } = renderHook(() => useProjects())
    await waitFor(() => result.current.loading === false)
    expect(fetch).toHaveBeenCalledWith('/api/projects?language=EN')
  })

  it('constructs correct API URL with single range parameter', () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ projects: mockProjects })
    }
    ;(fetch as jest.Mock).mockResolvedValue(mockResponse)
    
    renderHook(() => useProjects([5] as [number]))
    
    expect(fetch).toHaveBeenCalledWith('/api/projects?language=EN&start=5')
  })

  it('constructs correct API URL with range parameters', () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ projects: mockProjects })
    }
    ;(fetch as jest.Mock).mockResolvedValue(mockResponse)
    
    renderHook(() => useProjects([1, 10] as [number, number]))
    
    expect(fetch).toHaveBeenCalledWith('/api/projects?language=EN&start=1&end=10')
  })

  it('refetches when range changes', async () => {
    (fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => ({ projects: mockProjects }) })
    const { result, rerender } = renderHook(({ range }) => useProjects(range), { initialProps: { range: [1, 5] as [number, number] } })
    await waitFor(() => result.current.loading === false)
    expect(fetch).toHaveBeenCalledWith('/api/projects?language=EN&start=1&end=5')
    
    rerender({ range: [6, 10] as [number, number] })
    await waitFor(() => result.current.loading === false)
    expect(fetch).toHaveBeenCalledWith('/api/projects?language=EN&start=6&end=10')
  })

  it('refetches when language changes', async () => {
    (fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => ({ projects: mockProjects }) })
    const { result, rerender } = renderHook(() => useProjects())
    await waitFor(() => result.current.loading === false)
    expect(fetch).toHaveBeenCalledWith('/api/projects?language=EN')
    
    mockLanguage = 'FR'
    rerender()
    await waitFor(() => result.current.loading === false)
    expect(fetch).toHaveBeenCalledWith('/api/projects?language=FR')
  })

  it('handles non-ok response', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500
    })
    const { result } = renderHook(() => useProjects())
    await waitFor(() => result.current.loading === false)
    expect(result.current.projects).toEqual([])
    expect(result.current.loading).toBe(false)
  })

  it('handles empty projects response', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ projects: [] })
    })
    const { result } = renderHook(() => useProjects())
    await waitFor(() => result.current.loading === false)
    expect(result.current.projects).toEqual([])
    expect(result.current.loading).toBe(false)
  })
}) 