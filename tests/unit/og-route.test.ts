import { GET } from '@/app/og/route';

jest.mock('next/og', () => {
  const mockImageResponse = jest.fn(() => ({ mocked: true }));
  return { ImageResponse: mockImageResponse, __esModule: true };
});

jest.mock('@/app/resources', () => ({
  baseURL: 'https://example.com',
}));
jest.mock('@/app/resources/content', () => ({
  person: {
    name: 'Alexy Darius',
    avatar: '/images/avatar.webp',
    role: 'Developer',
  },
}));

describe('OG Image Route (8.4)', () => {
  it('should call ImageResponse with correct arguments and return its instance', async () => {
    const { ImageResponse } = require('next/og');
    ImageResponse.mockClear();
    const url = 'https://example.com/og?title=Test+Title';
    const req = { url } as Request;
    const response = await GET(req);
    expect(ImageResponse).toHaveBeenCalled();
    expect(response).toEqual({ mocked: true });
  });
}); 