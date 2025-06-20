import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import {
  getBlogPosts,
  getBlogPostBySlug,
  getBlogPostInBothLanguages
} from '@/app/utils/blog'
import type { Language } from '@/atoms/language'

jest.mock('fs')
jest.mock('gray-matter')

const mockedFs = fs as jest.Mocked<typeof fs>
const mockedMatter = matter as unknown as jest.Mock

describe('blog utils', () => {
  const mockPostsDir = path.join(process.cwd(), 'src', 'app', 'blog', 'posts')
  const mockBlogData = {
    title: 'Test Blog',
    publishedAt: '2024-01-15',
    summary: 'Test summary',
    image: '/test-image.jpg',
    tag: 'Test',
  }
  const mockBlogPost = {
    slug: 'test-blog',
    metadata: mockBlogData,
    content: '# Test Blog\n\nThis is test content.'
  }

  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(process, 'cwd').mockReturnValue('/mock/cwd')
    mockedMatter.mockReturnValue({
      data: mockBlogData,
      content: '# Test Blog\n\nThis is test content.',
      excerpt: '',
      orig: Buffer.from(''),
      language: '',
      matter: '',
      stringify: jest.fn()
    })
  })

  describe('getBlogPosts', () => {
    it('should return blog posts for English language', () => {
      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync.mockReturnValue(['test-blog.mdx', 'another-blog.mdx'] as any)
      mockedFs.readFileSync.mockReturnValue('mock content' as any)
      const result = getBlogPosts(undefined, 'EN')
      expect(mockedFs.existsSync).toHaveBeenCalledWith('/mock/cwd/src/app/blog/posts')
      expect(mockedFs.readdirSync).toHaveBeenCalledWith('/mock/cwd/src/app/blog/posts')
      expect(result).toHaveLength(2)
      expect(result[0]).toHaveProperty('slug', 'test-blog')
    })
    it('should return blog posts for French language', () => {
      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync.mockReturnValue(['test-blog.fr.mdx', 'another-blog.fr.mdx'] as any)
      mockedFs.readFileSync.mockReturnValue('mock content' as any)
      const result = getBlogPosts(undefined, 'FR')
      expect(result).toHaveLength(2)
      expect(result[0]).toHaveProperty('slug', 'test-blog')
    })
    it('should filter out French files when getting English posts', () => {
      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync.mockReturnValue([
        'test-blog.mdx',
        'test-blog.fr.mdx',
        'another-blog.mdx'
      ] as any)
      mockedFs.readFileSync.mockReturnValue('mock content' as any)
      const result = getBlogPosts(undefined, 'EN')
      expect(result).toHaveLength(2)
      expect(result.every(p => !p.slug.includes('.fr'))).toBe(true)
    })
    it('should return empty array when directory does not exist', () => {
      mockedFs.existsSync.mockReturnValue(false)
      const result = getBlogPosts(undefined, 'EN')
      expect(result).toEqual([])
      expect(mockedFs.readdirSync).not.toHaveBeenCalled()
    })
    it('should return empty array when no files in directory', () => {
      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync.mockReturnValue([] as any)
      const result = getBlogPosts(undefined, 'EN')
      expect(result).toEqual([])
    })
    it('should sort blog posts by publishedAt date (newest first)', () => {
      const oldPost = { ...mockBlogPost, metadata: { ...mockBlogData, publishedAt: '2023-01-01' } }
      const newPost = { ...mockBlogPost, metadata: { ...mockBlogData, publishedAt: '2024-01-01' } }
      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync.mockReturnValue(['old-post.mdx', 'new-post.mdx'] as any)
      mockedFs.readFileSync
        .mockReturnValueOnce('old content' as any)
        .mockReturnValueOnce('new content' as any)
      mockedMatter
        .mockReturnValueOnce({
          data: oldPost.metadata,
          content: oldPost.content,
          excerpt: '',
          orig: Buffer.from(''),
          language: '',
          matter: '',
          stringify: jest.fn()
        })
        .mockReturnValueOnce({
          data: newPost.metadata,
          content: newPost.content,
          excerpt: '',
          orig: Buffer.from(''),
          language: '',
          matter: '',
          stringify: jest.fn()
        })
      const result = getBlogPosts(undefined, 'EN')
      expect(result).toHaveLength(2)
      expect(result[0].metadata.publishedAt).toBe('2024-01-01')
      expect(result[1].metadata.publishedAt).toBe('2023-01-01')
    })
    it('should handle range parameter with single number', () => {
      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync.mockReturnValue(['post1.mdx', 'post2.mdx', 'post3.mdx'] as any)
      mockedFs.readFileSync.mockReturnValue('mock content' as any)
      const result = getBlogPosts([2], 'EN')
      expect(result).toHaveLength(2)
    })
    it('should handle range parameter with two numbers', () => {
      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync.mockReturnValue(['post1.mdx', 'post2.mdx', 'post3.mdx'] as any)
      mockedFs.readFileSync.mockReturnValue('mock content' as any)
      const result = getBlogPosts([2, 3], 'EN')
      expect(result).toHaveLength(2)
    })
    it('should handle invalid range parameters', () => {
      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync.mockReturnValue(['post1.mdx'] as any)
      mockedFs.readFileSync.mockReturnValue('mock content' as any)
      const result = getBlogPosts([0, -1], 'EN')
      expect(result).toEqual([])
    })
    it('should handle missing end parameter in range', () => {
      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync.mockReturnValue(['post1.mdx', 'post2.mdx', 'post3.mdx'] as any)
      mockedFs.readFileSync.mockReturnValue('mock content' as any)
      const result = getBlogPosts([2], 'EN')
      expect(result).toHaveLength(2)
    })
    it('should handle corrupted files gracefully', () => {
      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync.mockReturnValue(['corrupted-file.mdx'] as any)
      mockedFs.readFileSync.mockImplementation(() => { throw new Error('File read error') })
      const result = getBlogPosts(undefined, 'EN')
      expect(result).toEqual([])
    })
    it('should extract metadata from frontmatter correctly', () => {
      const testMetadata = {
        title: 'Test Title',
        publishedAt: '2024-01-01',
        summary: 'Test Summary',
        image: '/test.jpg',
        tag: 'TestTag',
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
      const result = getBlogPosts(undefined, 'EN')
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
      const result = getBlogPosts(undefined, 'EN')
      expect(result[0].metadata.summary).toBe('')
      expect(result[0].metadata.image).toBe('')
      expect(result[0].metadata.tag).toBe('')
    })
  })

  describe('getBlogPostBySlug', () => {
    it('should return blog post for valid slug', () => {
      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync.mockReturnValue(['test-blog.mdx'] as any)
      mockedFs.readFileSync.mockReturnValue('mock content' as any)
      const result = getBlogPostBySlug('test-blog', 'EN')
      expect(result).not.toBeNull()
      expect(result?.slug).toBe('test-blog')
    })
    it('should return null for invalid slug', () => {
      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync.mockReturnValue(['other-blog.mdx'] as any)
      mockedFs.readFileSync.mockReturnValue('mock content' as any)
      const result = getBlogPostBySlug('non-existent-blog', 'EN')
      expect(result).toBeNull()
    })
    it('should return null for non-existent slug', () => {
      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync.mockReturnValue([] as any)
      const result = getBlogPostBySlug('any-slug', 'EN')
      expect(result).toBeNull()
    })
  })

  describe('getBlogPostInBothLanguages', () => {
    it('should return blog post in both languages when available', () => {
      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync
        .mockReturnValueOnce(['test-blog.mdx'] as any)
        .mockReturnValueOnce(['test-blog.fr.mdx'] as any)
      mockedFs.readFileSync.mockReturnValue('mock content' as any)
      const result = getBlogPostInBothLanguages('test-blog')
      expect(result.en).not.toBeNull()
      expect(result.fr).not.toBeNull()
      expect(result.en?.slug).toBe('test-blog')
      expect(result.fr?.slug).toBe('test-blog')
    })
    it('should return null for missing language versions', () => {
      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync
        .mockReturnValueOnce(['test-blog.mdx'] as any)
        .mockReturnValueOnce([] as any)
      mockedFs.readFileSync.mockReturnValue('mock content' as any)
      const result = getBlogPostInBothLanguages('test-blog')
      expect(result.en).not.toBeNull()
      expect(result.fr).toBeNull()
    })
    it('should return null for both languages when blog post does not exist', () => {
      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync.mockReturnValue([] as any)
      const result = getBlogPostInBothLanguages('non-existent-blog')
      expect(result.en).toBeNull()
      expect(result.fr).toBeNull()
    })
  })
}) 