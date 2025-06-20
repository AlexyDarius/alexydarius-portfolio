import { GET } from '@/app/api/projects/route'
import * as projectsUtils from '@/app/utils/projects'

jest.mock('@/app/utils/projects')

const mockGetProjects = projectsUtils.getProjects as jest.Mock

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

describe('GET /api/projects', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns projects with default language', async () => {
    mockGetProjects.mockReturnValue([{ slug: 'test' }])
    const req = createRequest('http://localhost/api/projects')
    const res = await GET(req)
    const json = await res.json()
    expect(mockGetProjects).toHaveBeenCalledWith(undefined, 'EN')
    expect(json).toEqual({ projects: [{ slug: 'test' }] })
    expect(res.status).toBe(200)
  })

  it('returns projects with language=FR', async () => {
    mockGetProjects.mockReturnValue([{ slug: 'fr' }])
    const req = createRequest('http://localhost/api/projects?language=FR')
    const res = await GET(req)
    const json = await res.json()
    expect(mockGetProjects).toHaveBeenCalledWith(undefined, 'FR')
    expect(json).toEqual({ projects: [{ slug: 'fr' }] })
    expect(res.status).toBe(200)
  })

  it('returns projects with range [5]', async () => {
    mockGetProjects.mockReturnValue([{ slug: 'range' }])
    const req = createRequest('http://localhost/api/projects?start=5')
    const res = await GET(req)
    const json = await res.json()
    expect(mockGetProjects).toHaveBeenCalledWith([5, undefined], 'EN')
    expect(json).toEqual({ projects: [{ slug: 'range' }] })
    expect(res.status).toBe(200)
  })

  it('returns projects with range [1,10]', async () => {
    mockGetProjects.mockReturnValue([{ slug: 'range2' }])
    const req = createRequest('http://localhost/api/projects?start=1&end=10')
    const res = await GET(req)
    const json = await res.json()
    expect(mockGetProjects).toHaveBeenCalledWith([1, 10], 'EN')
    expect(json).toEqual({ projects: [{ slug: 'range2' }] })
    expect(res.status).toBe(200)
  })

  it('handles invalid start/end as NaN', async () => {
    mockGetProjects.mockReturnValue([{ slug: 'invalid' }])
    const req = createRequest('http://localhost/api/projects?start=abc&end=xyz')
    const res = await GET(req)
    const json = await res.json()
    expect(mockGetProjects).toHaveBeenCalledWith([NaN, NaN], 'EN')
    expect(json).toEqual({ projects: [{ slug: 'invalid' }] })
    expect(res.status).toBe(200)
  })

  it('returns 500 and error on exception', async () => {
    mockGetProjects.mockImplementation(() => { throw new Error('fail') })
    const req = createRequest('http://localhost/api/projects')
    const res = await GET(req)
    const json = await res.json()
    expect(json).toEqual({ error: 'Failed to fetch projects' })
    expect(res.status).toBe(500)
  })
}) 