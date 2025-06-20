import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Language } from '@/atoms/language';

export interface BlogPost {
  slug: string;
  metadata: {
    title: string;
    publishedAt: string;
    summary: string;
    image?: string;
    tag?: string;
  };
  content: string;
}

function getMDXFiles(dir: string, language: Language = 'EN') {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const files = fs.readdirSync(dir);
  
  if (language === 'FR') {
    // For French, look for .fr.mdx files
    return files.filter((file) => file.endsWith('.fr.mdx'));
  } else {
    // For English, look for .mdx files that are NOT .fr.mdx
    return files.filter((file) => file.endsWith('.mdx') && !file.endsWith('.fr.mdx'));
  }
}

function readMDXFile(filePath: string): BlogPost | null {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const rawContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(rawContent);

    const metadata = {
      title: data.title || "",
      publishedAt: data.publishedAt,
      summary: data.summary || "",
      image: data.image || "",
      tag: data.tag || "",
    };

    // Remove .fr from slug for French files to keep URLs consistent
    const slug = path.basename(filePath, path.extname(filePath)).replace('.fr', '');
    
    return { metadata, content, slug };
  } catch (e) {
    return null;
  }
}

export function getBlogPosts(range?: [number, number?], language: Language = 'EN'): BlogPost[] {
  const postsDir = path.join(process.cwd(), 'src', 'app', 'blog', 'posts');
  const mdxFiles = getMDXFiles(postsDir, language);
  
  const posts = mdxFiles
    .map((file) => readMDXFile(path.join(postsDir, file)))
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => {
      return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime();
    });

  if (range) {
    return posts.slice(range[0] - 1, range[1] ?? posts.length);
  }

  return posts;
}

export function getBlogPostBySlug(slug: string, language: Language = 'EN'): BlogPost | null {
  const posts = getBlogPosts(undefined, language);
  return posts.find(post => post.slug === slug) || null;
}

export function getBlogPostInBothLanguages(slug: string): { en: BlogPost | null, fr: BlogPost | null } {
  const enPost = getBlogPostBySlug(slug, 'EN');
  const frPost = getBlogPostBySlug(slug, 'FR');
  
  return {
    en: enPost,
    fr: frPost
  };
} 