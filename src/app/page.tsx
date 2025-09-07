import { createClient } from "@/lib/supabase/server";
import type { Course } from "@/lib/supabase/types";
import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/Navigation";

interface HomeProps {
  searchParams: Promise<{ error?: string }>
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams
  const supabase = await createClient();
  
  // 最適化: 必要なフィールドのみ取得し、インデックス活用
  const { data: courses, error } = await supabase
    .from('courses')
    .select(`
      id,
      title,
      description,
      thumbnail_url,
      created_at
    `)
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(20); // パフォーマンス向上のため制限

  if (error) {
    console.error('Error fetching courses:', error);
  }

  // サンプルデータ（Supabaseにデータがない場合のフォールバック）
  const sampleCourses = [
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      title: 'React & Next.js 完全攻略ガイド',
      description: '初心者から上級者まで、モダンなReactとNext.jsの開発手法を学べます。実践的なプロジェクトを通じて、フロントエンド開発のスキルを身につけましょう。',
      thumbnail_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop',
      is_published: true,
      created_at: '2024-01-01T00:00:00.000Z',
      updated_at: '2024-01-01T00:00:00.000Z'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      title: 'TypeScript マスターコース',
      description: 'JavaScriptからTypeScriptへステップアップ。型安全な開発手法を習得し、大規模アプリケーション開発に必要なスキルを身につけます。',
      thumbnail_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop',
      is_published: true,
      created_at: '2024-01-01T00:00:00.000Z',
      updated_at: '2024-01-01T00:00:00.000Z'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440003',
      title: 'Supabase実践開発',
      description: 'バックエンド開発をSupabaseで効率化。認証、データベース、リアルタイム機能を活用したWebアプリケーションを構築します。',
      thumbnail_url: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=450&fit=crop',
      is_published: true,
      created_at: '2024-01-01T00:00:00.000Z',
      updated_at: '2024-01-01T00:00:00.000Z'
    }
  ];

  // データがない場合はサンプルデータを使用
  const displayCourses = courses && courses.length > 0 ? courses : sampleCourses;

  return (
    <div className="min-h-screen bg-gray-50" suppressHydrationWarning>
        {/* エラーメッセージ */}
        {params.error === 'access_denied' && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  管理画面にアクセスするには管理者権限が必要です。
                </p>
              </div>
            </div>
          </div>
        )}
        
        <Navigation />

        {/* Hero Banner - Udemy Style */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  新しいスキルで
                  <br />
                  人生を変えよう
                </h1>
                <p className="text-xl mb-8 text-purple-100">
                  ShinCodeではAI時代に必要なプログラミングスキルを、
                  実践的なプロジェクトで学べます。
                </p>
                <button className="bg-white text-purple-600 px-8 py-3 rounded font-bold text-lg hover:bg-gray-100 transition-colors">
                  無料で始める
                </button>
              </div>
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <div className="aspect-video bg-gray-900 rounded mb-4 overflow-hidden">
                    <iframe
                      src="https://www.youtube.com/embed/dGcsHMXbSOA?rel=0&modestbranding=1"
                      title="React入門 - プログラミング基礎講座"
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                  <h3 className="font-bold mb-2">React入門講座</h3>
                  <p className="text-sm text-purple-100">プログラミングの基礎から学べる無料サンプル動画</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Breadcrumb/Category Pills */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-wrap gap-2">
              <button className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full text-sm font-medium transition-colors">
                人気
              </button>
              <button className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full text-sm font-medium transition-colors">
                JavaScript
              </button>
              <button className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full text-sm font-medium transition-colors">
                React
              </button>
              <button className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full text-sm font-medium transition-colors">
                AI開発
              </button>
              <button className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full text-sm font-medium transition-colors">
                Next.js
              </button>
            </div>
          </div>
        </div>
        
        {/* Course Section - Udemy Style */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              人気のコース
            </h2>
            <p className="text-gray-600">
              世界中の受講生が選んだコースで、スキルアップしましょう
            </p>
          </div>
          
          {error ? (
            <div className="text-center py-16">
              <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
                <div className="text-red-500 text-4xl mb-4">⚠️</div>
                <h3 className="text-lg font-semibold text-red-900 mb-2">接続エラー</h3>
                <p className="text-red-700">データベースへの接続に問題があります</p>
              </div>
            </div>
          ) : displayCourses && displayCourses.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {displayCourses.map((course: Course) => (
                <Link key={course.id} href={`/courses/${course.id}`} className="group bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200">
                  {/* Course Thumbnail */}
                  <div className="aspect-video relative overflow-hidden">
                    {course.thumbnail_url ? (
                      <Image 
                        src={course.thumbnail_url} 
                        alt={course.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        priority={false}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                        <svg className="w-16 h-16 text-white opacity-80" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    )}
                    
                    {/* Play button overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300">
                        <svg className="w-8 h-8 text-purple-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  {/* Course Content */}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                      {course.title}
                    </h3>
                    
                    {course.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {course.description}
                      </p>
                    )}
                    
                    {/* Instructor */}
                    <p className="text-xs text-gray-500 mb-2">
                      ShinCode Team
                    </p>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-gray-600 ml-1">4.8</span>
                      <span className="text-xs text-gray-500 ml-1">(1,234)</span>
                    </div>
                    
                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-gray-900">
                        無料
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(course.created_at).toLocaleDateString('ja-JP')}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  新しいコースを準備中です
                </h3>
                <p className="text-gray-600 mb-6">
                  素晴らしい学習コンテンツをお届けするため、現在準備中です。
                </p>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded font-medium transition-colors">
                  リリース通知を受け取る
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Features Section - Udemy Style */}
        <div className="bg-gray-100 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                なぜ ShinCode を選ぶのか？
              </h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                世界最高水準のオンライン学習体験を提供します
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  豊富なコンテンツ
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  初心者から上級者まで、あらゆるレベルの方に合った講座を提供します
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  実践的なスキル
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  理論だけではなく、実際のプロジェクトで使えるスキルを身につけます
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  専門講師陣
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  業界最前線で活躍するエキスパートから直接学べます
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Udemy Style */}
        <footer className="bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="font-semibold mb-4">ShinCode</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li><a href="#" className="hover:text-white">法人向けサービス</a></li>
                  <li><a href="#" className="hover:text-white">講師になる</a></li>
                  <li><a href="#" className="hover:text-white">モバイルアプリ</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">コミュニティ</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li><a href="#" className="hover:text-white">ブログ</a></li>
                  <li><a href="#" className="hover:text-white">ヘルプセンター</a></li>
                  <li><a href="#" className="hover:text-white">お問い合わせ</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">サポート</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li><a href="#" className="hover:text-white">ヘルプとサポート</a></li>
                  <li><a href="#" className="hover:text-white">利用規約</a></li>
                  <li><a href="#" className="hover:text-white">プライバシーポリシー</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">企業情報</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li><a href="#" className="hover:text-white">会社概要</a></li>
                  <li><a href="#" className="hover:text-white">采用</a></li>
                  <li><a href="#" className="hover:text-white">投資家情報</a></li>
                </ul>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-700">
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                <div className="text-xl font-bold text-purple-400">
                  ShinCode
                </div>
                <span className="text-sm text-gray-400">
                  &copy; 2024 ShinCode, Inc.
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                <button className="bg-gray-800 text-white px-3 py-1 rounded text-sm border border-gray-600 hover:bg-gray-700">
                  🌍 日本語
                </button>
              </div>
            </div>
          </div>
        </footer>
      </div>
  );
}
