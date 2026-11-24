import React from 'react';

export default function LoadingSkeleton() {
  return (
    <div className="px-5 mt-4 space-y-4 animate-pulse">
      {/* 날씨 바 스켈레톤 */}
      <div className="h-16 bg-basak-sand/70 rounded-2xl border border-basak-border/60" />

      {/* 메인 카드 스켈레톤 */}
      <div className="bg-white rounded-3xl p-5 border border-basak-border space-y-4 shadow-soft">
        <div className="flex justify-between items-center">
          <div className="h-4 w-32 bg-basak-sand/80 rounded" />
          <div className="h-6 w-24 bg-basak-sand/80 rounded-full" />
        </div>

        <div className="flex items-center gap-6 py-4">
          <div className="w-32 h-32 rounded-full bg-basak-sand/70 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-20 bg-basak-sand rounded" />
            <div className="h-4 w-full bg-basak-sand/60 rounded" />
            <div className="h-4 w-4/5 bg-basak-sand/60 rounded" />
            <div className="h-8 w-28 bg-basak-sand/80 rounded-xl mt-2" />
          </div>
        </div>

        <div className="h-12 bg-basak-sand/50 rounded-2xl" />
      </div>

      {/* 구역 리스트 스켈레톤 */}
      <div className="space-y-3 pt-3">
        <div className="h-5 w-40 bg-basak-sand rounded" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-white rounded-2xl border border-basak-border/60 p-4 space-y-2">
            <div className="h-4 w-1/2 bg-basak-sand rounded" />
            <div className="h-2 w-full bg-basak-sand/50 rounded-full" />
            <div className="h-3 w-3/4 bg-basak-sand/40 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
