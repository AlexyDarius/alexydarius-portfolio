import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { languageAtom, type Language } from '@/atoms/language';
import type { Project } from '@/types/project';

export function useProjects(range?: [number, number?], initialProjects?: Project[]) {
  const [language] = useAtom(languageAtom);
  const [projects, setProjects] = useState<Project[]>(initialProjects || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set('language', language);
        if (range) {
          params.set('start', range[0].toString());
          if (range[1]) {
            params.set('end', range[1].toString());
          }
        }

        const response = await fetch(`/api/projects?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          setProjects(data.projects);
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [language, range]);

  return { projects, loading };
} 