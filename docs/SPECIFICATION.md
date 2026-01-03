# kyo_dmps_site 技術仕様書

## 概要

kyo_dmps_site は、デュエル・マスターズ プレイス（DMP）の YouTubeグループ「きょうプレ！」のためのWebサイトです。マッチアップ表、ガイド記事、RSS更新情報などを表示します。

---

## 技術スタック

| 項目 | 技術 |
|------|------|
| フレームワーク | React 18 + TypeScript |
| ビルドツール | Vite |
| スタイリング | Tailwind CSS |
| デプロイ | GitHub Pages |
| パッケージ管理 | npm |

---

## ディレクトリ構造

```
kyo_dmps_site/
├── public/
│   ├── data/                    # JSONデータファイル（Botから更新）
│   │   ├── matrix_latest.json   # マッチアップ表
│   │   ├── guides_latest.json   # ガイド一覧
│   │   ├── note_latest.json     # note.com最新記事
│   │   ├── youtube_latest.json  # YouTube最新動画
│   │   ├── seasons.json         # シーズン設定
│   │   └── archives/            # シーズン別アーカイブ
│   │       └── {season_id}/
│   │           ├── matrix.json
│   │           ├── guides.json
│   │           ├── guides/      # ガイドMarkdownファイル
│   │           └── decks/       # デッキ画像
│   └── images/                  # 静的画像
├── src/
│   ├── components/              # Reactコンポーネント
│   │   ├── BentoGrid.tsx        # ホームページグリッド
│   │   ├── DetailView.tsx       # マッチアップ詳細
│   │   ├── Header.tsx           # ヘッダー
│   │   ├── MarkdownViewer.tsx   # Markdown表示
│   │   └── Matrix.tsx           # マッチアップ表
│   ├── types/                   # TypeScript型定義
│   ├── utils/                   # ユーティリティ
│   ├── App.tsx                  # メインアプリ
│   ├── index.css                # グローバルCSS
│   └── main.tsx                 # エントリーポイント
├── docs/                        # ドキュメント
│   ├── OPERATION_MANUAL.md      # 運用マニュアル
│   ├── REQUIREMENT_SPEC.md      # 要件仕様書
│   └── SPECIFICATION.md         # 技術仕様書（本ファイル）
└── README.md
```

---

## コンポーネント一覧

### App.tsx
**役割**: アプリケーションのルートコンポーネント

**状態管理**:
- `view`: 現在の画面 (`'matrix' | 'detail' | 'article'`)
- `selectedMatchup`: 選択されたマッチアップ
- `articleData`: 表示中の記事データ
- `seasons` / `currentSeasonId`: シーズン管理

**機能**:
- 画面遷移管理
- スクロール位置の保存・復元
- シーズンデータの取得

---

### BentoGrid.tsx
**役割**: ホームページのグリッドレイアウト（Bento Box スタイル）

**表示内容**:
- サマリーカード（Dominant Deck, Peak Win Rate など）
- マッチアップ表へのリンク
- RSS更新情報（note.com, YouTube）
- ガイド一覧

---

### Matrix.tsx
**役割**: マッチアップ表の表示

**機能**:
- デッキ間の勝率をヒートマップ形式で表示
- セルクリックで DetailView へ遷移
- 勝率に応じた色分け（緑=有利、赤=不利）

**データ取得**:
```typescript
fetch(`${BASE_URL}data/archives/${seasonId}/matrix.json`)
```

---

### DetailView.tsx
**役割**: マッチアップ詳細の表示

**表示内容**:
- 対戦デッキのバナー画像
- 予想勝率（大きく表示）
- Tactical Insight（戦術分析 - Markdownから読み込み）
- 注目カード

---

### MarkdownViewer.tsx
**役割**: Markdownコンテンツの表示

**機能**:
- `react-markdown` を使用したパース
- 記事メタデータ（タイトル、日付、カテゴリ）の表示
- サムネイル画像の表示

---

### Header.tsx
**役割**: サイトヘッダー

**表示内容**:
- ブランドロゴ「Kyo-Pre! AI Manager」
- タイトル「META-MATRIX」
- シーズン選択ドロップダウン
- 最終更新日時

---

## データフォーマット

### matrix.json
```json
{
  "decks": {
    "deck_id": {
      "name": "デッキ名",
      "img": "/path/to/image.jpg",
      "share": 15.5
    }
  },
  "scores": {
    "player_deck_id": {
      "opponent_deck_id": "55"
    }
  },
  "last_updated": "2026-01-03T12:00:00Z"
}
```

### guides.json
```json
{
  "guides": [
    {
      "player": "DeckA",
      "opponent": "DeckB",
      "path": "guides/DeckA_vs_DeckB.md",
      "created_at": "2026-01-01T00:00:00Z"
    }
  ]
}
```

### note_latest.json / youtube_latest.json
```json
{
  "title": "記事/動画タイトル",
  "link": "https://...",
  "thumbnail": "https://...",
  "last_updated": "2026-01-03T12:00:00Z"
}
```

### seasons.json
```json
{
  "current": "lop2026_nd",
  "all": [
    { "id": "lop2026_nd", "name": "LoP2026 ND環境" },
    { "id": "lop2025_ad", "name": "LoP2025 AD環境" }
  ]
}
```

---

## デプロイ

### GitHub Actions ワークフロー

`.github/workflows/deploy.yml`:
1. `master` または `data` ブランチへのプッシュでトリガー
2. `data` ブランチからデータファイルをマージ
3. `npm run build` でビルド
4. `dist/` を GitHub Pages にデプロイ

### ローカル開発

```bash
# 依存関係のインストール
npm install

# データファイルの取得（dataブランチから）
npm run fetch-data

# 開発サーバー起動
npm run dev
```

---

## Bot連携

kyo_dmps_bot から以下のデータが自動的に更新されます：

| データ | 更新トリガー | 更新元 |
|--------|-------------|--------|
| note_latest.json | 1時間ごと / 手動 | RssFetcher |
| youtube_latest.json | 1時間ごと / 手動 | RssFetcher |
| matrix_latest.json | スコア更新時 | Matchup Cog |
| guides/ | ガイド投稿時 | ContentManager |

---

## 環境変数

**本番環境** (GitHub Pages):
- `BASE_URL`: `/kyo_dmps_site/` (vite.config.ts で設定)

**ローカル開発**:
- `BASE_URL`: `/`
