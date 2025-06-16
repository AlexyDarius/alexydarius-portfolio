"use client";

import { Heading } from "@/once-ui/components";
import { useContent } from "@/app/resources/useContent";
import { useAtom } from 'jotai';
import { languageAtom, type Language } from '@/atoms/language';
import { useEffect } from 'react';

interface BlogPageHeaderProps {
  serverLanguage: Language;
}

export function BlogPageHeader({ serverLanguage }: BlogPageHeaderProps) {
  const [language, setLanguage] = useAtom(languageAtom);
  const { blog } = useContent();

  // Sync server language with client language atom
  useEffect(() => {
    setLanguage(serverLanguage);
  }, [serverLanguage, setLanguage]);

  return (
    <Heading marginBottom="l" variant="display-strong-s">
      {blog.title}
    </Heading>
  );
} 