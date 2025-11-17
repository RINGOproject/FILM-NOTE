import { useState, useEffect } from 'react';
import { X, Download, Smartphone } from 'lucide-react';
import { Button } from './ui/button';
import { pwaInstallManager } from '../utils/pwaInstall';
import { motion, AnimatePresence } from 'framer-motion';

export function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // 이미 설치되어 있거나 standalone 모드면 프롬프트 표시 안 함
    if (pwaInstallManager.isStandalone()) {
      return;
    }

    // 이전에 닫았는지 확인 (24시간 동안 표시 안 함)
    const lastDismissed = localStorage.getItem('pwa-install-dismissed');
    if (lastDismissed) {
      const dismissedTime = parseInt(lastDismissed, 10);
      const hoursPassed = (Date.now() - dismissedTime) / (1000 * 60 * 60);
      if (hoursPassed < 24) {
        return;
      }
    }

    // 설치 가능 여부 변경 감지
    const unsubscribe = pwaInstallManager.onChange((canInstall) => {
      setShowPrompt(canInstall);
    });

    // 초기 상태 확인
    if (pwaInstallManager.canInstall()) {
      // 3초 후 프롬프트 표시 (사용자 경험 개선)
      setTimeout(() => setShowPrompt(true), 3000);
    }

    return unsubscribe;
  }, []);

  const handleInstall = async () => {
    setIsInstalling(true);
    const result = await pwaInstallManager.install();
    
    if (result === 'accepted') {
      setShowPrompt(false);
    } else if (result === 'dismissed') {
      handleDismiss();
    }
    
    setIsInstalling(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  if (!showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-20 left-4 right-4 md:left-auto md:right-8 md:bottom-8 md:max-w-md z-50"
      >
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-6">
          {/* 닫기 버튼 */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>

          {/* 아이콘 */}
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Smartphone className="w-8 h-8 text-white" />
            </div>

            <div className="flex-1 pt-1">
              <h3 className="text-white mb-1">
                FILM NOTE 앱 설치
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                홈 화면에 추가하고 더 빠르게 접속하세요
              </p>

              {/* 혜택 목록 */}
              <ul className="space-y-1 mb-4 text-xs text-slate-300">
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-blue-400 rounded-full mr-2"></span>
                  오프라인에서도 사용 가능
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-blue-400 rounded-full mr-2"></span>
                  더 빠른 로딩 속도
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-blue-400 rounded-full mr-2"></span>
                  푸시 알림 수신
                </li>
              </ul>

              {/* 버튼 */}
              <div className="flex space-x-2">
                <Button
                  onClick={handleInstall}
                  disabled={isInstalling}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isInstalling ? '설치 중...' : '설치하기'}
                </Button>
                <Button
                  onClick={handleDismiss}
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-white"
                >
                  나중에
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// iOS 전용 설치 안내 (Safari는 beforeinstallprompt를 지원하지 않음)
export function IOSInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // iOS Safari 감지
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator as any).standalone;
    
    if (isIOS && !isInStandaloneMode) {
      const lastDismissed = localStorage.getItem('ios-install-dismissed');
      if (lastDismissed) {
        const dismissedTime = parseInt(lastDismissed, 10);
        const hoursPassed = (Date.now() - dismissedTime) / (1000 * 60 * 60);
        if (hoursPassed < 72) { // 3일 동안 표시 안 함
          return;
        }
      }
      
      setTimeout(() => setShowPrompt(true), 5000);
    }
  }, []);

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('ios-install-dismissed', Date.now().toString());
  };

  if (!showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-20 left-4 right-4 z-50"
      >
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-6">
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <h3 className="text-white mb-2">
            FILM NOTE 앱으로 추가하기
          </h3>
          <p className="text-slate-400 text-sm mb-4">
            Safari 공유 버튼을 누른 후 "홈 화면에 추가"를 선택하세요
          </p>

          <div className="flex items-center justify-center space-x-2 text-sm text-slate-300 bg-slate-800/50 rounded-lg p-3">
            <span>공유</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
            <span>→</span>
            <span>"홈 화면에 추가"</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
