"use client";

import React from "react";
import { Heading, Flex, Text, Button, Avatar, RevealFx, Column, Badge, Row, SmartImage } from "@/once-ui/components";
import { baseURL } from "@/app/resources";
import { Schema } from "@/once-ui/modules";
import { useContent } from "@/app/resources/useContent";
import { ProjectsSection } from "@/components/work/ProjectsSection";
import { Project } from "@/types/project";
import { useAtom } from 'jotai';
import { languageAtom, type Language } from '@/atoms/language';
import { useEffect } from 'react';

interface HomeContentProps {
  latestProjects: Project[];
  starredProjects: Project[];
  serverLanguage: Language;
}

export function HomeContent({ latestProjects, starredProjects, serverLanguage }: HomeContentProps) {
  const [language, setLanguage] = useAtom(languageAtom);
  const { home, about, person, newsletter } = useContent();

  // Sync server language with client language atom
  useEffect(() => {
    setLanguage(serverLanguage);
  }, [serverLanguage, setLanguage]);

  const getLatestProjectText = () => {
    return language === 'FR' ? 'Projet récent' : 'Latest Project';
  };

  const getStarredProjectsText = () => {
    return language === 'FR' ? 'Projets en lumière' : 'Starred Projects';
  };

  return (
    <Column maxWidth="m" gap="xl" horizontal="center">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={home.path}
        title={home.title}
        description={home.description}
        image={home.image ? `${baseURL}${home.image}` : `${baseURL}/og?title=${encodeURIComponent(home.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Column fillWidth paddingY="24" gap="m">
        <Column maxWidth="s">
          {home.featured && (
            <RevealFx fillWidth horizontal="start" paddingTop="16" paddingBottom="32" paddingLeft="12">
              <Badge
                background="brand-alpha-weak"
                paddingX="12"
                paddingY="4"
                onBackground="neutral-strong"
                textVariant="label-default-s"
                arrow={false}
                href={home.featured.href}
              >
                <Row paddingY="2">{home.featured.title}</Row>
              </Badge>
            </RevealFx>
          )}
          <RevealFx translateY="4" fillWidth horizontal="start" paddingBottom="16">
            <Heading wrap="balance" variant="display-strong-l">
              {home.headline}
            </Heading>
          </RevealFx>
          <RevealFx translateY="8" delay={0.2} fillWidth horizontal="start" paddingBottom="32">
            <Text wrap="balance" onBackground="neutral-weak" variant="heading-default-xl">
              {home.subline}
            </Text>
          </RevealFx>
          <RevealFx paddingTop="12" delay={0.4} horizontal="start" paddingLeft="12">
            <Button
              id="about"
              data-border="rounded"
              href={about.path}
              variant="secondary"
              size="m"
              arrowIcon
            >
              <Flex gap="8" vertical="center">
                {about.avatar.display && (
                  <Avatar
                    style={{ marginLeft: "-0.75rem", marginRight: "0.25rem" }}
                    src={person.avatar}
                    size="m"
                  />
                )}
                {about.title}
              </Flex>
            </Button>
          </RevealFx>
        </Column>
        {home.image && (
          <RevealFx translateY="12" delay={0.5} fillWidth paddingTop="l">
            <SmartImage
              priority
              aspectRatio="16 / 9"
              radius="l"
              alt={home.title}
              src={home.image}
              sizes="(max-width: 768px) 100vw, 960px"
            />
          </RevealFx>
        )}
        {latestProjects.length > 0 && (
          <RevealFx translateY="8" delay={0.6} paddingTop="l">
            <ProjectsSection
              projects={latestProjects}
              title={getLatestProjectText()}
            />
          </RevealFx>
        )}
        {starredProjects.length > 0 && (
          <RevealFx translateY="8" delay={0.8} paddingTop="l">
            <ProjectsSection
              projects={starredProjects}
              title={getStarredProjectsText()}
            />
          </RevealFx>
        )}
      </Column>
    </Column>
  );
} 