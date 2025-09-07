import Link from 'next/link';

export default function CourseNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <div className="mx-auto h-32 w-32 text-gray-400 mb-8">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            講座が見つかりません
          </h2>
          <p className="text-gray-600 mb-8">
            お探しの講座は見つかりませんでした。
            <br />
            削除されたか、URLが間違っている可能性があります。
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-block"
          >
            ホームに戻る
          </Link>
          <p className="text-sm text-gray-500">
            または、他の講座を探してみましょう
          </p>
        </div>
      </div>
    </div>
  );
}