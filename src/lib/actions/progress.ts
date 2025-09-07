"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function markVideoComplete(videoId: string): Promise<void> {
  const supabase = await createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error('認証が必要です');
  }

  const { error } = await supabase
    .from('user_progress')
    .upsert({
      user_id: user.id,
      video_id: videoId,
      is_completed: true,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id,video_id'
    });

  if (error) {
    console.error('Error marking video complete:', error);
    throw new Error('進捗の更新に失敗しました');
  }

  // Revalidate relevant pages
  revalidatePath(`/courses/[id]/videos/[videoId]`, 'page');
  revalidatePath(`/courses/[id]`, 'page');
}

export async function markVideoIncomplete(videoId: string): Promise<void> {
  const supabase = await createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error('認証が必要です');
  }

  const { error } = await supabase
    .from('user_progress')
    .upsert({
      user_id: user.id,
      video_id: videoId,
      is_completed: false,
      completed_at: null,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id,video_id'
    });

  if (error) {
    console.error('Error marking video incomplete:', error);
    throw new Error('進捗の更新に失敗しました');
  }

  // Revalidate relevant pages
  revalidatePath(`/courses/[id]/videos/[videoId]`, 'page');
  revalidatePath(`/courses/[id]`, 'page');
}

export async function calculateCourseProgress(userId: string, courseId: string): Promise<number> {
  const supabase = await createClient();

  // Get total videos count and completed count using MCP PostgREST
  const { data, error } = await supabase.rpc('calculate_course_progress', {
    p_user_id: userId,
    p_course_id: courseId
  });

  if (error) {
    console.error('Error calculating course progress:', error);
    return 0;
  }

  const totalVideos = data?.[0]?.total_videos || 0;
  const completedVideos = data?.[0]?.completed_videos || 0;

  if (totalVideos === 0) return 0;
  
  return Math.round((completedVideos / totalVideos) * 100);
}

// Alternative implementation using direct SQL if stored procedure is not available
export async function calculateCourseProgressDirect(userId: string, courseId: string): Promise<number> {
  const supabase = await createClient();

  // Get all videos for the course
  const { data: videos, error: videosError } = await supabase
    .from('videos')
    .select(`
      id,
      section:sections!inner (
        course_id
      )
    `)
    .eq('section.course_id', courseId);

  if (videosError || !videos) {
    console.error('Error fetching course videos:', videosError);
    return 0;
  }

  const totalVideos = videos.length;
  
  if (totalVideos === 0) return 0;

  // Get completed videos for this user
  const videoIds = videos.map(v => v.id);
  const { data: completedProgress, error: progressError } = await supabase
    .from('user_progress')
    .select('video_id')
    .eq('user_id', userId)
    .eq('is_completed', true)
    .in('video_id', videoIds);

  if (progressError) {
    console.error('Error fetching user progress:', progressError);
    return 0;
  }

  const completedVideos = completedProgress?.length || 0;
  
  return Math.round((completedVideos / totalVideos) * 100);
}