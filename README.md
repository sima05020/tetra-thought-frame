# 思考昇華システム - Thought Sublimator

プロダクト開発やQA作業において、曖昧な「なんとなくの理想」や「言葉にできない違和感」を、具体的な要件へと「昇華（進化）」させるための思考整理ツールです。

## 特徴

### 4つの思考カテゴリ
1. **絶対にこうあるべき** (Goals/Requirements) - 明確なゴール、仕様、要件
2. **こうだったら嬉しい** (Nice-to-Have) - ゆるやかな方針や理想
3. **なんか違う、違和感がある** (Intuitive Discomfort) - 正体不明の違和感
4. **絶対アカン** (Critical Avoidance) - 徹底して避けるべき状態

### 項目ライフサイクル管理
- **Active (進行中)** - 現在取り組むべき事項
- **Resolved (解決済み)** - 完了した事項
- **Sublimated (昇華済み)** - 新しい具体的タスク生まれた状態

### 昇華機能
曖昧な項目から複数の具体的な項目を生み出すことができ、親子関係（系譜）を追跡できます。

## 技術スタック

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build**: Vite
- **Storage**: ブラウザの localStorage（データは自動保存）
- **Deployment**: GitHub Pages

## セットアップ

### 1. 依存関係のインストール
```bash
npm install
```

### 2. 開発サーバーの起動
```bash
npm run dev
```
ブラウザで http://localhost:3000 を開きます。

### 3. ビルド
```bash
npm run build
```
`dist` フォルダにアプリが生成されます。

### 4. プレビュー
```bash
npm run preview
```

## 使い方

### プロジェクトの作成
1. ヘッダーの「新規プロジェクト」ボタンをクリック
2. プロジェクト名と説明を入力
3. 「作成」ボタンをクリック

### 項目の追加
- 各カラムの入力フィールドにタイトルを入力し、Enterキーを押すか + ボタンをクリック
- 項目は自動的にに割り当てたカテゴリのカラムに追加されます

### 項目の詳細編集
1. 項目カード をクリックしてモーダルを開きます
2. 「編集」ボタンをクリックして以下を編集可能:
   - タイトル
   - メモ（Markdown対応）
   - ステータス
3. 「保存」ボタンで確定

### 項目の昇華
1. 項目詳細モーダルを開きます
2. 下部の「昇華」セクションで:
   - 昇華先のカテゴリを選択
   - 新しい項目のタイトルを入力
   - 「昇華する」ボタンをクリック
3. 元の項目のステータスが「昇華済み」に変更され、新しい項目が作成されます

### 解決済み項目の表示切理
- ヘッダーの「解決済み表示」ボタンでトグル
- ONの場合、解決済みと昇華済みの項目が各カラムにグレーアウトされて表示されます

## データ保存
すべてのデータはブラウザの localStorage に自動保存されます。
ブラウザのキャッシュやクッキーをクリアしないかぎり、データは保持されます。

## デプロイ

GitHub Pages に自動デプロイされます：
1. `main` または `master` ブランチにプッシュ
2. GitHub Actions が自動でビルド・デプロイ
3. `https://<username>.github.io/tetra-thought-frame/` で利用可能

## ファイル構成

```
.
├── src/
│   ├── components/          # Reactコンポーネント
│   │   ├── Board.tsx       # メインボード（4カラム表示）
│   │   ├── ItemCard.tsx    # 項目カード
│   │   ├── ItemModal.tsx   # 項目詳細モーダル
│   │   └── ProjectSelector.tsx # プロジェクト選択
│   ├── contexts/           # React Context
│   │   └── ThoughtContext.tsx # アプリケーション全体の状態管理
│   ├── hooks/              # カスタムフック
│   │   └── useLocalStorage.ts
│   ├── types/              # TypeScript型定義
│   │   └── index.ts
│   ├── App.tsx             # メインアプリケーション
│   ├── main.tsx            # エントリーポイント
│   └── index.css           # グローバルスタイル
├── .github/workflows/      # GitHub Actions設定
│   └── deploy.yml         # GitHub Pages自動デプロイ
├── index.html             # HTMLエントリー
├── vite.config.ts         # Vite設定
├── tailwind.config.js     # Tailwind CSS設定
├── postcss.config.js      # PostCSS設定
├── tsconfig.json          # TypeScript設定
└── package.json           # 依存関係定義
```

## 今後の拡張可能性

- データベース連携（将来的なサーバーサイド化）
- チーム機能（複数人でのプロジェクト管理）
- 詳細な履歴追跡
- エクスポート機能（CSV/JSON）
- カスタムテーマ
- 検索・フィルター機能

## ライセンス

MIT

## 開発

このプロジェクトは[仕様.md](./仕様.md)に基づいて実装されました。
