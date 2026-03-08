# Found Hair - 台灣美髮沙龍行動應用程式

## 概述
Found Hair 是一個以台灣台北為主的專業美髮沙龍行動應用程式，使用 Expo + React Native 建構，提供完整的繁體中文介面和預約功能。

## 技術架構
- **前端**: Expo (React Native) with Expo Router file-based routing
- **後端**: Express.js (TypeScript)
- **狀態管理**: React Query + AsyncStorage
- **導航**: expo-router with NativeTabs (iOS 26+ liquid glass) / Classic Tabs fallback
- **字體**: Inter (Google Fonts)
- **圖片**: expo-image with local assets + Unsplash URLs

## 主題色彩
- Background: `#F8F6F2` (暖白)
- Primary: `#1C1C1C` (近黑)
- Accent/Gold: `#C9A96E` (香檳金)
- Text Secondary: `#6B6B6B`
- Border: `#E8E0D0`

## 應用程式頁面結構
```
app/
  _layout.tsx              # 根佈局（字體載入、providers）
  (tabs)/
    _layout.tsx            # 分頁導航（NativeTabs + Classic Tabs）
    index.tsx              # 首頁：品牌輪播、服務介紹、設計師、評價
    gallery.tsx            # 作品集：髮型照片網格、分類篩選
    booking.tsx            # 預約：5步驟預約流程（分店→設計師→服務→時間→確認）
    news.tsx               # 最新消息：公告和美髮知識文章
    more.tsx               # 更多：門市資訊、地圖、設計師團隊
```

## 門市資訊
- **Found Hair 信義店**: 台北市信義區信義路五段7號 2樓 | 02-2723-8899
- **Found Hair 東區店**: 台北市大安區忠孝東路四段181號 3樓 | 02-2771-5588

## 設計師團隊
- Emily Chen（首席設計師，信義店）
- Alex Wang（資深設計師，信義店）
- Sophia Lin（設計師，信義店）
- Kevin Liu（設計師，東區店）
- Amy Chou（資深設計師，東區店）
- Brian Hsu（設計師，東區店）

## 預約功能
- 5步驟完整流程：選分店 → 選設計師 → 選服務 → 選日期時間 → 填聯絡資訊
- 服務項目：剪髮、染髮、燙髮、護髮療程、套餐、造型諮詢
- 預約資料儲存至 AsyncStorage

## 圖片資源
- `assets/images/hero1-3.jpg` - 首頁輪播沙龍圖片（stock images）
- `assets/images/styling1-3.jpg` - 髮型設計圖片（stock images）
- `assets/images/icon.png` - AI 生成應用程式圖示
- `assets/images/splash-icon.png` - AI 生成啟動畫面圖示

## 開發伺服器
- **前端 (Expo)**: Port 8081 (`npm run expo:dev`)
- **後端 (Express)**: Port 5000 (`npm run server:dev`)

## 注意事項
- 避免使用 FlatList 的 scrollEnabled={false} + scrollToIndex（web 端會引起 Invalid hook call）
- 避免使用 react-native-webview（與 React 版本衝突）
- 地圖改以 Pressable + Linking.openURL 開啟原生地圖
- Web 平台額外的 insets：top: 67px, bottom: 34px
