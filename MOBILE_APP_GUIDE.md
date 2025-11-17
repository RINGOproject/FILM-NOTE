# 📱 FILM NOTE 모바일 앱 변환 가이드

FILM NOTE를 PWA 및 네이티브 앱으로 배포하는 완전한 가이드입니다.

---

## 🎯 1단계: PWA (Progressive Web App) 배포

### ✅ 이미 완료된 작업
- ✓ Web App Manifest 생성 (`/public/manifest.json`)
- ✓ Service Worker 구현 (`/public/sw.js`)
- ✓ PWA 설치 프롬프트 컴포넌트
- ✓ 오프라인 지원
- ✓ 캐싱 전략 구현

### 📋 추가 작업 필요사항

#### 1. HTML 헤더에 메타 태그 추가
`index.html` 파일의 `<head>` 섹션에 다음을 추가:

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
  
  <!-- PWA 기본 메타 태그 -->
  <meta name="theme-color" content="#0a0e27">
  <meta name="description" content="영화를 사랑하는 사람들의 평론 커뮤니티. 리뷰를 작성하고 공유하세요.">
  
  <!-- Apple Touch Icon -->
  <link rel="apple-touch-icon" href="/icons/icon-192x192.png">
  <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png">
  
  <!-- iOS 상태바 스타일 -->
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="FILM NOTE">
  
  <!-- Manifest -->
  <link rel="manifest" href="/manifest.json">
  
  <!-- Favicon -->
  <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png">
  
  <title>FILM NOTE - 영화 평론 커뮤니티</title>
</head>
<body>
  <div id="root"></div>
  
  <!-- Service Worker 등록 -->
  <script>
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(reg => console.log('SW registered:', reg))
          .catch(err => console.log('SW registration failed:', err));
      });
    }
  </script>
</body>
</html>
```

#### 2. 앱 아이콘 생성
다음 크기의 아이콘을 `/public/icons/` 폴더에 생성:
- 72x72
- 96x96
- 128x128
- 144x144
- 152x152
- 192x192
- 384x384
- 512x512

**아이콘 생성 도구:**
- [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator)
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [Favicon.io](https://favicon.io/)

```bash
# npm으로 자동 생성
npx pwa-asset-generator logo.png public/icons
```

#### 3. HTTPS 설정
PWA는 HTTPS에서만 동작합니다. Vercel, Netlify, Cloudflare Pages 등을 사용하면 자동으로 HTTPS가 적용됩니다.

#### 4. 배포
```bash
# Vercel 배포 예시
vercel --prod

# Netlify 배포 예시
netlify deploy --prod
```

### 🧪 PWA 테스트
1. Chrome DevTools > Lighthouse > Progressive Web App 감사 실행
2. 모바일에서 "홈 화면에 추가" 테스트
3. 오프라인 모드에서 동작 확인

---

## 📱 2단계: Capacitor로 네이티브 앱 변환

### 설치 및 초기 설정

#### 1. Capacitor 설치
```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android @capacitor/ios
npm install @capacitor/splash-screen @capacitor/status-bar
npm install @capacitor/keyboard @capacitor/push-notifications
npm install @capacitor/local-notifications @capacitor/share
npm install @capacitor/app @capacitor/haptics
```

#### 2. Capacitor 초기화
```bash
npx cap init
# App name: FILM NOTE
# App ID: com.filmnote.app
# Web asset directory: dist (또는 build 폴더)
```

#### 3. 플랫폼 추가
```bash
# Android 추가
npx cap add android

# iOS 추가 (macOS에서만)
npx cap add ios
```

#### 4. 빌드 및 동기화
```bash
# 웹 앱 빌드
npm run build

# Capacitor와 동기화
npx cap sync

# 또는 개별 플랫폼
npx cap sync android
npx cap sync ios
```

### Android 앱 빌드

#### 1. Android Studio 설치
[Android Studio](https://developer.android.com/studio) 다운로드 및 설치

#### 2. Android 프로젝트 열기
```bash
npx cap open android
```

#### 3. 앱 아이콘 및 스플래시 설정
`android/app/src/main/res/` 폴더에 아이콘 추가

**자동 생성 도구:**
```bash
npm install @capacitor/assets --save-dev
npx capacitor-assets generate --android
```

#### 4. 서명 키 생성 (릴리즈 빌드용)
```bash
keytool -genkey -v -keystore film-note.keystore -alias film-note -keyalg RSA -keysize 2048 -validity 10000
```

`android/app/build.gradle`에 서명 설정 추가:
```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file("../../film-note.keystore")
            storePassword "your-password"
            keyAlias "film-note"
            keyPassword "your-password"
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

#### 5. APK/AAB 빌드
```bash
# Android Studio에서 Build > Build Bundle(s) / APK(s) > Build APK
# 또는 커맨드라인:
cd android
./gradlew assembleRelease  # APK 생성
./gradlew bundleRelease    # AAB 생성 (Play Store용)
```

생성된 파일 위치:
- APK: `android/app/build/outputs/apk/release/app-release.apk`
- AAB: `android/app/build/outputs/bundle/release/app-release.aab`

### iOS 앱 빌드 (macOS 필요)

#### 1. Xcode 설치
App Store에서 Xcode 설치

#### 2. CocoaPods 설치
```bash
sudo gem install cocoapods
```

#### 3. iOS 프로젝트 열기
```bash
npx cap open ios
```

#### 4. 아이콘 및 스플래시 설정
```bash
npx capacitor-assets generate --ios
```

#### 5. 개발자 계정 설정
Xcode에서 Signing & Capabilities 탭:
- Team 선택 (Apple Developer 계정 필요)
- Bundle Identifier 확인: `com.filmnote.app`

#### 6. 빌드
Xcode에서:
1. Product > Archive
2. Distribute App
3. App Store Connect 또는 Ad Hoc 선택

### 앱스토어 배포

#### Google Play Store
1. [Google Play Console](https://play.google.com/console) 가입 ($25 일회성)
2. 새 앱 만들기
3. AAB 파일 업로드
4. 스토어 목록 작성 (스크린샷, 설명 등)
5. 심사 제출

**필요한 자료:**
- 앱 아이콘 512x512
- 스크린샷 (최소 2개)
- 기능 그래픽 1024x500
- 개인정보처리방침 URL

#### Apple App Store
1. [Apple Developer Program](https://developer.apple.com/programs/) 가입 ($99/년)
2. App Store Connect에서 새 앱 등록
3. Xcode에서 Archive 업로드
4. 앱 정보 작성
5. 심사 제출

**필요한 자료:**
- 앱 아이콘 1024x1024
- 스크린샷 (iPhone, iPad)
- 앱 미리보기 동영상 (선택)
- 개인정보처리방침 URL

---

## 🔧 Capacitor 플러그인 통합

### App.tsx 수정 예시

```typescript
import { useEffect } from 'react';
import { App as CapApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Share } from '@capacitor/share';

function App() {
  useEffect(() => {
    initCapacitor();
  }, []);

  const initCapacitor = async () => {
    // 상태바 스타일 설정
    try {
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setBackgroundColor({ color: '#0a0e27' });
    } catch (e) {
      console.log('StatusBar not available');
    }

    // 스플래시 숨기기
    try {
      await SplashScreen.hide();
    } catch (e) {
      console.log('SplashScreen not available');
    }

    // 뒤로가기 버튼 핸들러 (Android)
    CapApp.addListener('backButton', ({ canGoBack }) => {
      if (!canGoBack) {
        CapApp.exitApp();
      } else {
        window.history.back();
      }
    });
  };

  // 햅틱 피드백
  const triggerHaptic = async () => {
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (e) {
      console.log('Haptics not available');
    }
  };

  // 공유 기능
  const shareContent = async (title: string, text: string, url: string) => {
    try {
      await Share.share({
        title,
        text,
        url,
        dialogTitle: '공유하기'
      });
    } catch (e) {
      console.log('Share not available');
    }
  };

  // ... 나머지 컴포넌트
}
```

### 푸시 알림 구현

```typescript
import { PushNotifications } from '@capacitor/push-notifications';

const setupPushNotifications = async () => {
  // 권한 요청
  let permStatus = await PushNotifications.checkPermissions();

  if (permStatus.receive === 'prompt') {
    permStatus = await PushNotifications.requestPermissions();
  }

  if (permStatus.receive !== 'granted') {
    throw new Error('User denied permissions!');
  }

  await PushNotifications.register();

  // 리스너 추가
  PushNotifications.addListener('registration', (token) => {
    console.log('Push registration success, token: ' + token.value);
    // 서버에 토큰 저장
  });

  PushNotifications.addListener('pushNotificationReceived', (notification) => {
    console.log('Push received: ', notification);
  });

  PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
    console.log('Push action performed: ', notification);
  });
};
```

---

## 🎨 앱 아이콘 디자인 가이드라인

### Android
- **Adaptive Icon**: 108x108dp (foreground + background)
- **Legacy Icon**: 48dp ~ 192dp
- **Shape**: 원형, 사각형, 모서리 둥근 사각형 지원

### iOS
- **App Icon**: 1024x1024 (App Store)
- **다양한 크기**: 20pt ~ 1024pt
- **Shape**: 둥근 사각형 (시스템이 자동 적용)
- **투명도**: 불가

---

## 📊 성능 최적화

### 1. 번들 크기 최적화
```bash
# 분석
npm install -D @bundle-analyzer/webpack-plugin

# Tree-shaking 활성화
# 사용하지 않는 라이브러리 제거
```

### 2. 이미지 최적화
```bash
# WebP 변환
npm install -D @squoosh/cli
npx @squoosh/cli --webp auto images/**/*.{jpg,png}
```

### 3. Code Splitting
```typescript
// React.lazy로 페이지 분할
const FeedPage = lazy(() => import('./components/FeedPage'));
const ProfilePage = lazy(() => import('./components/ProfilePage'));
```

### 4. Service Worker 캐싱 전략
- **네트워크 우선**: API 요청
- **캐시 우선**: 정적 리소스, 이미지
- **Stale-While-Revalidate**: 영화 데이터

---

## 🐛 디버깅

### Android
```bash
# 로그 확인
adb logcat

# Chrome DevTools 원격 디버깅
chrome://inspect
```

### iOS
```bash
# Safari 웹 인스펙터
Safari > 개발 > [기기명] > [앱명]
```

### Capacitor 로그
```typescript
import { CapacitorHttp } from '@capacitor/core';

// 네트워크 요청 로깅
console.log('Request:', request);
```

---

## ✅ 체크리스트

### PWA 배포 전
- [ ] manifest.json 설정 완료
- [ ] Service Worker 등록
- [ ] HTTPS 설정
- [ ] 아이콘 생성 (모든 크기)
- [ ] 메타 태그 추가
- [ ] Lighthouse 점수 90+ (PWA)
- [ ] 모바일에서 테스트

### Android 앱 배포 전
- [ ] Capacitor 설치 및 설정
- [ ] 앱 아이콘 및 스플래시 생성
- [ ] 서명 키 생성
- [ ] 릴리즈 빌드 테스트
- [ ] Play Console 계정 생성
- [ ] 스크린샷 및 설명 작성
- [ ] 개인정보처리방침 페이지 작성

### iOS 앱 배포 전
- [ ] Apple Developer 계정 ($99)
- [ ] Xcode 설정
- [ ] 앱 아이콘 및 스플래시 생성
- [ ] Signing 설정
- [ ] Archive 테스트
- [ ] App Store Connect 앱 등록
- [ ] 스크린샷 및 설명 작성
- [ ] 심사 가이드라인 준수 확인

---

## 📚 추가 리소스

- [Capacitor 공식 문서](https://capacitorjs.com/docs)
- [PWA 가이드](https://web.dev/progressive-web-apps/)
- [Google Play 배포 가이드](https://developer.android.com/studio/publish)
- [App Store 심사 가이드라인](https://developer.apple.com/app-store/review/guidelines/)
- [Android 머티리얼 디자인](https://material.io/)
- [iOS 휴먼 인터페이스 가이드라인](https://developer.apple.com/design/human-interface-guidelines/)

---

## 🆘 문제 해결

### 자주 발생하는 오류

#### 1. "net::ERR_CLEARTEXT_NOT_PERMITTED" (Android)
```xml
<!-- android/app/src/main/AndroidManifest.xml -->
<application
    android:usesCleartextTraffic="true"
    ...>
```

#### 2. iOS에서 CORS 오류
```typescript
// capacitor.config.ts
server: {
  cleartext: true
}
```

#### 3. Keyboard가 입력창을 가림
```typescript
import { Keyboard } from '@capacitor/keyboard';

Keyboard.setAccessoryBarVisible({ isVisible: true });
Keyboard.setResizeMode({ mode: 'native' });
```

---

**작성일**: 2025-11-10  
**버전**: 1.0.0  
**작성자**: FILM NOTE Development Team
