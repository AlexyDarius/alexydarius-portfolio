import { formatDate } from '@/app/utils/formatDate'
import type { Language } from '@/atoms/language'

describe('formatDate', () => {
  const fixedNow = new Date('2024-06-01T12:00:00')
  const realDateNow = Date.now

  beforeAll(() => {
    // Mock Date.now to always return fixedNow
    global.Date.now = jest.fn(() => fixedNow.getTime())
  })

  afterAll(() => {
    global.Date.now = realDateNow
  })

  describe('English formatting', () => {
    it('formats full date in English', () => {
      expect(formatDate('2024-05-15', false, 'EN')).toBe('May 15, 2024')
    })

    it('formats full date with relative (years ago)', () => {
      expect(formatDate('2022-06-01', true, 'EN')).toMatch(/^June 1, 2022 \(2y ago\)$/)
    })

    it('formats full date with relative (months ago)', () => {
      expect(formatDate('2024-04-01', true, 'EN')).toMatch(/^April 1, 2024 \(2mo ago\)$/)
    })

    it('formats full date with relative (days ago)', () => {
      expect(formatDate('2024-05-30', true, 'EN')).toMatch(/^May 30, 2024 \(2d ago\)$/)
    })

    it('formats full date with relative (today)', () => {
      expect(formatDate('2024-06-01', true, 'EN')).toMatch(/^June 1, 2024 \(Today\)$/)
    })

    it('formats full date for date string without time', () => {
      expect(formatDate('2024-05-15', false, 'EN')).toBe('May 15, 2024')
    })
  })

  describe('French formatting', () => {
    it('formats full date in French', () => {
      expect(formatDate('2024-05-15', false, 'FR')).toBe('15 mai 2024')
    })

    it('formats full date with relative (years ago)', () => {
      expect(formatDate('2022-06-01', true, 'FR')).toMatch(/^1 juin 2022 \(il y a 2 ans\)$/)
    })

    it('formats full date with relative (months ago)', () => {
      expect(formatDate('2024-04-01', true, 'FR')).toMatch(/^1 avril 2024 \(il y a 2 mois\)$/)
    })

    it('formats full date with relative (days ago)', () => {
      expect(formatDate('2024-05-30', true, 'FR')).toMatch(/^30 mai 2024 \(il y a 2 jours\)$/)
    })

    it('formats full date with relative (today)', () => {
      expect(formatDate('2024-06-01', true, 'FR')).toMatch(/^1 juin 2024 \(Aujourd'hui\)$/)
    })

    it('formats full date for date string without time', () => {
      expect(formatDate('2024-05-15', false, 'FR')).toBe('15 mai 2024')
    })
  })

  describe('Edge cases', () => {
    it('returns Invalid Date for invalid date string', () => {
      const result = formatDate('not-a-date', false, 'EN')
      expect(result).toMatch(/Invalid Date/)
    })

    it('handles future dates (returns Today if same day)', () => {
      expect(formatDate('2024-06-01', true, 'EN')).toMatch(/Today/)
      expect(formatDate('2024-06-01', true, 'FR')).toMatch(/Aujourd'hui/)
    })

    it('handles future dates (returns Today if future day in same month)', () => {
      expect(formatDate('2024-06-02', true, 'EN')).toMatch(/Today/)
      expect(formatDate('2024-06-02', true, 'FR')).toMatch(/Aujourd'hui/)
    })

    it('handles date strings with time component', () => {
      expect(formatDate('2024-05-15T10:30:00', false, 'EN')).toBe('May 15, 2024')
      expect(formatDate('2024-05-15T10:30:00', false, 'FR')).toBe('15 mai 2024')
    })
  })

  describe('Parameter variations', () => {
    it('defaults to EN if language not provided', () => {
      expect(formatDate('2024-05-15')).toBe('May 15, 2024')
    })

    it('returns only full date if includeRelative is false', () => {
      expect(formatDate('2024-05-15', false, 'EN')).toBe('May 15, 2024')
      expect(formatDate('2024-05-15', false, 'FR')).toBe('15 mai 2024')
    })

    it('returns full date with relative if includeRelative is true', () => {
      expect(formatDate('2022-06-01', true, 'EN')).toMatch(/\(2y ago\)$/)
      expect(formatDate('2022-06-01', true, 'FR')).toMatch(/\(il y a 2 ans\)$/)
    })
  })
}) 