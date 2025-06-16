import { NextRequest, NextResponse } from 'next/server';
import { getBlogPosts } from '@/app/utils/blog';
import type { Language } from '@/atoms/language';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const language = (searchParams.get('language') as Language) || 'EN';

  try {
    const posts = getBlogPosts(undefined, language);
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json([], { status: 500 });
  }
} 