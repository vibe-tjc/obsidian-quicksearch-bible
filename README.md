# Bible QuickSearch

一個 Obsidian 外掛，讓你可以透過關鍵字快速搜尋聖經經文，並輕鬆插入到筆記中。

## 功能特色

- **快速搜尋**：輸入觸發前綴（預設 `--`）加上關鍵字，即時顯示符合的經文
- **中文輸入支援**：完整支援中文輸入法（IME），可連續輸入多個中文字進行搜尋
- **智慧文字處理**：自動處理資料庫中字元間的空格，輸出整潔的經文內容
- **多版本支援**：支援多個聖經 SQLite 資料庫，可自由切換版本
- **雙語介面**：支援英文與繁體中文書卷名稱顯示
- **自訂格式**：可自訂插入經文的格式範本
- **跨平台相容**：支援桌面版與行動版 Obsidian

## 安裝方式

### 手動安裝

1. 下載最新版本的 `main.js`、`manifest.json`、`styles.css`
2. 在你的 Vault 中建立資料夾：`.obsidian/plugins/bible-quicksearch/`
3. 將下載的檔案複製到該資料夾
4. 在資料夾中建立 `db/` 子目錄
5. 將你的聖經 SQLite 資料庫（`.db` 檔案）放入 `db/` 目錄
6. 重新啟動 Obsidian，在設定中啟用外掛

## 資料庫格式

本外掛使用 SQLite 資料庫儲存聖經經文。資料庫需包含 `verses` 資料表，結構如下：

| 欄位 | 類型 | 說明 |
|------|------|------|
| id | INTEGER | 唯一識別碼（主鍵） |
| book | INTEGER | 書卷編號（1-66） |
| chapter | INTEGER | 章節編號 |
| verse | INTEGER | 節編號 |
| text | TEXT | 經文內容 |

書卷編號對照：
- 1：創世記 (Genesis)
- 19：詩篇 (Psalms)
- 40：馬太福音 (Matthew)
- 66：啟示錄 (Revelation)

**注意**：本外掛支援字元間有空格的中文資料庫格式（如 `起 初 ， 神 創 造 天 地`），會自動移除多餘空格後輸出整潔的經文（如 `起初，神創造天地`）。

## 使用方式

### 搜尋經文

1. 在編輯器中輸入觸發前綴加上關鍵字，例如：`--愛`
2. 彈出式選單會顯示符合的經文列表
3. 使用方向鍵選擇經文，按 Enter 插入

### 設定選項

在 **設定 → Bible QuickSearch** 中可調整：

| 設定項目 | 說明 | 預設值 |
|----------|------|--------|
| Bible version | 選擇要搜尋的聖經版本 | - |
| Trigger prefix | 觸發搜尋的前綴字元 | `--` |
| Maximum results | 顯示的最大搜尋結果數 | 5 |
| Display language | 書卷名稱的顯示語言 | English |
| Insert format | 插入經文的格式範本 | `{book} {chapter}:{verse} - {text}` |

### 格式範本變數

在「Insert format」中可使用以下變數：

- `{book}` - 書卷名稱
- `{chapter}` - 章
- `{verse}` - 節
- `{text}` - 經文內容

範例格式：
- `{book} {chapter}:{verse} - {text}` → 「創世記 1:1 - 起初，神創造天地。」
- `> {text}\n> — {book} {chapter}:{verse}` → 引用區塊格式
- `**{book} {chapter}:{verse}** {text}` → 粗體參照格式

## 開發

### 環境需求

- Node.js 16+
- npm

### 開發指令

```bash
# 安裝相依套件
npm install

# 開發模式（監聽檔案變更）
npm run dev

# 建置正式版本
npm run build

# 程式碼檢查
npm run lint
```

## 授權條款

MIT License
