/**
 * Capacitor 글로벌 타입 정의
 */

interface Window {
  Capacitor?: {
    getPlatform: () => 'ios' | 'android' | 'web';
    isNativePlatform: () => boolean;
    convertFileSrc: (filePath: string) => string;
    Plugins: any;
  };
}

declare module '@capacitor/app' {
  export interface AppPlugin {
    exitApp(): Promise<void>;
    getInfo(): Promise<AppInfo>;
    getState(): Promise<AppState>;
    getLaunchUrl(): Promise<AppLaunchUrl | undefined>;
    openUrl(options: OpenURLOptions): Promise<OpenURLResult>;
    addListener(
      eventName: 'backButton',
      listenerFunc: (info: BackButtonListenerEvent) => void
    ): Promise<PluginListenerHandle>;
    addListener(
      eventName: 'appStateChange',
      listenerFunc: (state: AppState) => void
    ): Promise<PluginListenerHandle>;
    addListener(
      eventName: 'appUrlOpen',
      listenerFunc: (data: URLOpenListenerEvent) => void
    ): Promise<PluginListenerHandle>;
    addListener(
      eventName: 'appRestoredResult',
      listenerFunc: (data: RestoredListenerEvent) => void
    ): Promise<PluginListenerHandle>;
    removeAllListeners(): Promise<void>;
  }

  export interface AppInfo {
    name: string;
    id: string;
    build: string;
    version: string;
  }

  export interface AppState {
    isActive: boolean;
  }

  export interface AppLaunchUrl {
    url: string;
  }

  export interface OpenURLOptions {
    url: string;
  }

  export interface OpenURLResult {
    completed: boolean;
  }

  export interface BackButtonListenerEvent {
    canGoBack: boolean;
  }

  export interface URLOpenListenerEvent {
    url: string;
  }

  export interface RestoredListenerEvent {
    pluginId: string;
    methodName: string;
    data?: any;
    success: boolean;
    error?: {
      message: string;
    };
  }

  export interface PluginListenerHandle {
    remove: () => Promise<void>;
  }

  export const App: AppPlugin;
}

declare module '@capacitor/status-bar' {
  export interface StatusBarPlugin {
    setStyle(options: StyleOptions): Promise<void>;
    setBackgroundColor(options: BackgroundColorOptions): Promise<void>;
    show(options?: AnimationOptions): Promise<void>;
    hide(options?: AnimationOptions): Promise<void>;
    getInfo(): Promise<StatusBarInfo>;
    setOverlaysWebView(options: SetOverlaysWebViewOptions): Promise<void>;
  }

  export enum Style {
    Dark = 'DARK',
    Light = 'LIGHT',
    Default = 'DEFAULT',
  }

  export interface StyleOptions {
    style: Style | 'DARK' | 'LIGHT' | 'DEFAULT';
  }

  export interface BackgroundColorOptions {
    color: string;
  }

  export interface AnimationOptions {
    animation?: Animation;
  }

  export enum Animation {
    None = 'NONE',
    Slide = 'SLIDE',
    Fade = 'FADE',
  }

  export interface StatusBarInfo {
    visible: boolean;
    style: Style;
    color?: string;
    overlays?: boolean;
  }

  export interface SetOverlaysWebViewOptions {
    overlay: boolean;
  }

  export const StatusBar: StatusBarPlugin;
}

declare module '@capacitor/splash-screen' {
  export interface SplashScreenPlugin {
    show(options?: ShowOptions): Promise<void>;
    hide(options?: HideOptions): Promise<void>;
  }

  export interface ShowOptions {
    autoHide?: boolean;
    fadeInDuration?: number;
    fadeOutDuration?: number;
    showDuration?: number;
  }

  export interface HideOptions {
    fadeOutDuration?: number;
  }

  export const SplashScreen: SplashScreenPlugin;
}

declare module '@capacitor/haptics' {
  export interface HapticsPlugin {
    impact(options?: ImpactOptions): Promise<void>;
    notification(options?: NotificationOptions): Promise<void>;
    vibrate(options?: VibrateOptions): Promise<void>;
    selectionStart(): Promise<void>;
    selectionChanged(): Promise<void>;
    selectionEnd(): Promise<void>;
  }

  export enum ImpactStyle {
    Heavy = 'HEAVY',
    Medium = 'MEDIUM',
    Light = 'LIGHT',
  }

  export interface ImpactOptions {
    style: ImpactStyle | 'HEAVY' | 'MEDIUM' | 'LIGHT';
  }

  export enum NotificationType {
    Success = 'SUCCESS',
    Warning = 'WARNING',
    Error = 'ERROR',
  }

  export interface NotificationOptions {
    type: NotificationType;
  }

  export interface VibrateOptions {
    duration?: number;
  }

  export const Haptics: HapticsPlugin;
}

declare module '@capacitor/share' {
  export interface SharePlugin {
    share(options: ShareOptions): Promise<ShareResult>;
    canShare(): Promise<CanShareResult>;
  }

  export interface ShareOptions {
    title?: string;
    text?: string;
    url?: string;
    files?: string[];
    dialogTitle?: string;
  }

  export interface ShareResult {
    activityType?: string;
  }

  export interface CanShareResult {
    value: boolean;
  }

  export const Share: SharePlugin;
}

declare module '@capacitor/keyboard' {
  export interface KeyboardPlugin {
    show(): Promise<void>;
    hide(): Promise<void>;
    setAccessoryBarVisible(options: AccessoryBarOptions): Promise<void>;
    setScroll(options: ScrollOptions): Promise<void>;
    setStyle(options: KeyboardStyleOptions): Promise<void>;
    setResizeMode(options: KeyboardResizeOptions): Promise<void>;
    addListener(
      eventName: 'keyboardWillShow',
      listenerFunc: (info: KeyboardInfo) => void
    ): Promise<PluginListenerHandle>;
    addListener(
      eventName: 'keyboardDidShow',
      listenerFunc: (info: KeyboardInfo) => void
    ): Promise<PluginListenerHandle>;
    addListener(
      eventName: 'keyboardWillHide',
      listenerFunc: () => void
    ): Promise<PluginListenerHandle>;
    addListener(
      eventName: 'keyboardDidHide',
      listenerFunc: () => void
    ): Promise<PluginListenerHandle>;
    removeAllListeners(): Promise<void>;
  }

  export interface AccessoryBarOptions {
    isVisible: boolean;
  }

  export interface ScrollOptions {
    isDisabled: boolean;
  }

  export enum KeyboardStyle {
    Dark = 'DARK',
    Light = 'LIGHT',
  }

  export interface KeyboardStyleOptions {
    style: KeyboardStyle | 'DARK' | 'LIGHT';
  }

  export enum KeyboardResize {
    Body = 'body',
    Ionic = 'ionic',
    Native = 'native',
    None = 'none',
  }

  export interface KeyboardResizeOptions {
    mode: KeyboardResize | 'body' | 'ionic' | 'native' | 'none';
  }

  export interface KeyboardInfo {
    keyboardHeight: number;
  }

  export interface PluginListenerHandle {
    remove: () => Promise<void>;
  }

  export const Keyboard: KeyboardPlugin;
}

declare module '@capacitor/network' {
  export interface NetworkPlugin {
    getStatus(): Promise<NetworkStatus>;
    addListener(
      eventName: 'networkStatusChange',
      listenerFunc: (status: NetworkStatus) => void
    ): Promise<PluginListenerHandle>;
    removeAllListeners(): Promise<void>;
  }

  export interface NetworkStatus {
    connected: boolean;
    connectionType: ConnectionType;
  }

  export enum ConnectionType {
    Wifi = 'wifi',
    Cellular = 'cellular',
    None = 'none',
    Unknown = 'unknown',
  }

  export interface PluginListenerHandle {
    remove: () => Promise<void>;
  }

  export const Network: NetworkPlugin;
}
