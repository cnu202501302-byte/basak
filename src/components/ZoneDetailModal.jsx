import React from 'react';
import { X, MapPin, Clock, Info, AlertTriangle, Sparkles, Volume2, TreeDeciduous } from 'lucide-react';
import { playLeafCrunchSound } from '../utils/soundEffects';

export default function ZoneDetailModal({ zone, soundEnabled, onClose }) {
  if (!zone) return null;

  const isCushion = zone.isCushionMode;
  const displayScore = isCushion ? zone.cushionScore : zone.score;
  const scoreLabel = isCushion ? '푹신함 지수' : '바삭함 지수';

  const handlePlaySound = () => {
    if (soundEnabled) {
      if (isCushion) {
        playLeafCrunchSound('cushion');
      } else if (zone.score <= 30) {
        playLeafCrunchSound('soggy');
      } else if (zone.score >= 71) {
        playLeafCrunchSound('crisp');
      } else {
        playLeafCrunchSound('moderate');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm transition-opacity">
      <div
        className="bg-white w-full max-w-[460px] rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-basak-border transform transition-transform max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 상단 닫기 버튼 및 라벨 */}
        <div className="flex items-center justify-between pb-3 border-b border-basak-border/50">
          <div className="flex items-center gap-1.5 text-xs font-bold text-basak-terracotta">
            <TreeDeciduous size={15} />
            <span>CNU 낙엽 스팟 상세 가이드</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-basak-sand text-basak-textMuted transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* 구역 타이틀 */}
        <div className="mt-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-basak-terracottaLight text-basak-terracotta border border-basak-terracotta/20">
              {zone.treeType}
            </span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-basak-sand text-basak-forest">
              일조 보정계수 {zone.sunFactor}
            </span>
            {zone.showSlipWarning && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-300 flex items-center gap-1">
                <AlertTriangle size={12} />
                경사로 미끄럼 주의
              </span>
            )}
          </div>

          <h3 className="text-lg font-black text-basak-textDark mt-2">
            {zone.name}
          </h3>
        </div>

        {/* 메인 지수 표시 카드 */}
        <div className="mt-4 p-4 rounded-2xl bg-basak-bg border border-basak-border/70 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-basak-textMuted">{scoreLabel}</span>
            <div className="text-3xl font-black text-basak-textDark mt-0.5">
              {displayScore}
              <span className="text-lg font-semibold text-basak-textMuted ml-1">%</span>
            </div>
            <p className="text-xs font-semibold text-basak-terracotta mt-0.5">
              {zone.statusLabel}
            </p>
          </div>

          {/* 소리 듣기 버튼 */}
          <button
            onClick={handlePlaySound}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-basak-forest border border-basak-border shadow-sm hover:bg-basak-sand active:scale-95 transition-all text-xs font-bold"
          >
            <Volume2 size={15} className="text-basak-terracotta" />
            <span>이 구역 소리 체험</span>
          </button>
        </div>

        {/* 상세 설명 */}
        <div className="mt-4 text-xs text-basak-textDark font-medium leading-relaxed bg-white rounded-xl p-3 border border-basak-border/40">
          {zone.description}
        </div>

        {/* 코스 정보 박스 */}
        <div className="mt-4 space-y-2.5 text-xs text-basak-textDark">
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-basak-sand/50">
            <MapPin size={15} className="text-basak-terracotta shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-basak-forest">상세 위치</span>
              <span className="text-basak-textMuted">{zone.locationInfo}</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-basak-sand/50">
            <Clock size={15} className="text-basak-golden shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-basak-forest">추천 방문 시간</span>
              <span className="text-basak-textMuted">{zone.bestTime}</span>
            </div>
          </div>

          {zone.showSlipWarning && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200">
              <AlertTriangle size={15} className="text-red-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-red-700">미끄럼 안전 경고</span>
                <span className="text-red-600 text-[11px] leading-tight">
                  현재 바삭함 지수가 30% 이하로 낮아 낙엽이 젖어 있습니다. 공대~자연대 언덕 경사로에서는 미끄러지지 않도록 난간을 잡거나 보폭을 좁혀 이동하세요.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 하단 닫기 버튼 */}
        <button
          onClick={onClose}
          className="mt-6 w-full py-3 rounded-2xl bg-basak-forest text-white font-bold text-sm hover:bg-basak-forest/90 active:scale-[0.98] transition-all shadow-md"
        >
          확인 완료
        </button>
      </div>
    </div>
  );
}
