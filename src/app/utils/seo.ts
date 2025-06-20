import type { Language } from '@/atoms/language';
import type { Metadata } from 'next';

interface SEOContent {
  title: string;
  description: string;
  image?: string;
}

export async function generateLanguageMetadata(
  lang: Language,
  pagePath: string,
  baseURL: string
): Promise<Metadata> {
  // Import the correct content based on language
  const content = lang === 'FR' 
    ? await import('@/app/resources/content.fr')
    : await import('@/app/resources/content');

  // Get page-specific content
  let pageContent: SEOContent;
  
  switch (pagePath) {
    case '/':
      pageContent = {
        title: content.home.title,
        description: content.home.description,
        image: content.home.image
      };
      break;
    case '/about':
      pageContent = {
        title: content.about.title,
        description: content.about.description
      };
      break;
    case '/work':
      pageContent = {
        title: content.work.title,
        description: content.work.description
      };
      break;
    case '/blog':
      pageContent = {
        title: content.blog.title,
        description: content.blog.description
      };
      break;
    default:
      pageContent = {
        title: content.home.title,
        description: content.home.description
      };
  }

  // Create language-specific URLs for hreflang
  const alternateUrls: Record<string, string> = {
    'en': `${baseURL}${pagePath}?lang=EN`,
    'fr': `${baseURL}${pagePath}?lang=FR`,
    'x-default': `${baseURL}${pagePath}?lang=EN`
  };

  return {
    title: pageContent.title,
    description: pageContent.description,
    alternates: {
      languages: alternateUrls
    },
    openGraph: {
      title: pageContent.title,
      description: pageContent.description,
      images: pageContent.image ? [`${baseURL}${pageContent.image}`] : [`${baseURL}/og?title=${encodeURIComponent(pageContent.title)}`],
      url: `${baseURL}${pagePath}?lang=${lang}`,
      siteName: content.person.name,
      locale: lang === 'FR' ? 'fr_FR' : 'en_US',
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: pageContent.title,
      description: pageContent.description,
      images: pageContent.image ? [`${baseURL}${pageContent.image}`] : [`${baseURL}/og?title=${encodeURIComponent(pageContent.title)}`]
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    // Add structured data (only if verification exists)
    ...(process.env.GOOGLE_SITE_VERIFICATION && {
      other: {
        'google-site-verification': process.env.GOOGLE_SITE_VERIFICATION,
      }
    })
  };
} 