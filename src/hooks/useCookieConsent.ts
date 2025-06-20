"use client";

import { useState, useEffect } from 'react';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  consentDate: string;
}

const COOKIE_EXPIRATION_DAYS = 30;

export function useCookieConsent() {
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    consentDate: new Date().toISOString()
  });
  const [hasConsent, setHasConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if consent exists and is still valid (1 month)
    if (typeof localStorage === 'undefined') {
      setHasConsent(false);
      setIsLoading(false);
      return;
    }
    const consentData = localStorage.getItem('cookie-consent');
    if (consentData) {
      try {
        const consent = JSON.parse(consentData);
        const consentDate = new Date(consent.consentDate);
        const now = new Date();
        const daysSinceConsent = (now.getTime() - consentDate.getTime()) / (1000 * 3600 * 24);
        
        if (daysSinceConsent < COOKIE_EXPIRATION_DAYS) {
          // Consent is still valid
          setPreferences(consent);
          setHasConsent(true);
        } else {
          // Consent expired, remove it
          localStorage.removeItem('cookie-consent');
          setHasConsent(false);
        }
      } catch (error) {
        // Invalid consent data, remove it
        localStorage.removeItem('cookie-consent');
        setHasConsent(false);
      }
    } else {
      setHasConsent(false);
    }
    setIsLoading(false);
  }, []);

  const updatePreferences = (newPreferences: Partial<CookiePreferences>) => {
    const updatedPrefs = {
      ...preferences,
      ...newPreferences,
      consentDate: new Date().toISOString()
    };
    setPreferences(updatedPrefs);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('cookie-consent', JSON.stringify(updatedPrefs));
    }
    setHasConsent(true);
  };

  return {
    preferences,
    hasConsent,
    isLoading,
    updatePreferences,
    // Helper getters
    analyticsEnabled: preferences.analytics,
    necessaryEnabled: preferences.necessary
  };
} 