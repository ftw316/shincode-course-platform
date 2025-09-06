# CLAUDE.md

このファイルは、このリポジトリでコードを扱う際のClaude Code (claude.ai/code) へのガイダンスを提供します。

## 開発コマンド

- `npm run dev` - Turbopackバンドリングで開発サーバーを起動
- `npm run build` - Turbopackでプロダクションアプリケーションをビルド
- `npm start` - プロダクションサーバーを起動
- `npm run lint` - コード品質チェック用のESLintを実行

## プロジェクトアーキテクチャ

これはTypeScriptとTailwind CSS v4を使用した、App Routerアーキテクチャを採用したNext.js 15のコースプラットフォームプロジェクトです。

### 技術スタック
- **フレームワーク**: Next.js 15.5.2 with App Router
- **ランタイム**: React 19.1.0
- **スタイリング**: Tailwind CSS v4 with PostCSS統合
- **ビルドツール**: Turbopack（Next.jsの新しいバンドラー）
- **TypeScript**: 厳密モードとパスエイリアスで設定
- **フォント**: Google FontsのGeist SansとGeist Mono
- **リンティング**: Next.js TypeScript設定のESLint

### ディレクトリ構造
- `src/app/` - App Routerのページとレイアウト
  - `layout.tsx` - フォント設定とグローバルスタイルを含むルートレイアウト
  - `page.tsx` - ホームページコンポーネント
  - `globals.css` - TailwindインポートとCSSカスタムプロパティを含むグローバルスタイル
- `public/` - 静的アセット
- TypeScriptパスエイリアス `@/*` は `./src/*` にマップされます

### 主要設定ファイル
- `next.config.ts` - Next.js設定
- `tsconfig.json` - 厳密モードとパスエイリアスを含むTypeScript設定
- `eslint.config.mjs` - Next.jsプリセットを含むESLintフラット設定
- `postcss.config.mjs` - Tailwind CSS v4用のPostCSS設定
- `src/app/globals.css` - テーマ変数用のCSSカスタムプロパティを含むグローバルスタイル

### スタイリングシステム
- `@import "tailwindcss"` 構文でTailwind CSS v4を使用
- ライト/ダークテーマサポート用のCSSカスタムプロパティ
- `--font-geist-sans`と`--font-geist-mono`でフォント変数を設定
- `prefers-color-scheme`による自動ダークモードサポート

### 開発ノート
- プロジェクトは高速ビルドとホットリロード用にTurbopackを使用
- GeistフォントはNext.jsフォント最適化を使用して最適化
- レイアウトには見やすいフォントレンダリング用のアンチエイリアシングが含まれます
- TypeScriptは厳密モードと最新のES2017ターゲットで設定

## プロジェクト概要

このプロジェクトは**YouTube動画を活用したUdemyライクな講座プラットフォーム**のMVP開発です。

### サービス概要
- AIでプログラム開発を学びたいエンジニア・非エンジニア向けの講座プラットフォーム
- YouTube埋め込み動画による講座配信
- 3階層構造：講座 → セクション → 動画
- 進捗管理機能付き
- 最初の動画のみ未認証でも視聴可能、それ以外は認証必須

### 追加技術スタック
- **データベース・認証**: Supabase (PostgreSQL + Auth)
- **認証方法**: Google OAuth のみ
- **デプロイ**: Vercel
- **動画**: YouTube埋め込み

### データベース構造
```sql
-- 講座テーブル
courses (id, title, description, thumbnail_url, is_published, created_at, updated_at)

-- セクションテーブル  
sections (id, course_id, title, description, order_index, created_at, updated_at)

-- 動画テーブル
videos (id, section_id, title, description, youtube_url, youtube_video_id, order_index, is_preview, created_at, updated_at)

-- ユーザー進捗テーブル
user_progress (id, user_id, video_id, is_completed, completed_at, created_at, updated_at)

-- ユーザープロフィール拡張テーブル
user_profiles (id, user_id, display_name, avatar_url, created_at, updated_at)
```

### 主要機能
1. **フロントエンド（ユーザー向け）**
   - ホームページ（講座一覧）
   - 講座詳細ページ（セクション・動画一覧）
   - 動画視聴ページ（YouTube埋め込み、進捗管理）
   - 認証（Supabase Auth + Google OAuth）
   - プロフィール・ダッシュボード

2. **管理画面**
   - 講座・セクション・動画の CRUD 操作
   - YouTube URL 管理
   - 公開/非公開設定

### 開発優先順位
1. データベース設計・構築（Supabase）
2. 認証システム（Supabase Auth）
3. 講座・動画一覧表示
4. 動画視聴機能（YouTube埋め込み）
5. 進捗管理機能
6. 管理画面
7. UI/UX改善

## Next.js App Router ベストプラクティス

### ディレクトリ構造とルーティング
- `src/app/` 内でファイルベースルーティングを使用
- `page.tsx` - ページコンポーネント
- `layout.tsx` - 共有レイアウト
- `loading.tsx` - ローディングUI
- `error.tsx` - エラーハンドリング
- `not-found.tsx` - 404ページ
- ルートグループ `(auth)`, `(dashboard)` で論理的にグループ化
- プライベートフォルダ `_components`, `_lib` でUI以外のファイルを整理

### サーバーコンポーネントとクライアントコンポーネント
- デフォルトでServer Componentsを使用（データフェッチ、SEO最適化）
- `"use client"` は最小限に抑制（フォーム、イベントハンドラー、ブラウザAPI使用時のみ）
- Server Componentsでは `async/await` を直接使用してデータフェッチ
- Client Componentsは可能な限り葉っぱのコンポーネントに配置

### データフェッチとキャッシュ戦略
- Server Componentsで `fetch()` を使用（自動キャッシュ）
- `revalidate` オプションでISRを実装
- 動的データには `{ cache: 'no-store' }` または `revalidate: 0` を使用
- データ変更後は `revalidatePath()` や `revalidateTag()` でキャッシュを無効化

### メタデータとSEO
- 各ページで `generateMetadata()` を実装
- 動的メタデータには `generateMetadata()` 関数を使用
- 静的メタデータには `metadata` オブジェクトをエクスポート

### パフォーマンス最適化
- `next/image` コンポーネントを使用（自動最適化）
- `next/font` で Web フォントを最適化
- 動的インポートと `Suspense` でコード分割
- `loading.tsx` でローディング状態を管理

### 型安全性
- TypeScriptの厳密モードを使用
- ページのパラメータとクエリに型定義を追加
- Server ActionsとClient Actionsに適切な型を定義

### 認証とセキュリティ
-認証状態は Server Components で確認
- プライベートルートは `middleware.ts` で保護
- Server Actions には CSRF 保護を実装
- 環境変数は適切にプレフィックスを使用（`NEXT_PUBLIC_` など）

## Supabase認証ベストプラクティス

### Supabaseクライアント設定
- **2つのクライアントタイプを作成**:
  - Client Component用（ブラウザ側）
  - Server Component用（サーバー側）
- 各ルートで新しいSupabaseクライアントを作成
- サーバー側では各リクエストで再設定、クライアント側ではシングルトンパターンを使用

### 環境変数設定
`.env.local` に以下を設定:
```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_anon_key
```

### セキュリティ重要事項
- **絶対に `supabase.auth.getSession()` をサーバーコードで信頼しない**
- **常に `supabase.auth.getUser()` を使用してページとユーザーデータを保護**
- サーバーがクッキーからユーザーセッションを取得する際、誰でも偽装可能なため注意
- ページ保護時は細心の注意を払う

### Middleware実装要件
`middleware.ts` で以下を実装:
- 認証トークンのリフレッシュ
- リフレッシュされたトークンをServer Componentsに渡す
- リフレッシュされたトークンをブラウザに渡す

### 認証フロー実装
- ログイン/サインアップにはServer Actionsを実装
- メール確認テンプレートを設定
- 認証プロセスにはRoute Handlersを使用

### クッキー管理
- フレームワーク非依存のクッキー管理には `@supabase/ssr` を使用
- サーバーサイドクッキー操作にエラーハンドラを実装