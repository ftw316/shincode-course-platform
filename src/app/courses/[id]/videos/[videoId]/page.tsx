import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import type { Course, Section, Video, UserProgress } from "@/lib/supabase/types";

// 動的インポートでコンポーネントを遅延読み込み
const AuthButton = dynamic(() => import("@/components/AuthButton"), {
  loading: () => <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>,
});

const VideoPlayer = dynamic(() => import("@/components/VideoPlayer"), {
  loading: () => (
    <div className="aspect-video bg-gray-900 animate-pulse flex items-center justify-center">
      <div className="text-white text-lg">動画を読み込み中...</div>
    </div>
  ),
});

const VideoNavigation = dynamic(() => import("@/components/VideoNavigation"), {
  loading: () => <div className="h-16 bg-gray-100 animate-pulse"></div>,
});

const VideoSidebar = dynamic(() => import("@/components/VideoSidebar"), {
  loading: () => <div className="w-80 bg-gray-100 animate-pulse"></div>,
});

const ProgressButton = dynamic(() => import("@/components/ProgressButton"), {
  loading: () => <div className="w-32 h-10 bg-blue-200 animate-pulse rounded"></div>,
});

interface VideoWithCourse extends Video {
  section: Section & {
    course: Course;
  };
}

interface VideoPageData {
  video: VideoWithCourse;
  allVideos: (Video & { section: Section })[];
  currentIndex: number;
  progress: UserProgress | null;
}

async function getVideoWithCourse(videoId: string): Promise<VideoPageData | null> {
  const supabase = await createClient();
  
  // 最適化: 必要なフィールドのみ取得
  const { data: video, error: videoError } = await supabase
    .from('videos')
    .select(`
      id,
      title,
      description,
      youtube_url,
      youtube_video_id,
      order_index,
      is_preview,
      section:sections (
        id,
        course_id,
        title,
        order_index,
        course:courses (
          id,
          title,
          is_published
        )
      )
    `)
    .eq('id', videoId)
    .single();

  if (videoError || !video) {
    console.error('Error fetching video:', videoError);
    return null;
  }

  // Check if course is published
  if (!video.section.course.is_published) {
    return null;
  }

  // 最適化: 1つのクエリで全データ取得してN+1問題を回避
  const { data: courseSections, error: sectionsError } = await supabase
    .from('sections')
    .select(`
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
    `)
    .eq('course_id', video.section.course.id)
    .order('order_index', { ascending: true });

  if (sectionsError) {
    console.error('Error fetching course sections:', sectionsError);
    return null;
  }

  // Flatten videos from all sections and add section info
  const allVideos: (Video & { section: Section })[] = [];
  courseSections?.forEach(section => {
    section.videos?.forEach((sectionVideo: Video) => {
      allVideos.push({
        ...sectionVideo,
        section: {
          id: section.id,
          course_id: section.course_id,
          title: section.title,
          description: section.description,
          order_index: section.order_index,
          created_at: section.created_at,
          updated_at: section.updated_at
        }
      });
    });
  });

  // Sort videos by section order then video order
  allVideos.sort((a, b) => {
    if (a.section.order_index !== b.section.order_index) {
      return a.section.order_index - b.section.order_index;
    }
    return a.order_index - b.order_index;
  });

  // Find current video index
  const currentIndex = allVideos.findIndex(v => v.id === videoId);

  // Get user progress for this video
  const { data: { user } } = await supabase.auth.getUser();
  let progress = null;
  
  if (user) {
    const { data: progressData } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('video_id', videoId)
      .single();
    
    progress = progressData;
  }

  return {
    video: video as VideoWithCourse,
    allVideos,
    currentIndex,
    progress
  };
}

export default async function VideoPage({
  params,
}: {
  params: Promise<{ id: string; videoId: string }>
}) {
  const { id: courseId, videoId } = await params;
  const videoData = await getVideoWithCourse(videoId);

  if (!videoData) {
    notFound();
  }

  const { video, allVideos, currentIndex, progress } = videoData;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Check access permissions
  const canAccess = video.is_preview || user;

  if (!canAccess) {
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
                  <Link href={`/courses/${courseId}`} className="hover:text-purple-600">
                    {video.section.course.title}
                  </Link>
                  <span>/</span>
                  <span className="text-gray-900 font-medium">{video.title}</span>
                </nav>
              </div>
              <AuthButton />
            </div>
          </div>
        </nav>

        {/* Access Denied Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              ログインが必要です
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              この動画を視聴するにはログインが必要です。
              <br />
              Googleアカウントで簡単にサインアップできます。
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              ログイン / サインアップ
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
                <Link href={`/courses/${courseId}`} className="hover:text-purple-600">
                  {video.section.course.title}
                </Link>
                <span>/</span>
                <span className="text-gray-900 font-medium">{video.title}</span>
              </nav>
            </div>
            <AuthButton />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Video Player */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <VideoPlayer video={video} />
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {video.title}
                  </h1>
                  {user && (
                    <ProgressButton 
                      videoId={video.id}
                      initialCompleted={progress?.is_completed || false}
                    />
                  )}
                </div>
                
                {video.description && (
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {video.description}
                  </p>
                )}
                
                {video.is_preview && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 text-green-800">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 5v10l8-5-8-5z"/>
                      </svg>
                      <span className="font-medium">プレビュー動画</span>
                    </div>
                    <p className="text-green-700 text-sm mt-1">
                      この動画は無料でご視聴いただけます
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Video Navigation */}
            <VideoNavigation 
              allVideos={allVideos}
              currentIndex={currentIndex}
              courseId={courseId}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <VideoSidebar 
              course={video.section.course}
              allVideos={allVideos}
              currentVideoId={video.id}
              user={user}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ id: string; videoId: string }> }) {
  const { videoId } = await params;
  const videoData = await getVideoWithCourse(videoId);

  if (!videoData) {
    return {
      title: '動画が見つかりません',
    };
  }

  const { video } = videoData;

  return {
    title: `${video.title} - ${video.section.course.title} - ShinCode`,
    description: video.description || `${video.title}を学習しましょう。`,
  };
}