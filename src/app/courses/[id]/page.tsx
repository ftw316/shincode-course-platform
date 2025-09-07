import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Course, Section, Video } from "@/lib/supabase/types";
import AuthButton from "@/components/AuthButton";

interface CourseWithSections extends Course {
  sections: (Section & {
    videos: Video[];
  })[];
}

async function getCourseWithSections(courseId: string): Promise<CourseWithSections | null> {
  const supabase = await createClient();
  
  // 最適化: 1つのクエリで講座とセクション・動画を同時取得
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select(`
      id,
      title,
      description,
      thumbnail_url,
      is_published,
      created_at,
      updated_at,
      sections (
        id,
        course_id,
        title,
        description,
        order_index,
        created_at,
        updated_at,
        videos (
          id,
          section_id,
          title,
          description,
          youtube_url,
          youtube_video_id,
          order_index,
          is_preview,
          created_at,
          updated_at
        )
      )
    `)
    .eq('id', courseId)
    .eq('is_published', true)
    .single();

  if (courseError || !course) {
    console.error('Error fetching course:', courseError);
    return null;
  }

  // セクション内の動画をorder_indexでソート
  if (course.sections) {
    course.sections.forEach(section => {
      if (section.videos) {
        section.videos.sort((a: Video, b: Video) => a.order_index - b.order_index);
      }
    });
    course.sections.sort((a, b) => a.order_index - b.order_index);
  }

  return course;
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const course = await getCourseWithSections(id);

  if (!course) {
    notFound();
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 安全性のためのnullチェック追加
  const sections = course.sections || [];
  
  // 総動画数とプレビュー可能動画数を計算
  const totalVideos = sections.reduce((total, section) => 
    total + (section.videos?.length || 0), 0
  );
  const previewVideos = sections.reduce((total, section) => 
    total + (section.videos?.filter(video => video.is_preview)?.length || 0), 0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-2xl font-bold text-purple-600">
                ShinCode
              </Link>
              <nav className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                <Link href="/" className="hover:text-purple-600">ホーム</Link>
                <span>/</span>
                <span className="text-gray-900 font-medium">{course.title}</span>
              </nav>
            </div>
            <AuthButton />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {course.title}
              </h1>
              
              {course.description && (
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  {course.description}
                </p>
              )}

              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>{totalVideos}本の動画</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>{previewVideos}本のプレビュー</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{new Date(course.created_at).toLocaleDateString('ja-JP')}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">このコースについて</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  オンデマンド動画 {totalVideos}本
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  完全無料
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  無期限アクセス
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  モバイル・PC対応
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">コース内容</h2>
            <p className="text-gray-600 mt-2">
              {sections.length}セクション • {totalVideos}本の動画
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {sections.map((section, sectionIndex) => (
              <div key={section.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {sectionIndex + 1}. {section.title}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {section.videos.length}本の動画
                  </span>
                </div>
                
                {section.description && (
                  <p className="text-gray-600 mb-4">{section.description}</p>
                )}

                <div className="space-y-2">
                  {(section.videos || []).map((video, videoIndex) => {
                    const canAccess = video.is_preview || user;
                    
                    return canAccess ? (
                      <Link
                        key={video.id}
                        href={`/courses/${id}/videos/${video.id}`}
                        className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-purple-200 hover:bg-purple-50 cursor-pointer transition-colors group"
                      >
                        <div className="flex-shrink-0">
                          {video.is_preview ? (
                            <div className="w-6 h-6 bg-green-100 text-green-600 group-hover:bg-green-200 rounded-full flex items-center justify-center text-xs transition-colors">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M8 5v10l8-5-8-5z"/>
                              </svg>
                            </div>
                          ) : (
                            <div className="w-6 h-6 bg-blue-100 text-blue-600 group-hover:bg-blue-200 rounded-full flex items-center justify-center text-xs transition-colors">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M8 5v10l8-5-8-5z"/>
                              </svg>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900 group-hover:text-purple-900 transition-colors">
                              {sectionIndex + 1}.{videoIndex + 1} {video.title}
                            </span>
                            {video.is_preview && (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                                プレビュー
                              </span>
                            )}
                          </div>
                          {video.description && (
                            <p className="text-sm mt-1 text-gray-600 group-hover:text-gray-700 transition-colors">
                              {video.description}
                            </p>
                          )}
                        </div>

                        <div className="flex-shrink-0 text-sm text-gray-500 group-hover:text-gray-600 transition-colors">
                          約5分
                        </div>
                      </Link>
                    ) : (
                      <div
                        key={video.id}
                        className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-6 h-6 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center text-xs">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-400">
                              {sectionIndex + 1}.{videoIndex + 1} {video.title}
                            </span>
                            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
                              ログイン必要
                            </span>
                          </div>
                          {video.description && (
                            <p className="text-sm mt-1 text-gray-400">
                              {video.description}
                            </p>
                          )}
                        </div>

                        <div className="flex-shrink-0 text-sm text-gray-500">
                          約5分
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        {!user && (
          <div className="mt-8 bg-purple-50 border border-purple-200 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-purple-900 mb-4">
              今すぐ学習を始めましょう！
            </h3>
            <p className="text-purple-700 mb-6">
              すべての動画コンテンツにアクセスするには、ログインが必要です。
              <br />
              Googleアカウントで簡単にサインアップできます。
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              無料で始める
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = await getCourseWithSections(id);

  if (!course) {
    return {
      title: '講座が見つかりません',
    };
  }

  return {
    title: `${course.title} - ShinCode`,
    description: course.description || `${course.title}について学習しましょう。`,
  };
}