# チケット #002: 認証システム（Supabase Auth）

## 概要
Supabase Authを使用したGoogle OAuth認証システムを実装する。

## 目標
- Google OAuthによるログイン・サインアップ機能を実装
- セキュアな認証フローを構築
- Next.js App RouterでのSupabase認証ベストプラクティスに従う

## 詳細仕様

### 認証機能
- Google OAuthによるログイン・サインアップ
- セッション管理（クッキーベース）
- ログアウト機能
- 認証状態の管理

### セキュリティ要件
- `supabase.auth.getUser()` を使用した認証確認
- middleware.tsでのトークンリフレッシュ
- 適切なRLSポリシーの適用

## 技術実装

### 必要なパッケージ
```bash
npm install @supabase/supabase-js @supabase/ssr
```

### ファイル構成
- `src/lib/supabase/client.ts` - Client Component用
- `src/lib/supabase/server.ts` - Server Component用
- `src/lib/supabase/middleware.ts` - Middleware用
- `middleware.ts` - Next.js middleware
- `src/app/auth/callback/route.ts` - 認証コールバック
- `src/app/login/page.tsx` - ログインページ
- `src/components/AuthButton.tsx` - 認証ボタン

## TODO
- [x] Supabaseプロジェクトで Google OAuth 設定
- [x] 必要なパッケージをインストール
- [x] Supabaseクライアント設定（client/server）
- [x] 環境変数設定
- [x] middleware.ts実装
- [x] 認証コールバックRoute Handler実装
- [x] ログインページ作成
- [x] ログアウト機能実装
- [x] 認証状態管理コンポーネント作成
- [x] 認証ボタンコンポーネント作成
- [x] プライベートルート保護実装
- [x] ユーザープロフィール自動作成設定
- [x] 認証フロー動作確認

## セキュリティチェックリスト
- [x] サーバーコードで`getSession()`を使用していない
- [x] `getUser()`を使用してページ保護を実装
- [x] middlewareでトークンリフレッシュを実装
- [x] クッキーセキュリティ設定が適切
- [x] RLSポリシーが正しく動作
- [x] emailとfull_nameをauth.userからアクセスしてセキュリティ強化

## 完了条件
- [x] Google OAuthでログイン・サインアップができる
- [x] 認証状態が正しく管理されている
- [x] ログアウト機能が動作する
- [x] プライベートルートが適切に保護されている
- [x] セキュリティベストプラクティスに準拠している

## 関連チケット
- #001: データベース設計・構築
- #003: 基本ページ構造とルーティング設定
- #005: プロフィール・ダッシュボードページ