let mockLanguage = 'EN'
jest.mock('jotai', () => ({
  useAtom: () => [mockLanguage, jest.fn()]
}))

import { renderHook, act } from '@testing-library/react'
import { useBlogPosts } from '@/hooks/useBlogPosts'

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

describe('useBlogPosts', () => {
  const initialPosts = [
    {
      slug: 'test',
      title: 'Test',
      content: '...',
      publishedAt: '2024-01-01',
      summary: '',
      tag: '',
      images: [],
      team: [],
      metadata: { title: 'Test', publishedAt: '2024-01-01', summary: '' }
    }
  ]
  beforeEach(() => {
    jest.clearAllMocks()
    mockLanguage = 'EN'
  })

  it('returns initial posts and not loading after fetch', async () => {
    const { result } = renderHook(() => useBlogPosts(initialPosts))
    expect(result.current.loading).toBe(true)
    await waitFor(() => result.current.loading === false)
    expect(result.current.posts).toEqual(initialPosts)
    expect(result.current.loading).toBe(false)
  })

  it('fetches posts from API and updates state', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [{
        slug: 'api',
        title: 'API',
        content: '...',
        publishedAt: '2024-01-02',
        summary: '',
        tag: '',
        images: [],
        team: [],
        metadata: { title: 'API', publishedAt: '2024-01-02', summary: '' }
      }]
    })
    const { result } = renderHook(() => useBlogPosts(initialPosts))
    await waitFor(() => result.current.posts[0].slug === 'api')
    expect(result.current.posts[0].slug).toBe('api')
    expect(result.current.loading).toBe(false)
  })

  it('falls back to initialPosts on fetch error', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('fail'))
    const { result } = renderHook(() => useBlogPosts(initialPosts))
    await waitFor(() => result.current.loading === false)
    expect(result.current.posts).toEqual(initialPosts)
    expect(result.current.loading).toBe(false)
  })

  it('sets loading true while fetching', async () => {
    let resolve: any
    (fetch as jest.Mock).mockImplementationOnce(() => new Promise(r => { resolve = r }))
    const { result } = renderHook(() => useBlogPosts(initialPosts))
    expect(result.current.loading).toBe(true)
    act(() => resolve({ ok: true, json: async () => initialPosts }))
    await waitFor(() => result.current.loading === false)
    expect(result.current.loading).toBe(false)
  })

  it('switches language and refetches', async () => {
    (fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => [{
      slug: 'fr',
      title: 'FR',
      content: '...',
      publishedAt: '2024-01-03',
      summary: '',
      tag: '',
      images: [],
      team: [],
      metadata: { title: 'FR', publishedAt: '2024-01-03', summary: '' }
    }] })
    const { result, rerender } = renderHook(() => useBlogPosts(initialPosts))
    mockLanguage = 'FR'
    rerender()
    await waitFor(() => result.current.posts[0].slug === 'fr')
    expect(result.current.posts[0].slug).toBe('fr')
  })
}) 