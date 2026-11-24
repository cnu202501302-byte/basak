import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import WeatherSummaryBar from './components/WeatherSummaryBar';
import MainBasakCard from './components/MainBasakCard';
import ZoneCardList from './components/ZoneCardList';
import ZoneDetailModal from './components/ZoneDetailModal';
import LoadingSkeleton from './components/LoadingSkeleton';
import ErrorNotice from './components/ErrorNotice';

import { fetchCurrentWeather } from './services/kmaApi';
import {
  calculateCrispnessIndex,
  calculateLeafPileIndex,
  getBriefingMessage,
} from './utils/basakCalculator';
import { calculateZoneScores } from './data/cnuZones';

export default function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // 실시간 기상청 API 데이터 로드
  const loadWeatherData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCurrentWeather();
      setWeather(data);
    } catch (err) {
      console.error('Failed to fetch weather:', err);
      setError(err.message || '기상청 API 연동 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWeatherData();
  }, [loadWeatherData]);

  // 계산된 지수 모델링
  let crispness = null;
  let leafPile = null;
  let zones = [];
  let briefingMessage = '';

  if (weather) {
    crispness = calculateCrispnessIndex(weather);
    leafPile = calculateLeafPileIndex(new Date(), weather.windSpeed);
    zones = calculateZoneScores(crispness.score, crispness.isRaining);
    briefingMessage = getBriefingMessage(crispness, leafPile, weather);
  }

  return (
    <div className="min-h-screen bg-[#EDE7DF] py-0 sm:py-6 flex justify-center items-center">
      {/* 480px 모바일 전용 컨테이너 */}
      <main className="w-full sm:max-w-[480px] min-h-screen sm:min-h-[920px] bg-basak-bg flex flex-col justify-between shadow-2xl relative sm:rounded-[36px] overflow-hidden border-0 sm:border border-basak-border/60">
        <div className="flex-1 pb-6">
          {/* 상단 헤더 */}
          <Header
            weather={weather}
            loading={loading}
            onRefresh={loadWeatherData}
            soundEnabled={soundEnabled}
            onToggleSound={() => setSoundEnabled((prev) => !prev)}
          />

          {/* 본문 콘텐츠 상태별 분기 */}
          {loading && !weather ? (
            <LoadingSkeleton />
          ) : error && !weather ? (
            <ErrorNotice errorMessage={error} onRetry={loadWeatherData} />
          ) : (
            <>
              {/* 실시간 날씨 요약 바 */}
              <WeatherSummaryBar weather={weather} />

              {/* 메인 바삭 브리핑 카드 */}
              <MainBasakCard
                crispness={crispness}
                leafPile={leafPile}
                weather={weather}
                briefingMessage={briefingMessage}
                soundEnabled={soundEnabled}
              />

              {/* CNU 4대 핵심 구역 산책로 추천 리스트 */}
              <ZoneCardList
                zones={zones}
                onSelectZone={(zone) => setSelectedZone(zone)}
              />
            </>
          )}
        </div>

        {/* 푸터 영역 */}
        <footer className="px-5 py-4 border-t border-basak-border/40 text-center text-[11px] text-basak-textMuted bg-white/40">
          <p className="font-semibold text-basak-forest">
            바삭 (BASAK) · 충남대학교 대덕캠퍼스 낙엽 큐레이션
          </p>
          <p className="mt-0.5 text-[10px] text-basak-textMuted/80">
            데이터 출처: 기상청 초단기실황 (대전 유성구 궁동 nx:67, ny:100)
          </p>
        </footer>

        {/* 구역 상세 안내 모달 */}
        {selectedZone && (
          <ZoneDetailModal
            zone={selectedZone}
            soundEnabled={soundEnabled}
            onClose={() => setSelectedZone(null)}
          />
        )}
      </main>
    </div>
  );
}
