/**
 * Ultimate Contest Radar - PWA Registration Component
 * Handles service worker registration and PWA install prompt
 */

'use client';

import { useEffect } from 'react';

import { useServiceWorker } from '@/hooks/use-service-worker';

import PWAInstallPrompt from './pwa-install-prompt';

export default function PWARegister() {
  const { isSupported, register, error } = useServiceWorker();

  useEffect(() => {
    if (isSupported && register) {
      // Register service worker when component mounts
      register().catch(console.error);
    }
  }, [isSupported, register]);

  useEffect(() => {
    if (error) {
      console.warn('Service Worker warning:', error);
    }
  }, [error]);

  // Don't render anything - this component handles registration in the background
  return (
    <>
      {/* Service Worker registration happens in the background */}
      {/* PWA Install Prompt */}
      <PWAInstallPrompt
        onInstall={() => {
          console.log('✅ PWA installed successfully');
        }}
        onDismiss={() => {
          console.log('PWA install prompt dismissed');
        }}
      />
    </>
  );
}
