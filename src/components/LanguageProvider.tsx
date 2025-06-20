"use client";

import { useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { languageAtom, type Language } from '@/atoms/language';

interface LanguageProviderProps {
  children: React.ReactNode;
  initialLanguage?: Language;
}

export default function LanguageProvider({ children, initialLanguage }: LanguageProviderProps) {
  const [language, setLanguage] = useAtom(languageAtom);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isUpdatingRef = useRef(false);

  // Initialize language from URL or server on mount only
  useEffect(() => {
    if (isUpdatingRef.current) return;
    
    const urlLang = searchParams.get('lang') as Language;
    
    // Priority: URL param > server initial > current atom
    let targetLang = language;
    if (urlLang && (urlLang === 'EN' || urlLang === 'FR')) {
      targetLang = urlLang;
    } else if (initialLanguage && !urlLang) {
      targetLang = initialLanguage;
    }
    
    if (targetLang && targetLang !== language) {
      isUpdatingRef.current = true;
      setLanguage(targetLang);
      
      // Update cookie for persistence
      document.cookie = `language=${targetLang}; path=/; max-age=${60 * 60 * 24 * 365}`;
      
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 100);
    }
    
    // ALWAYS ensure URL has lang parameter
    if (!searchParams.get('lang') && targetLang) {
      isUpdatingRef.current = true;
      const params = new URLSearchParams(searchParams.toString());
      params.set('lang', targetLang);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 100);
    }
  }, []); // Only run on mount

  // Also ensure lang param is always present when URL changes (navigation)
  useEffect(() => {
    if (isUpdatingRef.current) return;
    
    const urlLang = searchParams.get('lang');
    
    // If no lang param but we have a language in atom, add it to URL
    if (!urlLang && language) {
      isUpdatingRef.current = true;
      const params = new URLSearchParams(searchParams.toString());
      params.set('lang', language);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 100);
    }
  }, [pathname, searchParams]); // Watch for navigation changes

  // Handle atom changes to update URL (when language is changed via LanguageToggle)
  useEffect(() => {
    if (isUpdatingRef.current) return;
    
    const currentUrlLang = searchParams.get('lang');
    
    if (language && currentUrlLang !== language) {
      isUpdatingRef.current = true;
      
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set('lang', language);
      
      // Update URL without causing a page reload
      const newUrl = `${pathname}?${newSearchParams.toString()}`;
      router.replace(newUrl, { scroll: false });
      
      // Update cookie
      document.cookie = `language=${language}; path=/; max-age=${60 * 60 * 24 * 365}`;
      
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 100);
    }
  }, [language]); // Only watch language changes

  return <>{children}</>;
} 