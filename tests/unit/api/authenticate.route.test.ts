import { POST } from '@/app/api/authenticate/route'

// Mock NextResponse.json
jest.mock('next/server', () => ({
  NextResponse: {
    json: (data: any, opts?: any) => {
      const headers = { set: jest.fn() }
      return { json: async () => data, status: opts?.status || 200, headers }
    }
  }
}))

// Mock cookie.serialize
jest.mock('cookie', () => ({
  serialize: jest.fn(() => 'authToken=authenticated; Path=/; HttpOnly')
}))

const createRequest = (body: any) => ({ json: async () => body } as any)

describe('POST /api/authenticate', () => {
  const OLD_ENV = process.env
  beforeEach(() => {
    jest.clearAllMocks()
    process.env = { ...OLD_ENV, PAGE_ACCESS_PASSWORD: 'secret', NODE_ENV: 'test' }
  })
  afterAll(() => {
    process.env = OLD_ENV
  })

  it('returns 500 if env var missing', async () => {
    process.env.PAGE_ACCESS_PASSWORD = ''
    const req = createRequest({ password: 'secret' })
    const res = await POST(req)
    const json = await res.json()
    expect(json).toEqual({ message: 'Internal server error' })
    expect(res.status).toBe(500)
  })

  it('returns 200 and sets cookie if password correct', async () => {
    const req = createRequest({ password: 'secret' })
    const res = await POST(req)
    const json = await res.json()
    expect(json).toEqual({ success: true })
    expect(res.status).toBe(200)
    expect(res.headers.set).toHaveBeenCalledWith(
      'Set-Cookie',
      expect.stringContaining('authToken=authenticated')
    )
  })

  it('returns 401 if password incorrect', async () => {
    const req = createRequest({ password: 'wrong' })
    const res = await POST(req)
    const json = await res.json()
    expect(json).toEqual({ message: 'Incorrect password' })
    expect(res.status).toBe(401)
  })
}) 