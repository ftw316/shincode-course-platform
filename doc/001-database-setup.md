# チケット #001: データベース設計・構築（Supabase）

## 概要
Supabaseプロジェクトの作成とデータベーススキーマの構築を行う。

## 目標
- Supabaseプロジェクトを作成し、基本設定を完了する
- 講座プラットフォームに必要な5つのテーブルを作成する
- 適切なRLS（Row Level Security）ポリシーを設定する

## 詳細仕様

### 作成するテーブル
1. **courses** - 講座情報
2. **sections** - セクション情報
3. **videos** - 動画情報
4. **user_progress** - ユーザー進捗管理
5. **user_profiles** - ユーザープロフィール拡張

### データベーススキーマ
```sql
-- 講座テーブル
courses (
  id: uuid (Primary Key)
  title: text
  description: text
  thumbnail_url: text
  is_published: boolean
  created_at: timestamp
  updated_at: timestamp
)

-- セクションテーブル
sections (
  id: uuid (Primary Key)
  course_id: uuid (Foreign Key -> courses.id)
  title: text
  description: text
  order_index: integer
  created_at: timestamp
  updated_at: timestamp
)

-- 動画テーブル
videos (
  id: uuid (Primary Key)
  section_id: uuid (Foreign Key -> sections.id)
  title: text
  description: text
  youtube_url: text
  youtube_video_id: text
  order_index: integer
  is_preview: boolean
  created_at: timestamp
  updated_at: timestamp
)

-- ユーザー進捗テーブル
user_progress (
  id: uuid (Primary Key)
  user_id: uuid (Foreign Key -> auth.users.id)
  video_id: uuid (Foreign Key -> videos.id)
  is_completed: boolean
  completed_at: timestamp
  created_at: timestamp
  updated_at: timestamp
)

-- ユーザープロフィール拡張テーブル
user_profiles (
  id: uuid (Primary Key)
  user_id: uuid (Foreign Key -> auth.users.id)
  display_name: text
  avatar_url: text
  created_at: timestamp
  updated_at: timestamp
)
```

## TODO
- [ ] Supabaseアカウント作成・プロジェクト作成
- [ ] 環境変数の設定（.env.local）
- [ ] coursesテーブル作成
- [ ] sectionsテーブル作成
- [ ] videosテーブル作成
- [ ] user_progressテーブル作成
- [ ] user_profilesテーブル作成
- [ ] 外部キー制約の設定
- [ ] RLSポリシーの設定
- [ ] テストデータの投入
- [ ] データベース接続テスト

## 完了条件
- [ ] すべてのテーブルが正しく作成されている
- [ ] 外部キー制約が適切に設定されている
- [ ] RLSポリシーが設定されている
- [ ] Next.jsアプリからデータベースに接続できる
- [ ] 基本的なCRUD操作が実行できる

## 関連チケット
- #002: 認証システム実装
- #003: 基本ページ構造とルーティング設定