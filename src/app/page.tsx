import React from "react";
import { Meta } from "@/once-ui/modules";
import { baseURL } from "@/app/resources";
import * as defaultContent from "@/app/resources/content";
import { HomeContent } from "@/components/home/HomeContent";
import { getProjects } from "@/app/utils/projects";
import { headers, cookies } from 'next/headers';
import type { Language } from '@/atoms/language';

export async function generateMetadata() {
  const { home } = defaultContent;
  return Meta.generate({
    title: home.title,
    description: home.description,
    baseURL: baseURL,
    path: home.path,
  });
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

  // Load projects based on detected language
  const projects = getProjects([1, 1], language);

  return (
    <HomeContent 
      projects={projects} 
      serverLanguage={language}
    />
  );
}

