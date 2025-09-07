# Google OAuth後のユーザーID取得ガイド

## 🎯 目的
Google OAuthでログイン後、あなたのユーザーIDを取得して管理者権限を設定する

## 📋 手順

### ステップ1: アプリケーションにログイン
1. 開発サーバーを起動
   ```bash
   npm run dev
   ```

2. ブラウザで http://localhost:3000 を開く

3. **「ログイン」**ボタンをクリック → Google OAuth実行

### ステップ2: ユーザーIDを確認

#### 方法A: Supabase Dashboard（推奨）
1. **Supabase Dashboard** (https://supabase.com/dashboard)
2. あなたのプロジェクト選択
3. **左メニュー → Authentication**
4. **Users** タブ
5. ログインしたユーザーの **ID列** をコピー
   - 例: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`

#### 方法B: ブラウザ開発者ツール
1. ログイン後、**F12**で開発者ツールを開く
2. **Console**タブ
3. 以下のコードを実行:
   ```javascript
   // Supabaseクライアントからユーザー情報取得
   const { createClient } = require('@supabase/supabase-js');
   // またはシンプルに
   console.log('Check Supabase Dashboard > Authentication > Users for your ID');
   ```

#### 方法C: アプリケーションに一時的なコード追加
`src/components/AuthButton.tsx`に一時的に追加:
```tsx
// useEffect内に追加（開発時のみ）
useEffect(() => {
  if (user) {
    console.log('Your User ID:', user.id); // <- これを追加
  }
}, [user]);
```

### ステップ3: 管理者権限の設定
ユーザーIDを取得したら、**Supabase Dashboard → SQL Editor**で実行:

```sql
-- 実際のユーザーIDに置き換えて実行
UPDATE user_profiles 
SET role = 'admin' 
WHERE user_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'; -- <- ここを実際のIDに変更
```

### ステップ4: 確認
```sql
-- 管理者権限が設定されているか確認
SELECT user_id, display_name, role 
FROM user_profiles 
WHERE role = 'admin';
```

## 🚨 重要なポイント

1. **ユーザーIDの形式**: UUID形式（例: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`）
2. **user_profiles テーブル**: Google OAuth後に自動作成される
3. **初回ログイン**: `role`は最初`'user'`に設定される
4. **管理者設定**: `UPDATE`で`'admin'`に変更

## 🔧 トラブルシューティング

### user_profiles テーブルにデータがない場合
```sql
-- ユーザープロフィールを手動作成
INSERT INTO user_profiles (user_id, display_name, role)
VALUES ('your-user-id-here', 'Your Name', 'admin');
```

### ユーザーIDが見つからない場合
1. **必ずGoogleでログイン完了後**に確認
2. **Supabase Dashboard** → **Authentication** → **Users**が最確実
3. **ブラウザのプライベートモード**は使用しない

## ✅ 完了後の確認方法

管理者権限設定後、アプリケーションで:
1. **管理画面**（/admin）にアクセス可能
2. **講座・動画の作成・編集**が可能
3. **AuthButton**に「管理画面」リンク表示

---

**このガイドに従って、安全に管理者権限を設定してください！**