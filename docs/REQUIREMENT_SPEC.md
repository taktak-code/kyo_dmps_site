# きょうプレ！ メタゲーム・マトリクス (Kyo-Pre! Meta-Matrix) 仕様書

## 1. 概要 (Overview)
本ドキュメントは、デュエプレ（Duel Masters Play）YouTubeグループ「きょうプレ！」の活動データを可視化するWebアプリケーション「Meta-Matrix」の仕様書です。
`site_mock.html` のデザインと機能をベースにしており、AIエージェントによる開発の指示書として機能します。

## 2. デザインシステム (Design System)

### 2.1 テーマ (Theme)
- **コンセプト**: 近未来的・戦術的ダッシュボード (Tactical Dashboard)
- **配色はダークモード**を基調とし、情報の視認性と高級感を両立させる。
- **フォント**: 'Inter', sans-serif (Google Fonts)
- **UIライブラリ**: Tailwind CSS (推奨)

### 2.2 カラーパレット (Color Palette)
| 役割 | カラー | Tailwind Class | 用途 |
|---|---|---|---|
| 背景 (Main) | Slate 950 | `bg-slate-950` | ページ全体の背景 |
| 背景 (Sub) | Slate 900 | `bg-slate-900` | カード、ヘッダー、パネル背景 |
| ボーダー | Slate 800 | `border-slate-800` | 区切り線 |
| テキスト (Main) | Slate 100 | `text-slate-100` | 見出し、主要テキスト |
| テキスト (Sub) | Slate 400-600 | `text-slate-400` etc | 補足情報、ラベル |
| アクセント | Yellow 500 | `text-yellow-500` | ブランドロゴ、強調、アイコン |
| 勝率 (高) | Green 500/600 | `bg-green-500` | 勝率が高い箇所の表示 |
| 勝率 (低) | Red 500/600 | `bg-red-500` | 勝率が低い箇所の表示 |

## 3. データ構造 (Data Structure)

アプリケーションは主に以下の2つのデータセットを使用します。

### 3.1 デッキデータ (`DECK_DATA`)
各デッキのメタ情報を管理する配列。
```json
{
  "id": "一意のID (例: 'apollo')",
  "name": "デッキ名 (例: '赤白アポロ')",
  "share": "使用率・シェア (数値)",
  "color": "デッキ固有色 (HEX)",
  "img": "背景画像のURL"
}
```

### 3.2 勝率データ (`WIN_RATES`)
デッキ間の勝率を定義するマトリクス。
- キーは `playerId` (プレイヤー側/横列)
- 値は `{ opponentId: winRate }` のオブジェクト
```json
{
  "apollo": { 
     "outrage": 30,
     "endurance": 45 
     // ...
  }
}
```

## 4. 画面・機能要件 (Feature Requirements)

### 4.1 共通レイアウト
- **ヘッダー**:
  - ブランド名: "Kyo-Pre! AI Manager" (Yellowタグ)
  - タイトル: "META-MATRIX ND"
  - ステータス表示: "Live Data Feed" (点滅アニメーション付き), "Last Sync" (日時)
- **フッター**:
  - コピーライト的表記: "Kyopure Strategic Interface // Visual Analytics"

### 4.2 マトリクスビュー (Matrix View / Home)
初期表示画面。

1.  **サマリーカード (Key Stats)**:
    - グリッド上部に配置。
    - **Dominant Deck**: シェア率などの観点で支配的なデッキ。
    - **Aggro King**: 攻撃的なデッキの筆頭。
    - **Peak Win Rate**: 最も勝率の高いデッキと数値。
    - **Win Grade (凡例)**: 勝率の色分けの意味を示す (緑=有利, 赤=不利)。
2.  **勝率マトリクス表**:
    - **行 (縦)**: Player (自身が使用するデッキ)。
    - **列 (横)**: Opponent (相手となるデッキ)。
    - **ヘッダーセル**: デッキ画像、固有色アイコン、デッキ名、シェア率を表示。画像には暗転オーバーレイをかけ、文字を見やすくする。
    - **データセル**:
        - 勝率に応じた背景色 (条件付レンダリング)。
            - 65%+: 濃い緑
            - 55-64%: 緑
            - 45-54%: 黄色 (五分)
            - 35-44%: 赤
            - 34%-: 濃い赤
        - ホバー時に拡大エフェクト。
        - クリックで「詳細ビュー」へ遷移。

### 4.3 詳細ビュー (Detail View)
マトリクスのセルをクリックした際に表示される、特定のマッチアップ詳細。

1.  **ナビゲーション**:
    - "Back to Matrix" ボタンでマトリクスビューに戻る。
2.  **マッチアップバナー**:
    - 左側にPlayer画像、右側にOpponent画像。
    - 中央に大きく予想勝率 (%) を表示。勝率に応じて色変化。
3.  **戦術分析 (Tactical Insight)**:
    - 調整チームによる分析ログを表示。
    - **運用**: 各マッチアップごとの分析内容は、個別のMarkdownファイル (`.md`) として管理・入稿する形式とする。
    - `react-markdown` 等を使用してパースし、リスト表示などのリッチテキストとして描画する。
    - 黄色い見出し番号 ("01." 等) と、タイトル・本文の構成。
4.  **注目カード (Focus Card)**:
    - サイドバーなどに配置。
    - キーカードの名前、画像(または背景)、解説文を表示。

## 5. 技術・実装要件 (Technical Specs)

- **デプロイ**: GitHub Pagesでの運用を想定し、静的サイトとしてのビルド・動作を保証すること。
- **フレームワーク**: React (推奨)
- **レスポンシブ対応**: スマートフォン(縦積み)とPC(グリッド)の両方で崩れないこと。
- **アニメーション**:
    - 画面遷移時にフェードイン/スライドインなどのマイクロインタラクションを入れる (`animate-in` クラスなど)。
- **状態管理**:
    - 現在のビュー(Matrix/Detail)の切り替え。
    - 選択されたマッチアップデータの保持。
    - React State/Contextなどを利用して管理する。
- **コンテンツ管理**:
    - Tactical InsightなどのテキストコンテンツはMarkdownファイルとしてリポジトリ内で管理し、ビルド時またはランタイムに読み込む構成とする。

## 6. HTML/CSS構造サンプル
(開発時のクラス名参考)

```html
<!-- Grid Cell Style -->
<div class="deck-cell-bg relative overflow-hidden bg-cover bg-center">
  <div class="deck-cell-overlay absolute inset-0 bg-slate-900/90"></div>
  <div class="relative z-10 text-white">CONTENT</div>
</div>

<!-- Win Rate Cell Condition -->
<div style="background-color: rgba(22, 163, 74, 0.8)">...</div>
```
