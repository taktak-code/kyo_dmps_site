# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

---

# 運用マニュアル (Operation Manual)

## 1. ローカルでの動作確認 (Development)

Botとの連携部分（相性データなど）を確認するため、以下の手順で開発サーバーを起動します。

```bash
npm install
npm run dev
```

### データの扱いについて
- 本番環境では、Botが `public/data/matrix.json` などを自動生成・更新します。
- ローカル環境では、`public/data/` 以下のJSONファイルが読み込まれます。
    - データがない場合はエラーになるか、Loading状態が続きます。
    - **テスト用データを作成したい場合**:
        - `public/data/matrix.json` を手動で編集するか、ローカルで稼働しているBotから `/add_deck` 等を実行して生成させてください（Botとローカルリポジトリが同じディレクトリを参照している場合）。

## 2. GitHub Pagesへのデプロイ前の結合試験 (Integration Test)

本番反映前に、Botの自動更新機能とWebサイトの表示が正しく連携するかを確認する手順です。

### 手順
1. **Botの準備**: ローカルでBotを起動します。
    - Botの設定で、`kyo_dmps_site` のパスが正しく設定されていることを確認してください。
2. **データの投入**:
    - Discordから `/add_deck` コマンドを実行し、新しいデッキと画像を登録します。
    - `/matchup` ダッシュボードで相性値を変更します。
3. **自動Pushの確認**:
    - Botのログを確認し、`Git Sync Complete` と表示されていることを確認します。
    - `kyo_dmps_site` リポジトリで `git log` を確認し、Botによるコミット（例: `Update Score: ...`）が作成されていることを確認します。
4. **Web表示の確認**:
    - `npm run dev` でローカルサーバーを起動（またはリロード）します。
    - Webサイト上で、手順2で追加したデッキや変更した相性が反映されているかを確認します。

### 注意点
- **GitHub Pagesへの反映**: ローカルから `git push`（またはBotによる自動Push）が行われると、GitHub Actionsがトリガーされ、数分後に本番サイト（GitHub Pages）が更新されます。
