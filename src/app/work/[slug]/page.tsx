import { notFound } from "next/navigation";
import { getProjects } from "@/app/utils/projects";
import { baseURL } from "@/app/resources";
import ScrollToHash from "@/components/ScrollToHash";
import { Metadata } from "next";
import { headers, cookies } from 'next/headers';
import type { Language } from '@/atoms/language';
import { ProjectDetail } from "@/components/work/ProjectDetail";
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
  
  const projects = getProjects(undefined, language);
  const project = projects.find((project) => project.slug === slug);

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
  const projects = getProjects(undefined, language);
  const project = projects.find((project) => project.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <>
      <ScrollToHash />
      <ProjectDetail 
        project={project} 
        serverLanguage={language}
      >
        <CustomMDX source={project.content} />
      </ProjectDetail>
    </>
  );
}
