import { useEffect, useMemo, useState } from "react";
import { AppConfig, FontItem } from "@/config";
import { initTheme } from "@/lib/theme";
import { ConfigProvider, useAppConfig } from "./ConfigContext";

export function AppProviders({
  appConfig,
  children,
  ver,
}: Readonly<{
  appConfig: AppConfig;
  children: React.ReactNode;
  ver?: string;
}>) {
  const { js, css } = appConfig.resources || {};

  useEffect(() => {
    initTheme(appConfig.globalStyle?.theme);
  }, [appConfig.globalStyle?.theme]);

  useEffect(() => {
    console.log(
      `\n %c Remio-home${
        ver ? " v" + ver : ""
      } By kasuie %c https://github.com/kasuie`,
      "color:#555;background:linear-gradient(to right, #a8edea 0%, #fed6e3 100%);padding:5px 0;",
      "color:#fff;background:#fff;padding:5px 10px 5px 0px;"
    );
  }, [ver]);

  useEffect(() => {
    const nodes: HTMLElement[] = [];
    js?.forEach((src) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
      nodes.push(script);
    });
    return () => {
      nodes.forEach((node) => node.remove());
    };
  }, [js]);

  const providerValue = useMemo(() => ({ appConfig }), [appConfig]);

  return (
    <ConfigProvider.Provider value={providerValue}>
      {css?.length
        ? css?.map((v: string) => <link rel="stylesheet" key={v} href={v} />)
        : null}
      <FontStyle />
      {children}
    </ConfigProvider.Provider>
  );
}

const DEFAULT_FONT = `
    @font-face {
      font-family: HYTMR;
      src: url("https://npm.elemecdn.com/fontcdn-ariasaka@1.0.0/HYTangMeiRen55W.woff2")
        format("woff2");
      font-weight: normal;
      font-style: normal;
    }
`;

function FontStyle() {
  const { appConfig } = useAppConfig();
  const { fonts, fallback } = appConfig.globalStyle || {};
  const [style, setStyle] = useState<string>(() =>
    buildFontStyle(fonts, fallback)
  );

  useEffect(() => {
    setStyle(buildFontStyle(fonts, fallback));
  }, [fonts, fallback]);

  return <style>{style}</style>;
}

const buildFontStyle = (fonts?: FontItem[], fallback?: string) => {
  const arr: string[] = [];
  let font = DEFAULT_FONT;
  font = fonts?.reduce((prev, curr) => {
    arr.push(curr?.name || "");
    return `
            @font-face {
                font-family: ${curr?.name || "custom"};
                src: url("${curr?.src}");
                font-weight: normal;
                font-style: normal;
            }
            ${prev}
        `;
  }, DEFAULT_FONT) || DEFAULT_FONT;

  const fontFamily = arr.length
    ? arr.join(",") + "," + fallback
    : fallback
      ? `HYTMR, ${fallback}`
      : "HYTMR";

  return `
    ${font}
    .mio-fonts {
      font-family: ${fontFamily};
    }
  `;
};