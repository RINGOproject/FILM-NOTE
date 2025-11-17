# 📱 FILM NOTE 앱 아이콘

이 폴더에 앱 아이콘 파일을 배치하세요.

## 필요한 파일

```
/public/icons/
├── icon-16x16.png
├── icon-32x32.png
├── icon-72x72.png
├── icon-96x96.png
├── icon-128x128.png
├── icon-144x144.png
├── icon-152x152.png
├── icon-192x192.png
├── icon-384x384.png
└── icon-512x512.png
```

## 빠른 생성 방법

### 1. 온라인 도구 (가장 쉬움)
- https://www.appicon.co/ - 1024x1024 이미지 업로드하면 모든 크기 자동 생성
- https://realfavicongenerator.net/ - 고급 옵션

### 2. 임시 아이콘 (개발용)
다음 URL에서 각 크기별로 다운로드:

```
16x16: https://dummyimage.com/16x16/0a0e27/5b7aff&text=FN
32x32: https://dummyimage.com/32x32/0a0e27/5b7aff&text=FN
72x72: https://dummyimage.com/72x72/0a0e27/5b7aff&text=FN
96x96: https://dummyimage.com/96x96/0a0e27/5b7aff&text=FN
128x128: https://dummyimage.com/128x128/0a0e27/5b7aff&text=FN
144x144: https://dummyimage.com/144x144/0a0e27/5b7aff&text=FN
152x152: https://dummyimage.com/152x152/0a0e27/5b7aff&text=FN
192x192: https://dummyimage.com/192x192/0a0e27/5b7aff&text=FN
384x384: https://dummyimage.com/384x384/0a0e27/5b7aff&text=FN
512x512: https://dummyimage.com/512x512/0a0e27/5b7aff&text=FN
```

각 링크를 브라우저에서 열고 우클릭 > "이미지 저장"

### 3. 디자인 가이드라인

**색상:**
- 배경: `#0a0e27` (다크 네이비)
- 전경: `#5b7aff` (블루)

**심볼:**
- 🍿 팝콘 (추천)
- 🎬 클래퍼보드
- 🎥 영화 카메라
- "FN" 텍스트 로고

**스타일:**
- 미니멀한 디자인
- 명확한 실루엣
- 작은 크기에서도 알아볼 수 있을 것

## 확인 방법

아이콘을 배치한 후:

1. 브라우저에서 `https://your-site.com/icons/icon-192x192.png` 접속
2. 이미지가 표시되는지 확인
3. Chrome DevTools > Application > Manifest 에서 아이콘 확인
