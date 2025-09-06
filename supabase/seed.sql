-- Insert sample courses
INSERT INTO courses (id, title, description, thumbnail_url, is_published) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Next.js完全マスターコース', 'Next.js 15とReact 19を使った最新のフルスタック開発を学びます', 'https://example.com/nextjs-thumbnail.jpg', true),
  ('550e8400-e29b-41d4-a716-446655440002', 'TypeScript基礎講座', 'TypeScriptの基本から応用まで、実践的なプロジェクトを通して学びます', 'https://example.com/typescript-thumbnail.jpg', true),
  ('550e8400-e29b-41d4-a716-446655440003', 'Supabase実践コース', 'Supabaseを使ったバックエンド開発とデータベース設計を学びます', 'https://example.com/supabase-thumbnail.jpg', false);

-- Insert sample sections for Next.js course
INSERT INTO sections (id, course_id, title, description, order_index) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '基礎知識', 'Next.jsの基本概念とセットアップ', 1),
  ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'App Router', 'Next.js 15のApp Routerについて', 2),
  ('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'データフェッチ', 'Server ComponentsとClient Componentsでのデータ取得', 3);

-- Insert sample sections for TypeScript course
INSERT INTO sections (id, course_id, title, description, order_index) VALUES
  ('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'TypeScript入門', 'TypeScriptの基本的な型システム', 1),
  ('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', '高度な型', 'ジェネリクスやConditional Typesなど', 2);

-- Insert sample videos
INSERT INTO videos (id, section_id, title, description, youtube_url, youtube_video_id, order_index, is_preview) VALUES
  -- Next.js 基礎知識セクション
  ('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Next.jsとは？', 'Next.jsの概要と特徴について学びます', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ', 1, true),
  ('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'プロジェクトのセットアップ', 'Create Next Appを使ったプロジェクト作成', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ', 2, false),
  ('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001', 'ディレクトリ構造', 'Next.jsプロジェクトの構造について', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ', 3, false),
  
  -- Next.js App Routerセクション
  ('770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440002', 'App Routerの基本', 'Pages RouterからApp Routerへの移行', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ', 1, false),
  ('770e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440002', 'ルーティングとレイアウト', 'ファイルベースルーティングの詳細', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ', 2, false),
  
  -- TypeScript入門セクション
  ('770e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440004', 'TypeScript入門', 'TypeScriptの基本的な使い方', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ', 1, true),
  ('770e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440004', '基本的な型', 'string, number, booleanなどの基本型', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ', 2, false);