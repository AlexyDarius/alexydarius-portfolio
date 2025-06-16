import React from "react";
import { Meta } from "@/once-ui/modules";
import { baseURL } from "@/app/resources";
import * as defaultContent from "@/app/resources/content";
import { HomeContent } from "@/components/home/HomeContent";
import { getProjects, getStarredProjects } from "@/app/utils/projects";
import { getBlogPosts } from "@/app/utils/blog";
import { headers, cookies } from 'next/headers';
import type { Language } from '@/atoms/language';

export async function generateMetadata() {
  const { home } = defaultContent;
  const title = home.title;
  const description = home.description;
  const ogImage = home.image ? `${baseURL}${home.image}` : `${baseURL}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${baseURL}`,
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
  };
}

// Force dynamic rendering to ensure cookies are read on each request
export const dynamic = 'force-dynamic';

export default async function Home() {
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

  // Load latest project and starred projects based on detected language
  const latestProjects = getProjects([1, 1], language);
  const starredProjects = getStarredProjects(language);

  // Load blog posts server-side with language support
  const blogPosts = getBlogPosts(undefined, language);

  return (
    <HomeContent 
      latestProjects={latestProjects} 
      starredProjects={starredProjects}
      blogPosts={blogPosts}
      serverLanguage={language}
    />
  );
}

