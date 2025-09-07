-- 管理者用のRLSポリシーを追加
-- 管理者は全てのCRUD操作が可能

-- 管理者判定用のヘルパー関数
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Courses テーブル: 管理者のCRUD権限
CREATE POLICY "Admins can insert courses" ON courses FOR INSERT TO authenticated WITH CHECK (is_admin());
CREATE POLICY "Admins can update courses" ON courses FOR UPDATE TO authenticated USING (is_admin());
CREATE POLICY "Admins can delete courses" ON courses FOR DELETE TO authenticated USING (is_admin());

-- Sections テーブル: 管理者のCRUD権限  
CREATE POLICY "Admins can insert sections" ON sections FOR INSERT TO authenticated WITH CHECK (is_admin());
CREATE POLICY "Admins can update sections" ON sections FOR UPDATE TO authenticated USING (is_admin());
CREATE POLICY "Admins can delete sections" ON sections FOR DELETE TO authenticated USING (is_admin());

-- Videos テーブル: 管理者のCRUD権限
CREATE POLICY "Admins can insert videos" ON videos FOR INSERT TO authenticated WITH CHECK (is_admin());
CREATE POLICY "Admins can update videos" ON videos FOR UPDATE TO authenticated USING (is_admin());
CREATE POLICY "Admins can delete videos" ON videos FOR DELETE TO authenticated USING (is_admin());

-- User Profiles テーブル: 管理者は全ユーザーのプロフィールを閲覧可能
CREATE POLICY "Admins can view all profiles" ON user_profiles FOR SELECT TO authenticated USING (is_admin());

-- User Progress テーブル: 管理者は全ユーザーの進捗を閲覧可能（統計用）
CREATE POLICY "Admins can view all progress" ON user_progress FOR SELECT TO authenticated USING (is_admin());

-- セキュリティ強化: 管理者権限の更新は既存の管理者のみ可能
CREATE POLICY "Only admins can update user roles" ON user_profiles FOR UPDATE TO authenticated 
USING (
  CASE 
    WHEN OLD.role IS DISTINCT FROM NEW.role THEN is_admin()
    ELSE auth.uid() = user_id OR is_admin()
  END
);

-- 管理者による削除から重要なデータを保護
CREATE POLICY "Protect admin deletion of user progress" ON user_progress FOR DELETE TO authenticated 
USING (
  -- 管理者は自分の進捗のみ削除可能（誤削除防止）
  auth.uid() = user_id
);

-- コメント: セキュリティ考慮事項
-- 1. is_admin() 関数は SECURITY DEFINER で実行され、auth.uid() を安全に使用
-- 2. ロール変更は既存管理者のみが実行可能
-- 3. ユーザー進捗の削除は制限（データ保護）
-- 4. 管理者でも他ユーザーの進捗データ削除は不可（監査ログ保持）