"use client";

import { useState, useEffect } from 'react';
import { Button, Text, Flex, Column, Heading, Switch } from '@/once-ui/components';
import { useAtom } from 'jotai';
import { languageAtom } from '@/atoms/language';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  consentDate: string;
}

const COOKIE_EXPIRATION_DAYS = 30;

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [language] = useAtom(languageAtom);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    consentDate: new Date().toISOString()
  });

  useEffect(() => {
    // Check if consent exists and is still valid (1 month)
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
          return;
        } else {
          // Consent expired, remove it
          localStorage.removeItem('cookie-consent');
        }
      } catch (error) {
        // Invalid consent data, remove it
        localStorage.removeItem('cookie-consent');
      }
    }
    setShowBanner(true);
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    const prefsWithDate = {
      ...prefs,
      consentDate: new Date().toISOString()
    };
    localStorage.setItem('cookie-consent', JSON.stringify(prefsWithDate));
    setPreferences(prefsWithDate);
    setShowBanner(false);
    setShowPreferences(false);

    // Handle Google Analytics based on preference
    if (prefs.analytics) {
      console.log('Google Analytics enabled');
      // Here you would initialize GA
      // gtag('config', 'GA_MEASUREMENT_ID');
    } else {
      console.log('Google Analytics disabled');
      // Here you would disable GA
      // gtag('config', 'GA_MEASUREMENT_ID', { 'anonymize_ip': true });
    }
  };

  const acceptAll = () => {
    savePreferences({
      necessary: true,
      analytics: true,
      consentDate: new Date().toISOString()
    });
  };

  const denyAll = () => {
    savePreferences({
      necessary: true, // Always true as these are required
      analytics: false,
      consentDate: new Date().toISOString()
    });
  };

  const getTexts = () => {
    if (language === 'FR') {
      return {
        title: 'Préférences de cookies',
        description: 'Nous utilisons des cookies pour améliorer votre expérience et analyser le trafic du site.',
        necessary: {
          title: 'Cookies nécessaires',
          description: 'Requis pour les préférences de langue et le fonctionnement du site.'
        },
        analytics: {
          title: 'Cookies analytiques',
          description: 'Nous aident à comprendre comment vous utilisez notre site (Google Analytics).'
        },
        acceptAll: 'Tout accepter',
        denyAll: 'Tout refuser',
        customize: 'Personnaliser',
        save: 'Sauvegarder',
        cancel: 'Annuler'
      };
    }
    return {
      title: 'Cookie Preferences',
      description: 'We use cookies to enhance your experience and analyze site traffic.',
      necessary: {
        title: 'Necessary Cookies',
        description: 'Required for language preferences and website functionality.'
      },
      analytics: {
        title: 'Analytics Cookies',
        description: 'Help us understand how you use our website (Google Analytics).'
      },
      acceptAll: 'Accept All',
      denyAll: 'Deny All',
      customize: 'Customize',
      save: 'Save Preferences',
      cancel: 'Cancel'
    };
  };

  if (!showBanner && !showPreferences) return null;

  const texts = getTexts();

  return (
    <>
      {/* Main Banner */}
      {showBanner && !showPreferences && (
        <Flex
          position="fixed"
          bottom="0"
          left="0"
          right="0"
          background="surface"
          padding="l"
          style={{ 
            backdropFilter: 'blur(10px)',
            borderTop: '1px solid var(--neutral-border-weak)',
            boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.1)',
            zIndex: 1000
          }}
        >
          <Column gap="m" fillWidth maxWidth="l" horizontal="center">
            <Column gap="xs">
              <Heading variant="heading-strong-s">
                {texts.title}
              </Heading>
              <Text variant="body-default-s" onBackground="neutral-weak">
                {texts.description}
              </Text>
            </Column>
            <Flex gap="s" horizontal="end" fillWidth wrap>
              <Button 
                size="s" 
                variant="tertiary"
                onClick={denyAll}
              >
                {texts.denyAll}
              </Button>
              <Button 
                size="s" 
                variant="secondary"
                onClick={() => setShowPreferences(true)}
              >
                {texts.customize}
              </Button>
              <Button 
                size="s" 
                variant="primary"
                onClick={acceptAll}
              >
                {texts.acceptAll}
              </Button>
            </Flex>
          </Column>
        </Flex>
      )}

      {/* Preferences Modal */}
      {showPreferences && (
        <Flex
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          background="page"
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 1001
          }}
          horizontal="center"
          vertical="center"
        >
          <Column
            background="surface"
            padding="xl"
            gap="l"
            style={{ 
              borderRadius: 'var(--radius-l)',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto',
              backgroundColor: 'var(--neutral-surface)',
              border: '1px solid var(--neutral-border-medium)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
              color: 'white'
            }}
          >
            <Heading variant="heading-strong-m" style={{ color: 'white' }}>
              {texts.title}
            </Heading>
            
            {/* Necessary Cookies */}
            <Flex horizontal="space-between" vertical="start">
              <Column gap="xs" flex={1} paddingRight="m">
                <Text variant="label-default-m" style={{ color: 'white' }}>
                  {texts.necessary.title}
                </Text>
                <Text variant="body-default-s" style={{ color: 'white' }}>
                  {texts.necessary.description}
                </Text>
              </Column>
              <Switch
                isChecked={true}
                disabled={true}
                onToggle={() => {}}
              />
            </Flex>

            {/* Analytics Cookies */}
            <Flex horizontal="space-between" vertical="start">
              <Column gap="xs" flex={1} paddingRight="m">
                <Text variant="label-default-m" style={{ color: 'white' }}>
                  {texts.analytics.title}
                </Text>
                <Text variant="body-default-s" style={{ color: 'white' }}>
                  {texts.analytics.description}
                </Text>
              </Column>
              <Switch
                isChecked={preferences.analytics}
                onToggle={() => 
                  setPreferences(prev => ({ ...prev, analytics: !prev.analytics }))
                }
              />
            </Flex>
            
            <Flex gap="s" horizontal="end" paddingTop="m">
              <Button 
                variant="tertiary" 
                onClick={() => setShowPreferences(false)}
                style={{ color: 'white' }}
              >
                {texts.cancel}
              </Button>
              <Button 
                onClick={() => savePreferences(preferences)}
                style={{ 
                  backgroundColor: 'white',
                  color: 'black',
                  border: 'none'
                }}
              >
                {texts.save}
              </Button>
            </Flex>
          </Column>
        </Flex>
      )}
    </>
  );
} 