import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Language } from '@/atoms/language';
import type { Project } from '@/types/project';

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

function readMDXFile(filePath: string): Project | null {
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
      images: data.images || [],
      tag: data.tag || [],
      team: data.team || [],
      link: data.link || "",
      starred: data.starred || false,
    };

    // Remove .fr from slug for French files to keep URLs consistent
    const slug = path.basename(filePath, path.extname(filePath)).replace('.fr', '');
    
    return { metadata, content, slug };
  } catch (e) {
    return null;
  }
}

export function getProjects(range?: [number, number?], language: Language = 'EN'): Project[] {
  const postsDir = path.join(process.cwd(), 'src', 'app', 'work', 'projects');
  const mdxFiles = getMDXFiles(postsDir, language);
  
  const projects = mdxFiles
    .map((file) => readMDXFile(path.join(postsDir, file)))
    .filter((project): project is Project => project !== null)
    .sort((a, b) => {
      return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime();
    });

  if (range) {
    return projects.slice(range[0] - 1, range[1] ?? projects.length);
  }

  return projects;
}

export function getStarredProjects(language: Language = 'EN'): Project[] {
  const allProjects = getProjects(undefined, language);
  return allProjects.filter(project => project.metadata.starred);
}

export function getProjectBySlug(slug: string, language: Language = 'EN'): Project | null {
  const projects = getProjects(undefined, language);
  return projects.find(project => project.slug === slug) || null;
}

export function getProjectInBothLanguages(slug: string): { en: Project | null, fr: Project | null } {
  const enProject = getProjectBySlug(slug, 'EN');
  const frProject = getProjectBySlug(slug, 'FR');
  
  return {
    en: enProject,
    fr: frProject
  };
} 