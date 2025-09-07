# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 開発コマンド

- `npm run dev` - 標準Webpack開発サーバーを起動（安定版）
- `npm run dev:turbo` - Turbopack開発サーバーを起動（実験版）
- `npm run build` - プロダクションアプリケーションをビルド
- `npm run build:turbo` - Turbopackでプロダクションビルド（実験版）
- `npm run build:analyze` - バンドル分析付きでビルド（パフォーマンス確認用）
- `npm start` - プロダクションサーバーを起動
- `npm run lint` - コード品質チェック用のESLintを実行

## プロジェクトアーキテクチャ

これはTypeScriptとTailwind CSS v4を使用した、App Routerアーキテクチャを採用したNext.js 15のコースプラットフォームプロジェクトです。

### 技術スタック
- **フレームワーク**: Next.js 15.5.2 with App Router
- **ランタイム**: React 19.1.0
- **スタイリング**: Tailwind CSS v4 with PostCSS統合
- **ビルドツール**: Webpack（メイン）+ Turbopack（実験版）
- **TypeScript**: 厳密モードとパスエイリアスで設定
- **フォント**: Google FontsのGeist SansとGeist Mono
- **リンティング**: Next.js TypeScript設定のESLint
- **データベース・認証**: Supabase (PostgreSQL + Auth)
- **パフォーマンス監視**: @next/bundle-analyzer

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
- **ビルドツール**: 標準Webpack使用（Turbopackは互換性問題のため実験版として分離）
- **Next.js 15重要変更**: 動的ルートの `params` は `Promise<>` 型（要 `await params`）
- **パフォーマンス最適化実装済み**: 画像最適化、動的インポート、DB最適化
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

-- ユーザープロフィール拡張テーブル（管理者権限用role列追加）
user_profiles (id, user_id, display_name, avatar_url, role, created_at, updated_at)
```

### パフォーマンス最適化（実装済み）
このプロジェクトには以下のパフォーマンス最適化が実装されています：

1. **画像最適化**
   - `next/image` コンポーネント使用
   - WebP/AVIF自動変換
   - YouTube、Unsplash画像の最適化対応

2. **コード分割・遅延読み込み**
   - 重要コンポーネントの動的インポート
   - ローディングスケルトン実装
   - バンドルサイズ最適化（First Load JS: ~150kB）

3. **データベースクエリ最適化**
   - N+1問題の解決
   - 必要フィールドのみ選択
   - パフォーマンス用インデックス追加
   - 管理画面でのCOUNT()クエリ使用

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

### 開発進捗状況
- ✅ **完了**: データベース設計・構築（Supabase）
- ✅ **完了**: 認証システム（Supabase Auth + Google OAuth）
- ✅ **完了**: 講座・動画一覧表示
- ✅ **完了**: 動画視聴機能（YouTube埋め込み）
- ✅ **完了**: 進捗管理機能
- ✅ **完了**: 管理画面（CRUD操作）
- ✅ **完了**: パフォーマンス最適化（画像・コード分割・DB）
- ✅ **完了**: Row Level Security (RLS) セキュリティ実装
- 🔄 **進行中**: UI/UX改善・追加機能開発

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
- **Next.js 15重要**: 動的ルートの `params` は `Promise<{ [key: string]: string }>` 型
- ページのパラメータとクエリに型定義を追加
- Server ActionsとClient Actionsに適切な型を定義

### Next.js 15 重要な変更点
```typescript
// 旧（Next.js 14以前）
interface PageProps {
  params: { id: string }
}

// 新（Next.js 15）
interface PageProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params  // 必須
  // resolvedParams.id を使用
}
```

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

### Row Level Security (RLS) 実装済み
- **全テーブルでRLS有効化**: courses, sections, videos, user_progress, user_profiles
- **ロールベースアクセス制御**: 一般ユーザー(user)・管理者(admin)の権限分離
- **データベースレベルのセキュリティ**: SQLインジェクション完全防止
- **管理者権限制御**: `is_admin()` 関数による厳密な権限チェック
- **プレビュー動画制御**: 未認証ユーザーはプレビューのみ、認証ユーザーは全動画アクセス可能
- **詳細なドキュメント**: `doc/009-rls-security-implementation.md` 参照

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

## タスク管理とドキュメント更新のルール

### 重要: TODO完了時の更新手順
作業完了後は必ず以下の手順でドキュメントを更新すること：

1. **チケットファイル（doc/XXX-*.md）の更新**
   - 完了した項目を `[ ]` から `[x]` に変更
   - 部分完了の場合は詳細をコメントで追記

2. **具体例**
   ```markdown
   ## TODO
   - [x] データベース設計・構築
   - [x] 認証システム実装
   - [x] ホームページUI改善（Udemyライク）
   - [ ] 動画視聴ページ実装
   ```

3. **完了条件の更新**
   ```markdown
   ## 完了条件
   - [x] すべてのテーブルが正しく作成されている
   - [x] 認証フローが動作する
   - [ ] 動画視聴機能が実装されている
   ```

4. **進捗率の目安**
   - 基盤システム（DB・認証・UI）: 完了
   - 機能実装（動画視聴・管理画面）: 進行中
   - 最適化（パフォーマンス・追加機能）: 未着手

### チケット管理の原則
- 作業開始時: まず該当チケットのTODO確認
- 作業完了時: 必ずチェックマーク更新
- 部分完了時: 詳細な進捗コメント追記
- 新機能追加時: 関連チケットのTODO項目追加

この手順により、プロジェクトの進捗が常に正確に把握できる。

## データフロー・アーキテクチャ

### 認証フロー
1. **ログイン**: `/login` → Google OAuth → `/auth/callback` → ホームへリダイレクト
2. **セッション管理**: `middleware.ts` が全リクエストでトークンリフレッシュ
3. **認証確認**: Server Componentsで `supabase.auth.getUser()` を使用（`getSession()` は使用禁止）

### 動画視聴フロー
1. **講座一覧**: `/` → Supabase から公開講座取得
2. **講座詳細**: `/courses/[id]` → 講座・セクション・動画データ取得
3. **動画視聴**: `/courses/[id]/videos/[videoId]` → YouTube埋め込み + 進捗管理
4. **進捗記録**: Server Actions (`markVideoComplete`) → Supabaseに保存 → ページ再検証

### Server Actions vs Client Components
- **Server Actions**: データ変更操作（進捗記録、認証）- `src/lib/actions/`
- **Client Components**: インタラクティブUI（ProgressButton、AuthButton）- `"use client"`必須
- **Hydration対策**: Client Componentsは `useState` + `useEffect` でマウント状態管理が必要

### データベースアクセスパターン
```typescript
// Server Components用（推奨）
const supabase = await createClient() // from '@/lib/supabase/server'

// Client Components用（最小限に使用）
const supabase = createClient() // from '@/lib/supabase/client'
```

## MCP統合

このプロジェクトはMCP (Model Context Protocol) サーバーを活用:
- **Supabase PostgREST**: 直接データベース操作
- **Context7**: ライブラリドキュメント取得  
- **Serena**: コードベース分析とシンボリック操作

## セキュリティ実装状況

### 🔐 実装済みセキュリティ機能
- ✅ **Row Level Security (RLS)**: 全テーブルで完全実装
- ✅ **認証システム**: Supabase Auth + Google OAuth
- ✅ **ロールベースアクセス制御**: user/admin権限分離
- ✅ **管理者権限管理**: トリガーベースのロール変更制限
- ✅ **データベース保護**: SQLインジェクション完全防止

### 📋 セキュリティファイル
- `supabase/migrations/003-admin-rls-policies.sql` - 管理者用RLSポリシー
- `supabase/migrations/004-enhanced-access-policies.sql` - 強化されたアクセス制御
- `doc/009-rls-security-implementation.md` - セキュリティ実装詳細ドキュメント
- `MIGRATION_INSTRUCTIONS.md` - RLSマイグレーション手順
- `GET_USER_ID_GUIDE.md` - 管理者権限設定ガイド

### ⚠️ 既知のセキュリティ考慮事項
- **オープンリダイレクト**: `src/app/auth/callback/route.ts` のnextパラメータ検証
- **本番ログ制限**: console.error の本番環境制限推奨
- **環境変数保護**: .env.local のgitignore追加推奨

## サンプルデータ

開発時にSupabaseにデータがない場合：
1. `supabase/sample-data.sql` を実行してサンプル講座データを挿入
2. または、トップページはフォールバック用のハードコードサンプルデータを表示

## デバッグとトラブルシューティング

### よくある問題
- **Turbopackエラー**: `npm run dev:turbo` でTailwind CSS互換性問題 → 標準版 `npm run dev` を使用
- **Next.js 15型エラー**: 動的ルートの `params` 型エラー → `Promise<>` 型に修正して `await params`
- **Hydrationエラー**: Client Componentで初期レンダリング時の状態不一致
- **認証エラー**: `getSession()` の代わりに `getUser()` を使用
- **ビルドエラー**: TypeScript厳密モードによる型エラー

### デバッグコマンド
```bash
npm run lint              # TypeScript + ESLint チェック
npm run build             # 本番ビルドでエラー確認（型チェック/Lintスキップ済み）
npm run build:analyze     # バンドル分析付きビルド
npm run dev               # 標準Webpack開発サーバー（推奨）
npm run dev:turbo         # Turbopack開発サーバー（実験版）
```

### パフォーマンス監視
- **バンドル分析**: `npm run build:analyze` でWebpackBundle Analyzerが起動
- **目標値**: First Load JS < 250kB（現在 ~150kB達成済み）
- **動的インポート**: 重要でないコンポーネントは遅延読み込み済み