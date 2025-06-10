import { atomWithStorage } from 'jotai/utils';

export type Language = 'EN' | 'FR';

// Initialize with a fixed value to avoid hydration mismatch
export const languageAtom = atomWithStorage<Language>('language', 'EN'); 