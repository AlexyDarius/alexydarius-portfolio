"use client";

import { Column, Row, Icon, HeadingNav } from "@/once-ui/components";
import { useAtom } from 'jotai';
import { languageAtom, type Language } from '@/atoms/language';
import { useContent } from '@/app/resources/useContent';
import { useEffect } from 'react';

interface BlogSidebarClientProps {
  language: Language;
}

export function BlogSidebarClient({ language }: BlogSidebarClientProps) {
  const [currentLanguage, setLanguage] = useAtom(languageAtom);
  const { blog } = useContent();

  // Sync server language with client language atom
  useEffect(() => {
    setLanguage(language);
  }, [language, setLanguage]);

  return (
    <Column maxWidth={12} paddingLeft="40" fitHeight position="sticky" top="80" gap="16" hide="m">
      <Row
        gap="12"
        paddingLeft="2"
        vertical="center"
        onBackground="neutral-medium"
        textVariant="label-default-s"
      >
        <Icon name="document" size="xs" />
        {blog.onThisPage}
      </Row>
      <HeadingNav fitHeight language={currentLanguage} />
    </Column>
  );
} 