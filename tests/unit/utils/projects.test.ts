import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import {
  getProjects,
  getStarredProjects,
  getProjectBySlug,
  getProjectInBothLanguages
} from '@/app/utils/projects'
import type { Project } from '@/types/project'
import type { Language } from '@/atoms/language'

// Mock fs module
jest.mock('fs')
jest.mock('gray-matter')

const mockedFs = fs as jest.Mocked<typeof fs>
const mockedMatter = matter as unknown as jest.Mock

describe('projects utils', () => {
  const mockProjectsDir = path.join(process.cwd(), 'src', 'app', 'work', 'projects')
  
  const mockProjectData = {
    title: 'Test Project',
    publishedAt: '2024-01-15',
    summary: 'Test summary',
    image: '/test-image.jpg',
    images: ['/test-image1.jpg', '/test-image2.jpg'],
    tag: ['Test', 'Project'],
    team: [{ avatar: '/avatar.jpg' }],
    link: 'https://test.com',
    starred: true
  }

  const mockProject: Project = {
    slug: 'test-project',
    metadata: mockProjectData,
    content: '# Test Project\n\nThis is test content.'
  }

  const mockFrenchProject: Project = {
    slug: 'test-project',
    metadata: {
      ...mockProjectData,
      title: 'Projet de Test'
    },
    content: '# Projet de Test\n\nCeci est du contenu de test.'
  }

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Mock process.cwd()
    jest.spyOn(process, 'cwd').mockReturnValue('/mock/cwd')
    
    // Mock gray-matter
    mockedMatter.mockReturnValue({
      data: mockProjectData,
      content: '# Test Project\n\nThis is test content.',
      excerpt: '',
      orig: Buffer.from(''),
      language: '',
      matter: '',
      stringify: jest.fn()
    })
  })

  describe('getProjects', () => {
    it('should return projects for English language', () => {
      // Arrange
      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync.mockReturnValue(['test-project.mdx', 'another-project.mdx'] as any)
      mockedFs.readFileSync.mockReturnValue('mock content' as any)

      // Act
      const result = getProjects(undefined, 'EN')

      // Assert
      expect(mockedFs.existsSync).toHaveBeenCalledWith('/mock/cwd/src/app/work/projects')
      expect(mockedFs.readdirSync).toHaveBeenCalledWith('/mock/cwd/src/app/work/projects')
      expect(result).toHaveLength(2)
      expect(result[0]).toHaveProperty('slug', 'test-project')
    })

    it('should return projects for French language', () => {
      // Arrange
      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync.mockReturnValue(['test-project.fr.mdx', 'another-project.fr.mdx'] as any)
      mockedFs.readFileSync.mockReturnValue('mock content' as any)

      // Act
      const result = getProjects(undefined, 'FR')

      // Assert
      expect(result).toHaveLength(2)
      expect(result[0]).toHaveProperty('slug', 'test-project')
    })

    it('should filter out French files when getting English projects', () => {
      // Arrange
      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync.mockReturnValue([
        'test-project.mdx',
        'test-project.fr.mdx',
        'another-project.mdx'
      ] as any)
      mockedFs.readFileSync.mockReturnValue('mock content' as any)

      // Act
      const result = getProjects(undefined, 'EN')

      // Assert
      expect(result).toHaveLength(2)
      expect(result.every(p => !p.slug.includes('.fr'))).toBe(true)
    })

    it('should return empty array when directory does not exist', () => {
      // Arrange
      mockedFs.existsSync.mockReturnValue(false)

      // Act
      const result = getProjects(undefined, 'EN')

      // Assert
      expect(result).toEqual([])
      expect(mockedFs.readdirSync).not.toHaveBeenCalled()
    })

    it('should return empty array when no files in directory', () => {
      // Arrange
      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync.mockReturnValue([] as any)

      // Act
      const result = getProjects(undefined, 'EN')

      // Assert
      expect(result).toEqual([])
    })

    it('should sort projects by publishedAt date (newest first)', () => {
      // Arrange
      const oldProject = { ...mockProject, metadata: { ...mockProjectData, publishedAt: '2023-01-01' } }
      const newProject = { ...mockProject, metadata: { ...mockProjectData, publishedAt: '2024-01-01' } }
      
      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync.mockReturnValue(['old-project.mdx', 'new-project.mdx'] as any)
      mockedFs.readFileSync
        .mockReturnValueOnce('old content' as any)
        .mockReturnValueOnce('new content' as any)
      
      mockedMatter
        .mockReturnValueOnce({
          data: oldProject.metadata,
          content: oldProject.content,
          excerpt: '',
          orig: Buffer.from(''),
          language: '',
          matter: '',
          stringify: jest.fn()
        })
        .mockReturnValueOnce({
          data: newProject.metadata,
          content: newProject.content,
          excerpt: '',
          orig: Buffer.from(''),
          language: '',
          matter: '',
          stringify: jest.fn()
        })

      // Act
      const result = getProjects(undefined, 'EN')

      // Assert
      expect(result).toHaveLength(2)
      expect(result[0].metadata.publishedAt).toBe('2024-01-01')
      expect(result[1].metadata.publishedAt).toBe('2023-01-01')
    })

    it('should handle range parameter with single number', () => {
      // Arrange
      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync.mockReturnValue(['project1.mdx', 'project2.mdx', 'project3.mdx'] as any)
      mockedFs.readFileSync.mockReturnValue('mock content' as any)

      // Act
      const result = getProjects([2], 'EN')

      // Assert
      expect(result).toHaveLength(2) // Should return projects 2 and 3
    })

    it('should handle range parameter with two numbers', () => {
      // Arrange
      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync.mockReturnValue(['project1.mdx', 'project2.mdx', 'project3.mdx'] as any)
      mockedFs.readFileSync.mockReturnValue('mock content' as any)

      // Act
      const result = getProjects([2, 3], 'EN')

      // Assert
      expect(result).toHaveLength(2) // Should return projects 2 and 3
    })

    it('should handle invalid range parameters', () => {
      // Arrange
      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync.mockReturnValue(['project1.mdx'] as any)
      mockedFs.readFileSync.mockReturnValue('mock content' as any)

      // Act
      const result = getProjects([0, -1], 'EN')

      // Assert
      expect(result).toEqual([])
    })

    it('should handle missing end parameter in range', () => {
      // Arrange
      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync.mockReturnValue(['project1.mdx', 'project2.mdx', 'project3.mdx'] as any)
      mockedFs.readFileSync.mockReturnValue('mock content' as any)

      // Act
      const result = getProjects([2], 'EN')

      // Assert
      expect(result).toHaveLength(2) // Should return all projects from index 2 onwards
    })

    it('should handle corrupted files gracefully', () => {
      // Arrange
      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync.mockReturnValue(['corrupted-file.mdx'] as any)
      mockedFs.readFileSync.mockImplementation(() => {
        throw new Error('File read error')
      })

      // Act
      const result = getProjects(undefined, 'EN')

      // Assert
      expect(result).toEqual([])
    })
  })

  describe('getStarredProjects', () => {
    it('should return only starred projects', () => {
      // Arrange
      const starredProject = { ...mockProject, metadata: { ...mockProjectData, starred: true } }
      const nonStarredProject = { ...mockProject, metadata: { ...mockProjectData, starred: false } }
      
      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync.mockReturnValue(['starred.mdx', 'non-starred.mdx'] as any)
      mockedFs.readFileSync
        .mockReturnValueOnce('starred content' as any)
        .mockReturnValueOnce('non-starred content' as any)
      
      mockedMatter
        .mockReturnValueOnce({
          data: starredProject.metadata,
          content: starredProject.content,
          excerpt: '',
          orig: Buffer.from(''),
          language: '',
          matter: '',
          stringify: jest.fn()
        })
        .mockReturnValueOnce({
          data: nonStarredProject.metadata,
          content: nonStarredProject.content,
          excerpt: '',
          orig: Buffer.from(''),
          language: '',
          matter: '',
          stringify: jest.fn()
        })

      // Act
      const result = getStarredProjects('EN')

      // Assert
      expect(result).toHaveLength(1)
      expect(result[0].metadata.starred).toBe(true)
    })

    it('should return empty array when no starred projects', () => {
      // Arrange
      const nonStarredProject = { ...mockProject, metadata: { ...mockProjectData, starred: false } }
      
      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync.mockReturnValue(['non-starred.mdx'] as any)
      mockedFs.readFileSync.mockReturnValue('content' as any)
      mockedMatter.mockReturnValue({
        data: nonStarredProject.metadata,
        content: nonStarredProject.content,
        excerpt: '',
        orig: Buffer.from(''),
        language: '',
        matter: '',
        stringify: jest.fn()
      })

      // Act
      const result = getStarredProjects('EN')

      // Assert
      expect(result).toEqual([])
    })
  })

  describe('getProjectBySlug', () => {
    it('should return project for valid slug', () => {
      // Arrange
      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync.mockReturnValue(['test-project.mdx'] as any)
      mockedFs.readFileSync.mockReturnValue('mock content' as any)

      // Act
      const result = getProjectBySlug('test-project', 'EN')

      // Assert
      expect(result).not.toBeNull()
      expect(result?.slug).toBe('test-project')
    })

    it('should return null for invalid slug', () => {
      // Arrange
      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync.mockReturnValue(['other-project.mdx'] as any)
      mockedFs.readFileSync.mockReturnValue('mock content' as any)

      // Act
      const result = getProjectBySlug('non-existent-project', 'EN')

      // Assert
      expect(result).toBeNull()
    })

    it('should return null for non-existent slug', () => {
      // Arrange
      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync.mockReturnValue([] as any)

      // Act
      const result = getProjectBySlug('any-slug', 'EN')

      // Assert
      expect(result).toBeNull()
    })
  })

  describe('getProjectInBothLanguages', () => {
    it('should return project in both languages when available', () => {
      // Arrange
      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync
        .mockReturnValueOnce(['test-project.mdx'] as any)
        .mockReturnValueOnce(['test-project.fr.mdx'] as any)
      mockedFs.readFileSync.mockReturnValue('mock content' as any)

      // Act
      const result = getProjectInBothLanguages('test-project')

      // Assert
      expect(result.en).not.toBeNull()
      expect(result.fr).not.toBeNull()
      expect(result.en?.slug).toBe('test-project')
      expect(result.fr?.slug).toBe('test-project')
    })

    it('should return null for missing language versions', () => {
      // Arrange
      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync
        .mockReturnValueOnce(['test-project.mdx'] as any)
        .mockReturnValueOnce([] as any)
      mockedFs.readFileSync.mockReturnValue('mock content' as any)

      // Act
      const result = getProjectInBothLanguages('test-project')

      // Assert
      expect(result.en).not.toBeNull()
      expect(result.fr).toBeNull()
    })

    it('should return null for both languages when project does not exist', () => {
      // Arrange
      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync.mockReturnValue([] as any)

      // Act
      const result = getProjectInBothLanguages('non-existent-project')

      // Assert
      expect(result.en).toBeNull()
      expect(result.fr).toBeNull()
    })
  })

  describe('MDX file reading and parsing', () => {
    it('should handle valid MDX files', () => {
      // Arrange
      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync.mockReturnValue(['valid-project.mdx'] as any)
      mockedFs.readFileSync.mockReturnValue('valid content' as any)

      // Act
      const result = getProjects(undefined, 'EN')

      // Assert
      expect(result).toHaveLength(1)
      expect(mockedMatter).toHaveBeenCalledWith('valid content')
    })

    it('should handle missing files gracefully', () => {
      // Arrange
      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync.mockReturnValue(['missing-file.mdx'] as any)
      mockedFs.existsSync.mockImplementation((path) => {
        if (typeof path === 'string' && path.includes('missing-file.mdx')) return false
        return true
      })

      // Act
      const result = getProjects(undefined, 'EN')

      // Assert
      expect(result).toEqual([])
    })

    it('should handle corrupted files gracefully', () => {
      // Arrange
      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync.mockReturnValue(['corrupted-file.mdx'] as any)
      mockedFs.readFileSync.mockImplementation(() => {
        throw new Error('File read error')
      })

      // Act
      const result = getProjects(undefined, 'EN')

      // Assert
      expect(result).toEqual([])
    })

    it('should extract metadata from frontmatter correctly', () => {
      // Arrange
      const testMetadata = {
        title: 'Test Title',
        publishedAt: '2024-01-01',
        summary: 'Test Summary',
        image: '/test.jpg',
        images: ['/test1.jpg'],
        tag: ['Test'],
        team: [{ avatar: '/avatar.jpg' }],
        link: 'https://test.com',
        starred: true
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

      // Act
      const result = getProjects(undefined, 'EN')

      // Assert
      expect(result[0].metadata).toEqual(testMetadata)
    })

    it('should handle missing metadata fields with defaults', () => {
      // Arrange
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

      // Act
      const result = getProjects(undefined, 'EN')

      // Assert
      expect(result[0].metadata.summary).toBe('')
      expect(result[0].metadata.image).toBe('')
      expect(result[0].metadata.images).toEqual([])
      expect(result[0].metadata.tag).toEqual([])
      expect(result[0].metadata.team).toEqual([])
      expect(result[0].metadata.link).toBe('')
      expect(result[0].metadata.starred).toBe(false)
    })
  })

  describe('File system operations', () => {
    it('should handle directory that does not exist', () => {
      // Arrange
      mockedFs.existsSync.mockReturnValue(false)

      // Act
      const result = getProjects(undefined, 'EN')

      // Assert
      expect(result).toEqual([])
      expect(mockedFs.readdirSync).not.toHaveBeenCalled()
    })

    it('should handle empty directory', () => {
      // Arrange
      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync.mockReturnValue([] as any)

      // Act
      const result = getProjects(undefined, 'EN')

      // Assert
      expect(result).toEqual([])
    })

    it('should handle file system errors gracefully', () => {
      // Arrange
      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync.mockImplementation(() => {
        throw new Error('Permission denied')
      })

      // Act & Assert
      expect(() => getProjects(undefined, 'EN')).toThrow('Permission denied')
    })
  })

  describe('Language-specific behavior', () => {
    it('should filter English files correctly', () => {
      // Arrange
      const files = ['project1.mdx', 'project1.fr.mdx', 'project2.mdx', 'project3.fr.mdx']
      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync.mockReturnValue(files as any)
      mockedFs.readFileSync.mockReturnValue('content' as any)

      // Act
      const result = getProjects(undefined, 'EN')

      // Assert
      expect(result).toHaveLength(2) // Only project1.mdx and project2.mdx
    })

    it('should filter French files correctly', () => {
      // Arrange
      const files = ['project1.mdx', 'project1.fr.mdx', 'project2.mdx', 'project3.fr.mdx']
      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync.mockReturnValue(files as any)
      mockedFs.readFileSync.mockReturnValue('content' as any)

      // Act
      const result = getProjects(undefined, 'FR')

      // Assert
      expect(result).toHaveLength(2) // Only project1.fr.mdx and project3.fr.mdx
    })

    it('should remove .fr from slug for French files', () => {
      // Arrange
      mockedFs.existsSync.mockReturnValue(true)
      mockedFs.readdirSync.mockReturnValue(['test-project.fr.mdx'] as any)
      mockedFs.readFileSync.mockReturnValue('content' as any)

      // Act
      const result = getProjects(undefined, 'FR')

      // Assert
      expect(result[0].slug).toBe('test-project')
    })
  })
}) 