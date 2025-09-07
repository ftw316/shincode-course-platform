# チケット #006: プロフィール・ダッシュボードページ

## 概要
ユーザーのプロフィール管理とダッシュボード機能を実装する。

## 目標
- ユーザーの基本情報表示・編集機能
- 受講状況のダッシュボード表示
- 学習進捗の可視化
- 学習履歴の管理

## 詳細仕様

### プロフィールページ
- ユーザー基本情報表示
  - 表示名
  - アバター画像
  - 登録日
  - Google アカウント情報
- プロフィール編集機能
  - 表示名の変更
  - アバター画像のアップロード（オプション）
- アカウント設定
  - ログアウト機能

### ダッシュボードページ
- 学習概要
  - 受講中の講座数
  - 完了した動画の総数
  - 総学習時間（推定）
  - 今週の学習時間
- 受講中の講座一覧
  - 講座名
  - 進捗率（プログレスバー）
  - 最後に視聴した動画
  - 次に視聴する動画へのリンク
- 最近の学習履歴
  - 最近視聴した動画リスト
  - 視聴日時
  - 講座・セクション情報

### 統計情報
- 週次・月次の学習統計
- 進捗グラフ（簡易版）
- 完了率の表示

## 必要な型定義
```typescript
interface UserProfile {
  id: string
  user_id: string
  display_name: string
  avatar_url: string | null
  created_at: string
  updated_at: string
}

interface DashboardStats {
  totalCourses: number
  completedVideos: number
  totalVideos: number
  estimatedHours: number
  thisWeekHours: number
}

interface CourseProgress {
  course: Course
  progress: number
  lastWatchedVideo?: Video
  nextVideo?: Video
}

interface RecentActivity {
  video: Video
  course: Course
  section: Section
  completed_at: string
}
```

## TODO
- [x] user_profilesテーブルの初期データ投入設定（DB設定済み）
- [ ] プロフィール取得API作成
- [ ] プロフィール更新API（Server Actions）作成
- [ ] ダッシュボード統計取得API作成
- [ ] 学習履歴取得API作成
- [x] プロフィール表示コンポーネント作成（AuthButton内統合）
- [ ] プロフィール編集フォーム作成
- [ ] ダッシュボード統計コンポーネント作成
- [ ] 受講中講座リストコンポーネント作成
- [ ] 進捗率プログレスバーコンポーネント作成
- [ ] 最近の学習履歴コンポーネント作成
- [ ] プロフィールページ実装
- [ ] ダッシュボードページ実装
- [ ] アバター画像アップロード機能（オプション）
- [ ] レスポンシブデザイン対応
- [ ] ローディング状態実装

## データベースクエリ例
```sql
-- ユーザー統計取得
SELECT 
  COUNT(DISTINCT s.course_id) as total_courses,
  COUNT(CASE WHEN up.is_completed = true THEN 1 END) as completed_videos,
  COUNT(v.id) as total_videos
FROM user_progress up
JOIN videos v ON up.video_id = v.id
JOIN sections s ON v.section_id = s.id
WHERE up.user_id = $1;

-- 受講中講座の進捗取得
SELECT 
  c.*,
  COUNT(v.id) as total_videos,
  COUNT(CASE WHEN up.is_completed = true THEN 1 END) as completed_videos,
  MAX(CASE WHEN up.is_completed = true THEN up.completed_at END) as last_activity
FROM courses c
JOIN sections s ON c.id = s.course_id
JOIN videos v ON s.id = v.section_id
LEFT JOIN user_progress up ON v.id = up.video_id AND up.user_id = $1
GROUP BY c.id
HAVING COUNT(CASE WHEN up.is_completed = true THEN 1 END) > 0
ORDER BY last_activity DESC;

-- 最近の学習履歴
SELECT 
  v.*,
  s.title as section_title,
  c.title as course_title,
  up.completed_at
FROM user_progress up
JOIN videos v ON up.video_id = v.id
JOIN sections s ON v.section_id = s.id
JOIN courses c ON s.course_id = c.id
WHERE up.user_id = $1 AND up.is_completed = true
ORDER BY up.completed_at DESC
LIMIT 10;
```

## Server Actions
```typescript
// プロフィール更新
async function updateProfile(userId: string, data: UpdateProfileData): Promise<void>

// ダッシュボード統計取得
async function getDashboardStats(userId: string): Promise<DashboardStats>

// 受講中講座取得
async function getEnrolledCourses(userId: string): Promise<CourseProgress[]>

// 最近の学習履歴取得
async function getRecentActivity(userId: string): Promise<RecentActivity[]>
```

## 完了条件
- [ ] プロフィール情報が表示される
- [ ] プロフィール編集機能が動作する
- [ ] ダッシュボード統計が正しく表示される
- [ ] 受講中講座の進捗が表示される
- [ ] 最近の学習履歴が表示される
- [ ] 次に視聴する動画へのリンクが機能する
- [ ] レスポンシブデザインが適用されている
- [ ] パフォーマンスが良好である

## 関連チケット
- #001: データベース設計・構築
- #002: 認証システム実装
- #005: 動画視聴ページと進捗管理
- #007: 管理画面（講座・動画管理）