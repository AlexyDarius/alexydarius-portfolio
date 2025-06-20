import { baseURL } from "@/app/resources";
import type { Language } from '@/atoms/language';

export async function generateLegalPageMetadata(
  page: 'cookiePolicy' | 'legalNotice' | 'privacyPolicy',
  searchParams: Promise<{ lang?: string }>
) {
  const params = await searchParams;
  const language = (params?.lang === 'FR' ? 'FR' : 'EN') as Language;

  // Import the correct content based on language
  const content = language === 'FR' 
    ? await import('@/app/resources/content.fr')
    : await import('@/app/resources/content');
  
  const { legal } = content;
  const pageContent = legal[page];
  const title = pageContent.title;
  const description = `${pageContent.title} - ${content.person.name}`;
  const ogImage = `${baseURL}/og?title=${encodeURIComponent(title)}`;
  
  const pagePath = page === 'cookiePolicy' ? 'cookie-policy' : 
                   page === 'legalNotice' ? 'legal-notice' : 
                   'privacy-policy';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website" as const,
      url: `${baseURL}/${pagePath}?lang=${language}`,
      siteName: content.person.name,
      locale: language === 'FR' ? 'fr_FR' : 'en_US',
      images: [
        {
          url: ogImage,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      languages: {
        'en': `${baseURL}/${pagePath}?lang=EN`,
        'fr': `${baseURL}/${pagePath}?lang=FR`,
        'x-default': `${baseURL}/${pagePath}?lang=EN`
      }
    }
  };
} 