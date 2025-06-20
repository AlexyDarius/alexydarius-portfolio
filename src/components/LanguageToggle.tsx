"use client";

import { useState, useEffect } from "react";
import { Flex, ToggleButton } from "@/once-ui/components";
import { useAtom } from 'jotai';
import { languageAtom, type Language } from '@/atoms/language';
import { getBrowserLanguage } from '@/utils/getBrowserLanguage';

export const LanguageToggle = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useAtom(languageAtom);

  const handleLanguageChange = (newLanguage: Language) => {
    // Only update if language is actually different
    if (newLanguage !== language) {
      setLanguage(newLanguage);
      setIsOpen(false);
      
      // Set cookie so server can read the language preference
      document.cookie = `language=${newLanguage}; path=/; max-age=${60 * 60 * 24 * 365}`; // 1 year
    } else {
      setIsOpen(false);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <ToggleButton
        onClick={() => setIsOpen(!isOpen)}
        label={language}
      />

      {isOpen && (
        <Flex
          vertical="start"
          background="surface"
          border="neutral-alpha-medium"
          radius="m-4"
          shadow="l"
          style={{
            position: "absolute",
            right: 0,
            [window.innerWidth >= 768 ? "top" : "bottom"]: "calc(100% + 16px)",
            minWidth: "120px",
            zIndex: 10
          }}
        >
          <ToggleButton
            label="English"
            onClick={() => handleLanguageChange("EN")}
            selected={language === "EN"}
            fillWidth
          />
          <ToggleButton
            label="Français"
            onClick={() => handleLanguageChange("FR")}
            selected={language === "FR"}
            fillWidth
          />
        </Flex>
      )}
    </div>
  );
}; 