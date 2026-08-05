import type { SlidersConfig } from "./types";

/**
 * 技能加点配置
 */
export const sliders: SlidersConfig = {
  data: [
    {
      title: "JavaScript/TypeScript",
      value: 40,
      icon: "qq",
    },
    {
      title: "Node.js",
      value: 20,
    },
    {
      title: "Linux",
      value: 70,
    },
    {
      title: "python",
      value: 70,
    },
    {
      title: "astro",
      value: 60,
    },
    {
      title: "c++/c",
      value: 10,
    },
    {
      title: "shell",
      value: 20,
    },
  ],
  title: "技能加点",
  color: "linear-gradient(to right, #ffafbd 0%, #c9ffbf 100%)",
  hidden: false,
  column: 4,
};