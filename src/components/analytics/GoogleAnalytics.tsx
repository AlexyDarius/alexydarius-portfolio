"use client";

import Script from 'next/script';
import { useEffect } from 'react';

interface GoogleAnalyticsProps {
  measurementId: string;
  enabled: boolean;
}

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export function GoogleAnalytics({ measurementId, enabled }: GoogleAnalyticsProps) {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      if (enabled) {
        // Enable Google Analytics
        window.gtag('consent', 'update', {
          'analytics_storage': 'granted'
        });
        console.log('✅ Google Analytics enabled');
      } else {
        // Disable Google Analytics
        window.gtag('consent', 'update', {
          'analytics_storage': 'denied'
        });
        console.log('❌ Google Analytics disabled');
      }
    }
  }, [enabled]);

  // Don't load scripts if GA is disabled
  if (!enabled) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        onLoad={() => {
          console.log('📊 Google Analytics script loaded');
        }}
      />
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            
            // Initialize with consent denied by default
            gtag('consent', 'default', {
              'analytics_storage': 'denied'
            });
            
            gtag('config', '${measurementId}', {
              page_title: document.title,
              page_location: window.location.href,
              send_page_view: false // We'll send this manually after consent
            });
          `,
        }}
      />
    </>
  );
}

// Helper function to track page views
export const trackPageView = (url: string, title: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
      page_path: url,
      page_title: title,
    });
  }
};

// Helper function to track custom events
export const trackEvent = (eventName: string, parameters: Record<string, any> = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
}; 