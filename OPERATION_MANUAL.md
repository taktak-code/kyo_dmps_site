# Kyo-Pre! Site 運用マニュアル

このドキュメントでは、エンジニア以外のメンバーがサイトのコンテンツを更新・管理する方法について解説します。

---

## 1. システムの仕組み（概要）

このサイト（Kyo-Pre! Site）は、サーバー上のデータベースを持たず、**ファイル（JSONや画像、テキスト）を読み込んで表示する**仕組みになっています。
つまり、以下の特定のファイルを書き換えてGitHubにアップロード（Push）するだけで、サイトの内容が更新されます。

**基本ルール:**
- データファイルは全て `public/data/` フォルダの中にあります。
- シーズン（カードパック）ごとのデータは `public/data/archives/[season]/` 以下に格納されます。
- 更新が反映されるまで、アップロード後 1〜5分程度かかります。

---

## 2. Bot コマンド一覧

以下のDiscord Botコマンドを使用して、サイトのコンテンツを更新できます。

| コマンド | 説明 | 備考 |
|---|---|---|
| `/add_deck` | 新しいデッキを相性表に追加 | 画像添付必須 |
| `/matchup` | 相性表ダッシュボードを表示 | 相性入力・デッキ削除はここから |
| `/update_tier` | Tier List画像を更新 | jpg/png添付必須 |
| `/submit_guide` | 攻略ガイド記事を投稿 | Markdownファイル(.md)添付必須 |
| `/illustration` | カード画像からイラストを抽出・高画質化 | 画像添付必須 |
| `/summary` | 直近のチャットを要約 | AI自動要約 |
| `!update_rss` | RSS情報を手動更新 | Note/YouTube最新情報を取得 |

---

## 3. 各エリアの更新手順

### A. Tier List（左上の大きい画像）

クリックすると拡大表示され、全体を確認できます。

**【推奨】Botを使用する方法**

Discordで `/update_tier` コマンドを実行し、画像を添付してください。
- 対応形式: `jpg`, `jpeg`, `png`
- 自動的にタイムスタンプ付きのファイル名に変換されます。
- 保存先: `public/data/archives/[season]/tier_list/`

**【緊急時】手動で更新する方法**
1. 新しいTier表の画像を用意します。
2. `public/data/archives/[season]/tier_list/` フォルダに画像をアップロードします。
3. `public/data/matrix.json` の `tierListImage` を新しいパスに更新します。
4. GitHubへ変更をアップロードします。

---

### B. YouTube / Note（右上・右下のカード）

これらは**Botが自動で更新**（1時間ごと）するため、基本的には手動での作業は不要です。
手動で更新したい場合は `!update_rss` コマンドを実行してください。

**【緊急時】手動で編集する方法**

以下のファイルを直接編集します：
- **YouTube**: `public/data/youtube_latest.json`
- **Note**: `public/data/note_latest.json`

```json
{
  "items": [
    {
      "title": "記事や動画のタイトル",
      "link": "https://...",
      "pubDate": "2025-01-01",
      "thumbnail": "画像のURL"
    }
  ]
}
```

---

### C. Tech / Guide（中央下の記事カード）

クリックすると記事の全文が表示されます。

**【推奨】Botを使用する方法**

Discordで `/submit_guide` コマンドを実行し、Markdownファイル（`.md`）を添付してください。
- `attacker`: 攻める側のデッキ名（オートコンプリート対応）
- `defender`: 守る側のデッキ名（オートコンプリート対応）
- 保存先: `public/data/archives/[season]/guides/`

ファイル名は自動的に `[日付]_[attacker]_vs_[defender].md` に変換されます。

**【緊急時】手動で更新する方法**

**ステップ 1: 記事ファイルの作成**
1. 記事の本文をMarkdown形式（`.md`ファイル）で作成します。
2. 作成したファイルを `public/data/archives/[season]/guides/` フォルダに保存します。

**ステップ 2: 目録（JSON）の更新**
1. `public/data/archives/[season]/guides.json` を開きます。
2. `items` リストの**一番上**に、新しい記事の情報を追記します。

```json
{
    "items": [
        {
            "title": "VS [対面デッキ] 徹底攻略",
            "date": "2025-01-01",
            "category": "GUIDE",
            "path": "/data/archives/season_1/guides/ファイル名.md",
            "summary": "カードに表示される短い要約文",
            "attacker": "攻めるデッキ名",
            "defender": "守るデッキ名"
        }
    ]
}
```

3. ルートの `public/data/guides_latest.json` にも同じ内容をコピーします（最新シーズンのミラー）。

---

### D. Meta Matrix（メインの相性表）

メインコンテンツの相性表です。各セルをクリックすると詳細ビューが表示されます。

**【推奨】Botを使用する方法**

| 操作 | コマンド |
|---|---|
| デッキ追加 | `/add_deck name:デッキ名 image:(画像添付)` |
| 相性入力 | `/matchup` → ダッシュボードから入力 |
| デッキ削除 | `/matchup` → ダッシュボードから「デッキ削除」 |

**【緊急時】手動で修正する方法**

`public/data/matrix_latest.json` を直接編集します。

1. **decks（デッキ情報）**:
   ```json
   {
     "id": "デッキID",
     "name": "デッキ名",
     "img": "/data/archives/season_1/decks/画像ファイル.jpg"
   }
   ```

2. **winRates（勝率情報）**:
   ```json
   "デッキAの名前": {
       "デッキBの名前": 60
   }
   ```
   ※ 逆の相性（デッキB→デッキA）は自動計算されないため、両方更新が必要です。

3. **tierListImage（Tier表画像パス）**:
   ```json
   "tierListImage": "/data/archives/season_1/tier_list/tier_list_20260101.jpg"
   ```

---

## 4. ディレクトリ構造

```
public/data/
├── archives/
│   └── season_1/                    # シーズン1のデータ
│       ├── decks/                   # デッキ画像
│       ├── guides/                  # 攻略記事（.md）
│       ├── tier_list/               # Tier表画像
│       ├── matrix.json              # 相性表データ
│       └── guides.json              # ガイド目録
├── matrix_latest.json               # 最新シーズンのミラー
├── guides_latest.json               # 最新シーズンのミラー
├── note_latest.json                 # Note最新記事
└── youtube_latest.json              # YouTube最新動画
```

---

## 5. よくあるミスと対策

### サイトが真っ白になった / 更新されない
- **原因**: JSONファイルの「カンマ（,）」忘れや「閉じ括弧（} ]）」の不足
- **対策**: [JSONLint](https://jsonlint.com/) でエラーチェック

### 画像が表示されない
- **原因**: ファイルパスが間違っている、または画像ファイル未アップロード
- **対策**: パスの大文字・小文字が一致しているか確認

### Botコマンドが動かない
- **原因**: Botがオフライン、または権限不足
- **対策**: Botのステータスを確認、管理者に連絡

### Guideをクリックしても記事が表示されない
- **原因**: `guides.json` の `path` と実際のファイルパスが一致していない
- **対策**: パスが `/data/archives/[season]/guides/ファイル名.md` 形式になっているか確認
