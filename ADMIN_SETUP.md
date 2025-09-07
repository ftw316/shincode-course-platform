# 管理者権限設定手順

管理者権限システムが実装されました。以下の手順で管理者ユーザーを設定してください。

## 1. データベースの拡張

Supabaseダッシュボードで以下のSQLを実行してください：

```sql
-- Add role column to user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';

-- Create index for faster role queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- Add constraint to ensure valid roles
ALTER TABLE user_profiles 
ADD CONSTRAINT check_valid_role 
CHECK (role IN ('user', 'admin', 'moderator'));
```

## 2. 管理者ユーザーの作成

### ステップ1: Google認証でログイン
1. アプリケーションで Google ログインを実行
2. `user_profiles` テーブルにレコードが自動作成されることを確認

### ステップ2: 管理者権限を付与
Supabaseダッシュボードで以下のSQLを実行：

```sql
-- 現在ログインしているユーザーのuser_idを確認
SELECT user_id, display_name, email FROM auth.users 
JOIN user_profiles ON auth.users.id = user_profiles.user_id;

-- 管理者権限を付与（user_idを実際の値に置き換えてください）
UPDATE user_profiles 
SET role = 'admin' 
WHERE user_id = 'your-actual-user-id-here';
```

## 3. 動作確認

### 管理者ユーザーの場合
- ✅ ナビゲーションバーに「管理画面」ボタンが表示される
- ✅ ユーザー名の隣に「管理者」バッジが表示される
- ✅ `/admin` にアクセスできる

### 一般ユーザーの場合
- ❌ 管理者メニューは表示されない
- ❌ `/admin` にアクセスすると自動的にホームページにリダイレクトされる

## 4. トラブルシューティング

### 問題: 管理者メニューが表示されない
**解決策:**
1. ブラウザのキャッシュをクリア
2. ログアウト→再ログイン
3. user_profilesテーブルでroleが'admin'に設定されているか確認

### 問題: user_profilesにレコードが作成されない
**解決策:**
1. 一度ログアウト→再ログイン
2. 手動でレコードを作成：
```sql
INSERT INTO user_profiles (user_id, display_name, role) 
VALUES ('your-user-id', 'Admin User', 'admin');
```

### 問題: 管理画面にアクセスできない
**解決策:**
- コンソールで認証エラーがないか確認
- user_idが正しく設定されているか確認

## 5. セキュリティ注意事項

- 管理者権限は信頼できるユーザーにのみ付与してください
- 不要になった管理者権限は速やかに削除してください：
```sql
UPDATE user_profiles SET role = 'user' WHERE user_id = 'user-id-to-remove';
```

## 実装済み機能

✅ **自動ユーザープロフィール作成**: ログイン時に自動でuser_profilesレコード作成
✅ **管理者権限チェック**: サーバーサイド・クライアントサイド両方で実装
✅ **管理者UI**: ナビゲーションバーに管理画面ボタン・管理者バッジ
✅ **アクセス制御**: 管理画面への未認証・非管理者アクセスを防止
✅ **権限表示**: 管理者のみに管理機能を表示