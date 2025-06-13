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

export async function generateMetadata() {
  const { work } = defaultContent;
  return Meta.generate({
    title: work.title,
    description: work.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(work.title)}`,
    path: work.path,
  });
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

