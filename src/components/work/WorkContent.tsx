"use client";

import React from "react";
import { Projects } from "@/components/work/Projects";
import { Column } from "@/once-ui/components";
import { Project } from "@/types/project";
import { useAtom } from 'jotai';
import { languageAtom, type Language } from '@/atoms/language';
import { useEffect } from 'react';

interface WorkContentProps {
  projects: Project[];
  serverLanguage: Language;
}

export function WorkContent({ projects, serverLanguage }: WorkContentProps) {
  const [, setLanguage] = useAtom(languageAtom);

  // Sync server language with client language atom
  useEffect(() => {
    setLanguage(serverLanguage);
  }, [serverLanguage, setLanguage]);

  return (
    <Column maxWidth="m">
      <Projects projects={projects} />
    </Column>
  );
} 