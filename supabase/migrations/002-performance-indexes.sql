-- パフォーマンス最適化のためのインデックス作成
-- 実行前にSupabaseダッシュボードでSQLエディタから実行してください

-- 1. コース検索の最適化
CREATE INDEX IF NOT EXISTS idx_courses_published_created 
ON courses (is_published, created_at DESC) 
WHERE is_published = true;

-- 2. セクション順序の最適化
CREATE INDEX IF NOT EXISTS idx_sections_course_order 
ON sections (course_id, order_index);

-- 3. 動画順序の最適化
CREATE INDEX IF NOT EXISTS idx_videos_section_order 
ON videos (section_id, order_index);

-- 4. ユーザー進捗検索の最適化
CREATE INDEX IF NOT EXISTS idx_user_progress_user_video 
ON user_progress (user_id, video_id, is_completed);

-- 5. プロフィール検索の最適化
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id 
ON user_profiles (user_id);

-- 6. 動画の講座関連検索最適化のための複合インデックス
CREATE INDEX IF NOT EXISTS idx_videos_course_preview 
ON videos (section_id) 
INCLUDE (id, title, is_preview, order_index);

-- 統計情報の更新（PostgreSQL向け）
ANALYZE courses;
ANALYZE sections; 
ANALYZE videos;
ANALYZE user_progress;
ANALYZE user_profiles;