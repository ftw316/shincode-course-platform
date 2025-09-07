import Link from 'next/link';

export default function VideoNotFound() {
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
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            動画が見つかりません
          </h2>
          <p className="text-gray-600 mb-8">
            お探しの動画は見つかりませんでした。
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