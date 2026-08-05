/*
 * @Author: kasuie
 * @Date: 2024-05-24 22:10:32
 * @LastEditors: kasuie
 * @LastEditTime: 2025-04-17 16:57:12
 * @Description:
 */
import { AppConfig, Site } from "@/config";

export const transformConfig = (appConfig: AppConfig) => {
  const {
    sites = [],
    layoutConfig = {},
    sitesConfig = {},
    keywords,
    description,
    favicon,
    domain,
    bgConfig,
    globalStyle,
    footer,
    ...others
  } = appConfig;

  const primaryColor: string = globalStyle?.primaryColor || "#229fff";

  /** 布局配置结构于对象中 */
  const { istTransition = true, gapSize = "md", style } = layoutConfig;

  /** 样式变量及样式 */
  const varStyle: Record<string, string> = {
    "--primary-color": primaryColor,
  };

  /** 处理站点 */
  const index = sites.findIndex((v: Site) => !v.url);
  let staticSites: Site[] = [],
    modalSites: Site[] = [];
  if (index > -1) {
    if (!sitesConfig.modal) {
      staticSites = sites.filter((_, i) => i !== index);
    } else {
      staticSites = sites.slice(0, index + 1);
      modalSites = sites.slice(index + 1);
    }
  } else {
    staticSites = sites;
  }

  /** 背景处理 */
  let bgs: string[] = [],
    mbgs: string[] = [];
  if (!bgConfig?.bg) {
    bgs.push("https://s2.loli.net/2024/06/21/euQ48saP7UgMyDr.webp");
  } else if (typeof bgConfig.bg === "string") {
    bgs.push(bgConfig.bg);
  } else if (Array.isArray(bgConfig.bg)) {
    bgs = bgConfig.bg;
  }
  if (!bgConfig?.mbg) {
    mbgs.push("https://s2.loli.net/2024/06/21/59b6eRscAvQWHT1.webp");
  } else if (typeof bgConfig.mbg === "string") {
    mbgs.push(bgConfig.mbg);
  } else if (Array.isArray(bgConfig.mbg)) {
    mbgs = bgConfig.mbg;
  }

  let footers = 0;
  if (typeof footer === "object" && footer.direction?.includes("col")) {
    if (footer.ICP) ++footers;
    if (footer.MPSICP) ++footers;
    if (footer.text) ++footers;
  }

  return {
    ...others,
    footers,
    footer,
    bgConfig: { ...bgConfig, bgs, mbgs },
    sitesConfig,
    primaryColor,
    globalStyle,
    istTransition,
    gapSize,
    style,
    varStyle,
    staticSites,
    modalSites,
  };
};