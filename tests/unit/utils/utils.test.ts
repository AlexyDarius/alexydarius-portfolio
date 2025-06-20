import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { getPosts } from '@/app/utils/utils'

jest.mock('fs')
jest.mock('gray-matter')
jest.mock('next/navigation', () => ({
  notFound: jest.fn(() => {
    throw new Error('Not found')
  })
}))

const mockedFs = fs as jest.Mocked<typeof fs>
const mockedMatter = matter as unknown as jest.Mock

describe('utils', () => {
  const mockPostData = {
    title: 'Test Post',
    publishedAt: '2024-01-15',
    summary: 'Test summary',
    image: '/test-image.jpg',
    images: ['/test-image1.jpg', '/test-image2.jpg'],
    tag: 'Test',
    team: [{ name: 'John Doe', role: 'Developer', avatar: '/avatar.jpg', linkedIn: 'https://linkedin.com' }],
    link: 'https://test.com'
  }

  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(process, 'cwd').mockReturnValue('/mock/cwd')
    mockedMatter.mockReturnValue({
      data: mockPostData,
      content: '# Test Post\n\nThis is test content.',
      excerpt: '',
      orig: Buffer.from(''),
      language: '',
      matter: '',
      stringify: jest.fn()
    })
  })

  describe('getPosts', () => {
    it('should return posts from default path', () => {
      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync.mockReturnValue(['test-post.mdx', 'another-post.mdx'] as any)
      mockedFs.readFileSync.mockReturnValue('mock content' as any)

      const result = getPosts()

      expect(mockedFs.existsSync).toHaveBeenCalledWith('/mock/cwd')
      expect(mockedFs.existsSync).toHaveBeenCalledWith('/mock/cwd/test-post.mdx')
      expect(mockedFs.existsSync).toHaveBeenCalledWith('/mock/cwd/another-post.mdx')
      expect(result).toHaveLength(2)
      expect(result[0]).toHaveProperty('slug', 'test-post')
      expect(result[0]).toHaveProperty('metadata')
      expect(result[0]).toHaveProperty('content')
    })

    it('should return posts from custom path', () => {
      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync.mockReturnValue(['test-post.mdx'] as any)
      mockedFs.readFileSync.mockReturnValue('mock content' as any)

      const result = getPosts(['src', 'app', 'work', 'projects'])

      expect(mockedFs.existsSync).toHaveBeenCalledWith('/mock/cwd/src/app/work/projects')
      expect(result).toHaveLength(1)
    })

    it('should call notFound when directory does not exist', () => {
      const { notFound } = require('next/navigation')
      mockedFs.existsSync.mockReturnValue(false)

      expect(() => getPosts()).toThrow('Not found')
      expect(notFound).toHaveBeenCalled()
    })

    it('should filter only MDX files', () => {
      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync.mockReturnValue([
        'test-post.mdx',
        'test-post.txt',
        'another-post.mdx',
        'image.jpg'
      ] as any)
      mockedFs.readFileSync.mockReturnValue('mock content' as any)

      const result = getPosts()

      expect(result).toHaveLength(2)
      expect(result.every(post => post.slug.endsWith('.mdx') || !post.slug.includes('.'))).toBe(true)
    })

    it('should extract metadata from frontmatter correctly', () => {
      const testMetadata = {
        title: 'Test Title',
        publishedAt: '2024-01-01',
        summary: 'Test Summary',
        image: '/test.jpg',
        images: ['/test1.jpg'],
        tag: 'TestTag',
        team: [{ name: 'John', role: 'Dev', avatar: '/avatar.jpg', linkedIn: 'https://linkedin.com' }],
        link: 'https://test.com'
      }

      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync.mockReturnValue(['test.mdx'] as any)
      mockedFs.readFileSync.mockReturnValue('test content' as any)
      mockedMatter.mockReturnValue({
        data: testMetadata,
        content: '# Test\n\nContent',
        excerpt: '',
        orig: Buffer.from(''),
        language: '',
        matter: '',
        stringify: jest.fn()
      })

      const result = getPosts()

      expect(result[0].metadata).toEqual(testMetadata)
    })

    it('should handle missing metadata fields with defaults', () => {
      const partialMetadata = {
        title: 'Test Title',
        publishedAt: '2024-01-01'
      }

      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync.mockReturnValue(['test.mdx'] as any)
      mockedFs.readFileSync.mockReturnValue('test content' as any)
      mockedMatter.mockReturnValue({
        data: partialMetadata,
        content: '# Test\n\nContent',
        excerpt: '',
        orig: Buffer.from(''),
        language: '',
        matter: '',
        stringify: jest.fn()
      })

      const result = getPosts()

      expect(result[0].metadata.summary).toBe('')
      expect(result[0].metadata.image).toBe('')
      expect(result[0].metadata.images).toEqual([])
      expect(result[0].metadata.tag).toEqual([])
      expect(result[0].metadata.team).toEqual([])
      expect(result[0].metadata.link).toBe('')
    })

    it('should call notFound when file does not exist', () => {
      const { notFound } = require('next/navigation')
      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync.mockReturnValue(['missing-file.mdx'] as any)
      mockedFs.existsSync.mockImplementation((path) => {
        if (typeof path === 'string' && path.includes('missing-file.mdx')) return false
        return true
      })

      expect(() => getPosts()).toThrow('Not found')
      expect(notFound).toHaveBeenCalled()
    })

    it('should handle file system errors gracefully', () => {
      const { notFound } = require('next/navigation')
      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync.mockImplementation(() => {
        throw new Error('Permission denied')
      })

      expect(() => getPosts()).toThrow('Permission denied')
    })

    it('should generate correct slug from filename', () => {
      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync.mockReturnValue(['my-test-post.mdx'] as any)
      mockedFs.readFileSync.mockReturnValue('mock content' as any)

      const result = getPosts()

      expect(result[0].slug).toBe('my-test-post')
    })

    it('should handle multiple posts with different metadata', () => {
      const post1Metadata = { ...mockPostData, title: 'Post 1' }
      const post2Metadata = { ...mockPostData, title: 'Post 2' }

      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync.mockReturnValue(['post1.mdx', 'post2.mdx'] as any)
      mockedFs.readFileSync
        .mockReturnValueOnce('post1 content' as any)
        .mockReturnValueOnce('post2 content' as any)

      mockedMatter
        .mockReturnValueOnce({
          data: post1Metadata,
          content: '# Post 1\n\nContent',
          excerpt: '',
          orig: Buffer.from(''),
          language: '',
          matter: '',
          stringify: jest.fn()
        })
        .mockReturnValueOnce({
          data: post2Metadata,
          content: '# Post 2\n\nContent',
          excerpt: '',
          orig: Buffer.from(''),
          language: '',
          matter: '',
          stringify: jest.fn()
        })

      const result = getPosts()

      expect(result).toHaveLength(2)
      expect(result[0].metadata.title).toBe('Post 1')
      expect(result[1].metadata.title).toBe('Post 2')
      expect(result[0].slug).toBe('post1')
      expect(result[1].slug).toBe('post2')
    })
  })
}) 