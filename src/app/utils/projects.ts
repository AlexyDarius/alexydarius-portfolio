import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface Project {
  slug: string;
  metadata: {
    title: string;
    publishedAt: string;
    summary: string;
    image: string;
    images: string[];
    tag: string[];
    team: Array<{ avatar: string }>;
    link: string;
  };
  content: string;
}

function getMDXFiles(dir: string) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

function readMDXFile(filePath: string): Project | null {
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
  };

  return { metadata, content, slug: path.basename(filePath, path.extname(filePath)) };
}

export function getProjects(range?: [number, number?]): Project[] {
  const postsDir = path.join(process.cwd(), 'src', 'app', 'work', 'projects');
  const mdxFiles = getMDXFiles(postsDir);
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