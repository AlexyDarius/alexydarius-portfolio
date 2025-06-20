"use client";

import Link from 'next/link';
import { useAtom } from 'jotai';
import { useSearchParams } from 'next/navigation';
import { languageAtom } from '@/atoms/language';

interface LanguageAwareLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  [key: string]: any; // Allow other Link props
}

export default function LanguageAwareLink({ href, children, ...props }: LanguageAwareLinkProps) {
  const [language] = useAtom(languageAtom);
  const searchParams = useSearchParams();

  // Create URL with language parameter
  const createLanguageAwareHref = (originalHref: string) => {
    const url = new URL(originalHref, window.location.origin);
    
    // Set the current language
    url.searchParams.set('lang', language);
    
    // Preserve other existing query parameters if they don't conflict
    searchParams.forEach((value, key) => {
      if (key !== 'lang' && !url.searchParams.has(key)) {
        url.searchParams.set(key, value);
      }
    });

    return `${url.pathname}${url.search}`;
  };

  return (
    <Link href={createLanguageAwareHref(href)} {...props}>
      {children}
    </Link>
  );
} 