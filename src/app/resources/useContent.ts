"use client";

import { useAtom } from 'jotai';
import { languageAtom } from '@/atoms/language';
import * as enContent from './content';
import * as frContent from './content.fr';

export const useContent = () => {
  const [language] = useAtom(languageAtom);
  
  // Select content based on language
  const content = language === 'FR' ? frContent : enContent;
  
  return content;
}; 