import React from "react";
import { Meta } from "@/once-ui/modules";
import { baseURL } from "@/app/resources";
import type { Language } from '@/atoms/language';
import { AboutContent } from "@/components/about/AboutContent";

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const params = await searchParams;
  const language = (params?.lang === 'FR' ? 'FR' : 'EN') as Language;

  // Import the correct content based on language
  const content = language === 'FR' 
    ? await import('@/app/resources/content.fr')
    : await import('@/app/resources/content');
  
  const { about } = content;
  const title = about.title;
  const description = about.description;
  const ogImage = `${baseURL}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${baseURL}/about?lang=${language}`,
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
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      languages: {
        'en': `${baseURL}/about?lang=EN`,
        'fr': `${baseURL}/about?lang=FR`,
        'x-default': `${baseURL}/about?lang=EN`
      }
    }
  };
}

export default async function About() {
  return <AboutContent />;
}
