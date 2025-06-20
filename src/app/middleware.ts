import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  
  // Skip API routes, static files, and Next.js internals
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/images/') ||
    pathname.startsWith('/trademark/')
  ) {
    return NextResponse.next();
  }

  // Check if it's a bot/crawler (for SEO)
  const userAgent = request.headers.get('user-agent') || '';
  const isBot = /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|sogou|facebook|twitter|linkedinbot|whatsapp|telegrambot/i.test(userAgent);

  // Check for language preference
  let preferredLanguage = 'EN';
  
  // Check URL path for language indicators (for SEO crawlers)
  if (pathname.endsWith('-fr') || pathname.includes('-fr/')) {
    preferredLanguage = 'FR';
  }
  // Check query parameter
  else if (search.includes('lang=fr') || search.includes('lang=FR')) {
    preferredLanguage = 'FR';
  }
  // Check cookie
  else {
    const languageCookie = request.cookies.get('language')?.value;
    if (languageCookie === 'FR') {
      preferredLanguage = 'FR';
    } else {
      // Check Accept-Language header
      const acceptLanguage = request.headers.get('accept-language');
      if (acceptLanguage && acceptLanguage.toLowerCase().includes('fr')) {
        preferredLanguage = 'FR';
      }
    }
  }

  // For bots: serve SEO-friendly URLs without redirects
  if (isBot) {
    const response = NextResponse.next();
    // Add language as a header for the page to read
    response.headers.set('x-language', preferredLanguage);
    return response;
  }

  // For users: ensure language query parameter is always present
  const url = request.nextUrl.clone();
  const currentLang = url.searchParams.get('lang');
  
  // If no language parameter or invalid, add/fix it
  if (!currentLang || (currentLang !== 'EN' && currentLang !== 'FR')) {
    url.searchParams.set('lang', preferredLanguage);
    return NextResponse.redirect(url);
  }

  // If language parameter exists and is valid, use it
  if (currentLang && (currentLang === 'EN' || currentLang === 'FR')) {
    preferredLanguage = currentLang;
  }

  // Add language header for server components
  const response = NextResponse.next();
  response.headers.set('x-language', preferredLanguage);
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|trademark).*)',
  ],
}; 