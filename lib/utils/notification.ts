// lib/utils/notification.ts
import { getAllPlayers, type AlbionPlayerData } from './albionStorage';
import { MAX_FOCUS } from './focusCalculator';

const NOTIFICATION_KEY = 'albion_notification_enabled';

// Check apakah notification sudah di-enable
export function isNotificationEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(NOTIFICATION_KEY) === 'true';
}

// Enable notification
export function enableNotification(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(NOTIFICATION_KEY, 'true');
}

// Disable notification
export function disableNotification(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(NOTIFICATION_KEY, 'false');
}

// Request notification permission
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      enableNotification();
    }
    return permission;
  }

  return Notification.permission;
}

// Check focus dan trigger notification jika sudah 30k
export function checkAndNotifyFullFocus(): void {
  if (typeof window === 'undefined' || !isNotificationEnabled()) return;
  if (Notification.permission !== 'granted') return;

  const players = getAllPlayers();
  players.forEach((player) => {
    if (player.focusRightNow >= MAX_FOCUS) {
      // Check apakah sudah pernah notifikasi untuk player ini
      const notifiedKey = `notified_${player.id}`;
      const lastNotified = localStorage.getItem(notifiedKey);
      const now = Date.now();

      // Notifikasi hanya sekali per 24 jam per player
      if (!lastNotified || now - parseInt(lastNotified) > 24 * 60 * 60 * 1000) {
        new Notification('🎉 Focus Penuh!', {
          body: `${player.nickname} sudah mencapai ${player.focusRightNow.toLocaleString()} focus!`,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: `focus-full-${player.id}`,
          requireInteraction: true,
          vibrate: [200, 100, 200],
        } as any);

        localStorage.setItem(notifiedKey, now.toString());
      }
    }
  });
}

// Register service worker
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    // Register periodic sync jika supported
    if ('periodicSync' in registration) {
      try {
        await (registration as any).periodicSync.register('check-focus', {
          minInterval: 60 * 60 * 1000, // 1 jam
        });
      } catch (error) {
        console.log('Periodic sync not supported:', error);
      }
    }

    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
}