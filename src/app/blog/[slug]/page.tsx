import { notFound } from "next/navigation";
import { CustomMDX } from "@/components/mdx";
import { getBlogPosts, getBlogPostInBothLanguages } from "@/app/utils/blog";
import { BlogDetailWithLanguages } from "@/components/blog/BlogDetailWithLanguages";
import { Row } from "@/once-ui/components";
import { about, blog, person, baseURL } from "@/app/resources";
import ScrollToHash from "@/components/ScrollToHash";
import { Metadata } from 'next';
import { Meta, Schema } from "@/once-ui/modules";
import { headers, cookies } from 'next/headers';
import type { Language } from '@/atoms/language';
import { BlogSidebarClient } from "@/components/blog/BlogSidebarClient";

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const enPosts = getBlogPosts(undefined, 'EN');
  const frPosts = getBlogPosts(undefined, 'FR');
  
  // Get unique slugs from both languages
  const allSlugs = new Set([
    ...enPosts.map(post => post.slug),
    ...frPosts.map(post => post.slug)
  ]);
  
  return Array.from(allSlugs).map(slug => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string | string[] }>;
}): Promise<Metadata> {
  const routeParams = await params;
  const slugPath = Array.isArray(routeParams.slug) ? routeParams.slug.join('/') : routeParams.slug || '';

  // Get language from cookie for metadata
  const languageCookie = (await cookies()).get('language')?.value as Language;
  let language: Language;
  if (languageCookie) {
    language = languageCookie;
  } else {
    const acceptLang = (await headers()).get('accept-language') || '';
    language = acceptLang.toLowerCase().includes('fr') ? 'FR' : 'EN';
  }

  const posts = getBlogPostInBothLanguages(slugPath);
  const post = (language === 'FR' && posts.fr) ? posts.fr : posts.en;

  if (!post) return {};

  return Meta.generate({
    title: post.metadata.title,
    description: post.metadata.summary,
    baseURL: baseURL,
    image: post.metadata.image ? `${baseURL}${post.metadata.image}` : `${baseURL}/og?title=${post.metadata.title}`,
    path: `${blog.path}/${post.slug}`,
  });
}

export default async function Blog({
  params
}: { params: Promise<{ slug: string | string[] }> }) {
  const routeParams = await params;
  const slugPath = Array.isArray(routeParams.slug) ? routeParams.slug.join('/') : routeParams.slug || '';

  // Get language from cookie
  const languageCookie = (await cookies()).get('language')?.value as Language;
  let language: Language;
  if (languageCookie) {
    language = languageCookie;
  } else {
    const acceptLang = (await headers()).get('accept-language') || '';
    language = acceptLang.toLowerCase().includes('fr') ? 'FR' : 'EN';
  }

  const posts = getBlogPostInBothLanguages(slugPath);
  
  if (!posts.en && !posts.fr) {
    notFound();
  }

  const currentPost = (language === 'FR' && posts.fr) ? posts.fr : (posts.en || posts.fr);

  if (!currentPost) {
    notFound();
  }

  return (
    <Row fillWidth>
      <Row maxWidth={12} hide="m"/>
      <Row fillWidth horizontal="center">
        <Schema
          as="blogPosting"
          baseURL={baseURL}
          path={`${blog.path}/${currentPost.slug}`}
          title={currentPost.metadata.title}
          description={currentPost.metadata.summary}
          datePublished={currentPost.metadata.publishedAt}
          dateModified={currentPost.metadata.publishedAt}
          image={currentPost.metadata.image ? `${baseURL}${currentPost.metadata.image}` : `${baseURL}/og?title=${encodeURIComponent(currentPost.metadata.title)}`}
          author={{
            name: person.name,
            url: `${baseURL}${about.path}`,
            image: `${baseURL}${person.avatar}`,
          }}
        />
        <BlogDetailWithLanguages
          posts={posts}
          serverLanguage={language}
        >
          {{
            en: posts.en ? <CustomMDX source={posts.en.content} /> : null,
            fr: posts.fr ? <CustomMDX source={posts.fr.content} /> : null,
          }}
        </BlogDetailWithLanguages>
        <ScrollToHash />
      </Row>
      <BlogSidebarClient language={language} />
    </Row>
  );
}
