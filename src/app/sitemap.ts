import { getPosts } from "@/app/utils/utils";
import { baseURL, routes as routesConfig } from "@/app/resources";

export default async function sitemap() {
  const supportedLanguages = ['EN', 'FR'];
  const today = new Date().toISOString().split("T")[0];

  // Generate language-specific blog URLs using query parameters
  const blogs: Array<{url: string; lastModified: string}> = [];
  const blogPosts = getPosts(["src", "app", "blog", "posts"]);
  
  blogPosts.forEach((post) => {
    supportedLanguages.forEach((lang) => {
      blogs.push({
        url: `https://${baseURL}/blog/${post.slug}?lang=${lang}`,
        lastModified: post.metadata.publishedAt,
      });
    });
  });

  // Generate language-specific work URLs using query parameters  
  const works: Array<{url: string; lastModified: string}> = [];
  const workProjects = getPosts(["src", "app", "work", "projects"]);
  
  workProjects.forEach((project) => {
    supportedLanguages.forEach((lang) => {
      works.push({
        url: `https://${baseURL}/work/${project.slug}?lang=${lang}`,
        lastModified: project.metadata.publishedAt,
      });
    });
  });

  // Generate language-specific page URLs using query parameters
  const activeRoutes = Object.keys(routesConfig).filter((route) => routesConfig[route as keyof typeof routesConfig]);
  const routes: Array<{url: string; lastModified: string}> = [];
  
  activeRoutes.forEach((route) => {
    supportedLanguages.forEach((lang) => {
      routes.push({
        url: `https://${baseURL}${route !== "/" ? route : ""}?lang=${lang}`,
        lastModified: today,
      });
    });
  });

  // Add root URLs without query parameters (will auto-redirect)
  routes.push({
    url: `https://${baseURL}`,
    lastModified: today,
  });

  // Add SEO-friendly French alias URLs (these redirect to query parameter versions)
  const frenchAliases: Array<{url: string; lastModified: string}> = [
    { url: `https://${baseURL}/fr`, lastModified: today },
    { url: `https://${baseURL}/fr/about`, lastModified: today },
    { url: `https://${baseURL}/fr/work`, lastModified: today },
    { url: `https://${baseURL}/fr/blog`, lastModified: today },
    { url: `https://${baseURL}/fr/gallery`, lastModified: today },
    { url: `https://${baseURL}/fr/cookie-policy`, lastModified: today },
    { url: `https://${baseURL}/fr/legal-notice`, lastModified: today },
    { url: `https://${baseURL}/fr/privacy-policy`, lastModified: today },
  ];

  return [...routes, ...blogs, ...works, ...frenchAliases];
}
