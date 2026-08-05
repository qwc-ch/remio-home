/*
 * @Author: kasuie
 * @Date: 2024-05-22 14:11:51
 * @LastEditors: kasuie
 * @LastEditTime: 2024-05-24 10:09:47
 * @Description:
 */
import { makeBlurDataURL } from "@kasuie/utils";
import { CSSProperties, ImgHTMLAttributes } from "react";

export type ImageProps = {
  alt?: string | undefined;
  className?: any;
  imageProps?: any;
  skeleton?: boolean;
  priority?: boolean;
  width?: number;
  height?: number;
  style?: CSSProperties;
} & Omit<ImgHTMLAttributes<HTMLImageElement>, "alt">;

export const Image = ({
  width,
  height,
  src,
  alt,
  className,
  skeleton = false,
  priority,
  ...imageProps
}: ImageProps) => {
  return (
    <img
      src={src as string}
      alt={alt || "image"}
      width={width}
      height={height}
      loading="lazy"
      {...(skeleton
        ? {
            placeholder: "blur" as const,
            blurDataURL: makeBlurDataURL(width as number, height as number),
          }
        : {})}
      className={className}
      {...imageProps}
    />
  );
};

Image.displayName = "Image";