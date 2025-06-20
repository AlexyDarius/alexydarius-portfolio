import React from "react";
import { Meta, Schema } from "@/once-ui/modules";
import { baseURL } from "@/app/resources";
import * as defaultContent from "@/app/resources/content";
import { getProjects } from "@/app/utils/projects";
import { headers, cookies } from 'next/headers';
import type { Language } from '@/atoms/language';
import { WorkContent } from "@/components/work/WorkContent";

// Force dynamic rendering to ensure cookies are read on each request
export const dynamic = 'force-dynamic';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const params = await searchParams;
  const language = (params?.lang === 'FR' ? 'FR' : 'EN') as Language;

  // Import the correct content based on language
  const content = language === 'FR' 
    ? await import('@/app/resources/content.fr')
    : await import('@/app/resources/content');
  
  const { work } = content;
  const title = work.title;
  const description = work.description;
  const ogImage = `/api/og/generate?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${baseURL}/work?lang=${language}`,
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
        'en': `${baseURL}/work?lang=EN`,
        'fr': `${baseURL}/work?lang=FR`,
        'x-default': `${baseURL}/work?lang=EN`
      }
    }
  };
}

export default async function Work() {
  // Get language from cookie first
  const languageCookie = (await cookies()).get('language')?.value as Language;
  
  let language: Language;
  if (languageCookie) {
    language = languageCookie;
  } else {
    // Fallback to Accept-Language header
    const acceptLang = (await headers()).get('accept-language') || '';
    language = acceptLang.toLowerCase().includes('fr') ? 'FR' : 'EN';
  }

  // Load all projects based on detected language
  const projects = getProjects(undefined, language);

  return (
    <>
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={defaultContent.work.path}
        title={defaultContent.work.title}
        description={defaultContent.work.description}
        image={`/api/og/generate?title=${encodeURIComponent(defaultContent.work.title)}`}
        author={{
          name: defaultContent.person.name,
          url: `${baseURL}${defaultContent.about.path}`,
          image: `${baseURL}${defaultContent.person.avatar}`,
        }}
      />
      <WorkContent 
        projects={projects} 
        serverLanguage={language}
      />
    </>
  );
}

