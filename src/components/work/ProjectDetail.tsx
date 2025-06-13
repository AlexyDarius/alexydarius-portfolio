"use client";

import { AvatarGroup, Button, Column, Flex, Heading, SmartImage, Text } from "@/once-ui/components";
import { formatDate } from "@/app/utils/formatDate";
import { Project } from "@/types/project";
import { useAtom } from 'jotai';
import { languageAtom, type Language } from '@/atoms/language';
import { useEffect, ReactNode } from 'react';

interface ProjectDetailProps {
  project: Project;
  serverLanguage: Language;
  children: ReactNode;
}

export function ProjectDetail({ project, serverLanguage, children }: ProjectDetailProps) {
  const [language, setLanguage] = useAtom(languageAtom);

  // Sync server language with client language atom
  useEffect(() => {
    setLanguage(serverLanguage);
  }, [serverLanguage, setLanguage]);

  // If language changed from server language, reload the page to get new content
  useEffect(() => {
    if (language !== serverLanguage) {
      window.location.reload();
    }
  }, [language, serverLanguage]);

  return (
    <Column maxWidth="m" gap="xl">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: project.metadata.title,
            datePublished: project.metadata.publishedAt,
            dateModified: project.metadata.publishedAt,
            description: project.metadata.summary,
            image: project.metadata.image
              ? `${process.env.NEXT_PUBLIC_BASE_URL}${project.metadata.image}`
              : `${process.env.NEXT_PUBLIC_BASE_URL}/og?title=${encodeURIComponent(project.metadata.title)}`,
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/work/${project.slug}`,
            author: {
              "@type": "Person",
              name: "Alexy Roman",
            },
          }),
        }}
      />
      <Column gap="l">
        <Column gap="m">
          <Text variant="label-default-s" onBackground="neutral-weak">
            {formatDate(project.metadata.publishedAt)}
          </Text>
          <Heading variant="display-strong-s">{project.metadata.title}</Heading>
          <Text variant="body-default-l" onBackground="neutral-weak">
            {project.metadata.summary}
          </Text>
        </Column>
        {project.metadata.images.length > 0 && (
          <SmartImage
            aspectRatio="16 / 9"
            radius="l"
            alt={project.metadata.title}
            src={project.metadata.images[0]}
          />
        )}
      </Column>
      <Column gap="l">
        {children}
        <Flex fillWidth paddingTop="m" paddingBottom="xl" gap="xs" wrap>
          {project.metadata.tag.map((tag) => (
            <Text
              key={tag}
              variant="label-default-s"
              style={{
                border: "1px solid var(--neutral-alpha-medium)",
                borderRadius: "var(--radius-full)",
                padding: "var(--static-space-4) var(--static-space-8)",
              }}
            >
              {tag}
            </Text>
          ))}
        </Flex>
        {project.metadata.team && project.metadata.team.length > 0 && (
          <Flex fillWidth paddingTop="m" paddingBottom="xl" gap="xs" wrap>
            <AvatarGroup
              avatars={project.metadata.team.map((member) => ({
                src: member.avatar,
              }))}
              size="m"
            />
          </Flex>
        )}
        {project.metadata.link && (
          <Button href={project.metadata.link} variant="secondary" size="m">
            View Project
          </Button>
        )}
      </Column>
    </Column>
  );
} 