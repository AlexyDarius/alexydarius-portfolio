"use client";

import { GoogleAnalytics } from './GoogleAnalytics';
import { useCookieConsent } from '@/hooks/useCookieConsent';

export function GoogleAnalyticsProvider() {
  const { analyticsEnabled, isLoading } = useCookieConsent();
  
  // Don't render anything while loading consent state
  if (isLoading) {
    return null;
  }

  // Only render if we have a measurement ID
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!measurementId) {
    console.warn('⚠️ Google Analytics: NEXT_PUBLIC_GA_MEASUREMENT_ID not found');
    return null;
  }

  return (
    <GoogleAnalytics 
      measurementId={measurementId}
      enabled={analyticsEnabled}
    />
  );
} 