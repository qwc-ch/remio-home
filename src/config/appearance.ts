import type { BgConfig, GlobalStyle, LayoutConfig } from "./types";

/**
 * 全局样式配置
 */
export const globalStyle: GlobalStyle = {
  primaryColor: "#0dbf56",
  theme: "switcher",
  weather: true,
  fallback: "",
  fonts: [],
};

/**
 * 背景配置
 */
export const bgConfig: BgConfig = {
  bg: ["/images/DesktopWallpaper/bg.mp4"],
  mbg: [
    "/images/MobileWallpaper/mobile-1.jpg",
    "/images/MobileWallpaper/mobile-2.jpg",
    "/images/MobileWallpaper/mobile-3.jpg",
    "/images/MobileWallpaper/mobile-4.jpg",
    "/images/MobileWallpaper/mobile-5.jpg",
    "/images/MobileWallpaper/mobile-6.jpg",
    "/images/MobileWallpaper/mobile-7.jpg",
    "/images/MobileWallpaper/mobile-8.jpg",
    "/images/MobileWallpaper/mobile-9.jpg",
    "/images/MobileWallpaper/mobile-10.jpg",
  ],
  bgStyle: "",
  blur: "none",
  cardOpacity: 0.3,
  carousel: false,
  carouselGap: 5,
  transitionTime: 0.7,
  transitionStyle: "default",
  autoAnimate: false,
  audio: "",
};

/**
 * 布局配置
 */
export const layoutConfig: LayoutConfig = {
  gapSize: "lg",
  style: "",
  istTransition: true,
};