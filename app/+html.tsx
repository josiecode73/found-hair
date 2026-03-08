import { ScrollViewStyleReset } from "expo-router/html";
import type { PropsWithChildren } from "react";

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="zh-TW">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

        {/* 強制手機版 viewport */}
        <meta
          name="viewport"
          content="width=390, initial-scale=1, maximum-scale=1, user-scalable=no"
        />

        <title>Found Hair</title>

        {/* PWA: 加入主畫面 */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="Found Hair" />
        <meta name="application-name" content="Found Hair" />
        <meta name="theme-color" content="#1C1C1C" />
        <meta name="description" content="台北專業美髮沙龍・信義店・東區店" />

        {/* PWA Manifest */}
        <link rel="manifest" href="./manifest.json" />

        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="./assets/images/icon.png" />

        {/* Favicon */}
        <link
          rel="icon"
          type="image/png"
          href="./assets/images/favicon.png"
        />

        {/* ScrollView reset (Expo default) */}
        <ScrollViewStyleReset />

        {/* 全域 CSS：強制手機版 layout */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              *, *::before, *::after {
                box-sizing: border-box;
              }

              html {
                height: 100%;
                background-color: #111111;
              }

              body {
                height: 100%;
                margin: 0 auto;
                padding: 0;
                max-width: 430px;
                background-color: #F8F6F2;
                overflow: hidden;
              }

              #root {
                display: flex;
                flex-direction: column;
                height: 100%;
                width: 100%;
                overflow: hidden;
              }

              /* 桌面：手機框陰影效果 */
              @media screen and (min-width: 431px) {
                body {
                  box-shadow: 0 0 80px rgba(0, 0, 0, 0.7);
                }
              }

              /* 強制蓋掉任何 desktop breakpoint */
              @media (min-width: 768px) {
                body { max-width: 430px !important; margin: 0 auto !important; }
                #root { max-width: 430px !important; }
              }
              @media (min-width: 1024px) {
                body { max-width: 430px !important; margin: 0 auto !important; }
                #root { max-width: 430px !important; }
              }
            `,
          }}
        />
      </head>

      <body>{children}</body>
    </html>
  );
}
