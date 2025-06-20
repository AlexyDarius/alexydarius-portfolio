import { GET } from '@/app/api/blog-posts/route'
import * as blogUtils from '@/app/utils/blog'

jest.mock('@/app/utils/blog')

const mockGetBlogPosts = blogUtils.getBlogPosts as jest.Mock

// Mock NextResponse.json
jest.mock('next/server', () => ({
  NextResponse: {
    json: (data: any, opts?: any) => ({
      json: async () => data,
      status: opts?.status || 200
    })
  }
}))

const createRequest = (url: string) => ({ url } as any)

describe('GET /api/blog-posts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns posts with default language', async () => {
    mockGetBlogPosts.mockReturnValue([{ slug: 'test' }])
    const req = createRequest('http://localhost/api/blog-posts')
    const res = await GET(req)
    const json = await res.json()
    expect(mockGetBlogPosts).toHaveBeenCalledWith(undefined, 'EN')
    expect(json).toEqual([{ slug: 'test' }])
    expect(res.status).toBe(200)
  })

  it('returns posts with language=FR', async () => {
    mockGetBlogPosts.mockReturnValue([{ slug: 'fr' }])
    const req = createRequest('http://localhost/api/blog-posts?language=FR')
    const res = await GET(req)
    const json = await res.json()
    expect(mockGetBlogPosts).toHaveBeenCalledWith(undefined, 'FR')
    expect(json).toEqual([{ slug: 'fr' }])
    expect(res.status).toBe(200)
  })

  it('returns 500 and empty array on exception', async () => {
    mockGetBlogPosts.mockImplementation(() => { throw new Error('fail') })
    const req = createRequest('http://localhost/api/blog-posts')
    const res = await GET(req)
    const json = await res.json()
    expect(json).toEqual([])
    expect(res.status).toBe(500)
  })
}) 