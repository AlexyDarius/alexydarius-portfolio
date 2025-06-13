"use client";

import { Column } from "@/once-ui/components";
import { ProjectCard } from "@/components";
import { Project } from "@/types/project";
import { useProjects } from "@/hooks/useProjects";

interface ProjectsProps {
  projects?: Project[];
  range?: [number, number?];
}

export function Projects({ projects: initialProjects = [], range }: ProjectsProps) {
  const { projects, loading } = useProjects(range, initialProjects);

  if (loading && projects.length === 0) {
    return null; // or a loading spinner
  }

  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <Column fillWidth gap="xl" marginBottom="40" paddingX="l" data-testid="projects-section">
      {projects.map((post, index) => (
        <ProjectCard
          priority={index < 2}
          key={post.slug}
          href={`work/${post.slug}`}
          images={post.metadata.images}
          title={post.metadata.title}
          description={post.metadata.summary}
          content={post.content}
          avatars={post.metadata.team?.map((member) => ({ src: member.avatar })) || []}
          link={post.metadata.link || ""}
          data-testid="project-card"
        />
      ))}
    </Column>
  );
}
