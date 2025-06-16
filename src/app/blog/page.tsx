import { Column, Heading } from "@/once-ui/components";
import { Mailchimp } from "@/components";
import { BlogPostsGridClient } from "@/components/blog/BlogPostsGridClient";
import { getBlogPosts } from "@/app/utils/blog";
import { baseURL } from "@/app/resources";
import { blog, person, newsletter } from "@/app/resources/content";
import { Meta, Schema } from "@/once-ui/modules";
import { headers, cookies } from 'next/headers';
import type { Language } from '@/atoms/language';

export async function generateMetadata() {
  return Meta.generate({
    title: blog.title,
    description: blog.description,
    baseURL: baseURL,
    image: `${baseURL}/og?title=${encodeURIComponent(blog.title)}`,
    path: blog.path,
  });
}

export default async function Blog() {
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

  // Load blog posts with language support
  const allBlogPosts = getBlogPosts(undefined, language);

  return (
    <Column maxWidth="s">
      <Schema
        as="blog"
        baseURL={baseURL}
        title={blog.title}
        description={blog.description}
        path={blog.path}
        image={`${baseURL}/og?title=${encodeURIComponent(blog.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}/blog`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Heading marginBottom="l" variant="display-strong-s">
        {blog.title}
      </Heading>
      <Column fillWidth flex={1}>
        <BlogPostsGridClient initialPosts={allBlogPosts} range={[1, 1]} thumbnail direction="column"/>
        <BlogPostsGridClient initialPosts={allBlogPosts} range={[2, 3]} thumbnail/>
        <BlogPostsGridClient initialPosts={allBlogPosts} range={[4]} columns="2"/>
      </Column>
      {newsletter.display && <Mailchimp newsletter={newsletter} />}
    </Column>
  );
}
