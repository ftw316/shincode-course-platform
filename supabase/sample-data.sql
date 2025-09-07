-- サンプルデータ挿入用SQL
-- 注意: これは開発環境でのテスト用です

-- 講座データの挿入
INSERT INTO courses (id, title, description, thumbnail_url, is_published, created_at, updated_at) VALUES
  (
    '550e8400-e29b-41d4-a716-446655440001',
    'React & Next.js 完全攻略ガイド',
    '初心者から上級者まで、モダンなReactとNext.jsの開発手法を学べます。実践的なプロジェクトを通じて、フロントエンド開発のスキルを身につけましょう。',
    'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop',
    true,
    now() - interval '7 days',
    now() - interval '7 days'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440002', 
    'TypeScript マスターコース',
    'JavaScriptからTypeScriptへステップアップ。型安全な開発手法を習得し、大規模アプリケーション開発に必要なスキルを身につけます。',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop',
    true,
    now() - interval '5 days',
    now() - interval '5 days'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440003',
    'Supabase実践開発',
    'バックエンド開発をSupabaseで効率化。認証、データベース、リアルタイム機能を活用したWebアプリケーションを構築します。',
    'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=450&fit=crop',
    true,
    now() - interval '3 days',
    now() - interval '3 days'
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  thumbnail_url = EXCLUDED.thumbnail_url,
  is_published = EXCLUDED.is_published,
  updated_at = now();

-- セクションデータの挿入
INSERT INTO sections (id, course_id, title, description, order_index, created_at, updated_at) VALUES
  -- React & Next.js講座のセクション
  (
    '660e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001',
    'React基礎',
    'Reactの基本概念とコンポーネントの作成方法を学びます',
    1,
    now() - interval '7 days',
    now() - interval '7 days'
  ),
  (
    '660e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440001',
    'Next.js入門',
    'Next.jsのルーティングとSSRについて詳しく解説します',
    2,
    now() - interval '7 days',
    now() - interval '7 days'
  ),
  -- TypeScript講座のセクション
  (
    '660e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440002',
    'TypeScript基本文法',
    'TypeScriptの型システムと基本文法をマスターします',
    1,
    now() - interval '5 days',
    now() - interval '5 days'
  ),
  (
    '660e8400-e29b-41d4-a716-446655440004',
    '550e8400-e29b-41d4-a716-446655440002',
    '高度な型機能',
    'ジェネリクスや条件型など、高度な型機能を学びます',
    2,
    now() - interval '5 days',
    now() - interval '5 days'
  ),
  -- Supabase講座のセクション
  (
    '660e8400-e29b-41d4-a716-446655440005',
    '550e8400-e29b-41d4-a716-446655440003',
    'Supabaseセットアップ',
    'Supabaseプロジェクトの作成と基本設定を行います',
    1,
    now() - interval '3 days',
    now() - interval '3 days'
  ),
  (
    '660e8400-e29b-41d4-a716-446655440006',
    '550e8400-e29b-41d4-a716-446655440003',
    'データベース設計',
    'PostgreSQLを使ったデータベース設計のベストプラクティス',
    2,
    now() - interval '3 days',
    now() - interval '3 days'
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  updated_at = now();

-- 動画データの挿入（YouTube動画のサンプル）
INSERT INTO videos (id, section_id, title, description, youtube_url, youtube_video_id, order_index, is_preview, created_at, updated_at) VALUES
  -- React基礎セクションの動画
  (
    '770e8400-e29b-41d4-a716-446655440001',
    '660e8400-e29b-41d4-a716-446655440001',
    'Reactとは何か？',
    'Reactの概要と特徴について詳しく解説します',
    'https://www.youtube.com/watch?v=dGcsHMXbSOA',
    'dGcsHMXbSOA',
    1,
    true,
    now() - interval '7 days',
    now() - interval '7 days'
  ),
  (
    '770e8400-e29b-41d4-a716-446655440002',
    '660e8400-e29b-41d4-a716-446655440001',
    'コンポーネントの作成',
    'Reactコンポーネントの基本的な作成方法を学びます',
    'https://www.youtube.com/watch?v=SqcY0GlETPk',
    'SqcY0GlETPk',
    2,
    false,
    now() - interval '7 days',
    now() - interval '7 days'
  ),
  (
    '770e8400-e29b-41d4-a716-446655440003',
    '660e8400-e29b-41d4-a716-446655440001',
    'Propsとstate',
    'Reactの重要な概念であるPropsとstateについて',
    'https://www.youtube.com/watch?v=hQAHSlTtcmY',
    'hQAHSlTtcmY',
    3,
    false,
    now() - interval '7 days',
    now() - interval '7 days'
  ),
  -- Next.js入門セクションの動画
  (
    '770e8400-e29b-41d4-a716-446655440004',
    '660e8400-e29b-41d4-a716-446655440002',
    'Next.js プロジェクトの作成',
    'Next.jsプロジェクトの初期セットアップ方法',
    'https://www.youtube.com/watch?v=mTz0GXj8NN0',
    'mTz0GXj8NN0',
    1,
    true,
    now() - interval '7 days',
    now() - interval '7 days'
  ),
  (
    '770e8400-e29b-41d4-a716-446655440005',
    '660e8400-e29b-41d4-a716-446655440002',
    'ルーティングシステム',
    'Next.jsの強力なルーティング機能を理解しよう',
    'https://www.youtube.com/watch?v=Sklc_fQBmcs',
    'Sklc_fQBmcs',
    2,
    false,
    now() - interval '7 days',
    now() - interval '7 days'
  ),
  -- TypeScript基本文法セクションの動画
  (
    '770e8400-e29b-41d4-a716-446655440006',
    '660e8400-e29b-41d4-a716-446655440003',
    'TypeScriptとは？',
    'TypeScriptの利点と導入方法について',
    'https://www.youtube.com/watch?v=ahCwqrYpIuM',
    'ahCwqrYpIuM',
    1,
    true,
    now() - interval '5 days',
    now() - interval '5 days'
  ),
  (
    '770e8400-e29b-41d4-a716-446655440007',
    '660e8400-e29b-41d4-a716-446655440003',
    '基本的な型定義',
    'TypeScriptの基本的な型について学びます',
    'https://www.youtube.com/watch?v=d56mG7DezGs',
    'd56mG7DezGs',
    2,
    false,
    now() - interval '5 days',
    now() - interval '5 days'
  ),
  -- Supabaseセットアップセクションの動画
  (
    '770e8400-e29b-41d4-a716-446655440008',
    '660e8400-e29b-41d4-a716-446655440005',
    'Supabase入門',
    'Supabaseの概要とアカウント作成',
    'https://www.youtube.com/watch?v=7uKQBl9uZ00',
    '7uKQBl9uZ00',
    1,
    true,
    now() - interval '3 days',
    now() - interval '3 days'
  ),
  (
    '770e8400-e29b-41d4-a716-446655440009',
    '660e8400-e29b-41d4-a716-446655440005',
    'プロジェクト作成',
    'Supabaseプロジェクトの作成手順',
    'https://www.youtube.com/watch?v=cPH-ReywZPE',
    'cPH-ReywZPE',
    2,
    false,
    now() - interval '3 days',
    now() - interval '3 days'
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  youtube_url = EXCLUDED.youtube_url,
  youtube_video_id = EXCLUDED.youtube_video_id,
  order_index = EXCLUDED.order_index,
  is_preview = EXCLUDED.is_preview,
  updated_at = now();