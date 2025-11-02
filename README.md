# 專案名稱: SMIL Frontend

此專案為乾淨的 vite + react專案 (node 22.17.0) 
盡量使用jsx 不使用typescript

建立人: 蔡政翰

## 環境設定

### Google 登入設定

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 建立專案或選擇現有專案
3. 啟用 Google Identity Services API
4. 建立 OAuth 2.0 Client ID
5. 設定授權的重新導向 URI（開發時：`http://localhost:5173`）
6. 在專案根目錄建立 `.env` 檔案，加入以下內容：

```
VITE_GOOGLE_CLIENT_ID=你的_Google_Client_ID
```

### 安裝依賴

```bash
npm install
```

### 開發

```bash
npm run dev
```

### 建置

```bash
npm run build
```

## 功能特色

included:
- eslint
- keywords tools
- alias
- prettier
- react-boostrap / boostrap
- custom utils (by chenghan)
- custom hooks (by chenghan)
- custom searchBar
- react-toastify
- react-useform
- react-icon
- react-feather
- API base code
- loading animation
- **Google 登入整合**
- i18n 多語系支援（中文/英文）