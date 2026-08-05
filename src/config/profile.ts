import type { AvatarConfig, SubTitleConfig } from "./types";

/**
 * 头像配置
 */
export const avatarConfig: AvatarConfig = {
  src: "https://q1.qlogo.cn/g?b=qq&nk=1323860289&s=640",
  size: 150,
  round: "full",
  style: "wave",
  hoverAnimate: "top",
  hidden: false,
  aloneRight: false,
};

/**
 * 头像下方的次标题，可填入一言 API，例：https://v1.hitokoto.cn?c=a&c=b&c=c
 */
export const subTitle = "https://v1.hitokoto.cn?c=a&c=b&c=c";

/**
 * 次标题展示配置
 */
export const subTitleConfig: SubTitleConfig = {
  typing: true,
  loading: "wave",
  loopTyping: true,
  shadow: false,
  typingCursor: true,
  showFrom: true,
  style: "desc",
  gapDelay: 0.05,
  content: "Hello💫，这里是年华の主页",
  desc: "",
  heart: false,
  typingGap: 10,
};