import { GET } from '@/app/api/check-auth/route'

// Mock NextResponse.json
jest.mock('next/server', () => ({
  NextResponse: {
    json: (data: any, opts?: any) => ({
      json: async () => data,
      status: opts?.status || 200
    })
  }
}))

// Mock cookie.parse
jest.mock('cookie', () => ({
  parse: jest.fn()
}))

const mockParse = require('cookie').parse

const createRequest = (cookieHeader: string) => ({ headers: { get: () => cookieHeader } } as any)

describe('GET /api/check-auth', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns authenticated true if cookie present', async () => {
    mockParse.mockReturnValue({ authToken: 'authenticated' })
    const req = createRequest('authToken=authenticated')
    const res = await GET(req)
    const json = await res.json()
    expect(json).toEqual({ authenticated: true })
    expect(res.status).toBe(200)
  })

  it('returns authenticated false if cookie missing', async () => {
    mockParse.mockReturnValue({})
    const req = createRequest('')
    const res = await GET(req)
    const json = await res.json()
    expect(json).toEqual({ authenticated: false })
    expect(res.status).toBe(401)
  })

  it('returns authenticated false if cookie wrong', async () => {
    mockParse.mockReturnValue({ authToken: 'nope' })
    const req = createRequest('authToken=nope')
    const res = await GET(req)
    const json = await res.json()
    expect(json).toEqual({ authenticated: false })
    expect(res.status).toBe(401)
  })
}) 