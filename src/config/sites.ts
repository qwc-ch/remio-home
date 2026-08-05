import type { Site, SitesConfig } from "./types";

/**
 * 项目/站点链接
 */
export const sites: Site[] = [
  {
    icon: "https://q1.qlogo.cn/g?b=qq&nk=1323860289&s=640",
    title: "年华的个人主页",
    url: "https://amamo.top/",
    desc: "博客主页",
  },
  {
    icon: "https://q1.qlogo.cn/g?b=qq&nk=1323860289&s=640",
    title: "年华的博客",
    url: "https://blog.amamo.top/",
    desc: "博客主页",
  },
  {
    icon: "https://q1.qlogo.cn/g?b=qq&nk=1323860289&s=640",
    title: "年华的音乐",
    url: "https://music.amamo.top/",
    desc: "音乐主页",
  },
  {
    icon: "https://q1.qlogo.cn/g?b=qq&nk=1323860289&s=640",
    title: "年华的博客后台",
    url: "https://config.520781.xyz/",
    desc: "博客后台",
  },
];

/**
 * sites 组件渲染配置
 */
export const sitesConfig: SitesConfig = {
  hidden: false,
  cardStyle: "",
  hoverBlur: true,
  hoverScale: true,
  hoverFlip: true,
  direction: "row",
  modal: true,
  modalTips:
    "这里大多都是初学时开发的，算是练手的，技术力不高，看起来也很不好看，算是黑历史，但也算是一段记忆的载体了，所以我想把它保存在此。",
  modalTitle: "",
};