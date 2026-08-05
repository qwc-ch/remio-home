import type { AppConfig } from "./types";
import { siteConfig } from "./site";
import { avatarConfig, subTitle, subTitleConfig } from "./profile";
import { bgConfig, globalStyle, layoutConfig } from "./appearance";
import { links, socialConfig } from "./social";
import { sites, sitesConfig } from "./sites";
import { sliders } from "./skills";
import { music } from "./music";
import { footer, resources } from "./footer";

export * from "./types";

/**
 * 由多个配置文件合并出的完整站点配置
 */
export const appConfig: AppConfig = {
  ...siteConfig,
  avatarConfig,
  subTitle,
  subTitleConfig,
  bgConfig,
  globalStyle,
  layoutConfig,
  links,
  socialConfig,
  sites,
  sitesConfig,
  sliders,
  footer,
  resources,
  music,
};

export default appConfig;