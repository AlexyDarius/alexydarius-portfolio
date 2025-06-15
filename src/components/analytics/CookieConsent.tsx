"use client";

import { useState } from 'react';
import { Button, Text, Flex, Column, Heading, Switch, SmartLink } from '@/once-ui/components';
import { useAtom } from 'jotai';
import { languageAtom } from '@/atoms/language';
import { useCookieConsent } from '@/hooks/useCookieConsent';

export function CookieConsent() {
  const [showPreferences, setShowPreferences] = useState(false);
  const [language] = useAtom(languageAtom);
  const { hasConsent, preferences, updatePreferences } = useCookieConsent();

  const acceptAll = () => {
    updatePreferences({
      necessary: true,
      analytics: true
    });
  };

  const denyAll = () => {
    updatePreferences({
      necessary: true,
      analytics: false
    });
  };

  const savePreferences = () => {
    updatePreferences(preferences);
    setShowPreferences(false);
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
        cancel: 'Annuler',
        learnMore: 'En savoir plus'
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
      cancel: 'Cancel',
      learnMore: 'Learn more'
    };
  };

  // Don't show banner if user has already given consent
  if (hasConsent && !showPreferences) return null;

  const texts = getTexts();

  return (
    <>
      {/* Main Banner */}
      {!hasConsent && !showPreferences && (
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
                {texts.description}{' '}
                <SmartLink 
                  href="/cookie-policy" 
                  style={{ 
                    color: 'var(--neutral-on-background-strong)',
                    textDecoration: 'underline',
                    fontWeight: '500'
                  }}
                >
                  {texts.learnMore}
                </SmartLink>
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
              <div style={{
                '--brand-solid-medium': preferences.analytics ? '#ffffff' : 'var(--neutral-solid-medium)',
                '--brand-solid-strong': preferences.analytics ? '#f0f0f0' : 'var(--neutral-solid-strong)',
                '--brand-on-solid-strong': preferences.analytics ? '#000000' : '#ffffff',
                '--solid-border-color-brand': preferences.analytics ? '#ffffff' : 'var(--solid-border-color-neutral)'
              } as React.CSSProperties}>
                <Switch
                  isChecked={preferences.analytics}
                  onToggle={() => 
                    updatePreferences({ analytics: !preferences.analytics })
                  }
                />
              </div>
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
                onClick={savePreferences}
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