# 📱 Capacitor 네이티브 앱 설정 가이드

FILM NOTE를 Capacitor를 사용하여 네이티브 모바일 앱으로 변환하는 단계별 가이드입니다.

---

## 🚀 빠른 시작

### 1단계: 개발 환경 준비

#### 공통 요구사항
```bash
# Node.js 18+ 설치 확인
node --version

# npm 또는 yarn 설치 확인
npm --version
```

#### Android 개발 (Windows/Mac/Linux)
1. [Android Studio](https://developer.android.com/studio) 다운로드 및 설치
2. Android SDK 설치 (API 33 이상 권장)
3. 환경 변수 설정:
   ```bash
   # Windows
   ANDROID_HOME=C:\Users\[사용자명]\AppData\Local\Android\Sdk
   
   # Mac/Linux
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
   ```

#### iOS 개발 (Mac만 가능)
1. [Xcode](https://apps.apple.com/app/xcode/id497799835) 설치 (Mac App Store)
2. Xcode Command Line Tools 설치:
   ```bash
   xcode-select --install
   ```
3. CocoaPods 설치:
   ```bash
   sudo gem install cocoapods
   ```

---

## 🔧 2단계: 프로젝트 설정

### Capacitor 설치
```bash
# 프로젝트 루트에서 실행
npm install @capacitor/core @capacitor/cli

# 플랫폼별 패키지 설치
npm install @capacitor/android @capacitor/ios

# 필수 플러그인 설치
npm install @capacitor/app
npm install @capacitor/haptics
npm install @capacitor/keyboard
npm install @capacitor/status-bar
npm install @capacitor/splash-screen
npm install @capacitor/share
npm install @capacitor/push-notifications
npm install @capacitor/local-notifications
npm install @capacitor/network
npm install @capacitor/camera
npm install @capacitor/filesystem
```

### Capacitor 초기화
```bash
npx cap init
```

다음 정보를 입력하세요:
- **App name**: `FILM NOTE`
- **App package ID**: `com.filmnote.app`
- **Web asset directory**: `dist` (또는 `build`)

---

## 📦 3단계: 웹 앱 빌드

### 프로젝트 빌드
```bash
# 프로덕션 빌드
npm run build

# 또는
yarn build
```

**중요**: `dist` 또는 `build` 폴더가 생성되었는지 확인하세요.

---

## 📱 4단계: 플랫폼 추가 및 동기화

### Android 추가
```bash
npx cap add android
```

### iOS 추가 (Mac만)
```bash
npx cap add ios
```

### 파일 동기화
```bash
# 모든 플랫폼 동기화
npx cap sync

# 또는 특정 플랫폼만
npx cap sync android
npx cap sync ios
```

**언제 `sync`를 실행해야 하나요?**
- 웹 앱을 새로 빌드했을 때
- 새로운 Capacitor 플러그인을 설치했을 때
- `capacitor.config.ts`를 수정했을 때

---

## 🤖 5단계: Android 앱 빌드

### Android Studio에서 프로젝트 열기
```bash
npx cap open android
```

### 앱 아이콘 설정

#### 자동 생성 (권장)
```bash
# Capacitor Assets 플러그인 설치
npm install @capacitor/assets --save-dev

# 아이콘 자동 생성 (1024x1024 PNG 필요)
npx capacitor-assets generate --android --iconBackgroundColor '#0a0e27'
```

#### 수동 설정
1. `android/app/src/main/res/` 폴더에 아이콘 추가
2. 다음 크기별 폴더에 배치:
   - `mipmap-mdpi` (48x48)
   - `mipmap-hdpi` (72x72)
   - `mipmap-xhdpi` (96x96)
   - `mipmap-xxhdpi` (144x144)
   - `mipmap-xxxhdpi` (192x192)

### 스플래시 스크린 설정
`android/app/src/main/res/values/` 폴더의 `styles.xml` 수정:
```xml
<style name="AppTheme.NoActionBarLaunch" parent="AppTheme.NoActionBar">
    <item name="android:background">@drawable/splash</item>
</style>
```

### 앱 이름 및 권한 설정
`android/app/src/main/AndroidManifest.xml`:
```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <!-- 권한 -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    
    <application
        android:label="FILM NOTE"
        android:icon="@mipmap/ic_launcher"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:usesCleartextTraffic="true"
        android:theme="@style/AppTheme">
        <!-- ... -->
    </application>
</manifest>
```

### 디버그 APK 빌드
Android Studio에서:
1. **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**
2. 빌드 완료 후 `android/app/build/outputs/apk/debug/app-debug.apk` 생성

### 릴리즈 APK 빌드

#### 1. 키스토어 생성
```bash
cd android/app
keytool -genkey -v -keystore film-note.keystore -alias film-note -keyalg RSA -keysize 2048 -validity 10000
```

#### 2. `gradle.properties` 설정
`android/gradle.properties`에 추가:
```properties
FILM_NOTE_RELEASE_STORE_FILE=film-note.keystore
FILM_NOTE_RELEASE_KEY_ALIAS=film-note
FILM_NOTE_RELEASE_STORE_PASSWORD=your_password
FILM_NOTE_RELEASE_KEY_PASSWORD=your_password
```

#### 3. `build.gradle` 수정
`android/app/build.gradle`:
```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file(FILM_NOTE_RELEASE_STORE_FILE)
            storePassword FILM_NOTE_RELEASE_STORE_PASSWORD
            keyAlias FILM_NOTE_RELEASE_KEY_ALIAS
            keyPassword FILM_NOTE_RELEASE_KEY_PASSWORD
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

#### 4. 릴리즈 빌드 실행
```bash
cd android
./gradlew assembleRelease  # APK
./gradlew bundleRelease    # AAB (Play Store용)
```

**빌드 결과:**
- APK: `android/app/build/outputs/apk/release/app-release.apk`
- AAB: `android/app/build/outputs/bundle/release/app-release.aab`

---

## 🍎 6단계: iOS 앱 빌드 (Mac 전용)

### Xcode에서 프로젝트 열기
```bash
npx cap open ios
```

### 앱 아이콘 설정
```bash
# 자동 생성
npx capacitor-assets generate --ios
```

또는 Xcode에서:
1. **Assets.xcassets** > **AppIcon** 클릭
2. 각 크기별 아이콘 드래그 앤 드롭

### 서명 및 팀 설정
Xcode에서:
1. 프로젝트 네비게이터에서 **App** 선택
2. **Signing & Capabilities** 탭
3. **Team** 선택 (Apple Developer 계정 필요)
4. **Bundle Identifier** 확인: `com.filmnote.app`

### 디바이스 또는 시뮬레이터에서 실행
1. Xcode 상단에서 타겟 디바이스 선택
2. **Product** > **Run** (⌘+R)

### Archive 빌드 (배포용)
1. **Product** > **Archive**
2. **Distribute App** 클릭
3. 배포 방법 선택:
   - **App Store Connect** (앱스토어 배포)
   - **Ad Hoc** (테스트 배포)
   - **Development** (개발용)

---

## 🎨 7단계: 앱 아이콘 디자인

### 필요한 아이콘 크기

#### Android
- **적응형 아이콘**: 108dp 안전 영역 내 108dp
- **레거시 아이콘**: 48, 72, 96, 144, 192dp

#### iOS
- **App Store**: 1024x1024 (투명도 없음)
- **앱 내**: 20, 29, 40, 58, 60, 76, 80, 87, 120, 152, 167, 180pt

### 디자인 가이드라인

1. **간결하고 인식 가능하게**
   - 복잡한 디테일 지양
   - 명확한 실루엣

2. **색상**
   - FILM NOTE 브랜드 컬러 사용
   - 배경: `#0a0e27` (네이비)
   - 강조: `#5b7aff` (블루)

3. **안전 영역**
   - Android: 중앙 66dp
   - iOS: 자동 라운드 적용

### 추천 도구
- [Figma](https://www.figma.com/)
- [Canva](https://www.canva.com/)
- [App Icon Generator](https://appicon.co/)
- [MakeAppIcon](https://makeappicon.com/)

---

## 🔌 8단계: Capacitor 플러그인 사용

### App.tsx에 플러그인 통합 예시

```typescript
import { useEffect } from 'react';
import { App as CapApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Share } from '@capacitor/share';
import { Network } from '@capacitor/network';

export default function App() {
  useEffect(() => {
    initCapacitor();
  }, []);

  const initCapacitor = async () => {
    // 플랫폼 감지
    const platform = Capacitor.getPlatform();
    console.log('Running on:', platform); // 'ios', 'android', 'web'

    if (platform !== 'web') {
      // 네이티브 앱에서만 실행
      
      // 상태바 스타일
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setBackgroundColor({ color: '#0a0e27' });
      
      // 스플래시 스크린 숨기기
      await SplashScreen.hide();
      
      // 뒤로가기 버튼 (Android)
      CapApp.addListener('backButton', ({ canGoBack }) => {
        if (!canGoBack) {
          CapApp.exitApp();
        } else {
          window.history.back();
        }
      });

      // 네트워크 상태 모니터링
      Network.addListener('networkStatusChange', status => {
        console.log('Network status changed', status);
      });
    }
  };

  // 햅틱 피드백
  const triggerHaptic = async () => {
    if (Capacitor.isNativePlatform()) {
      await Haptics.impact({ style: ImpactStyle.Light });
    }
  };

  // 공유 기능
  const handleShare = async (title: string, text: string, url: string) => {
    if (Capacitor.isNativePlatform()) {
      await Share.share({
        title,
        text,
        url,
        dialogTitle: '공유하기'
      });
    } else {
      // 웹에서는 Web Share API 사용
      if (navigator.share) {
        await navigator.share({ title, text, url });
      }
    }
  };

  // ... 나머지 컴포넌트
}
```

### 플랫폼별 코드 분기
```typescript
import { Capacitor } from '@capacitor/core';

// 플랫폼 확인
const platform = Capacitor.getPlatform(); // 'ios' | 'android' | 'web'
const isNative = Capacitor.isNativePlatform(); // true | false

// 조건부 실행
if (platform === 'ios') {
  // iOS 전용 코드
} else if (platform === 'android') {
  // Android 전용 코드
} else {
  // 웹 전용 코드
}
```

---

## 📤 9단계: 앱스토어 배포

### Google Play Store

#### 1. 개발자 계정 등록
- [Google Play Console](https://play.google.com/console) 접속
- 일회성 등록비: $25

#### 2. 앱 만들기
1. **앱 만들기** 클릭
2. 앱 이름: `FILM NOTE`
3. 기본 언어: 한국어
4. 앱 또는 게임: 앱
5. 무료 또는 유료: 무료

#### 3. 스토어 등록정보 작성

**필수 항목:**
- 앱 이름: FILM NOTE
- 간단한 설명 (80자)
- 자세한 설명 (4000자)
- 앱 아이콘: 512x512 PNG
- 스크린샷: 최소 2개 (다양한 화면 크기)
- 기능 그래픽: 1024x500 PNG

**선택 항목:**
- 홍보용 동영상
- 프로모 그래픽

#### 4. 콘텐츠 등급
- 설문지 작성 (영화 리뷰 앱)
- 자동으로 등급 부여

#### 5. 타겟 고객 및 콘텐츠
- 타겟 연령: 13세 이상
- 개인정보처리방침 URL 필수

#### 6. 프로덕션 트랙에 릴리즈 만들기
1. **프로덕션** > **새 릴리스 만들기**
2. AAB 파일 업로드
3. 출시 이름 및 출시 노트 작성
4. **검토** > **프로덕션 출시 시작**

#### 7. 심사 대기
- 심사 기간: 일반적으로 1-3일
- 상태는 Play Console에서 확인

---

### Apple App Store

#### 1. Apple Developer Program 가입
- [Apple Developer](https://developer.apple.com/programs/) 접속
- 연간 비용: $99

#### 2. App Store Connect에서 앱 등록
1. [App Store Connect](https://appstoreconnect.apple.com/) 접속
2. **내 앱** > **+** > **새로운 앱**
3. 정보 입력:
   - 플랫폼: iOS
   - 이름: FILM NOTE
   - 기본 언어: 한국어
   - 번들 ID: com.filmnote.app
   - SKU: filmnote

#### 3. 앱 정보 작성
- 개인정보처리방침 URL
- 카테고리: 엔터테인먼트
- 연령 등급

#### 4. 가격 및 사용 가능 여부
- 가격: 무료
- 사용 가능 국가: 대한민국 (또는 전체)

#### 5. 스크린샷 및 미리보기
**필수:**
- 6.7" 디스플레이 (iPhone 15 Pro Max): 최대 10개
- 5.5" 디스플레이 (iPhone 8 Plus): 최대 10개

**선택:**
- 앱 미리보기 동영상

#### 6. Archive 업로드
Xcode에서:
1. **Product** > **Archive**
2. **Distribute App**
3. **App Store Connect**
4. 업로드 완료 대기

#### 7. TestFlight (선택사항)
- 내부 테스터: 즉시 테스트 가능
- 외부 테스터: 베타 앱 심사 필요 (1-2일)

#### 8. 심사 제출
1. 빌드 선택
2. 수출 규정 준수 정보 입력
3. **심사를 위해 제출**

#### 9. 심사 대기
- 심사 기간: 일반적으로 1-3일
- 상태: **심사 대기 중** → **심사 중** → **출시 준비 완료**

---

## 🐛 문제 해결

### 일반적인 오류

#### 1. "Cleartext HTTP traffic not permitted"
**Android**
`android/app/src/main/AndroidManifest.xml`:
```xml
<application
    android:usesCleartextTraffic="true"
    ...>
```

#### 2. CORS 오류 (API 요청)
**capacitor.config.ts**:
```typescript
server: {
  cleartext: true,
  androidScheme: 'https'
}
```

#### 3. 키보드가 입력창을 가림
```typescript
import { Keyboard, KeyboardResize } from '@capacitor/keyboard';

// 네이티브 리사이징 모드
await Keyboard.setResizeMode({ mode: KeyboardResize.Native });

// 악세서리 바 표시
await Keyboard.setAccessoryBarVisible({ isVisible: true });
```

#### 4. iOS에서 Safe Area 문제
CSS:
```css
.app-container {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
```

#### 5. "Provisioning profile doesn't match" (iOS)
Xcode에서:
1. **Signing & Capabilities**
2. **Automatically manage signing** 체크
3. Team 재선택

---

## 📊 성능 최적화

### 번들 크기 줄이기
```bash
# 사용하지 않는 패키지 제거
npm uninstall [package-name]

# 트리 쉐이킹 확인
npm run build -- --stats

# 번들 분석
npm install -D webpack-bundle-analyzer
```

### 이미지 최적화
```bash
# WebP 변환
npm install -D @squoosh/cli
npx @squoosh/cli --webp auto images/**/*.{jpg,png}
```

### Code Splitting
```typescript
// React lazy loading
const FeedPage = lazy(() => import('./components/FeedPage'));
const ProfilePage = lazy(() => import('./components/ProfilePage'));

// 사용
<Suspense fallback={<LoadingSpinner />}>
  <FeedPage />
</Suspense>
```

---

## 🔄 업데이트 배포

### 웹 앱 업데이트
1. 코드 수정
2. `npm run build`
3. `npx cap sync`
4. 네이티브 앱 재빌드

### Over-The-Air (OTA) 업데이트
**Capacitor Live Updates** 사용 (선택사항):
- [Ionic Appflow](https://ionic.io/appflow)
- [Microsoft AppCenter](https://appcenter.ms/)

네이티브 코드 변경 없이 웹 리소스만 업데이트 가능

---

## ✅ 배포 체크리스트

### Android
- [ ] 앱 아이콘 모든 크기 추가
- [ ] 스플래시 스크린 설정
- [ ] 앱 이름 및 버전 설정
- [ ] 키스토어 생성 및 안전 보관
- [ ] 릴리즈 APK/AAB 빌드 성공
- [ ] 실제 디바이스에서 테스트
- [ ] Play Console 계정 등록
- [ ] 스크린샷 및 설명 작성
- [ ] 개인정보처리방침 URL 준비
- [ ] 심사 제출

### iOS
- [ ] 앱 아이콘 모든 크기 추가
- [ ] 스플래시 스크린 설정
- [ ] Apple Developer 계정 등록 ($99)
- [ ] Signing & Capabilities 설정
- [ ] Archive 빌드 성공
- [ ] 실제 디바이스에서 테스트
- [ ] App Store Connect 앱 등록
- [ ] 스크린샷 및 설명 작성
- [ ] 개인정보처리방침 URL 준비
- [ ] 심사 제출

---

## 📚 추가 리소스

### 공식 문서
- [Capacitor 공식 문서](https://capacitorjs.com/docs)
- [Android 개발자 가이드](https://developer.android.com/)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)

### 도구
- [Capacitor Asset Generator](https://github.com/ionic-team/capacitor-assets)
- [App Icon Generator](https://appicon.co/)
- [Screenshot Framer](https://screenshots.pro/)

### 커뮤니티
- [Capacitor Community](https://github.com/capacitor-community)
- [Ionic Forum](https://forum.ionicframework.com/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/capacitor)

---

## 💡 팁

1. **개발 중 라이브 리로드**
   ```bash
   # 웹 서버 실행
   npm run dev
   
   # capacitor.config.ts에 추가
   server: {
     url: 'http://localhost:5173',
     cleartext: true
   }
   ```

2. **디버깅**
   - Android: Chrome DevTools (`chrome://inspect`)
   - iOS: Safari Web Inspector

3. **버전 관리**
   - `package.json` 버전과 네이티브 앱 버전 동기화
   - `android/app/build.gradle`: `versionCode`, `versionName`
   - iOS: Xcode에서 Version & Build 설정

---

**최종 업데이트**: 2025-11-10  
**Capacitor 버전**: 6.x  
**작성자**: FILM NOTE Development Team
