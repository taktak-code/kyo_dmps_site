# KyoPre Matchup Matrix

デュエル・マスターズ・プレイス (DMP) の対戦相性データを可視化するWebアプリケーションです。

🔗 **公開URL**: https://taktak-code.github.io/kyo_dmps_site/

## 主な機能

- **相性マトリクス表示**: デッキ間の勝率をヒートマップ形式で表示
- **詳細ビュー**: 各マッチアップの詳細情報と戦術ガイドを閲覧
- **自動更新**: Discord Bot (`kyo_dmps_bot`) と連携し、データを自動で更新・公開

## 技術スタック

- React 19 + TypeScript
- Vite
- Tailwind CSS
- GitHub Pages (ホスティング)

## ローカル開発

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# 本番ビルド
npm run build
```

## データについて

- 本番環境では、`kyo_dmps_bot` が `public/data/` 配下のJSONファイルを自動生成・更新します
- ローカル開発時は、既存のJSONファイルが使用されます
- データが存在しない場合はLoading状態になります

## デプロイ

`main` ブランチへのPush時に、GitHub Actionsが自動でビルド＆デプロイを実行します。

## 関連リポジトリ

- [kyo_dmps_bot](https://github.com/taktak-code/kyo_dmps_bot) - データ管理用Discord Bot
