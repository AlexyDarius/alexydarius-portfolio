import { useRouter, useSearchParams } from 'next/navigation';
import { useAtom } from 'jotai';
import { languageAtom } from '@/atoms/language';

export function useNavigateWithLanguage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [language] = useAtom(languageAtom);

  const navigate = (path: string, options?: { scroll?: boolean }) => {
    // Always include the current language parameter
    const params = new URLSearchParams();
    params.set('lang', language);
    
    // Preserve any existing query parameters except lang
    searchParams.forEach((value, key) => {
      if (key !== 'lang') {
        params.set(key, value);
      }
    });

    const finalUrl = `${path}?${params.toString()}`;
    router.push(finalUrl, options);
  };

  const replace = (path: string, options?: { scroll?: boolean }) => {
    // Always include the current language parameter
    const params = new URLSearchParams();
    params.set('lang', language);
    
    // Preserve any existing query parameters except lang
    searchParams.forEach((value, key) => {
      if (key !== 'lang') {
        params.set(key, value);
      }
    });

    const finalUrl = `${path}?${params.toString()}`;
    router.replace(finalUrl, options);
  };

  return { navigate, replace };
} 