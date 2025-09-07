# チケット #004: 講座・動画一覧表示

## 概要
講座一覧ページと講座詳細ページを実装し、Supabaseからデータを取得して表示する。

## 目標
- 講座一覧をカード形式で表示
- 講座詳細ページでセクションと動画を階層表示
- 進捗率の表示
- 未認証ユーザーでも最初の動画はプレビュー可能

## 詳細仕様

### 講座一覧ページ（ホーム）
- 公開中の講座をカード形式で表示
- 各講座カードの表示項目：
  - サムネイル画像
  - 講座タイトル
  - 説明文（抜粋）
  - 総動画数
  - 進捗率（認証ユーザーのみ）

### 講座詳細ページ
- 講座の詳細情報表示
- セクション一覧（アコーディオン形式）
- 各セクション内の動画リスト
- 動画の進捗状態表示（完了/未完了）
- 最初の動画のプレビュー表示

### データフェッチ戦略
- Server Componentsでの初期データ取得
- 適切なキャッシュ戦略の実装
- 進捗データは認証ユーザーのみ取得

## 必要な型定義
```typescript
interface Course {
  id: string
  title: string
  description: string
  thumbnail_url: string | null
  is_published: boolean
  created_at: string
  updated_at: string
  sections?: Section[]
}

interface Section {
  id: string
  course_id: string
  title: string
  description: string | null
  order_index: number
  videos?: Video[]
}

interface Video {
  id: string
  section_id: string
  title: string
  description: string | null
  youtube_url: string
  youtube_video_id: string
  order_index: number
  is_preview: boolean
  progress?: UserProgress
}

interface UserProgress {
  id: string
  user_id: string
  video_id: string
  is_completed: boolean
  completed_at: string | null
}
```

## TODO
- [x] 講座関連の型定義作成
- [x] Supabaseクエリ関数作成
- [x] 講座一覧取得API作成（ホームページ）
- [x] 講座詳細取得API作成
- [ ] 進捗率計算関数作成
- [x] 講座カードコンポーネント作成（Udemyライク）
- [x] 講座一覧ページ実装
- [x] 講座詳細ページ実装
- [x] セクションアコーディオンコンポーネント作成（統合実装）
- [x] 動画リストコンポーネント作成（統合実装）
- [ ] 進捗表示コンポーネント作成
- [x] プレビュー判定ロジック実装
- [x] レスポンシブデザイン対応
- [x] ローディング状態実装
- [x] エラーハンドリング実装
- [x] SEOメタデータ設定

## データベースクエリ例
```sql
-- 講座一覧取得（公開中のみ）
SELECT * FROM courses WHERE is_published = true ORDER BY created_at DESC;

-- 講座詳細取得（セクション・動画含む）
SELECT 
  c.*,
  s.*,
  v.*
FROM courses c
LEFT JOIN sections s ON c.id = s.course_id
LEFT JOIN videos v ON s.id = v.section_id
WHERE c.id = $1 AND c.is_published = true
ORDER BY s.order_index, v.order_index;

-- ユーザー進捗取得
SELECT * FROM user_progress WHERE user_id = $1;
```

## 完了条件
- [x] 講座一覧が正しく表示される
- [x] 講座詳細ページが機能する
- [x] セクション・動画の階層表示ができている
- [ ] 進捗率が正しく計算・表示される
- [x] 未認証ユーザーのプレビュー制限が機能する
- [x] レスポンシブデザインが適用されている
- [x] ローディング・エラー状態が適切に処理される

## 関連チケット
- #001: データベース設計・構築
- #002: 認証システム実装
- #003: 基本ページ構造とルーティング設定
- #005: 動画視聴ページと進捗管理