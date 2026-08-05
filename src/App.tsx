import { lazy, Suspense, useEffect } from "react";
import { appConfig } from "@/config";
import { transformConfig } from "@/lib/config";
import { AppProviders } from "@/providers";
import { Layout } from "@/components/layout/Layout";
import { Loader } from "@/components/ui/loader/Loader";
import { MainEffect } from "@/components/effect/MainEffect";
import { Footer } from "@/components/layout/Footer";
import { Weather } from "@/components/weather/Weather";
import { getMotion } from "@/lib/motion";

const Horizontal = lazy(() =>
  import("@/components/content/Horizontal").then((m) => ({
    default: m.Horizontal,
  }))
);

const Vertical = lazy(() =>
  import("@/components/content/Vertical").then((m) => ({
    default: m.Vertical,
  }))
);

const setMeta = (name: string, content?: string) => {
  if (!content) return;
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.name = name;
    document.head.appendChild(el);
  }
  el.content = content;
};

const useSiteMeta = (config = appConfig) => {
  useEffect(() => {
    document.title = config.name || "Remio Home";
    setMeta("description", config.description);
    setMeta("keywords", config.keywords);
    if (config.favicon) {
      const icon =
        document.querySelector<HTMLLinkElement>('link[rel="icon"]') ||
        document.createElement("link");
      icon.rel = "icon";
      icon.href = config.favicon;
      document.head.appendChild(icon);
    }
    setMeta("baidu-site-verification", import.meta.env.VITE_BAIDU_SITE_VERIFY);
  }, [config]);
};

const useAnalytics = () => {
  useEffect(() => {
    const GTMID = import.meta.env.VITE_GTMID;
    const GTAGID = import.meta.env.VITE_GTAGID;
    const BAIDUID = import.meta.env.VITE_BAIDUID;

    if (GTMID) {
      const s = document.createElement("script");
      s.src = `https://www.googletagmanager.com/gtm.js?id=${GTMID}`;
      s.async = true;
      document.body.appendChild(s);
    }
    if (GTAGID) {
      const s = document.createElement("script");
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${GTAGID}`;
      document.body.appendChild(s);
      const dataLayer = (window.dataLayer = window.dataLayer || []);
      window.gtag = function gtag(...args: unknown[]) {
        dataLayer.push(args);
      };
      window.gtag("js", new Date());
      window.gtag("config", GTAGID);
    }
    if (BAIDUID) {
      const s = document.createElement("script");
      s.src = `https://hm.baidu.com/hm.js?${BAIDUID}`;
      s.async = true;
      document.body.appendChild(s);
    }
  }, []);
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export default function App() {
  useSiteMeta();
  useAnalytics();

  const {
    staticSites,
    modalSites,
    varStyle,
    istTransition,
    gapSize,
    style,
    bgConfig,
    footer,
    globalStyle,
    resources,
    footers,
  } = transformConfig(appConfig);

  const { bodyHtml } = resources || {};

  const renderMain = (props: any) => {
    if (style === "horizontal") {
      return <Horizontal {...props} />;
    }
    return <Vertical {...props} />;
  };

  return (
    <AppProviders
      appConfig={appConfig}
      ver={import.meta.env.VITE_VERSION || ""}
    >
      <Layout>
        <Suspense
          fallback={
            <Loader warpClass="h-screen bg-black" miao>
              ᓚᘏᗢ猫猫正在努力加载...
            </Loader>
          }
        >
          {globalStyle?.weather && <Weather size={18} />}
          {renderMain({
            name: appConfig.name,
            avatarConfig: appConfig.avatarConfig,
            subTitle: appConfig.subTitle,
            subTitleConfig: appConfig.subTitleConfig,
            socialConfig: appConfig.socialConfig,
            links: appConfig.links,
            sliders: appConfig.sliders,
            footers,
            gapSize,
            istTransition,
            staticSites,
            modalSites,
            primaryColor: varStyle["--primary-color"],
            cardOpacity: bgConfig?.cardOpacity,
            style: varStyle,
          })}
          <MainEffect
            bgArr={bgConfig.bgs}
            mbgArr={bgConfig.mbgs}
            bgStyle={bgConfig?.bgStyle}
            blur={bgConfig?.blur || "sm"}
            audio={bgConfig?.audio}
            carousel={bgConfig?.carousel}
            carouselGap={bgConfig?.carouselGap}
            theme={globalStyle?.theme}
            motions={getMotion(0.1, 4, 0.2, istTransition)}
            musicConfig={appConfig.music}
            primaryColor={varStyle?.["--primary-color"]}
          />
          {footer ? (
            <Footer
              motions={getMotion(0.1, 4, 0.2, istTransition)}
              footer={footer}
            />
          ) : null}
          {bodyHtml && (
            <section
              id="remio-bodyHtml"
              className="relative z-20"
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            ></section>
          )}
        </Suspense>
      </Layout>
    </AppProviders>
  );
}