import "@/once-ui/styles/index.scss";
import "@/once-ui/tokens/index.scss";

import classNames from "classnames";

import { Footer, Header, RouteGuard } from "@/components";
import { CookieConsent } from "@/components/analytics/CookieConsent";
import { GoogleAnalyticsProvider } from "@/components/analytics/GoogleAnalyticsProvider";
import LanguageProvider from "@/components/LanguageProvider";
import { baseURL, effects, style, font, home } from "@/app/resources";
import { headers } from 'next/headers';
import type { Language } from '@/atoms/language';

import { Background, Column, Flex, ThemeProvider, ToastProvider } from "@/once-ui/components";
import { opacity, SpacingToken } from "@/once-ui/types";
import { Meta } from "@/once-ui/modules";

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const params = await searchParams;
  const language = (params?.lang === 'FR' ? 'FR' : 'EN') as Language;
  
  // Import the correct content based on language
  const content = language === 'FR' 
    ? await import('@/app/resources/content.fr')
    : await import('@/app/resources/content');

  const { home } = content;

  return {
    title: home.title,
    description: home.description,
    openGraph: {
      title: home.title,
      description: home.description,
      images: [home.image ? `${baseURL}${home.image}` : `${baseURL}/og?title=${encodeURIComponent(home.title)}`],
      url: `${baseURL}?lang=${language}`,
      siteName: content.person.name,
      locale: language === 'FR' ? 'fr_FR' : 'en_US',
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: home.title,
      description: home.description,
      images: [home.image ? `${baseURL}${home.image}` : `${baseURL}/og?title=${encodeURIComponent(home.title)}`]
    },
    alternates: {
      languages: {
        'en': `${baseURL}?lang=EN`,
        'fr': `${baseURL}?lang=FR`,
        'x-default': `${baseURL}?lang=EN`
      }
    }
  };
}

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  // Get language from middleware header
  const headersList = await headers();
  const serverLanguage = headersList.get('x-language') as Language || 'EN';
  const lang = serverLanguage === 'FR' ? 'fr' : 'en';

  return (
    <Flex
      suppressHydrationWarning
      as="html"
      lang={lang}
      background="page"
      data-neutral={style.neutral}
      data-brand={style.brand}
      data-accent={style.accent}
      data-solid={style.solid}
      data-solid-style={style.solidStyle}
      data-border={style.border}
      data-surface={style.surface}
      data-transition={style.transition}
      className={classNames(
        font.primary.variable,
        font.secondary.variable,
        font.tertiary.variable,
        font.code.variable,
      )}
    >
      <head>
        {/* SEO: Add hreflang for language versions */}
        <link rel="alternate" hrefLang="en" href={`${baseURL}?lang=EN`} />
        <link rel="alternate" hrefLang="fr" href={`${baseURL}?lang=FR`} />
        <link rel="alternate" hrefLang="x-default" href={`${baseURL}?lang=EN`} />
        
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 'system';
                  const root = document.documentElement;
                  if (theme === 'system') {
                    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    root.setAttribute('data-theme', isDark ? 'dark' : 'light');
                  } else {
                    root.setAttribute('data-theme', theme);
                  }
                } catch (e) {
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              })();
            `,
          }}
        />
      </head>
      <ThemeProvider>
        <ToastProvider>
          <LanguageProvider initialLanguage={serverLanguage}>
            <GoogleAnalyticsProvider />
            <Column style={{ minHeight: "100vh" }} as="body" fillWidth margin="0" padding="0">
            <Background
              position="fixed"
              mask={{
                x: effects.mask.x,
                y: effects.mask.y,
                radius: effects.mask.radius,
                cursor: effects.mask.cursor
              }}
              gradient={{
                display: effects.gradient.display,
                opacity: effects.gradient.opacity as opacity,
                x: effects.gradient.x,
                y: effects.gradient.y,
                width: effects.gradient.width,
                height: effects.gradient.height,
                tilt: effects.gradient.tilt,
                colorStart: effects.gradient.colorStart,
                colorEnd: effects.gradient.colorEnd,
              }}
              dots={{
                display: effects.dots.display,
                opacity: effects.dots.opacity as opacity,
                size: effects.dots.size as SpacingToken,
                color: effects.dots.color,
              }}
              grid={{
                display: effects.grid.display,
                opacity: effects.grid.opacity as opacity,
                color: effects.grid.color,
                width: effects.grid.width,
                height: effects.grid.height,
              }}
              lines={{
                display: effects.lines.display,
                opacity: effects.lines.opacity as opacity,
                size: effects.lines.size as SpacingToken,
                thickness: effects.lines.thickness,
                angle: effects.lines.angle,
                color: effects.lines.color,
              }}
            />
            <Flex fillWidth minHeight="16" hide="s"></Flex>
            <Header />
            <Flex
              zIndex={0}
              fillWidth
              paddingY="l"
              paddingX="l"
              horizontal="center"
              flex={1}
            >
              <Flex horizontal="center" fillWidth minHeight="0">
                <RouteGuard>{children}</RouteGuard>
              </Flex>
            </Flex>
            <Footer />
            <CookieConsent />
          </Column>
          </LanguageProvider>
        </ToastProvider>
      </ThemeProvider>
    </Flex>
  );
}
