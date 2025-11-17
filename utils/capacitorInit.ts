/**
 * Capacitor 초기화 및 플랫폼 감지 유틸리티
 */

// Capacitor 타입 정의 (동적 import를 위해)
export type CapacitorPlatform = 'ios' | 'android' | 'web';

/**
 * Capacitor가 사용 가능한지 확인
 */
export function isCapacitorAvailable(): boolean {
  return typeof window !== 'undefined' && 'Capacitor' in window;
}

/**
 * 현재 플랫폼 가져오기
 */
export function getPlatform(): CapacitorPlatform {
  if (isCapacitorAvailable()) {
    try {
      // @ts-ignore
      return window.Capacitor.getPlatform();
    } catch (error) {
      console.log('Capacitor getPlatform failed:', error);
    }
  }
  return 'web';
}

/**
 * 네이티브 플랫폼인지 확인
 */
export function isNativePlatform(): boolean {
  if (isCapacitorAvailable()) {
    try {
      // @ts-ignore
      return window.Capacitor.isNativePlatform();
    } catch (error) {
      console.log('Capacitor isNativePlatform failed:', error);
    }
  }
  return false;
}

/**
 * Capacitor 플러그인 동적 로드
 */
export async function loadCapacitorPlugin<T>(pluginName: string): Promise<T | null> {
  if (!isCapacitorAvailable()) {
    return null;
  }

  try {
    // @ts-ignore
    const { Plugins } = window.Capacitor;
    if (Plugins && Plugins[pluginName]) {
      return Plugins[pluginName] as T;
    }

    // 동적 import 시도
    const plugin = await import(`@capacitor/${pluginName.toLowerCase()}`);
    return plugin[pluginName] as T;
  } catch (error) {
    console.log(`Failed to load Capacitor plugin: ${pluginName}`, error);
    return null;
  }
}

/**
 * Capacitor 앱 초기화
 */
export async function initializeCapacitor() {
  const platform = getPlatform();
  const isNative = isNativePlatform();

  console.log('🚀 FILM NOTE - Platform:', platform);
  console.log('📱 Native App:', isNative);

  if (!isNative) {
    console.log('🌐 Running as Web App (PWA)');
    return;
  }

  console.log('📱 Running as Native App (Capacitor)');

  try {
    // StatusBar 초기화
    const StatusBar = await loadCapacitorPlugin<any>('StatusBar');
    if (StatusBar) {
      console.log('✅ StatusBar plugin loaded');
      try {
        await StatusBar.setStyle({ style: 'DARK' });
        await StatusBar.setBackgroundColor({ color: '#0a0e27' });
        console.log('✅ StatusBar configured');
      } catch (error) {
        console.log('⚠️ StatusBar configuration failed:', error);
      }
    }

    // SplashScreen 초기화
    const SplashScreen = await loadCapacitorPlugin<any>('SplashScreen');
    if (SplashScreen) {
      console.log('✅ SplashScreen plugin loaded');
      try {
        await SplashScreen.hide();
        console.log('✅ SplashScreen hidden');
      } catch (error) {
        console.log('⚠️ SplashScreen hide failed:', error);
      }
    }

    // App 플러그인 초기화 (뒤로가기 버튼 등)
    const App = await loadCapacitorPlugin<any>('App');
    if (App) {
      console.log('✅ App plugin loaded');
      
      // Android 뒤로가기 버튼
      if (platform === 'android') {
        try {
          App.addListener('backButton', ({ canGoBack }: { canGoBack: boolean }) => {
            console.log('🔙 Back button pressed, canGoBack:', canGoBack);
            if (!canGoBack) {
              App.exitApp();
            } else {
              window.history.back();
            }
          });
          console.log('✅ Back button listener registered');
        } catch (error) {
          console.log('⚠️ Back button listener failed:', error);
        }
      }

      // 앱 상태 변경 리스너
      try {
        App.addListener('appStateChange', ({ isActive }: { isActive: boolean }) => {
          console.log('📱 App state changed, active:', isActive);
        });
        console.log('✅ App state listener registered');
      } catch (error) {
        console.log('⚠️ App state listener failed:', error);
      }
    }

    // Keyboard 초기화
    const Keyboard = await loadCapacitorPlugin<any>('Keyboard');
    if (Keyboard) {
      console.log('✅ Keyboard plugin loaded');
      try {
        await Keyboard.setAccessoryBarVisible({ isVisible: true });
        await Keyboard.setResizeMode({ mode: 'native' });
        console.log('✅ Keyboard configured');
      } catch (error) {
        console.log('⚠️ Keyboard configuration failed:', error);
      }
    }

    // Network 상태 모니터링
    const Network = await loadCapacitorPlugin<any>('Network');
    if (Network) {
      console.log('✅ Network plugin loaded');
      try {
        const status = await Network.getStatus();
        console.log('🌐 Network status:', status);

        Network.addListener('networkStatusChange', (status: any) => {
          console.log('🌐 Network status changed:', status);
          if (!status.connected) {
            console.log('⚠️ Device is offline');
          } else {
            console.log('✅ Device is online');
          }
        });
        console.log('✅ Network listener registered');
      } catch (error) {
        console.log('⚠️ Network monitoring failed:', error);
      }
    }

    console.log('🎉 Capacitor initialization complete!');
  } catch (error) {
    console.error('❌ Capacitor initialization failed:', error);
  }
}

/**
 * Capacitor 햅틱 피드백
 */
export async function triggerHaptic(style: 'LIGHT' | 'MEDIUM' | 'HEAVY' = 'LIGHT') {
  if (!isNativePlatform()) return;

  try {
    const Haptics = await loadCapacitorPlugin<any>('Haptics');
    if (Haptics) {
      await Haptics.impact({ style });
    }
  } catch (error) {
    console.log('Haptics not available:', error);
  }
}

/**
 * Capacitor 공유 기능
 */
export async function shareContent(title: string, text: string, url?: string) {
  if (!isNativePlatform()) {
    // 웹에서는 Web Share API 사용
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return true;
      } catch (error) {
        console.log('Web Share failed:', error);
        return false;
      }
    }
    return false;
  }

  try {
    const Share = await loadCapacitorPlugin<any>('Share');
    if (Share) {
      await Share.share({
        title,
        text,
        url,
        dialogTitle: '공유하기'
      });
      return true;
    }
  } catch (error) {
    console.log('Share not available:', error);
  }
  return false;
}

/**
 * Capacitor 카메라 접근
 */
export async function openCamera() {
  if (!isNativePlatform()) return null;

  try {
    const Camera = await loadCapacitorPlugin<any>('Camera');
    if (Camera) {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: 'uri',
        source: 'camera'
      });
      return image;
    }
  } catch (error) {
    console.log('Camera not available:', error);
  }
  return null;
}

/**
 * Capacitor 토스트 메시지
 */
export async function showToast(text: string, duration: 'short' | 'long' = 'short') {
  if (!isNativePlatform()) return;

  try {
    const Toast = await loadCapacitorPlugin<any>('Toast');
    if (Toast) {
      await Toast.show({
        text,
        duration: duration === 'short' ? 2000 : 3500
      });
    }
  } catch (error) {
    console.log('Toast not available:', error);
  }
}
