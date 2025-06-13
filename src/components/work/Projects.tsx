"use client";

import { Column } from "@/once-ui/components";
import { ProjectCard } from "@/components";
import { Project } from "@/app/utils/projects";

interface ProjectsProps {
  projects?: Project[];
}

export function Projects({ projects = [] }: ProjectsProps) {
  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <Column fillWidth gap="xl" marginBottom="40" paddingX="l">
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
        />
      ))}
    </Column>
  );
}
