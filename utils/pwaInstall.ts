// PWA 설치 유틸리티

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

class PWAInstallManager {
  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private listeners: Array<(canInstall: boolean) => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  private init() {
    // beforeinstallprompt 이벤트 리스너
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e as BeforeInstallPromptEvent;
      this.notifyListeners(true);
    });

    // 앱 설치 완료 이벤트
    window.addEventListener('appinstalled', () => {
      console.log('FILM NOTE PWA가 설치되었습니다!');
      this.deferredPrompt = null;
      this.notifyListeners(false);
    });
  }

  public canInstall(): boolean {
    return this.deferredPrompt !== null;
  }

  public async install(): Promise<'accepted' | 'dismissed' | 'error'> {
    if (!this.deferredPrompt) {
      return 'error';
    }

    try {
      await this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('사용자가 PWA 설치를 수락했습니다');
      } else {
        console.log('사용자가 PWA 설치를 거부했습니다');
      }

      this.deferredPrompt = null;
      this.notifyListeners(false);
      
      return outcome;
    } catch (error) {
      console.error('PWA 설치 오류:', error);
      return 'error';
    }
  }

  public onChange(callback: (canInstall: boolean) => void) {
    this.listeners.push(callback);
    
    // 구독 해제 함수 반환
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  private notifyListeners(canInstall: boolean) {
    this.listeners.forEach(listener => listener(canInstall));
  }

  public isStandalone(): boolean {
    if (typeof window === 'undefined') return false;
    
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://')
    );
  }

  public async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.log('이 브라우저는 알림을 지원하지 않습니다');
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission;
    }

    return Notification.permission;
  }

  public async subscribeToPushNotifications() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.log('푸시 알림이 지원되지 않습니다');
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          // VAPID public key - 실제 사용 시 교체 필요
          'YOUR_VAPID_PUBLIC_KEY'
        )
      });

      return subscription;
    } catch (error) {
      console.error('푸시 알림 구독 오류:', error);
      return null;
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}

export const pwaInstallManager = new PWAInstallManager();

// Service Worker 등록 함수
export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('Service Worker 등록 성공:', registration.scope);

      // 업데이트 확인
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        console.log('새로운 Service Worker 발견');

        newWorker?.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('새로운 버전이 사용 가능합니다. 페이지를 새로고침하세요.');
            // 선택사항: 사용자에게 알림 표시
          }
        });
      });

      return registration;
    } catch (error) {
      console.error('Service Worker 등록 실패:', error);
      return null;
    }
  }
  return null;
}
