export interface Link {
  title: string;
  color?: string;
  url?: string;
  icon?: string;
}

export interface Site {
  icon?: string;
  title: string;
  url?: string;
  desc?: string;
}

export interface FontItem {
  src?: string;
  name?: string;
}

export interface Slider {
  icon?: string;
  title?: string;
  value?: number;
  color?: string;
}

export interface SitesConfig {
  hidden?: boolean;
  cardStyle?: string;
  hoverBlur?: boolean;
  hoverScale?: boolean;
  hoverFlip?: boolean;
  direction?: string;
  modal?: boolean;
  modalTips?: string;
  modalTitle?: string;
}

export interface SubTitleConfig {
  heart?: boolean;
  shadow?: boolean;
  typing?: boolean;
  loading?: string | boolean;
  typingGap?: number | string;
  loopTyping?: boolean;
  typingCursor?: boolean;
  showFrom?: boolean;
  desc?: string;
  content?: string;
  style?: string;
  gapDelay?: number;
}

export interface SocialConfig {
  ripple?: boolean;
  autoAnimate?: boolean;
  loading?: string | boolean;
}

export interface BgConfig {
  bg?: string | string[];
  mbg?: string | string[];
  audio?: string;
  bgStyle?: string;
  blur?: string;
  cardOpacity?: number;
  carousel?: boolean;
  carouselGap?: number;
  transitionTime?: number;
  transitionStyle?:
    | "default"
    | "toBottom"
    | "toTop"
    | "toLeft"
    | "toRight"
    | "toIn"
    | "toOut"
    | "toInOut"
    | "toOutIn";
  autoAnimate?: boolean;
}

export interface AvatarConfig {
  hidden?: boolean;
  src?: string;
  size?: number;
  round?: string;
  hoverAnimate?: string;
  style?: string;
  aloneRight?: boolean;
}

export interface LayoutConfig {
  istTransition?: boolean;
  gapSize?: string;
  style?: string;
}

export interface SlidersConfig {
  data?: Slider[];
  title?: string;
  hidden?: boolean;
  color?: string;
  column?: number;
}

export interface FooterConfig {
  text?: string;
  url?: string;
  ICP?: string;
  MPSICP?: string;
  direction?: string;
  isExternal?: boolean;
}

export interface GlobalStyle {
  fonts?: FontItem[];
  fallback?: string;
  primaryColor?: string;
  theme?: string;
  weather?: boolean;
}

export interface MetingConfig {
  api?: string;
  server?: "netease" | "tencent" | "kugou" | "xiami" | "baidu";
  type?: "song" | "playlist" | "album" | "search" | "artist";
  id?: string;
  auth?: string;
  fallbackApis?: string[];
  /**
   * 无后端环境下的 CORS 代理模板，:url 占位符会被替换为请求地址，
   * 例如 https://corsproxy.io/?url=:url ，留空则直接请求
   */
  proxy?: string;
}

export interface LocalSong {
  name: string;
  artist: string;
  url: string;
  cover?: string;
  lrc?: string;
}

export interface MusicConfig {
  enable?: boolean;
  mode?: "meting" | "local";
  volume?: number;
  playMode?: "list" | "one" | "random";
  showLyrics?: boolean;
  meting?: MetingConfig;
  local?: { playlist?: LocalSong[] };
}

export interface Resources {
  js?: string[];
  css?: string[];
  bodyHtml?: string;
}

export interface AppConfig {
  name: string;
  favicon?: string;
  domain?: string;
  keywords?: string;
  description?: string;
  avatarConfig?: AvatarConfig;
  layoutConfig?: LayoutConfig;
  bgConfig: BgConfig;
  globalStyle?: GlobalStyle;
  subTitle?: string;
  subTitleConfig?: SubTitleConfig;
  socialConfig?: SocialConfig;
  footer?: string | FooterConfig;
  links: Link[];
  sites: Site[];
  sitesConfig?: SitesConfig;
  sliders?: SlidersConfig;
  resources?: Resources;
  music?: MusicConfig;
}