import type { AppConfig } from "./types";

/**
 * 站点基础信息
 */
export const siteConfig: Pick<
  AppConfig,
  "name" | "favicon" | "domain" | "keywords" | "description"
> = {
  name: "年华の主页✨",
  favicon: "https://q1.qlogo.cn/g?b=qq&nk=1323860289&s=640",
  keywords:
    "年华の次元,年华的个人博客,年华,个人主页,主页,个人记录,技术博客,个人生活",
  description: "年华の次元，兴趣至上，内容随缘，个人主页",
  domain: "https://amamo.top/",
};