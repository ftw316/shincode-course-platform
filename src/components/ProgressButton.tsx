"use client";

import { useState, useTransition, useEffect } from "react";
import { markVideoComplete, markVideoIncomplete } from "@/lib/actions/progress";

interface ProgressButtonProps {
  videoId: string;
  initialCompleted: boolean;
}

export default function ProgressButton({ videoId, initialCompleted }: ProgressButtonProps) {
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const [isPending, startTransition] = useTransition();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setIsCompleted(initialCompleted);
  }, [initialCompleted]);

  const handleToggleProgress = () => {
    startTransition(async () => {
      try {
        if (isCompleted) {
          await markVideoIncomplete(videoId);
          setIsCompleted(false);
        } else {
          await markVideoComplete(videoId);
          setIsCompleted(true);
        }
      } catch (error) {
        console.error('Error updating progress:', error);
        // Optionally show user-friendly error message
      }
    });
  };

  // Show loading state during initial hydration
  if (!isMounted) {
    return (
      <button
        disabled
        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-gray-400 text-white opacity-50 cursor-not-allowed"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        読み込み中...
      </button>
    );
  }

  return (
    <button
      onClick={handleToggleProgress}
      disabled={isPending}
      className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
        isCompleted
          ? 'bg-green-600 hover:bg-green-700 text-white'
          : 'bg-purple-600 hover:bg-purple-700 text-white'
      } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isPending ? (
        <>
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          更新中...
        </>
      ) : isCompleted ? (
        <>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          完了済み
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          完了にする
        </>
      )}
    </button>
  );
}