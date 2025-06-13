import { NextRequest, NextResponse } from 'next/server';
import { getProjects } from '@/app/utils/projects';
import type { Language } from '@/atoms/language';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const language = (searchParams.get('language') || 'EN') as Language;
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    let range: [number, number?] | undefined;
    if (start) {
      const startNum = parseInt(start, 10);
      const endNum = end ? parseInt(end, 10) : undefined;
      range = [startNum, endNum];
    }

    const projects = getProjects(range, language);

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
} 