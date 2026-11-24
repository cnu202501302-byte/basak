import React from 'react';
import { ChevronRight, AlertTriangle, Feather, Sparkles } from 'lucide-react';

export default function ZoneCardList({ zones, onSelectZone }) {
  if (!zones || zones.length === 0) return null;

  return (
    <div className="px-5 mt-6 mb-8">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-base font-bold text-basak-textDark flex items-center gap-1.5">
            <span>CNU 바삭 산책로 큐레이션</span>
            <span className="text-xs font-normal text-basak-textMuted">(4대 명소)</span>
          </h2>
          <p className="text-[11px] text-basak-textMuted mt-0.5">
            실시간 일조량 및 수종별 공간 보정 지수
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {zones.map((zone) => {
          const isCushion = zone.isCushionMode;
          const displayScore = isCushion ? zone.cushionScore : zone.score;
          const scoreLabel = isCushion ? '푹신함' : '바삭함';

          // 게이지 바 색상
          let barColor = 'bg-basak-terracotta';
          if (isCushion) {
            barColor = 'bg-basak-forest';
          } else if (zone.score <= 30) {
            barColor = 'bg-slate-400';
          } else if (zone.score < 70) {
            barColor = 'bg-basak-golden';
          }

          return (
            <div
              key={zone.id}
              onClick={() => onSelectZone(zone)}
              className="group bg-white rounded-2xl p-4 border border-basak-border/80 shadow-soft hover:shadow-float transition-all cursor-pointer hover:border-basak-terracotta/40 active:scale-[0.99] relative overflow-hidden"
            >
              {/* 상단: 구역명 & 수종 배지 */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] px-2 py-0.5 rounded-md font-semibold bg-basak-sand text-basak-forest border border-basak-border/50">
                      🌿 수종: {zone.treeType}
                    </span>
                    <span className="text-[10px] text-basak-textMuted font-mono">
                      (보정계수 ×{zone.sunFactor})
                    </span>

                    {/* 경사로 미끄럼 주의 빨간색 경고 배지 */}
                    {zone.showSlipWarning && (
                      <span className="animate-pulse flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md font-bold bg-red-100 text-red-700 border border-red-300">
                        <AlertTriangle size={11} className="text-red-600" />
                        경사로 미끄럼 주의
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-basak-textDark mt-1.5 group-hover:text-basak-terracotta transition-colors flex items-center gap-1">
                    <span>{zone.name}</span>
                  </h3>
                </div>

                {/* 지수 표시 배지 */}
                <div className="text-right shrink-0">
                  <div className="text-xs font-semibold text-basak-textMuted">
                    {scoreLabel}
                  </div>
                  <div className="text-lg font-black text-basak-textDark leading-tight flex items-baseline justify-end gap-0.5">
                    <span
                      className={
                        isCushion
                          ? 'text-basak-forest'
                          : zone.score >= 71
                          ? 'text-basak-terracotta'
                          : zone.score <= 30
                          ? 'text-slate-500'
                          : 'text-basak-brown'
                      }
                    >
                      {displayScore}
                    </span>
                    <span className="text-xs font-semibold text-basak-textMuted">%</span>
                  </div>
                </div>
              </div>

              {/* 진행도 게이지 바 */}
              <div className="mt-2.5 w-full bg-basak-sand/60 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full ${barColor} rounded-full transition-all duration-700 ease-out`}
                  style={{ width: `${Math.min(100, displayScore)}%` }}
                />
              </div>

              {/* 한줄평 & 화살표 */}
              <div className="mt-3 flex items-center justify-between text-xs text-basak-textMuted pt-2 border-t border-basak-border/40">
                <p className="truncate pr-2 font-medium text-basak-textDark/80">
                  {zone.oneLiner}
                </p>
                <div className="flex items-center gap-0.5 text-basak-terracotta font-semibold text-[11px] shrink-0 group-hover:translate-x-1 transition-transform">
                  <span>팁 보기</span>
                  <ChevronRight size={13} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
