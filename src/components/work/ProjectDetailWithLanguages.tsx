"use client";

import { AvatarGroup, Button, Column, Flex, Heading, SmartImage, Text } from "@/once-ui/components";
import { formatDate } from "@/app/utils/formatDate";
import { Project } from "@/types/project";
import { useAtom } from 'jotai';
import { languageAtom, type Language } from '@/atoms/language';
import { useEffect, ReactNode, useMemo } from 'react';

interface ProjectDetailWithLanguagesProps {
  projects: {
    en: Project | null;
    fr: Project | null;
  };
  serverLanguage: Language;
  children: {
    en: ReactNode | null;
    fr: ReactNode | null;
  };
}

export function ProjectDetailWithLanguages({ projects, serverLanguage, children }: ProjectDetailWithLanguagesProps) {
  const [language, setLanguage] = useAtom(languageAtom);

  // Sync server language with client language atom
  useEffect(() => {
    setLanguage(serverLanguage);
  }, [serverLanguage, setLanguage]);

  // Get the current project and content based on selected language, with fallback
  const currentProject = useMemo(() => {
    if (language === 'FR' && projects.fr) {
      return projects.fr;
    } else if (language === 'EN' && projects.en) {
      return projects.en;
    }
    // Fallback to available language
    return projects.en || projects.fr;
  }, [language, projects]);

  const currentContent = useMemo(() => {
    if (language === 'FR' && projects.fr && children.fr) {
      return children.fr;
    } else if (language === 'EN' && projects.en && children.en) {
      return children.en;
    }
    // Fallback to available content
    return children.en || children.fr;
  }, [language, projects, children]);

  const getViewProjectText = () => {
    return language === 'FR' ? 'Voir le projet' : 'View Project';
  };

  if (!currentProject) {
    return null;
  }

  return (
    <Column maxWidth="m" gap="xl">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: currentProject.metadata.title,
            datePublished: currentProject.metadata.publishedAt,
            dateModified: currentProject.metadata.publishedAt,
            description: currentProject.metadata.summary,
            image: currentProject.metadata.image
              ? `${process.env.NEXT_PUBLIC_BASE_URL}${currentProject.metadata.image}`
              : `${process.env.NEXT_PUBLIC_BASE_URL}/og?title=${encodeURIComponent(currentProject.metadata.title)}`,
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/work/${currentProject.slug}`,
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
            {formatDate(currentProject.metadata.publishedAt, false, language)}
          </Text>
          <Heading variant="display-strong-s">{currentProject.metadata.title}</Heading>
          <Text variant="body-default-l" onBackground="neutral-weak">
            {currentProject.metadata.summary}
          </Text>
        </Column>
        {currentProject.metadata.images.length > 0 && (
          <SmartImage
            aspectRatio="16 / 9"
            radius="l"
            alt={currentProject.metadata.title}
            src={currentProject.metadata.images[0]}
          />
        )}
      </Column>
      <Column gap="l">
        {currentContent}
        <Flex fillWidth paddingTop="m" paddingBottom="xl" gap="xs" wrap>
          {currentProject.metadata.tag.map((tag) => (
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
        {currentProject.metadata.team && currentProject.metadata.team.length > 0 && (
          <Flex fillWidth paddingTop="m" paddingBottom="xl" gap="xs" wrap>
            <AvatarGroup
              avatars={currentProject.metadata.team.map((member) => ({
                src: member.avatar,
              }))}
              size="m"
            />
          </Flex>
        )}
        {currentProject.metadata.link && (
          <Button href={currentProject.metadata.link} variant="secondary" size="m">
            {getViewProjectText()}
          </Button>
        )}
      </Column>
    </Column>
  );
} 