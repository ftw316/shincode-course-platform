-- RLSポリシーのテスト用クエリとサンプルデータ
-- このファイルは開発・テスト環境でのみ実行してください

-- ========================================
-- テスト用サンプルデータの挿入（管理者として実行）
-- ========================================

-- 注意: 実際の環境では、管理者ユーザーを手動で設定する必要があります
-- テスト用の仮想管理者ユーザー（実際のauth.users IDに置き換えてください）
-- INSERT INTO user_profiles (user_id, display_name, role) VALUES 
-- ('12345678-1234-1234-1234-123456789012', 'Test Admin', 'admin');

-- テスト用の講座データ
-- INSERT INTO courses (id, title, description, is_published) VALUES 
-- ('aaaaaaaa-1111-1111-1111-111111111111', 'テスト公開講座', 'RLSテスト用の公開講座', true),
-- ('bbbbbbbb-2222-2222-2222-222222222222', 'テスト非公開講座', 'RLSテスト用の非公開講座', false);

-- ========================================
-- RLSポリシーのテストクエリ
-- ========================================

-- 【テスト1】未認証ユーザーのアクセステスト
-- 期待結果: 公開講座のみ閲覧可能
/*
SET ROLE anon;
SELECT title, is_published FROM courses; -- 公開講座のみ表示されるべき
SELECT COUNT(*) FROM sections; -- 公開講座のセクションのみカウント
SELECT COUNT(*) FROM videos WHERE is_preview = true; -- プレビュー動画のみカウント
RESET ROLE;
*/

-- 【テスト2】一般認証ユーザーのアクセステスト  
-- 期待結果: 全ての公開講座コンテンツにアクセス可能
/*
SET ROLE authenticated;
-- 実際のテストでは SET LOCAL "request.jwt.claims" = '{"sub":"user-uuid"}'; を使用
SELECT title, is_published FROM courses; -- 全講座表示されるべき
SELECT COUNT(*) FROM videos; -- 公開講座の全動画カウント
SELECT COUNT(*) FROM user_progress; -- 自分の進捗のみカウント（空）
RESET ROLE;
*/

-- 【テスト3】管理者ユーザーのアクセステスト
-- 期待結果: 全てのデータにCRUD権限あり
/*
SET ROLE authenticated;
-- 管理者として設定: SET LOCAL "request.jwt.claims" = '{"sub":"admin-uuid"}';
SELECT title, is_published FROM courses; -- 全講座（非公開含む）表示
SELECT COUNT(*) FROM user_profiles; -- 全ユーザープロフィール閲覧可能
-- INSERT, UPDATE, DELETE操作も可能
RESET ROLE;
*/

-- ========================================
-- セキュリティチェック用クエリ
-- ========================================

-- 【チェック1】RLSが有効化されているかの確認
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled,
  hasrls
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('courses', 'sections', 'videos', 'user_progress', 'user_profiles');

-- 【チェック2】作成されたポリシーの一覧
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 【チェック3】管理者判定関数の動作確認
-- 注意: 実際のユーザーIDで置き換えて実行
/*
SELECT is_admin(); -- 現在のユーザーが管理者かどうか
*/

-- ========================================
-- パフォーマンステスト用クエリ
-- ========================================

-- インデックスの使用状況確認
EXPLAIN (ANALYZE, BUFFERS) 
SELECT v.* FROM videos v
JOIN sections s ON v.section_id = s.id
JOIN courses c ON s.course_id = c.id
WHERE c.is_published = true;

-- ========================================
-- 本番運用前チェックリスト
-- ========================================

/*
✅ 確認項目:
1. 全テーブルでRLSが有効化されている
2. anon（未認証）ユーザーは公開データのみアクセス可能
3. authenticated（認証済み）ユーザーは適切なデータにアクセス可能
4. 管理者は管理機能にのみアクセス可能
5. ユーザーは自分のデータのみ変更可能
6. プレビュー動画は未認証でも閲覧可能
7. 管理者権限の変更は既存管理者のみ可能
8. パフォーマンスに問題がない（インデックス効果）

⚠️ 注意事項:
- テストは必ず本番環境と同じ設定で実行
- 実際のユーザーIDを使用してテスト
- 負荷テストも実施推奨
- セキュリティログの監視設定
*/