import React from 'react';
import { RefreshCw, MapPin, Volume2, VolumeX, Sparkles } from 'lucide-react';

export default function Header({
  weather,
  loading,
  onRefresh,
  soundEnabled,
  onToggleSound,
}) {
  return (
    <header className="px-5 pt-6 pb-4 bg-gradient-to-b from-white/80 to-transparent backdrop-blur-sm sticky top-0 z-20 border-b border-basak-border/40">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-basak-terracotta font-semibold text-xs tracking-wider uppercase">
            <span className="text-sm">🍂</span>
            <span>CNU Autumn Curation</span>
          </div>
          <h1 className="text-2xl font-black text-basak-textDark tracking-tight flex items-center gap-2 mt-0.5">
            <span>바삭</span>
            <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-basak-terracottaLight text-basak-terracotta border border-basak-terracotta/20">
              BASAK
            </span>
          </h1>
          <p className="text-xs text-basak-textMuted mt-0.5 font-medium">
            충남대학교 대덕캠퍼스 낙엽 적재량 & 바삭함 큐레이션
          </p>
        </div>

        {/* 상단 컨트롤 버튼 (사운드 토글 & 새로고침) */}
        <div className="flex items-center gap-1.5 mt-1">
          <button
            onClick={onToggleSound}
            title={soundEnabled ? '바스락 효과음 켜짐' : '효과음 꺼짐'}
            className={`p-2 rounded-xl transition-all border ${
              soundEnabled
                ? 'bg-basak-terracotta text-white border-basak-terracotta shadow-sm'
                : 'bg-white text-basak-textMuted border-basak-border hover:bg-basak-sand'
            }`}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          <button
            onClick={onRefresh}
            disabled={loading}
            title="기상청 실시간 데이터 새로고침"
            className="p-2 rounded-xl bg-white text-basak-forest border border-basak-border hover:bg-basak-sand active:scale-95 transition-all disabled:opacity-50 shadow-sm"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin text-basak-terracotta' : ''} />
          </button>
        </div>
      </div>

      {/* 기상청 API 연동 상태 배지 */}
      <div className="mt-3 flex items-center justify-between text-xs bg-white/90 backdrop-blur rounded-xl px-3 py-2 border border-basak-border/60 shadow-sm">
        <div className="flex items-center gap-1.5 text-basak-forest font-medium">
          <MapPin size={13} className="text-basak-terracotta shrink-0" />
          <span className="font-semibold text-basak-textDark">충남대 대덕캠퍼스</span>
          <span className="text-gray-300">|</span>
          <span className="text-basak-textMuted">대전 유성구 궁동</span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-basak-textMuted">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>
            {weather ? `기상청 실황 (${weather.displayTime})` : '기상청 연결 중...'}
          </span>
        </div>
      </div>
    </header>
  );
}
