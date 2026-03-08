#!/usr/bin/env node
/**
 * Post-build script: 修改 dist/index.html 為手機版 PWA
 * 執行：node scripts/postbuild-web.js
 */

const fs = require("fs");
const path = require("path");

const distDir = path.join(__dirname, "../dist");
const indexPath = path.join(distDir, "index.html");

if (!fs.existsSync(indexPath)) {
  console.error("❌ dist/index.html not found. Run expo export first.");
  process.exit(1);
}

let html = fs.readFileSync(indexPath, "utf-8");

// ─── 0. 自動偵測並轉換絕對路徑為相對路徑 ───
// 當 baseUrl 設為 "/found-hair" 時，Expo 產生 src="/found-hair/_expo/..."
// 這裡把所有 ="/found-hair/ → ="./
const basePrefixMatch = html.match(/src="(\/[^/"]+\/)/);
if (basePrefixMatch && basePrefixMatch[1] && basePrefixMatch[1] !== '/') {
  const basePrefix = basePrefixMatch[1]; // e.g. "/found-hair/"
  const escaped = basePrefix.replace(/\//g, "\\/");
  html = html.replace(new RegExp(`="${escaped}`, "g"), '="./');
  console.log(`✅ 轉換 base URL: ${basePrefix} → ./`);
}

// ─── 1. 換掉 viewport（強制手機 390px）───
html = html.replace(
  /<meta name="viewport"[^>]*>/,
  `<meta name="viewport" content="width=390, initial-scale=1, maximum-scale=1, user-scalable=no" />`
);

// ─── 2. 換 lang="en" → lang="zh-TW" ───
html = html.replace(`<html lang="en">`, `<html lang="zh-TW">`);

// ─── 3. 在 </head> 之前插入 PWA + 手機版 CSS ───
const headInsert = `
    <!-- PWA meta tags -->
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="Found Hair" />
    <meta name="application-name" content="Found Hair" />
    <meta name="theme-color" content="#1C1C1C" />
    <meta name="description" content="台北專業美髮沙龍・信義店・東區店" />
    <!-- PWA Manifest -->
    <link rel="manifest" href="./manifest.json" />
    <!-- Apple Touch Icon -->
    <link rel="apple-touch-icon" href="./assets/images/icon.png" />
    <!-- Mobile-first global CSS -->
    <style id="mobile-override">
      *, *::before, *::after { box-sizing: border-box; }

      html {
        height: 100%;
        background-color: #111111;
      }

      body {
        height: 100%;
        margin: 0 auto !important;
        padding: 0;
        max-width: 430px !important;
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

      /* 桌面：手機外框陰影 */
      @media screen and (min-width: 431px) {
        body { box-shadow: 0 0 80px rgba(0, 0, 0, 0.7); }
      }

      /* 蓋掉任何 desktop breakpoint */
      @media (min-width: 768px) {
        body { max-width: 430px !important; margin: 0 auto !important; }
        #root { max-width: 430px !important; }
      }
      @media (min-width: 1024px) {
        body { max-width: 430px !important; margin: 0 auto !important; }
        #root { max-width: 430px !important; }
      }
    </style>`;

html = html.replace("</head>", headInsert + "\n  </head>");

// ─── 4. 寫回 dist/index.html ───
fs.writeFileSync(indexPath, html, "utf-8");
console.log("✅ dist/index.html patched (mobile PWA)");

// ─── 5. 複製 manifest.json 到 dist/ ───
const manifestSrc = path.join(__dirname, "../web/manifest.json");
const manifestDst = path.join(distDir, "manifest.json");
if (fs.existsSync(manifestSrc)) {
  fs.copyFileSync(manifestSrc, manifestDst);
  console.log("✅ manifest.json copied to dist/");
} else {
  console.warn("⚠️  web/manifest.json not found, skipping");
}

// ─── 6. 建立 .nojekyll（GitHub Pages 需要，否則 _expo/ 會被 Jekyll 忽略）───
fs.writeFileSync(path.join(distDir, ".nojekyll"), "", "utf-8");
console.log("✅ .nojekyll created (prevents Jekyll from hiding _expo/)");

// ─── 7. 列出 dist/ 結構 ───
const files = fs.readdirSync(distDir);
console.log("\ndist/ 內容:", files);
