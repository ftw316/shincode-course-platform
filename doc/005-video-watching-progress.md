# チケット #005: 動画視聴ページと進捗管理機能

## 概要
YouTube埋め込み動画の視聴ページと進捗管理機能を実装する。

## 目標
- YouTube動画を埋め込んで視聴できるページを作成
- 手動での動画完了マーク機能
- 動画間のナビゲーション機能
- 進捗データの永続化

## 詳細仕様

### 動画視聴ページ
- YouTube動画の埋め込み表示
- 動画タイトル・説明の表示
- 「完了」ボタン（手動マーク）
- 前/次の動画への導線
- サイドバーで講座内の他動画一覧
- パンくずナビゲーション

### アクセス制御
- 最初の動画（is_preview=true）: 未認証でもアクセス可能
- その他の動画: 認証必須
- 未認証ユーザーには適切なメッセージとログイン誘導

### 進捗管理
- 「完了」ボタンクリックでuser_progressに記録
- 完了済み動画の表示状態変更
- 講座全体の進捗率再計算
- 完了日時の記録

## YouTube埋め込み仕様
```typescript
// YouTube動画IDの抽出
function getYouTubeVideoId(url: string): string | null {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// YouTube埋め込みURL生成
function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
}
```

## 必要なコンポーネント
- VideoPlayer（YouTube埋め込み）
- VideoNavigation（前/次ボタン）
- VideoSidebar（動画一覧）
- ProgressButton（完了ボタン）
- AuthGuard（認証チェック）

## TODO
- [ ] 動画視聴ページのレイアウト作成
- [ ] YouTube埋め込みコンポーネント作成
- [ ] 動画情報表示コンポーネント作成
- [ ] 進捗管理のServer Actions作成
- [ ] 完了ボタンコンポーネント作成
- [ ] 動画ナビゲーションコンポーネント作成
- [ ] サイドバー動画リストコンポーネント作成
- [ ] パンくずナビゲーション実装
- [ ] アクセス制御ミドルウェア実装
- [ ] 未認証ユーザー用メッセージ実装
- [ ] 動画完了API（Server Action）実装
- [ ] 進捗状態の同期処理実装
- [ ] レスポンシブ対応（特にモバイル）
- [ ] ローディング・エラー状態実装
- [ ] 動作テスト（完了マーク、ナビゲーション）

## Server Actions
```typescript
// 動画完了マーク
async function markVideoComplete(userId: string, videoId: string): Promise<void>

// 動画完了解除
async function markVideoIncomplete(userId: string, videoId: string): Promise<void>

// 進捗率計算
async function calculateCourseProgress(userId: string, courseId: string): Promise<number>
```

## データベース操作
```sql
-- 進捗記録の挿入/更新
INSERT INTO user_progress (user_id, video_id, is_completed, completed_at)
VALUES ($1, $2, true, NOW())
ON CONFLICT (user_id, video_id) 
DO UPDATE SET is_completed = true, completed_at = NOW();

-- 講座の進捗率計算
SELECT 
  COUNT(*) as total_videos,
  COUNT(CASE WHEN up.is_completed = true THEN 1 END) as completed_videos
FROM videos v
JOIN sections s ON v.section_id = s.id
LEFT JOIN user_progress up ON v.id = up.video_id AND up.user_id = $1
WHERE s.course_id = $2;
```

## 完了条件
- [ ] YouTube動画が正しく埋め込み表示される
- [ ] 認証制御が正しく動作する
- [ ] 「完了」ボタンで進捗が記録される
- [ ] 動画間のナビゲーションが機能する
- [ ] サイドバーの動画リストが表示される
- [ ] 進捗状態が正しく同期される
- [ ] モバイルでも快適に視聴できる
- [ ] パンくずナビゲーションが機能する

## 関連チケット
- #001: データベース設計・構築
- #002: 認証システム実装
- #004: 講座・動画一覧表示
- #006: プロフィール・ダッシュボードページ