import type { Video } from "@/lib/supabase/types";

interface VideoPlayerProps {
  video: Video;
}

// YouTube動画IDの抽出
function getYouTubeVideoId(url: string): string | null {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// YouTube埋め込みURL生成
function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=0`;
}

export default function VideoPlayer({ video }: VideoPlayerProps) {
  const videoId = video.youtube_video_id || getYouTubeVideoId(video.youtube_url);
  
  if (!videoId) {
    return (
      <div className="aspect-video bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg font-medium mb-2">動画を読み込めませんでした</p>
          <p className="text-gray-300">YouTube URLが正しくない可能性があります</p>
        </div>
      </div>
    );
  }

  const embedUrl = getYouTubeEmbedUrl(videoId);

  return (
    <div className="aspect-video bg-black">
      <iframe
        src={embedUrl}
        title={video.title}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}