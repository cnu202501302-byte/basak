import React from 'react';
import { Thermometer, Droplets, Wind, CloudRain, Sun, CloudDrizzle } from 'lucide-react';

export default function WeatherSummaryBar({ weather }) {
  if (!weather) return null;

  const { temperature, humidity, windSpeed, rain1h, rainType } = weather;

  // 강수 형태 라벨 및 아이콘
  let rainLabel = '강수 없음';
  let RainIcon = Sun;
  let rainColor = 'text-amber-500';

  if (rainType === 1) {
    rainLabel = `비 ${rain1h > 0 ? `(${rain1h}mm)` : ''}`;
    RainIcon = CloudRain;
    rainColor = 'text-blue-500 font-semibold';
  } else if (rainType === 2) {
    rainLabel = '비/눈';
    RainIcon = CloudRain;
    rainColor = 'text-blue-500 font-semibold';
  } else if (rainType === 3) {
    rainLabel = '눈';
    RainIcon = CloudRain;
    rainColor = 'text-sky-500 font-semibold';
  } else if (rainType === 5) {
    rainLabel = '빗방울';
    RainIcon = CloudDrizzle;
    rainColor = 'text-blue-400 font-medium';
  }

  return (
    <div className="px-5 mt-3">
      <div className="bg-white/80 backdrop-blur rounded-2xl p-3 border border-basak-border/70 shadow-soft">
        <div className="grid grid-cols-4 gap-2 text-center divide-x divide-basak-border/50">
          {/* 기온 */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-[11px] text-basak-textMuted mb-0.5">
              <Thermometer size={12} className="text-basak-terracotta" />
              <span>기온</span>
            </div>
            <div className="text-sm font-bold text-basak-textDark">
              {temperature}
              <span className="text-xs font-normal ml-0.5">℃</span>
            </div>
          </div>

          {/* 습도 */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-[11px] text-basak-textMuted mb-0.5">
              <Droplets size={12} className="text-blue-500" />
              <span>습도</span>
            </div>
            <div className="text-sm font-bold text-basak-textDark">
              {humidity}
              <span className="text-xs font-normal ml-0.5">%</span>
            </div>
          </div>

          {/* 풍속 */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-[11px] text-basak-textMuted mb-0.5">
              <Wind size={12} className="text-basak-forest" />
              <span>풍속</span>
            </div>
            <div className="text-sm font-bold text-basak-textDark">
              {windSpeed}
              <span className="text-xs font-normal ml-0.5">m/s</span>
            </div>
          </div>

          {/* 강수 */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-[11px] text-basak-textMuted mb-0.5">
              <RainIcon size={12} className={rainColor} />
              <span>하늘</span>
            </div>
            <div className={`text-xs truncate max-w-full px-1 ${rainColor}`}>
              {rainLabel}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
