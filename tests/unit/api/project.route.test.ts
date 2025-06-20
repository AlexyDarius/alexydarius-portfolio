import { GET } from '@/app/api/project/route'
import * as projectsUtils from '@/app/utils/projects'

jest.mock('@/app/utils/projects')

const mockGetProjects = projectsUtils.getProjects as jest.Mock

// Mock NextResponse.json
jest.mock('next/server', () => ({
  NextResponse: {
    json: (data: any, opts?: any) => ({
      json: async () => data,
      status: opts?.status || 200,
      headers: { set: jest.fn() }
    })
  }
}))

const createRequest = (url: string) => ({ url } as any)

describe('GET /api/project', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns 400 if slug is missing', async () => {
    const req = createRequest('http://localhost/api/project')
    const res = await GET(req)
    const json = await res.json()
    expect(json).toEqual({ error: 'Slug parameter is required' })
    expect(res.status).toBe(400)
  })

  it('returns 404 if project not found', async () => {
    mockGetProjects.mockReturnValue([{ slug: 'a' }])
    const req = createRequest('http://localhost/api/project?slug=notfound')
    const res = await GET(req)
    const json = await res.json()
    expect(json).toEqual({ error: 'Project not found' })
    expect(res.status).toBe(404)
  })

  it('returns project if found', async () => {
    mockGetProjects.mockReturnValue([{ slug: 'abc', title: 'Test' }])
    const req = createRequest('http://localhost/api/project?slug=abc')
    const res = await GET(req)
    const json = await res.json()
    expect(json).toEqual({ project: { slug: 'abc', title: 'Test' } })
    expect(res.status).toBe(200)
  })

  it('returns project with language param', async () => {
    mockGetProjects.mockReturnValue([{ slug: 'abc', title: 'FR' }])
    const req = createRequest('http://localhost/api/project?slug=abc&language=FR')
    const res = await GET(req)
    const json = await res.json()
    expect(mockGetProjects).toHaveBeenCalledWith(undefined, 'FR')
    expect(json).toEqual({ project: { slug: 'abc', title: 'FR' } })
    expect(res.status).toBe(200)
  })

  it('returns 500 on error', async () => {
    mockGetProjects.mockImplementation(() => { throw new Error('fail') })
    const req = createRequest('http://localhost/api/project?slug=abc')
    const res = await GET(req)
    const json = await res.json()
    expect(json).toEqual({ error: 'Failed to fetch project' })
    expect(res.status).toBe(500)
  })
}) 