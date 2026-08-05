import type { MusicConfig } from "./types";

/**
 * 音乐播放器配置
 *
 * 无后端环境下：
 * - meting.api 直接由浏览器请求，若目标 API 不支持 CORS，
 *   请在 meting.proxy 配置公共 CORS 代理模板（:url 为占位符）
 * - 音频地址同理，可通过 meting.proxy 中转
 */
export const music: MusicConfig = {
  enable: true,
  mode: "meting",
  volume: 0.8,
  playMode: "list",
  showLyrics: true,
  meting: {
    api: "https://api.qijieya.cn/meting/?server=:server&type=:type&id=:id&auth=:auth&r=:r",
    server: "netease",
    type: "playlist",
    id: "17426009449",
    auth: "",
    proxy: "",
    fallbackApis: [
      "https://api.injahow.cn/meting/?server=:server&type=:type&id=:id",
      "https://api.moeyao.cn/meting/?server=:server&type=:type&id=:id",
    ],
  },
};