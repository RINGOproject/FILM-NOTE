# 📱 FILM NOTE - 모바일 앱 변환 가이드

FILM NOTE 웹 애플리케이션을 모바일 앱으로 변환하는 완벽한 가이드입니다.

---

## 🎯 개요

FILM NOTE는 이제 다음 방식으로 모바일 앱으로 배포할 수 있습니다:

### 1️⃣ PWA (Progressive Web App) ✨
- ✅ **가장 빠르고 간단한 방법**
- ✅ iOS/Android 모두 지원
- ✅ 홈 화면에 설치 가능
- ✅ 오프라인 지원
- ✅ 푸시 알림
- ✅ 앱스토어 불필요

### 2️⃣ Capacitor 네이티브 앱 📦
- ✅ Google Play Store / Apple App Store 배포
- ✅ 네이티브 기능 접근 (카메라, 생체인증 등)
- ✅ 기존 React 코드 100% 재사용
- ✅ Supabase 백엔드 완벽 호환

---

## 🚀 이미 완료된 작업

### ✅ PWA 설정 완료
- [x] Web App Manifest (`/public/manifest.json`)
- [x] Service Worker (`/public/sw.js`)
- [x] PWA 설치 프롬프트 컴포넌트
- [x] iOS 전용 설치 안내
- [x] 오프라인 캐싱 전략
- [x] 백그라운드 동기화
- [x] 푸시 알림 준비

### ✅ Capacitor 설정 완료
- [x] Capacitor Config (`/capacitor.config.ts`)
- [x] 플랫폼별 설정 (Android/iOS)
- [x] 스플래시 스크린 설정
- [x] 상태바 스타일 설정
- [x] 키보드 설정

### ✅ 문서 완비
- [x] PWA 배포 가이드 (`/MOBILE_APP_GUIDE.md`)
- [x] Capacitor 상세 설정 가이드 (`/CAPACITOR_SETUP.md`)
- [x] 문제 해결 FAQ

---

## 📋 추가 작업이 필요한 사항

### 1단계: 앱 아이콘 생성 🎨

FILM NOTE 브랜드에 맞는 앱 아이콘을 디자인하고 생성하세요.

#### 필요한 크기:
- **1024x1024** (기본 디자인용)
- **512x512** (웹 manifest)
- **192x192** (Android)
- **152x152** (iOS)
- **72x72, 96x96, 128x128, 144x144, 384x384** (다양한 디스플레이)

#### 디자인 가이드라인:
```
배경색: #0a0e27 (다크 네이비)
주요색: #5b7aff (블루)
심볼: 영화 필름 또는 팝콘 아이콘
스타일: 미니멀, 시네마틱
```

#### 추천 도구:
- [Figma](https://www.figma.com/) - 디자인
- [App Icon Generator](https://appicon.co/) - 자동 크기 생성
- [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator) - CLI 도구

```bash
# 자동 생성 예시 (1024x1024 PNG 준비 후)
npx pwa-asset-generator logo.png public/icons
```

---

### 2단계: HTML 메타 태그 추가 📄

이미 `/public/index.html` 파일을 생성했습니다. 
프로젝트의 실제 `index.html` 파일에 해당 내용을 복사하세요.

**주요 내용:**
- PWA manifest 링크
- Apple touch icons
- 메타 태그 (theme-color, description 등)
- Service Worker 등록 스크립트

---

### 3단계: PWA 테스트 🧪

#### Chrome DevTools로 테스트
1. 웹사이트를 HTTPS로 배포
2. Chrome DevTools 열기 (F12)
3. **Lighthouse** 탭 > **Progressive Web App** 감사 실행
4. 점수 90+ 확인

#### 모바일 테스트
1. **Android Chrome**:
   - 사이트 접속
   - 메뉴 > "홈 화면에 추가"
   - 설치 후 독립 실행형 모드 확인

2. **iOS Safari**:
   - 사이트 접속
   - 공유 버튼 > "홈 화면에 추가"
   - 설치 확인

#### 오프라인 테스트
1. Chrome DevTools > **Network** 탭
2. **Offline** 체크박스 활성화
3. 페이지 새로고침
4. 캐시된 콘텐츠 로드 확인

---

### 4단계: Capacitor 앱 빌드 (선택사항) 📦

앱스토어 배포를 원하는 경우 Capacitor로 네이티브 앱을 빌드하세요.

#### 상세 가이드 보기:
- **전체 가이드**: `/MOBILE_APP_GUIDE.md` 참고
- **Capacitor 설정**: `/CAPACITOR_SETUP.md` 참고

#### 빠른 시작:
```bash
# 1. Capacitor 설치
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android @capacitor/ios

# 2. 플랫폼 추가
npx cap add android
npx cap add ios

# 3. 웹 빌드
npm run build

# 4. 동기화
npx cap sync

# 5. 네이티브 IDE에서 열기
npx cap open android  # Android Studio
npx cap open ios      # Xcode (Mac만)
```

---

## 🎨 브랜딩 커스터마이징

### 앱 이름
`/public/manifest.json`:
```json
{
  "name": "FILM NOTE - 영화 평론 커뮤니티",
  "short_name": "FILM NOTE"
}
```

### 테마 색상
`/public/manifest.json`:
```json
{
  "theme_color": "#1a1f3a",
  "background_color": "#0a0e27"
}
```

### 스플래시 스크린 (Capacitor)
`/capacitor.config.ts`:
```typescript
SplashScreen: {
  backgroundColor: '#0a0e27',
  spinnerColor: '#5b7aff'
}
```

---

## 📤 배포 방법

### PWA 배포 (권장 첫 단계)

#### 1. Vercel 배포
```bash
# Vercel CLI 설치
npm install -g vercel

# 배포
vercel --prod
```

#### 2. Netlify 배포
```bash
# Netlify CLI 설치
npm install -g netlify-cli

# 배포
netlify deploy --prod
```

#### 3. 커스텀 서버
- HTTPS 필수
- `service-worker.js` 제공
- `manifest.json` 제공

### Capacitor 앱스토어 배포

#### Google Play Store
1. [Play Console](https://play.google.com/console) 계정 생성 ($25)
2. 릴리즈 AAB 빌드
3. 스토어 등록정보 작성
4. 심사 제출

#### Apple App Store
1. [Apple Developer Program](https://developer.apple.com/programs/) 가입 ($99/년)
2. Xcode에서 Archive
3. App Store Connect에 업로드
4. 스토어 등록정보 작성
5. 심사 제출

상세한 배포 가이드는 `/MOBILE_APP_GUIDE.md`를 참고하세요.

---

## 🔔 푸시 알림 설정 (선택사항)

### VAPID 키 생성
```bash
npx web-push generate-vapid-keys
```

### `/utils/pwaInstall.ts` 수정
생성된 public key를 다음 부분에 입력:
```typescript
applicationServerKey: this.urlBase64ToUint8Array(
  'YOUR_VAPID_PUBLIC_KEY'  // 여기에 입력
)
```

### 백엔드에서 푸시 전송
```typescript
// Supabase Edge Function 예시
import webpush from 'npm:web-push';

webpush.setVapidDetails(
  'mailto:your-email@example.com',
  'YOUR_VAPID_PUBLIC_KEY',
  'YOUR_VAPID_PRIVATE_KEY'
);

await webpush.sendNotification(subscription, payload);
```

---

## 📊 분석 및 모니터링

### PWA 설치 추적
```typescript
// Google Analytics 예시
window.addEventListener('appinstalled', () => {
  gtag('event', 'pwa_installed');
});

pwaInstallManager.onChange((canInstall) => {
  if (canInstall) {
    gtag('event', 'pwa_prompt_shown');
  }
});
```

### 사용자 참여도
- **Standalone 모드** 사용률
- **설치율** (프롬프트 표시 → 설치)
- **재방문율**
- **오프라인 사용**

---

## 🐛 문제 해결

### PWA 설치 프롬프트가 표시되지 않음
**원인:**
- HTTPS가 아님
- Service Worker 등록 실패
- manifest.json 누락 또는 오류
- 이미 설치됨

**해결:**
```bash
# Chrome DevTools > Application 탭
# Manifest 섹션에서 오류 확인
# Service Workers 섹션에서 등록 상태 확인
```

### iOS에서 설치 안내가 작동하지 않음
iOS Safari는 `beforeinstallprompt` 이벤트를 지원하지 않습니다.  
대신 `IOSInstallPrompt` 컴포넌트가 수동 안내를 표시합니다.

### Service Worker 캐시 문제
```javascript
// 캐시 버전 업데이트
const CACHE_NAME = 'film-note-v2'; // v1 → v2로 변경
```

### Capacitor 빌드 오류
1. `npx cap sync` 다시 실행
2. 네이티브 프로젝트 클린 빌드
3. Gradle/Pods 캐시 삭제
4. 상세 로그 확인

상세한 문제 해결은 각 가이드 문서를 참고하세요.

---

## ✅ 최종 체크리스트

### PWA 배포
- [ ] 앱 아이콘 생성 (모든 크기)
- [ ] manifest.json 설정 완료
- [ ] Service Worker 등록 확인
- [ ] index.html 메타 태그 추가
- [ ] HTTPS 도메인 준비
- [ ] Lighthouse PWA 점수 90+
- [ ] 모바일 테스트 (Android, iOS)
- [ ] 오프라인 모드 테스트
- [ ] 설치 프롬프트 테스트

### Capacitor 앱 배포
- [ ] 개발 환경 설정 (Android Studio/Xcode)
- [ ] Capacitor 플러그인 설치
- [ ] 앱 아이콘 및 스플래시 생성
- [ ] 앱 서명 키 생성
- [ ] 릴리즈 빌드 성공
- [ ] 실제 디바이스 테스트
- [ ] 스토어 등록정보 준비
- [ ] 개인정보처리방침 작성
- [ ] 심사 제출

---

## 📚 참고 문서

### 프로젝트 내 문서
- `/MOBILE_APP_GUIDE.md` - PWA 및 앱스토어 배포 완벽 가이드
- `/CAPACITOR_SETUP.md` - Capacitor 상세 설정 가이드
- `/public/manifest.json` - PWA 매니페스트
- `/public/sw.js` - Service Worker
- `/capacitor.config.ts` - Capacitor 설정

### 외부 리소스
- [PWA 공식 가이드](https://web.dev/progressive-web-apps/)
- [Capacitor 문서](https://capacitorjs.com/docs)
- [Google Play 배포](https://developer.android.com/studio/publish)
- [App Store 심사 가이드라인](https://developer.apple.com/app-store/review/guidelines/)

---

## 💡 다음 단계

### 즉시 시작 (PWA)
1. ✅ 앱 아이콘 생성
2. ✅ index.html 메타 태그 추가
3. ✅ HTTPS로 배포
4. ✅ 모바일에서 설치 테스트

### 장기 계획 (네이티브 앱)
1. 📱 Capacitor 환경 설정
2. 📱 앱스토어 계정 등록
3. 📱 네이티브 기능 추가 (카메라, 푸시 등)
4. 📱 심사 제출

---

## 🎉 축하합니다!

FILM NOTE는 이제 모바일 앱으로 변환할 준비가 완료되었습니다!

위 가이드를 따라 PWA 또는 네이티브 앱으로 배포하세요. 
질문이나 문제가 있으면 각 가이드 문서의 "문제 해결" 섹션을 참고하세요.

**Happy Deploying! 🚀**

---

**작성일**: 2025-11-10  
**버전**: 1.0.0  
**FILM NOTE Development Team**
