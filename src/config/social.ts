import type { Link, SocialConfig } from "./types";

/**
 * 社交媒体链接
 */
export const links: Link[] = [
  {
    title: "qq",
    color: "#dfba00",
    url: "https://wpa.qq.com/msgrd?v=3&uin=3542985722&site=qq&menu=yes",
    icon: "qq",
  },
  {
    title: "github",
    color: "#000000",
    url: "https://github.com/qwc-ch",
    icon: "github",
  },
  {
    title: "email",
    color: "#fd3232",
    url: "mailto:zzzzzzxx2022@163.com",
    icon: "email",
  },
  {
    title: "bilibili",
    color: "#0088cc",
    url: "https://b23.tv/zpKw9Er",
    icon: "bilibili",
  },
];

/**
 * 社媒展示配置
 */
export const socialConfig: SocialConfig = {
  autoAnimate: true,
  loading: "wave",
  ripple: true,
};