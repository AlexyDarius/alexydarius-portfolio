import { notFound } from "next/navigation";
import { getProjectInBothLanguages } from "@/app/utils/projects";
import { baseURL } from "@/app/resources";
import ScrollToHash from "@/components/ScrollToHash";
import { Metadata } from "next";
import { headers, cookies } from 'next/headers';
import type { Language } from '@/atoms/language';
import { ProjectDetailWithLanguages } from "@/components/work/ProjectDetailWithLanguages";
import { CustomMDX } from "@/components/mdx";

// Force dynamic rendering to ensure cookies are read on each request
export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  // Get language from cookie first
  const languageCookie = (await cookies()).get('language')?.value as Language;
  
  let language: Language;
  if (languageCookie) {
    language = languageCookie;
  } else {
    // Fallback to Accept-Language header from browser
    const acceptLang = (await headers()).get('accept-language') || '';
    language = acceptLang.toLowerCase().includes('fr') ? 'FR' : 'EN';
  }
  
  const projects = getProjectInBothLanguages(slug);
  const project = language === 'FR' ? projects.fr : projects.en;

  if (!project) {
    return {
      title: "Project not found",
    };
  }

  const { title, publishedAt: publishedTime, summary: description, image } = project.metadata;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `${baseURL}/work/${project.slug}`,
      images: [
        {
          url: image || `${baseURL}/og?title=${encodeURIComponent(title)}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image || `${baseURL}/og?title=${encodeURIComponent(title)}`],
    },
  };
}

export default async function Project({ params }: Props) {
  // Get language from cookie first
  const languageCookie = (await cookies()).get('language')?.value as Language;
  
  let language: Language;
  if (languageCookie) {
    language = languageCookie;
  } else {
    // Fallback to Accept-Language header from browser
    const acceptLang = (await headers()).get('accept-language') || '';
    const browserLanguage = acceptLang.toLowerCase().includes('fr') ? 'FR' : 'EN';
    language = browserLanguage;
  }

  const { slug } = await params;
  const projects = getProjectInBothLanguages(slug);

  // If neither language version exists, return 404
  if (!projects.en && !projects.fr) {
    notFound();
  }

  return (
    <>
      <ScrollToHash />
      <ProjectDetailWithLanguages 
        projects={projects}
        serverLanguage={language}
      >
        {{
          en: projects.en ? <CustomMDX source={projects.en.content} /> : null,
          fr: projects.fr ? <CustomMDX source={projects.fr.content} /> : null,
        }}
      </ProjectDetailWithLanguages>
    </>
  );
}
