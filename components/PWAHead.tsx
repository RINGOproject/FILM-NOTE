import { useEffect } from 'react';

/**
 * PWA를 위한 메타 태그 및 설정을 동적으로 추가하는 컴포넌트
 */
export function PWAHead() {
  useEffect(() => {
    // 메타 태그 추가
    const metaTags = [
      { name: 'theme-color', content: '#0a0e27' },
      { name: 'description', content: '영화를 사랑하는 사람들의 평론 커뮤니티. 리뷰를 작성하고 공유하세요.' },
      { name: 'keywords', content: '영화, 리뷰, 평점, 평론, OTT, 넷플릭스, 디즈니플러스, 영화 커뮤니티' },
      { name: 'author', content: 'FILM NOTE' },
      
      // Apple Meta Tags
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      { name: 'apple-mobile-web-app-title', content: 'FILM NOTE' },
      
      // Open Graph
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: 'FILM NOTE - 영화 평론 커뮤니티' },
      { property: 'og:description', content: '영화를 사랑하는 사람들의 평론 커뮤니티. 리뷰를 작성하고 공유하세요.' },
      { property: 'og:image', content: '/icons/icon-512x512.png' },
      
      // Twitter
      { property: 'twitter:card', content: 'summary_large_image' },
      { property: 'twitter:title', content: 'FILM NOTE - 영화 평론 커뮤니티' },
      { property: 'twitter:description', content: '영화를 사랑하는 사람들의 평론 커뮤니티. 리뷰를 작성하고 공유하세요.' },
      { property: 'twitter:image', content: '/icons/icon-512x512.png' },
    ];

    const createdTags: HTMLMetaElement[] = [];

    metaTags.forEach(({ name, property, content }) => {
      const existingTag = name 
        ? document.querySelector(`meta[name="${name}"]`)
        : document.querySelector(`meta[property="${property}"]`);

      if (!existingTag) {
        const meta = document.createElement('meta');
        if (name) {
          meta.name = name;
        } else if (property) {
          meta.setAttribute('property', property);
        }
        meta.content = content;
        document.head.appendChild(meta);
        createdTags.push(meta);
      } else {
        (existingTag as HTMLMetaElement).content = content;
      }
    });

    // Link 태그 추가
    const linkTags = [
      { rel: 'manifest', href: '/manifest.json' },
      { rel: 'apple-touch-icon', href: '/icons/icon-192x192.png' },
      { rel: 'apple-touch-icon', sizes: '152x152', href: '/icons/icon-152x152.png' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/icons/icon-192x192.png' },
      { rel: 'apple-touch-icon', sizes: '512x512', href: '/icons/icon-512x512.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/icons/icon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/icons/icon-16x16.png' },
    ];

    const createdLinks: HTMLLinkElement[] = [];

    linkTags.forEach(({ rel, href, sizes, type }) => {
      const selector = sizes 
        ? `link[rel="${rel}"][sizes="${sizes}"]`
        : `link[rel="${rel}"][href="${href}"]`;
      
      const existingLink = document.querySelector(selector);

      if (!existingLink) {
        const link = document.createElement('link');
        link.rel = rel;
        link.href = href;
        if (sizes) link.setAttribute('sizes', sizes);
        if (type) link.type = type;
        document.head.appendChild(link);
        createdLinks.push(link);
      }
    });

    // 타이틀 설정
    const originalTitle = document.title;
    document.title = 'FILM NOTE - 영화 평론 커뮤니티';

    // viewport 메타 태그 확인 및 업데이트
    let viewportMeta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;
    const originalViewport = viewportMeta?.content;
    if (viewportMeta) {
      viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes';
    } else {
      viewportMeta = document.createElement('meta');
      viewportMeta.name = 'viewport';
      viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes';
      document.head.appendChild(viewportMeta);
      createdTags.push(viewportMeta);
    }

    // Cleanup
    return () => {
      document.title = originalTitle;
      createdTags.forEach(tag => tag.remove());
      createdLinks.forEach(link => link.remove());
      if (originalViewport && viewportMeta) {
        viewportMeta.content = originalViewport;
      }
    };
  }, []);

  return null;
}
