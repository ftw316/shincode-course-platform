# RLS セキュリティマイグレーション実行手順

## 🎯 実行方法

### Supabase Dashboard での実行

1. **Supabase Dashboard** (https://supabase.com/dashboard) にアクセス
2. プロジェクト選択
3. 左メニュー → **"SQL Editor"**
4. 以下のSQLを**順番に**実行

---

## 📝 実行するSQL（コピー&ペースト）

### ステップ1: 管理者判定関数の作成
```sql
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
```

### ステップ2: 管理者用RLSポリシー
```sql
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
```

### ステップ3: 強化されたセキュリティポリシー
```sql
-- 既存のポリシーをまず削除
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

-- 管理者権限の更新ポリシー（修正版）
CREATE POLICY "Users and admins can update profiles" ON user_profiles FOR UPDATE TO authenticated 
USING (auth.uid() = user_id OR is_admin())
WITH CHECK (auth.uid() = user_id OR is_admin());

-- ロール変更の制限はトリガーで実装（より安全）
CREATE OR REPLACE FUNCTION check_role_change()
RETURNS TRIGGER AS $$
BEGIN
  -- ロール変更の場合は管理者権限が必要
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    IF NOT EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    ) THEN
      RAISE EXCEPTION 'Only admins can change user roles';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- トリガーの作成
DROP TRIGGER IF EXISTS trigger_check_role_change ON user_profiles;
CREATE TRIGGER trigger_check_role_change
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION check_role_change();

-- 管理者による削除から重要なデータを保護
CREATE POLICY "Protect user progress deletion" ON user_progress FOR DELETE TO authenticated 
USING (
  -- ユーザーは自分の進捗のみ削除可能（管理者でも制限）
  auth.uid() = user_id
);
```

### ステップ4: プレビュー動画の詳細制御
```sql
-- 既存のポリシーを削除して再作成
DROP POLICY IF EXISTS "Anyone can view videos of published courses" ON videos;

-- プレビュー動画の新しいポリシー
CREATE POLICY "Anyone can view preview videos of published courses" ON videos FOR SELECT USING (
  is_preview = true AND EXISTS (
    SELECT 1 FROM sections 
    JOIN courses ON sections.course_id = courses.id 
    WHERE sections.id = videos.section_id 
    AND courses.is_published = true
  )
);

-- 認証ユーザー用の動画ポリシー
CREATE POLICY "Authenticated users can view all videos of published courses" ON videos FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM sections 
    JOIN courses ON sections.course_id = courses.id 
    WHERE sections.id = videos.section_id 
    AND courses.is_published = true
  )
);
```

### ステップ5: 進捗データの強化ポリシー
```sql
-- 既存ポリシーの削除と再作成
DROP POLICY IF EXISTS "Users can insert own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;

-- 統合された進捗管理ポリシー
CREATE POLICY "Authenticated users can manage own progress" ON user_progress 
FOR ALL TO authenticated 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- 無効な進捗記録を防ぐ
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
```

### ステップ6: ユーザープロフィールセキュリティ
```sql
-- 既存ポリシーの更新
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;

-- 新規ユーザーは一般ユーザーロールのみ
CREATE POLICY "Users can create own profile" ON user_profiles FOR INSERT TO authenticated 
WITH CHECK (
  auth.uid() = user_id AND
  role IN ('user') -- 新規ユーザーは一般ユーザーロールのみ
);
```

---

## ✅ 実行後の確認

### 管理者ユーザーの設定
Google OAuth でログイン後、以下のSQLを実行：
```sql
-- 実際のuser_idに置き換えてください
UPDATE user_profiles 
SET role = 'admin' 
WHERE user_id = 'your-actual-google-user-id';
```

### RLS動作確認
```sql
-- RLSが有効化されているかの確認
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled,
  hasrls
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('courses', 'sections', 'videos', 'user_progress', 'user_profiles');

-- 作成されたポリシーの一覧
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

---

## 🚨 重要な注意事項

1. **順番を守って実行**してください
2. エラーが出た場合は**既存ポリシーとの競合**の可能性があります
3. 管理者ユーザー設定は**Google OAuth後**に実行
4. テスト環境での確認を**強く推奨**

---

## 🎯 実行完了後の効果

- ✅ 管理者のみが講座・動画を管理可能
- ✅ 未認証ユーザーはプレビュー動画のみ閲覧
- ✅ 認証ユーザーは全動画閲覧可能  
- ✅ ユーザー進捗データの完全保護
- ✅ 権限昇格攻撃の防止

**セキュリティが大幅に強化されます！**