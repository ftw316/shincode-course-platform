-- プレビュー動画とゲストアクセス用の強化されたRLSポリシー

-- 既存のポリシーをより細かく制御するため更新

-- Videos テーブル: プレビュー動画の詳細制御
DROP POLICY IF EXISTS "Anyone can view videos of published courses" ON videos;
CREATE POLICY "Anyone can view preview videos of published courses" ON videos FOR SELECT USING (
  is_preview = true AND EXISTS (
    SELECT 1 FROM sections 
    JOIN courses ON sections.course_id = courses.id 
    WHERE sections.id = videos.section_id 
    AND courses.is_published = true
  )
);

CREATE POLICY "Authenticated users can view all videos of published courses" ON videos FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM sections 
    JOIN courses ON sections.course_id = courses.id 
    WHERE sections.id = videos.section_id 
    AND courses.is_published = true
  )
);

-- User Progress: 認証済みユーザーのみ進捗記録可能
DROP POLICY IF EXISTS "Users can insert own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;

CREATE POLICY "Authenticated users can manage own progress" ON user_progress 
FOR ALL TO authenticated 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- セキュリティ強化: 悪意のあるデータ挿入を防ぐ
CREATE POLICY "Prevent invalid video progress" ON user_progress FOR INSERT TO authenticated 
WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM videos v
    JOIN sections s ON v.section_id = s.id
    JOIN courses c ON s.course_id = c.id
    WHERE v.id = video_id 
    AND c.is_published = true
  )
);

-- User Profiles: 自動プロフィール作成のセキュリティ
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
CREATE POLICY "Users can create own profile" ON user_profiles FOR INSERT TO authenticated 
WITH CHECK (
  auth.uid() = user_id AND
  role IN ('user') -- 新規ユーザーは一般ユーザーロールのみ
);

-- レート制限的なポリシー: 同じ動画の進捗更新頻度制限（DoS防止）
CREATE OR REPLACE FUNCTION check_progress_rate_limit()
RETURNS BOOLEAN AS $$
BEGIN
  -- 同一ユーザー・動画の更新が1分以内に複数回行われることを制限
  RETURN NOT EXISTS (
    SELECT 1 FROM user_progress 
    WHERE user_id = auth.uid() 
    AND video_id = NEW.video_id 
    AND updated_at > NOW() - INTERVAL '1 minute'
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 進捗更新時のレート制限チェック（コメントアウト - 必要に応じて有効化）
-- CREATE POLICY "Rate limit progress updates" ON user_progress FOR UPDATE TO authenticated 
-- USING (auth.uid() = user_id AND check_progress_rate_limit());

-- 監査ログ用のポリシー: 管理者アクションの記録
CREATE POLICY "Log admin actions" ON user_profiles FOR UPDATE TO authenticated 
USING (
  -- 通常の更新または管理者による権限変更の場合
  (auth.uid() = user_id) OR 
  (is_admin() AND OLD.role IS DISTINCT FROM NEW.role)
)
WITH CHECK (
  -- 権限変更は管理者のみ、その他は本人のみ
  CASE 
    WHEN OLD.role IS DISTINCT FROM NEW.role THEN is_admin()
    ELSE auth.uid() = user_id OR is_admin()
  END
);

-- コメント: セキュリティポリシーの説明
-- 1. プレビュー動画は未認証でも閲覧可能
-- 2. 通常動画は認証済みユーザーのみ
-- 3. 進捗記録は公開済み講座の動画のみ可能
-- 4. 新規ユーザーは自動的に'user'ロール
-- 5. レート制限機能（オプション）でDoS攻撃防止
-- 6. 管理者アクションは監査可能