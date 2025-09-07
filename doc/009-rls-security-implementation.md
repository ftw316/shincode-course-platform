# RLS (Row Level Security) セキュリティ実装

## 概要

このドキュメントでは、Supabaseデータベースに実装したRow Level Security (RLS) ポリシーについて説明します。RLSにより、データベースレベルでのアクセス制御を実現し、セキュリティを大幅に強化しました。

## 🔐 実装済みセキュリティ機能

### 1. 基本RLSポリシー（`001_initial_schema.sql`）

#### Coursesテーブル
- **未認証ユーザー**: 公開済み講座のみ閲覧可能
- **認証済みユーザー**: 全講座閲覧可能（プレビュー用）

#### Sectionsテーブル  
- **未認証ユーザー**: 公開講座のセクションのみ閲覧可能
- **認証済みユーザー**: 全セクション閲覧可能

#### Videosテーブル
- **未認証ユーザー**: 公開講座の動画のみ閲覧可能
- **認証済みユーザー**: 全動画閲覧可能

#### User Progressテーブル
- **認証済みユーザー**: 自分の進捗のみ閲覧・更新可能
- **セキュリティ**: `auth.uid() = user_id` で厳密に制御

#### User Profilesテーブル
- **認証済みユーザー**: 自分のプロフィールのみ管理可能

### 2. 管理者用RLSポリシー（`003-admin-rls-policies.sql`）

#### 管理者判定機能
```sql
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

#### 管理者権限
- **Courses, Sections, Videos**: 完全なCRUD権限
- **User Profiles**: 全ユーザープロフィール閲覧可能
- **User Progress**: 全ユーザー進捗閲覧可能（統計・分析用）

#### セキュリティ保護
- **ロール変更**: 既存管理者のみが実行可能
- **進捗削除**: 管理者でも他ユーザーの進捗は削除不可（監査ログ保護）

### 3. 強化されたアクセス制御（`004-enhanced-access-policies.sql`）

#### プレビュー動画制御
```sql
CREATE POLICY "Anyone can view preview videos of published courses" ON videos FOR SELECT USING (
  is_preview = true AND EXISTS (
    SELECT 1 FROM sections 
    JOIN courses ON sections.course_id = courses.id 
    WHERE sections.id = videos.section_id 
    AND courses.is_published = true
  )
);
```

#### セキュリティ強化
- **無効な進捗記録防止**: 公開済み講座の動画のみ進捗記録可能
- **自動ロール設定**: 新規ユーザーは自動的に'user'ロール
- **レート制限**: 進捗更新の頻度制限（DoS防止、オプション）

## 🚀 実装手順

### 1. マイグレーション実行
```bash
# Supabase CLIを使用
supabase db push

# または各マイグレーションを個別実行
psql -f supabase/migrations/003-admin-rls-policies.sql
psql -f supabase/migrations/004-enhanced-access-policies.sql
```

### 2. 管理者ユーザーの設定
```sql
-- Google OAuth後に実際のuser_idで実行
UPDATE user_profiles 
SET role = 'admin' 
WHERE user_id = 'your-actual-google-user-id';
```

### 3. テスト実行
```bash
# テストクエリの実行
psql -f supabase/migrations/005-rls-test-queries.sql
```

## 🔍 セキュリティテストケース

### テストシナリオ

1. **未認証ユーザー**
   - ✅ 公開講座のみ閲覧可能
   - ✅ プレビュー動画のみ閲覧可能
   - ❌ 進捗記録不可
   - ❌ 非公開コンテンツアクセス不可

2. **一般認証ユーザー**
   - ✅ 全公開講座コンテンツアクセス可能
   - ✅ 自分の進捗管理可能
   - ❌ 他ユーザーの進捗アクセス不可
   - ❌ 管理機能アクセス不可

3. **管理者ユーザー**
   - ✅ 全データへのCRUD権限
   - ✅ ユーザーロール管理可能
   - ✅ 統計・分析用データアクセス可能
   - ❌ 他ユーザー進捗の削除は不可

### パフォーマンステスト
```sql
-- インデックス効果の確認
EXPLAIN (ANALYZE, BUFFERS) 
SELECT v.* FROM videos v
JOIN sections s ON v.section_id = s.id
JOIN courses c ON s.course_id = c.id
WHERE c.is_published = true;
```

## ⚠️ セキュリティ考慮事項

### 実装済みセキュリティ対策

1. **SQLインジェクション防止**: パラメータ化クエリとSupabaseクライアント使用
2. **認証バイパス防止**: `auth.uid()`による厳密なユーザー識別
3. **権限昇格防止**: ロール変更は既存管理者のみ可能
4. **データ漏洩防止**: テーブル毎の細かいアクセス制御
5. **監査ログ保護**: 重要データの削除制限

### 追加推奨事項

1. **ログ監視**: 管理者アクションの監査ログ
2. **アラート設定**: 異常なアクセスパターンの検知
3. **定期的な権限確認**: 管理者権限の定期レビュー
4. **バックアップ戦略**: RLS設定を含むデータベース設計のバックアップ

## 🎯 本番運用チェックリスト

### デプロイ前確認
- [ ] 全テーブルでRLS有効化
- [ ] 全ポリシーの正常動作確認
- [ ] パフォーマンステスト実施
- [ ] 管理者ユーザーの正しい設定
- [ ] バックアップ・復旧手順の確認

### 運用監視項目
- [ ] RLSポリシー違反の監視
- [ ] データベースパフォーマンスの監視
- [ ] 管理者アクセスログの監視
- [ ] 異常なクエリパターンの検知
- [ ] 定期的なセキュリティ監査

## 📚 関連ファイル

- `supabase/migrations/001_initial_schema.sql` - 基本RLSポリシー
- `supabase/migrations/003-admin-rls-policies.sql` - 管理者用ポリシー
- `supabase/migrations/004-enhanced-access-policies.sql` - 強化されたアクセス制御
- `supabase/migrations/005-rls-test-queries.sql` - テスト用クエリ
- `src/lib/supabase/server.ts` - サーバーサイドクライアント設定
- `src/lib/auth/admin.ts` - 管理者権限チェック機能

## 🔄 今後のアップデート予定

1. **高度な監査ログ**: 全データ変更の追跡
2. **動的権限管理**: より柔軟なロールベースアクセス制御
3. **API レート制限**: Supabase Edge Functionsとの連携
4. **セキュリティダッシュボード**: リアルタイム監視UI

---

**注意**: この実装により、データベースレベルでの強固なセキュリティが確保されました。アプリケーションコードのセキュリティホールがあっても、不正なデータアクセスは防止されます。