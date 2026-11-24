import React, { useState } from 'react';
import { Volume2, Layers, HelpCircle, ChevronDown, ChevronUp, Sparkles, AlertTriangle } from 'lucide-react';
import { playLeafCrunchSound } from '../utils/soundEffects';

export default function MainBasakCard({
  crispness,
  leafPile,
  weather,
  briefingMessage,
  soundEnabled,
}) {
  const [showFormula, setShowFormula] = useState(false);

  if (!crispness || !leafPile) return null;

  const { score, level, levelCode, soundTip, effectiveHumidity, isRaining } = crispness;

  // 원형 게이지 계산 (원 둘레 2 * PI * r)
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // 상태 등급별 테마 컬러 및 태그
  let gaugeColor = '#D96B27'; // 기본 테라코타 오렌지
  let levelBadgeBg = 'bg-basak-terracottaLight text-basak-terracotta border-basak-terracotta/30';

  if (levelCode === 'soggy') {
    gaugeColor = '#5A738E'; // 습기 가득한 블루그레이
    levelBadgeBg = 'bg-blue-50 text-blue-700 border-blue-200';
  } else if (levelCode === 'moderate') {
    gaugeColor = '#E5A93C'; // 골든 옐로우
    levelBadgeBg = 'bg-amber-50 text-amber-800 border-amber-200';
  } else if (levelCode === 'crisp') {
    gaugeColor = '#D96B27'; // 크런치 테라코타
    levelBadgeBg = 'bg-orange-50 text-orange-700 border-orange-300';
  }

  const handleTestSound = () => {
    if (soundEnabled) {
      playLeafCrunchSound(levelCode);
    }
  };

  return (
    <div className="px-5 mt-4">
      <div className="bg-white rounded-3xl p-5 border border-basak-border shadow-float relative overflow-hidden">
        {/* 배경 은은한 가을 낙엽 일러스트 워터마크 */}
        <div className="absolute -right-6 -bottom-6 text-8xl opacity-[0.04] pointer-events-none select-none">
          🍁
        </div>

        {/* 상단 라벨 & 적재량 배지 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-basak-forest tracking-wide">
              CAMPUS BASAK INDEX
            </span>
            <span className="text-[10px] text-basak-textMuted font-medium">대덕캠퍼스 종합</span>
          </div>

          {/* 적재량 지수 배지 (1~3단계) */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-basak-goldenLight border border-basak-golden/40 text-xs font-semibold text-basak-brown shadow-sm">
            <Layers size={12} className="text-basak-golden" />
            <span>{leafPile.badge}</span>
          </div>
        </div>

        {/* 메인 비주얼 영역: 원형 게이지 차트 & 수치 */}
        <div className="mt-5 flex items-center justify-between gap-4">
          {/* SVG 원형 게이지 */}
          <div className="relative flex items-center justify-center shrink-0">
            <svg width="150" height="150" className="transform -rotate-90">
              {/* 배경 원 */}
              <circle
                cx="75"
                cy="75"
                r={radius}
                stroke="#F1EAE0"
                strokeWidth="11"
                fill="transparent"
              />
              {/* 프로그레스 아크 */}
              <circle
                cx="75"
                cy="75"
                r={radius}
                stroke={gaugeColor}
                strokeWidth="11"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* 게이지 중앙 텍스트 */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black text-basak-textDark tracking-tight leading-none">
                {score}
                <span className="text-base font-semibold text-basak-textMuted">%</span>
              </span>
              <span className="text-[11px] font-medium text-basak-textMuted mt-1">
                바삭함 지수
              </span>
            </div>
          </div>

          {/* 우측 판정 및 인터랙션 */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="inline-block">
              <span
                className={`text-xs px-2.5 py-1 rounded-lg font-bold border ${levelBadgeBg} inline-flex items-center gap-1`}
              >
                {isRaining && <AlertTriangle size={12} className="text-red-500" />}
                {level}
              </span>
            </div>

            <p className="text-xs text-basak-textDark font-medium mt-2 leading-relaxed">
              {crispness.desc}
            </p>

            {/* 낙엽 ASMR 사운드 체험 버튼 */}
            <button
              onClick={handleTestSound}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-basak-sand hover:bg-basak-border/70 active:scale-95 transition-all text-xs font-semibold text-basak-forest group"
            >
              <Volume2 size={13} className="text-basak-terracotta group-hover:scale-110 transition-transform" />
              <span>낙엽 밟기 ASMR 듣기</span>
            </button>
          </div>
        </div>

        {/* 하단 큐레이션 브리핑 멘트 박스 */}
        <div className="mt-4 p-3.5 rounded-2xl bg-basak-bg/70 border border-basak-border/60">
          <div className="flex items-start gap-2">
            <Sparkles size={15} className="text-basak-golden shrink-0 mt-0.5" />
            <p className="text-xs font-medium text-basak-textDark leading-snug">
              {briefingMessage}
            </p>
          </div>
        </div>

        {/* 실효습도 공식 토글 아코디언 */}
        <div className="mt-3 pt-2.5 border-t border-basak-border/40">
          <button
            onClick={() => setShowFormula(!showFormula)}
            className="flex items-center justify-between w-full text-[11px] text-basak-textMuted hover:text-basak-textDark transition-colors"
          >
            <div className="flex items-center gap-1 font-medium">
              <HelpCircle size={12} className="text-basak-terracotta" />
              <span>실효습도(He: {effectiveHumidity}%) 산출 공식 보기</span>
            </div>
            {showFormula ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>

          {showFormula && (
            <div className="mt-2 p-2.5 rounded-xl bg-amber-50/50 border border-amber-200/50 text-[11px] text-basak-textMuted space-y-1.5 leading-normal">
              <p className="font-semibold text-basak-forest">
                📐 기상청 실효습도 가중 평균 공식 (r = 0.7):
              </p>
              <p className="font-mono text-[10px] text-basak-brown bg-white/70 p-1 rounded border border-amber-100">
                He = (1 - r) × (H₀ + rH₁ + r²H₂ + r³H₃ + r⁴H₄)
              </p>
              <p className="text-[10px]">
                실시간 기상청 상대습도(H₀ = {weather?.humidity}%)와 최근 5일간의 누적 습도 가중치를 반영하여 낙엽 내부의 수분 침투도를 정밀 산출합니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
