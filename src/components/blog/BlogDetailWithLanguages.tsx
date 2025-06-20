"use client";

import { Button, Column, Heading, Row, Text } from "@/once-ui/components";
import { formatDate } from "@/app/utils/formatDate";
import { BlogPost } from "@/app/utils/blog";
import { useAtom } from 'jotai';
import { languageAtom, type Language } from '@/atoms/language';
import { useEffect, ReactNode, useMemo } from 'react';

interface BlogDetailWithLanguagesProps {
  posts: {
    en: BlogPost | null;
    fr: BlogPost | null;
  };
  serverLanguage: Language;
  children: {
    en: ReactNode | null;
    fr: ReactNode | null;
  };
}

export function BlogDetailWithLanguages({ posts, serverLanguage, children }: BlogDetailWithLanguagesProps) {
  const [language, setLanguage] = useAtom(languageAtom);

  // Sync server language with client language atom
  useEffect(() => {
    setLanguage(serverLanguage);
  }, [serverLanguage, setLanguage]);

  // Get the current post and content based on selected language, with fallback
  const currentPost = useMemo(() => {
    if (language === 'FR' && posts.fr) {
      return posts.fr;
    } else if (language === 'EN' && posts.en) {
      return posts.en;
    }
    // Fallback to available language
    return posts.en || posts.fr;
  }, [language, posts]);

  const currentContent = useMemo(() => {
    if (language === 'FR' && posts.fr && children.fr) {
      return children.fr;
    } else if (language === 'EN' && posts.en && children.en) {
      return children.en;
    }
    // Fallback to available content
    return children.en || children.fr;
  }, [language, posts, children]);

  const getPostsText = () => {
    return language === 'FR' ? 'Articles' : 'Posts';
  };

  if (!currentPost) {
    return null;
  }

  return (
    <Column as="section" maxWidth="xs" gap="l">
      <Button data-border="rounded" href={`/blog?lang=${language}`} weight="default" variant="tertiary" size="s" prefixIcon="chevronLeft">
        {getPostsText()}
      </Button>
      <Heading variant="display-strong-s">{currentPost.metadata.title}</Heading>
      <Row gap="12" vertical="center">
        <Text variant="body-default-s" onBackground="neutral-weak">
          {currentPost.metadata.publishedAt && formatDate(currentPost.metadata.publishedAt, false, language)}
        </Text>
      </Row>
      <Column as="article" fillWidth>
        {currentContent}
      </Column>
    </Column>
  );
} 