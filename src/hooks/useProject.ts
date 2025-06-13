import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { languageAtom, type Language } from '@/atoms/language';
import type { Project } from '@/types/project';

export function useProject(slug: string, initialProject?: Project) {
  const [language] = useAtom(languageAtom);
  const [project, setProject] = useState<Project | null>(initialProject || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set('language', language);
        params.set('slug', slug);

        const response = await fetch(`/api/project?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          setProject(data.project);
        }
      } catch (error) {
        console.error('Failed to fetch project:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [language, slug]);

  return { project, loading };
} 