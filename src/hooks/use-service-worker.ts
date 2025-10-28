/**
 * Ultimate Contest Radar - Service Worker Hook
 * Handles service worker registration, updates, and PWA functionality
 */

import { useEffect,useState } from 'react';

interface ServiceWorkerState {
  isSupported: boolean;
  isRegistered: boolean;
  isUpdating: boolean;
  registration: ServiceWorkerRegistration | null;
  error: string | null;
  updateAvailable: boolean;
}

interface UseServiceWorkerReturn extends ServiceWorkerState {
  register: () => Promise<void>;
  unregister: () => Promise<boolean>;
  update: () => Promise<void>;
  requestNotificationPermission: () => Promise<NotificationPermission>;
}

export const useServiceWorker = (): UseServiceWorkerReturn => {
  const [state, setState] = useState<ServiceWorkerState>({
    isSupported: false,
    isRegistered: false,
    isUpdating: false,
    registration: null,
    error: null,
    updateAvailable: false,
  });

  // Check if service workers are supported
  const isSupported = 'serviceWorker' in navigator;

  useEffect(() => {
    if (!isSupported) {
      setState(prev => ({
        ...prev,
        error: 'Service Workers are not supported in this browser',
      }));
      return;
    }

    // Check if already registered
    checkRegistration();
  }, []);

  const checkRegistration = async () => {
    try {
      const existingRegistration = await navigator.serviceWorker.getRegistration();

      if (existingRegistration) {
        setState(prev => ({
          ...prev,
          isRegistered: true,
          registration: existingRegistration,
        }));

        // Check for updates
        existingRegistration.addEventListener('updatefound', () => {
          setState(prev => ({ ...prev, updateAvailable: true }));
        });
      }
    } catch (error) {
      console.error('Error checking service worker registration:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
    }
  };

  const register = async () => {
    if (!isSupported) {
      setState(prev => ({
        ...prev,
        error: 'Service Workers are not supported',
      }));
      return;
    }

    try {
      setState(prev => ({ ...prev, isUpdating: true, error: null }));

      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      console.log('✅ Service Worker registered successfully:', registration);

      // Wait for the service worker to be ready
      await navigator.serviceWorker.ready;

      setState(prev => ({
        ...prev,
        isRegistered: true,
        isUpdating: false,
        registration,
        error: null,
      }));

      // Handle service worker updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setState(prev => ({ ...prev, updateAvailable: true }));
            }
          });
        }
      });

      // Listen for service worker messages
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data?.type === 'SYNC_COMPLETE') {
          console.log('📊 Background sync completed:', event.data.data);
          // You could dispatch custom events here to update the UI
          window.dispatchEvent(new CustomEvent('sw-sync-complete', {
            detail: event.data.data,
          }));
        }
      });

    } catch (error) {
      console.error('❌ Service Worker registration failed:', error);
      setState(prev => ({
        ...prev,
        isUpdating: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      }));
    }
  };

  const unregister = async (): Promise<boolean> => {
    if (!state.registration) {
      return false;
    }

    try {
      const result = await state.registration.unregister();
      setState(prev => ({
        ...prev,
        isRegistered: false,
        registration: null,
        updateAvailable: false,
      }));
      return result;
    } catch (error) {
      console.error('Service Worker unregistration failed:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Unregistration failed',
      }));
      return false;
    }
  };

  const update = async () => {
    if (!state.registration) {
      throw new Error('No service worker registration found');
    }

    try {
      setState(prev => ({ ...prev, isUpdating: true }));

      await state.registration.update();

      // Wait for the new service worker to be ready
      await navigator.serviceWorker.ready;

      setState(prev => ({
        ...prev,
        isUpdating: false,
        updateAvailable: false,
      }));

      // Reload the page to use the new service worker
      if (navigator.serviceWorker.controller) {
        window.location.reload();
      }

    } catch (error) {
      console.error('Service Worker update failed:', error);
      setState(prev => ({
        ...prev,
        isUpdating: false,
        error: error instanceof Error ? error.message : 'Update failed',
      }));
      throw error;
    }
  };

  const requestNotificationPermission = async (): Promise<NotificationPermission> => {
    if (!('Notification' in window)) {
      throw new Error('This browser does not support notifications');
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission === 'denied') {
      throw new Error('Notification permission has been denied');
    }

    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      console.log('✅ Notification permission granted');
    } else {
      console.log('❌ Notification permission denied');
    }

    return permission;
  };

  return {
    ...state,
    isSupported,
    register,
    unregister,
    update,
    requestNotificationPermission,
  };
};

export default useServiceWorker;
