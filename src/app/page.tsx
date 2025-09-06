import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import type { Course } from "@/lib/supabase/types";
import AuthButton from "@/components/AuthButton";
import NoSSR from "@/components/NoSSR";

export default async function Home() {
  const supabase = await createClient();
  
  const { data: courses, error } = await supabase
    .from('courses')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching courses:', error);
  }
  return (
    <NoSSR fallback={
      <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
          <div className="w-full max-w-4xl flex justify-between items-center">
            <h1 className="text-4xl font-bold">ShinCode講座プラットフォーム</h1>
            <div className="py-2 px-4 rounded-md bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300">読み込み中...</div>
          </div>
          <div className="w-full max-w-4xl">
            <h2 className="text-2xl font-semibold mb-6">公開中のコース</h2>
            <div className="text-gray-600 dark:text-gray-300">読み込み中...</div>
          </div>
        </main>
      </div>
    }>
      <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
          <div className="w-full max-w-4xl flex justify-between items-center">
            <h1 className="text-4xl font-bold">ShinCode講座プラットフォーム</h1>
            <AuthButton />
          </div>
        
        <div className="w-full max-w-4xl">
          <h2 className="text-2xl font-semibold mb-6">公開中のコース</h2>
          
          {error ? (
            <p className="text-red-600 dark:text-red-400">データベース接続エラーが発生しました</p>
          ) : courses && courses.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course: Course) => (
                <div key={course.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                  {course.description && (
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{course.description}</p>
                  )}
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    作成日: {new Date(course.created_at).toLocaleDateString('ja-JP')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-300">公開中のコースがありません</p>
          )}
          </div>

          <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
          </div>
        </main>
        <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
        </footer>
      </div>
    </NoSSR>
  );
}
