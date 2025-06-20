import React from 'react'
import { render, screen } from '@testing-library/react'
import MasonryGrid from '@/components/gallery/MasonryGrid'

// Mock gallery.images
jest.mock('@/app/resources/content', () => ({
  gallery: {
    images: [
      { src: '/img1.jpg', alt: 'Image 1', orientation: 'horizontal' },
      { src: '/img2.jpg', alt: 'Image 2', orientation: 'vertical' },
      { src: '/img3.jpg', alt: 'Image 3', orientation: 'horizontal' },
    ]
  }
}))

// Mock SmartImage
jest.mock('@/once-ui/components', () => ({
  SmartImage: ({ src, alt, aspectRatio, priority, ...props }: any) => (
    <img data-testid="smart-image" src={src} alt={alt} data-aspect={aspectRatio} data-priority={priority} {...props} />
  )
}))

// Mock react-masonry-css
jest.mock('react-masonry-css', () => ({
  __esModule: true,
  default: ({ children, ...props }: any) => <div data-testid="masonry" {...props}>{children}</div>
}))

describe('MasonryGrid', () => {
  it('renders a masonry grid', () => {
    render(<MasonryGrid />)
    expect(screen.getByTestId('masonry')).toBeInTheDocument()
  })

  it('renders all gallery images as SmartImage', () => {
    render(<MasonryGrid />)
    const images = screen.getAllByTestId('smart-image')
    expect(images).toHaveLength(3)
    expect(images[0]).toHaveAttribute('src', '/img1.jpg')
    expect(images[1]).toHaveAttribute('src', '/img2.jpg')
    expect(images[2]).toHaveAttribute('src', '/img3.jpg')
  })

  it('sets correct aspect ratio for horizontal and vertical images', () => {
    render(<MasonryGrid />)
    const images = screen.getAllByTestId('smart-image')
    expect(images[0]).toHaveAttribute('data-aspect', '16 / 9')
    expect(images[1]).toHaveAttribute('data-aspect', '3 / 4')
    expect(images[2]).toHaveAttribute('data-aspect', '16 / 9')
  })

  it('sets alt text correctly', () => {
    render(<MasonryGrid />)
    const images = screen.getAllByTestId('smart-image')
    expect(images[0]).toHaveAttribute('alt', 'Image 1')
    expect(images[1]).toHaveAttribute('alt', 'Image 2')
    expect(images[2]).toHaveAttribute('alt', 'Image 3')
  })

  it('sets priority true for first 10 images', () => {
    render(<MasonryGrid />)
    const images = screen.getAllByTestId('smart-image')
    images.forEach((img, i) => {
      expect(img).toHaveAttribute('data-priority', 'true')
    })
  })
}) 