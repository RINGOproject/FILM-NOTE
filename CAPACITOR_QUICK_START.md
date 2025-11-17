# ⚡ Capacitor 빠른 시작 가이드

## ✅ 코드 준비 완료!

FILM NOTE는 이제 Capacitor 네이티브 앱으로 빌드할 준비가 되었습니다!

**구현된 기능:**
- ✅ 플랫폼 자동 감지 (iOS/Android/Web)
- ✅ 네이티브 플러그인 통합
- ✅ 햅틱 피드백
- ✅ 네이티브 공유
- ✅ 상태바/키보드/스플래시 스크린 설정
- ✅ 뒤로가기 버튼 처리 (Android)
- ✅ PWA와 공존 가능

---

## 🚀 1단계: 필수 도구 설치

### Node.js 확인
```bash
node --version  # v18 이상 필요
npm --version
```

### Android 개발 (Windows/Mac/Linux)
1. **Android Studio 설치**
   - https://developer.android.com/studio 다운로드
   - 설치 시 "Android SDK" 포함

2. **환경 변수 설정**
   ```bash
   # Windows (시스템 환경 변수)
   ANDROID_HOME=C:\Users\[사용자명]\AppData\Local\Android\Sdk
   Path에 추가: %ANDROID_HOME%\platform-tools
   
   # Mac/Linux (~/.zshrc 또는 ~/.bash_profile)
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

### iOS 개발 (Mac만 가능)
1. **Xcode 설치**
   - Mac App Store에서 설치 (무료)
   
2. **Command Line Tools**
   ```bash
   xcode-select --install
   ```

3. **CocoaPods 설치**
   ```bash
   sudo gem install cocoapods
   ```

---

## 📦 2단계: Capacitor 설치

프로젝트 루트에서 실행:

```bash
# Capacitor 코어 및 CLI
npm install @capacitor/core @capacitor/cli

# 플랫폼 패키지
npm install @capacitor/android @capacitor/ios

# 필수 플러그인 (이미 코드에서 사용 중)
npm install @capacitor/app
npm install @capacitor/haptics
npm install @capacitor/keyboard
npm install @capacitor/status-bar
npm install @capacitor/splash-screen
npm install @capacitor/share
npm install @capacitor/network
```

---

## 🔧 3단계: Capacitor 초기화

```bash
npx cap init
```

**입력 정보:**
- App name: `FILM NOTE`
- App ID (package name): `com.filmnote.app`
- Web asset directory: `dist` (또는 `build`)

**자동 생성:** `capacitor.config.ts` (이미 프로젝트에 포함됨)

---

## 🏗️ 4단계: 웹 앱 빌드

```bash
# 프로덕션 빌드
npm run build

# 또는
yarn build
```

**확인:** `dist` 또는 `build` 폴더가 생성되었는지 확인

---

## 📱 5단계: 플랫폼 추가

### Android
```bash
npx cap add android
```

**생성 폴더:** `/android`

### iOS (Mac만)
```bash
npx cap add ios
```

**생성 폴더:** `/ios`

---

## 🔄 6단계: 동기화

웹 빌드를 네이티브 프로젝트로 복사:

```bash
# 모든 플랫폼
npx cap sync

# 특정 플랫폼만
npx cap sync android
npx cap sync ios
```

**언제 실행하나요?**
- 웹 앱 새로 빌드 후
- 새 플러그인 설치 후
- `capacitor.config.ts` 수정 후

---

## 🤖 Android 앱 빌드

### 1. Android Studio에서 열기
```bash
npx cap open android
```

### 2. 디바이스 선택
- 상단에서 USB 연결된 실제 디바이스 선택
- 또는 에뮬레이터 실행

### 3. 실행
- **Run** 버튼 (▶️) 클릭
- 또는 `Shift + F10`

### 4. APK 빌드 (배포용)
1. **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**
2. 완료 후: `android/app/build/outputs/apk/debug/app-debug.apk`

### 5. 릴리즈 APK (Play Store용)

**서명 키 생성:**
```bash
cd android/app
keytool -genkey -v -keystore film-note.keystore -alias film-note -keyalg RSA -keysize 2048 -validity 10000
```

**빌드:**
```bash
cd android
./gradlew assembleRelease  # APK
./gradlew bundleRelease    # AAB (Play Store 권장)
```

**결과물:**
- APK: `android/app/build/outputs/apk/release/app-release.apk`
- AAB: `android/app/build/outputs/bundle/release/app-release.aab`

---

## 🍎 iOS 앱 빌드 (Mac만)

### 1. Xcode에서 열기
```bash
npx cap open ios
```

### 2. 서명 설정
1. 프로젝트 네비게이터에서 **App** 선택
2. **Signing & Capabilities** 탭
3. **Team** 선택 (Apple ID 로그인 필요)
4. **Bundle Identifier** 확인: `com.filmnote.app`

### 3. 디바이스 선택
- 상단에서 시뮬레이터 또는 실제 디바이스 선택

### 4. 실행
- **Product** > **Run** (⌘R)

### 5. Archive (App Store 배포용)
1. **Product** > **Archive**
2. **Organizer** 창에서 **Distribute App**
3. 배포 방법 선택:
   - **App Store Connect** (앱스토어)
   - **Ad Hoc** (테스트)

---

## 🎨 앱 아이콘 추가

### 자동 생성 (권장)
```bash
# 플러그인 설치
npm install @capacitor/assets --save-dev

# 1024x1024 아이콘 준비 (logo.png)
# 모든 크기 자동 생성
npx capacitor-assets generate
```

### 수동 배치
- **Android**: `android/app/src/main/res/mipmap-*/ic_launcher.png`
- **iOS**: Xcode > Assets > AppIcon

---

## 🧪 테스트

### 개발 중 라이브 리로드

**1. 웹 서버 실행**
```bash
npm run dev
# 예: http://localhost:5173
```

**2. capacitor.config.ts 수정**
```typescript
export default {
  // ... 기존 설정
  server: {
    url: 'http://192.168.1.100:5173',  // 로컬 IP 주소
    cleartext: true
  }
}
```

**3. 동기화 및 실행**
```bash
npx cap sync
npx cap open android  # 또는 ios
```

이제 코드 수정 시 자동 새로고침됩니다!

---

## 🐛 디버깅

### Android
```bash
# 로그 확인
adb logcat | grep Capacitor

# Chrome DevTools 원격 디버깅
chrome://inspect
```

### iOS
- **Safari** > **개발** > **[디바이스명]** > **[앱명]**

### 콘솔 로그
앱 실행 시 다음 로그 확인:
```
🚀 FILM NOTE 초기화
📱 플랫폼: android (또는 ios)
🔧 네이티브 앱: true
📱 Capacitor 네이티브 앱으로 실행 중...
✅ StatusBar configured
✅ SplashScreen hidden
✅ Capacitor initialization complete!
```

---

## 🔍 동작 확인

### 1. 플랫폼 감지
- 앱 우하단에 "🚀 Capacitor 네이티브 앱" 배지 표시 (개발 모드)
- 콘솔에 플랫폼 정보 출력

### 2. 네이티브 기능
- **공유 버튼**: 네이티브 공유 시트 표시
- **버튼 클릭**: 햅틱 피드백 느껴짐
- **상태바**: 어두운 스타일로 변경
- **뒤로가기** (Android): 앱 종료/뒤로가기

### 3. PWA는?
- 웹 브라우저에서는 자동으로 PWA로 작동
- 네이티브 앱에서는 PWA 프롬프트 숨김

---

## 📤 앱스토어 배포

### Google Play Store
1. **계정 생성**: https://play.google.com/console ($25 일회성)
2. **새 앱 만들기**
3. **AAB 업로드**: `app-release.aab`
4. **스토어 정보 작성**: 아이콘, 스크린샷, 설명
5. **심사 제출**

**심사 기간**: 1-3일

### Apple App Store
1. **Developer Program**: https://developer.apple.com/programs/ ($99/년)
2. **App Store Connect**: 앱 등록
3. **Archive 업로드**: Xcode에서 업로드
4. **앱 정보 작성**: 스크린샷, 설명, 개인정보처리방침
5. **심사 제출**

**심사 기간**: 1-3일

---

## ✅ 체크리스트

### 빌드 전
- [ ] Capacitor 및 플러그인 설치
- [ ] 웹 앱 빌드 (`npm run build`)
- [ ] 플랫폼 추가 (`npx cap add android/ios`)
- [ ] 동기화 (`npx cap sync`)

### Android
- [ ] Android Studio 설치
- [ ] 앱 아이콘 추가
- [ ] 실제 디바이스에서 테스트
- [ ] 릴리즈 APK 빌드 성공
- [ ] Play Console 계정 준비

### iOS
- [ ] Xcode 설치
- [ ] Apple Developer 계정 ($99)
- [ ] 앱 아이콘 추가
- [ ] 서명 설정 완료
- [ ] 실제 디바이스에서 테스트
- [ ] Archive 빌드 성공
- [ ] App Store Connect 계정 준비

---

## 🎯 주요 명령어 요약

```bash
# 설치
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android @capacitor/ios
npm install @capacitor/app @capacitor/haptics @capacitor/share

# 초기화
npx cap init

# 플랫폼 추가
npx cap add android
npx cap add ios

# 빌드 & 동기화
npm run build
npx cap sync

# 열기
npx cap open android
npx cap open ios

# 업데이트 (웹 코드 수정 후)
npm run build && npx cap sync
```

---

## 📚 더 알아보기

- **상세 가이드**: `/CAPACITOR_SETUP.md`
- **전체 문서**: `/MOBILE_APP_GUIDE.md`
- **PWA 가이드**: `/QUICK_START.md`
- **Capacitor 공식 문서**: https://capacitorjs.com/docs

---

## 💡 팁

1. **개발 시**: 라이브 리로드 사용
2. **릴리즈 시**: 프로덕션 빌드로 동기화
3. **업데이트 시**: 웹만 수정 후 sync
4. **플러그인 추가 시**: npm install 후 sync

---

## 🎉 완료!

이제 FILM NOTE가 네이티브 앱으로 실행됩니다!

**예상 소요 시간:**
- Android: 30분-1시간 (처음)
- iOS: 1-2시간 (처음)
- 이후 빌드: 5-10분

**문제 발생 시** `/CAPACITOR_SETUP.md`의 "문제 해결" 섹션을 참고하세요.

**행운을 빕니다! 🚀📱**
