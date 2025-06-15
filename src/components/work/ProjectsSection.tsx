"use client";

import { Column, Heading, Text } from "@/once-ui/components";
import { ProjectCard } from "@/components";
import { Project } from "@/types/project";

interface ProjectsSectionProps {
  projects: Project[];
  title: string;
  description?: string;
}

export function ProjectsSection({ projects, title, description }: ProjectsSectionProps) {
  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <Column fillWidth gap="l">
      <Column gap="xs" paddingX="l">
        <Heading variant="heading-strong-xl">{title}</Heading>
        {description && (
          <Text variant="body-default-m" onBackground="neutral-weak">
            {description}
          </Text>
        )}
      </Column>
      <Column fillWidth gap="xl" paddingX="l">
        {projects.map((project, index) => (
          <ProjectCard
            priority={index < 2}
            key={project.slug}
            href={`work/${project.slug}`}
            images={project.metadata.images}
            title={project.metadata.title}
            description={project.metadata.summary}
            content={project.content}
            avatars={project.metadata.team?.map((member) => ({ src: member.avatar })) || []}
            link={project.metadata.link || ""}
          />
        ))}
      </Column>
    </Column>
  );
} 