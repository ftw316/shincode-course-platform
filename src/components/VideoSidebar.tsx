import Link from "next/link";
import type { Course, Video, Section } from "@/lib/supabase/types";
import type { User } from "@supabase/supabase-js";

interface VideoSidebarProps {
  course: Course;
  allVideos: (Video & { section: Section })[];
  currentVideoId: string;
  user: User | null;
}

// Group videos by section
function groupVideosBySection(videos: (Video & { section: Section })[]) {
  const sectionMap = new Map();
  
  videos.forEach(video => {
    const sectionId = video.section.id;
    if (!sectionMap.has(sectionId)) {
      sectionMap.set(sectionId, {
        section: video.section,
        videos: []
      });
    }
    sectionMap.get(sectionId).videos.push(video);
  });

  // Convert to array and sort by section order
  return Array.from(sectionMap.values()).sort((a, b) => 
    a.section.order_index - b.section.order_index
  );
}

export default function VideoSidebar({ course, allVideos, currentVideoId, user }: VideoSidebarProps) {
  const sectionsWithVideos = groupVideosBySection(allVideos);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <Link href={`/courses/${course.id}`} className="group">
          <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
            {course.title}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 mt-1">
          {allVideos.length}本の動画
        </p>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {sectionsWithVideos.map((sectionData, sectionIndex) => (
          <div key={sectionData.section.id} className="border-b border-gray-100 last:border-b-0">
            <div className="p-4 bg-gray-50">
              <h4 className="font-medium text-gray-900 text-sm">
                {sectionIndex + 1}. {sectionData.section.title}
              </h4>
            </div>
            
            <div className="divide-y divide-gray-100">
              {sectionData.videos
                .sort((a: Video, b: Video) => a.order_index - b.order_index)
                .map((video: Video, videoIndex: number) => {
                  const canAccess = video.is_preview || user;
                  const isCurrentVideo = video.id === currentVideoId;

                  return (
                    <div
                      key={video.id}
                      className={`${isCurrentVideo ? 'bg-purple-50 border-l-4 border-l-purple-600' : ''}`}
                    >
                      {canAccess ? (
                        <Link
                          href={`/courses/${course.id}/videos/${video.id}`}
                          className={`block p-3 hover:bg-gray-50 transition-colors ${
                            isCurrentVideo ? 'hover:bg-purple-50' : ''
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className="flex-shrink-0">
                              {video.is_preview ? (
                                <div className="w-4 h-4 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs">
                                  <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M8 5v10l8-5-8-5z"/>
                                  </svg>
                                </div>
                              ) : (
                                <div className="w-4 h-4 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs">
                                  <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M8 5v10l8-5-8-5z"/>
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm truncate ${
                                isCurrentVideo ? 'font-semibold text-purple-900' : 'font-medium text-gray-900'
                              }`}>
                                {sectionIndex + 1}.{videoIndex + 1} {video.title}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                {video.is_preview && (
                                  <span className="bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded-full font-medium">
                                    プレビュー
                                  </span>
                                )}
                                <span className="text-xs text-gray-500">約5分</span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ) : (
                        <div className="p-3 opacity-50">
                          <div className="flex items-center gap-2">
                            <div className="flex-shrink-0">
                              <div className="w-4 h-4 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center text-xs">
                                <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-400 truncate">
                                {sectionIndex + 1}.{videoIndex + 1} {video.title}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded-full font-medium">
                                  ログイン必要
                                </span>
                                <span className="text-xs text-gray-400">約5分</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}