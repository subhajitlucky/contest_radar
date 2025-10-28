/**
 * Ultimate Contest Radar - PWA Install Prompt
 * Encourages users to install the app as a native application
 */

'use client';

import { AnimatePresence,motion } from 'framer-motion';
import {
  Bell,
  Download,
  Shield,
  Smartphone,
  Star,
  X,
  Zap } from 'lucide-react';
import { useEffect,useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAInstallPromptProps {
  onInstall?: () => void;
  onDismiss?: () => void;
}

export const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({
  onInstall,
  onDismiss,
}) => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running on iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Check if app is already installed (running in standalone mode)
    const standalone = window.matchMedia('(display-mode: standalone)').matches ||
                      (window.navigator as any).standalone ||
                      document.referrer.includes('android-app://');
    setIsStandalone(standalone);

    // Don't show if already installed or dismissed
    if (standalone || localStorage.getItem('pwa-install-dismissed')) {
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const installEvent = e as BeforeInstallPromptEvent;
      setInstallPrompt(installEvent);

      // Show the prompt after a delay to avoid being annoying
      setTimeout(() => {
        setIsVisible(true);
      }, 5000);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsVisible(false);
      setInstallPrompt(null);
      localStorage.setItem('pwa-installed', 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // For iOS, show custom install instructions
    if (iOS) {
      setTimeout(() => {
        setIsVisible(true);
      }, 5000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (installPrompt) {
      try {
        await installPrompt.prompt();
        const { outcome } = await installPrompt.userChoice;

        if (outcome === 'accepted') {
          console.log('✅ PWA installation accepted');
          onInstall?.();
        } else {
          console.log('❌ PWA installation dismissed');
        }
      } catch (error) {
        console.error('PWA installation failed:', error);
      }

      setInstallPrompt(null);
    }

    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
    onDismiss?.();
  };

  // Don't render if not visible or already installed
  if (!isVisible || isInstalled || isStandalone) {
    return null;
  }

  const iOSInstallInstructions = (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className='fixed bottom-6 right-6 z-50 max-w-sm'
    >
      <Card className='shadow-2xl border-2 border-blue-200 dark:border-blue-800'>
        <CardHeader className='pb-3'>
          <div className='flex items-start justify-between'>
            <div className='flex items-center gap-2'>
              <div className='p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600'>
                <Smartphone className='h-5 w-5 text-white' />
              </div>
              <Badge variant='secondary'>iOS Install</Badge>
            </div>
            <Button
              variant='ghost'
              size='icon'
              onClick={handleDismiss}
              className='h-6 w-6'
            >
              <X className='h-4 w-4' />
            </Button>
          </div>
          <CardTitle className='text-lg'>Install Contest Radar</CardTitle>
          <CardDescription>
            Add to your home screen for quick access and offline functionality
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-3'>
          <div className='text-sm space-y-2'>
            <p className='font-medium'>📱 <strong>Step 1:</strong> Tap the Share button</p>
            <p className='font-medium'>➕ <strong>Step 2:</strong> Scroll down and tap "Add to Home Screen"</p>
            <p className='font-medium'>✅ <strong>Step 3:</strong> Tap "Add" to confirm</p>
          </div>
          <div className='flex gap-2 pt-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={handleDismiss}
              className='flex-1'
            >
              Got it
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const standardInstallPrompt = (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      className='fixed bottom-6 right-6 z-50 max-w-sm'
    >
      <Card className='shadow-2xl border-2 border-blue-200 dark:border-blue-800'>
        <CardHeader className='pb-3'>
          <div className='flex items-start justify-between'>
            <div className='flex items-center gap-2'>
              <div className='p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600'>
                <Download className='h-5 w-5 text-white' />
              </div>
              <Badge variant='secondary'>Install App</Badge>
            </div>
            <Button
              variant='ghost'
              size='icon'
              onClick={handleDismiss}
              className='h-6 w-6'
            >
              <X className='h-4 w-4' />
            </Button>
          </div>
          <CardTitle className='text-lg'>Install Contest Radar</CardTitle>
          <CardDescription>
            Get the full app experience with offline access and push notifications
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          {/* Features */}
          <div className='grid grid-cols-2 gap-3 text-xs'>
            <div className='flex items-center gap-2'>
              <Zap className='h-4 w-4 text-yellow-500' />
              <span>Offline Access</span>
            </div>
            <div className='flex items-center gap-2'>
              <Bell className='h-4 w-4 text-blue-500' />
              <span>Push Alerts</span>
            </div>
            <div className='flex items-center gap-2'>
              <Star className='h-4 w-4 text-purple-500' />
              <span>Full Screen</span>
            </div>
            <div className='flex items-center gap-2'>
              <Shield className='h-4 w-4 text-green-500' />
              <span>Secure</span>
            </div>
          </div>

          {/* Install button */}
          <div className='flex gap-2 pt-2'>
            <Button
              onClick={handleInstall}
              className='flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
              disabled={!installPrompt}
            >
              <Download className='h-4 w-4 mr-2' />
              {installPrompt ? 'Install App' : 'Installing...'}
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={handleDismiss}
            >
              Later
            </Button>
          </div>

          {!installPrompt && (
            <p className='text-xs text-muted-foreground text-center'>
              Install prompt will appear shortly...
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {isIOS ? iOSInstallInstructions : standardInstallPrompt}
        </>
      )}
    </AnimatePresence>
  );
};

export default PWAInstallPrompt;
