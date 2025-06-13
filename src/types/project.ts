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