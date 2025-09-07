import Link from "next/link";
import type { Video, Section } from "@/lib/supabase/types";

interface VideoNavigationProps {
  allVideos: (Video & { section: Section })[];
  currentIndex: number;
  courseId: string;
}

export default function VideoNavigation({ allVideos, currentIndex, courseId }: VideoNavigationProps) {
  const previousVideo = currentIndex > 0 ? allVideos[currentIndex - 1] : null;
  const nextVideo = currentIndex < allVideos.length - 1 ? allVideos[currentIndex + 1] : null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {previousVideo ? (
            <Link
              href={`/courses/${courseId}/videos/${previousVideo.id}`}
              className="inline-flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-purple-200 hover:bg-purple-50 transition-colors group w-full max-w-md"
            >
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-gray-400 group-hover:text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm text-gray-500 mb-1">前の動画</p>
                <p className="font-medium text-gray-900 group-hover:text-purple-900 truncate">
                  {previousVideo.title}
                </p>
              </div>
            </Link>
          ) : (
            <div className="inline-flex items-center gap-3 p-4 rounded-lg border border-gray-100 w-full max-w-md opacity-50">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm text-gray-400 mb-1">前の動画</p>
                <p className="font-medium text-gray-400">
                  最初の動画です
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex-shrink-0 mx-4">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">進捗</p>
            <p className="text-2xl font-bold text-purple-600">
              {currentIndex + 1} / {allVideos.length}
            </p>
          </div>
        </div>

        <div className="flex-1 flex justify-end">
          {nextVideo ? (
            <Link
              href={`/courses/${courseId}/videos/${nextVideo.id}`}
              className="inline-flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-purple-200 hover:bg-purple-50 transition-colors group w-full max-w-md"
            >
              <div className="flex-1 text-right">
                <p className="text-sm text-gray-500 mb-1">次の動画</p>
                <p className="font-medium text-gray-900 group-hover:text-purple-900 truncate">
                  {nextVideo.title}
                </p>
              </div>
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-gray-400 group-hover:text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ) : (
            <div className="inline-flex items-center gap-3 p-4 rounded-lg border border-gray-100 w-full max-w-md opacity-50">
              <div className="flex-1 text-right">
                <p className="text-sm text-gray-400 mb-1">次の動画</p>
                <p className="font-medium text-gray-400">
                  最後の動画です
                </p>
              </div>
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}