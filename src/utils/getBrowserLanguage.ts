import type { Language } from '@/atoms/language';

export const getBrowserLanguage = (): Language => {
  // Only run on client side
  if (typeof window === 'undefined') return 'EN';

  // Get browser language (returns something like 'en-US' or 'fr-FR')
  const browserLang = navigator.language.toLowerCase();

  // Check if it starts with 'fr' for French
  if (browserLang.startsWith('fr')) {
    return 'FR';
  }

  // Default to English for all other cases
  return 'EN';
}; 