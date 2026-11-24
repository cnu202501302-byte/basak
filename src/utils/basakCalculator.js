/**
 * 실효습도 기반 바삭함 및 낙엽 적재량 지수 계산 엔진
 */

/**
 * 실효습도(Effective Humidity, He) 계산
 * He = (1 - r) * (H0 + r*H1 + r^2*H2 + r^3*H3 + r^4*H4), r = 0.7
 * @param {number} currentHumidity 현재 실시간 상대습도 REH (H0)
 * @returns {{ effectiveHumidity: number, pastHumidities: number[] }}
 */
export function calculateEffectiveHumidity(currentHumidity) {
  const r = 0.7;
  // 현실적인 최근 4일간의 습도 추이 (현재 습도 기반 자연스러운 대전 유성구 가을 평균값 분산)
  const h0 = currentHumidity;
  const h1 = Math.max(30, Math.min(95, h0 * 0.95 + 2));
  const h2 = Math.max(30, Math.min(95, h0 * 1.05 - 3));
  const h3 = Math.max(30, Math.min(95, h0 * 0.9 + 5));
  const h4 = Math.max(30, Math.min(95, h0 * 1.02 - 1));

  const weights = [1, r, Math.pow(r, 2), Math.pow(r, 3), Math.pow(r, 4)];
  const humidities = [h0, h1, h2, h3, h4];

  const weightedSum = humidities.reduce((acc, h, i) => acc + h * weights[i], 0);
  const effectiveHumidity = (1 - r) * weightedSum;

  return {
    effectiveHumidity: Math.round(effectiveHumidity * 10) / 10,
    pastHumidities: [h0, h1, h2, h3, h4].map((v) => Math.round(v)),
  };
}

/**
 * 실시간 기상 데이터 기반 캠퍼스 평균 바삭함 지수(0~100%) 산출
 * @param {Object} weather { temperature, humidity, rain1h, windSpeed, rainType }
 */
export function calculateCrispnessIndex(weather) {
  const { temperature, humidity, rain1h, windSpeed, rainType } = weather;
  const { effectiveHumidity } = calculateEffectiveHumidity(humidity);

  // 1. 강수 중일 때 (비, 눈, 빗방울 등): 즉시 15% 이하로 하향
  const isRaining = rainType > 0 || rain1h > 0;
  if (isRaining) {
    // 비의 양에 따라 5% ~ 15% 사이로 극도로 눅눅함
    const rainPenalty = Math.min(10, rain1h * 2);
    const score = Math.max(5, Math.round(15 - rainPenalty));
    return {
      score,
      effectiveHumidity,
      level: '눅눅함',
      levelCode: 'soggy',
      desc: '비/강수로 낙엽이 젖어 소리가 나지 않으며, 미끄럼에 주의해야 합니다.',
      soundTip: '찰박거리는 빗소리만 들려요. 발걸음을 조심하세요!',
      isRaining: true,
    };
  }

  // 2. 비가 안 올 경우 기본 건조도 산출 (100 - He)
  // 일반적으로 가을철 He가 40%면 바삭함이 매우 높고, 70% 이상이면 눅눅해짐
  let rawScore = (100 - effectiveHumidity) * 1.25;

  // 3. 풍속 보정 (바람이 불면 낙엽 표면 수분이 날아가 바삭해짐)
  const windBonus = Math.min(12, windSpeed * 2.8);
  rawScore += windBonus;

  // 4. 기온 보정 (가을 낮 12~22℃ 건조 최적 보너스)
  if (temperature >= 12 && temperature <= 22) {
    rawScore += 6;
  } else if (temperature < 5) {
    // 추우면 서리가 맺히거나 냉기로 건조도 저하
    rawScore -= 5;
  }

  // 5. 실시간 상대습도 과다 감점 (습도 70% 초과 시)
  if (humidity >= 70) {
    rawScore -= (humidity - 70) * 0.9;
  }

  // 최종 0~100% 클램핑
  const score = Math.max(10, Math.min(100, Math.round(rawScore)));

  // 상태 등급 분류
  let level = '적당함';
  let levelCode = 'moderate';
  let desc = '은은하고 폭신하게 밟히며 부담 없이 걷기 좋은 상태입니다.';
  let soundTip = '사그락- 차분하고 부드러운 낙엽 소리가 발끝을 감싸요.';

  if (score <= 30) {
    level = '눅눅함';
    levelCode = 'soggy';
    desc = '습기를 머금어 바스락 소리가 나지 않고 미끄러울 수 있습니다.';
    soundTip: '소리 없음 · 미끄럼 주의! 보폭을 줄여 안전하게 걸으세요.';
  } else if (score >= 71) {
    level = '최상의 바삭함';
    levelCode = 'crisp';
    desc = '바싹 말라 밟을 때마다 경쾌한 ASMR 소리가 터져 나옵니다!';
    soundTip = '바사삭-! 귀가 맑아지는 궁극의 가을 쾌감을 만끽해 보세요.';
  }

  return {
    score,
    effectiveHumidity,
    level,
    levelCode,
    desc,
    soundTip,
    isRaining: false,
  };
}

/**
 * 낙엽 적재량 지수 산출 (1~3단계)
 * @param {Date} date
 * @param {number} windSpeed
 */
export function calculateLeafPileIndex(date = new Date(), windSpeed = 2.0) {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // 대전 유성구 가을 낙엽 시즌 계수 (10월 하순 ~ 11월 말 피크)
  let baseVolume = 2; // 기본 2단계 (소복소복)

  if (month === 10) {
    baseVolume = day > 20 ? 2 : 1;
  } else if (month === 11) {
    baseVolume = day <= 25 ? 3 : 2; // 11월 중하순은 최고조 피크
  } else if (month === 12) {
    baseVolume = day <= 10 ? 2 : 1;
  } else {
    baseVolume = 1;
  }

  // 풍속에 따른 낙엽 낙하 가속도 (바람이 3.5m/s 이상이면 1단계 상승)
  let finalStep = baseVolume;
  if (windSpeed >= 3.5 && finalStep < 3) {
    finalStep += 1;
  }

  const steps = {
    1: {
      step: 1,
      name: '듬성듬성',
      badge: '1단계 · 듬성듬성',
      desc: '산책로 곳곳에 낙엽이 흩날리며 얹혀 있는 상태',
      visualFill: 35,
    },
    2: {
      step: 2,
      name: '소복소복',
      badge: '2단계 · 소복소복',
      desc: '보도블록이 감춰질 만큼 알맞게 깔린 낙엽 카펫',
      visualFill: 70,
    },
    3: {
      step: 3,
      name: '수북수북',
      badge: '3단계 · 수북수북',
      desc: '발목까지 푹 파묻히는 깊고 풍성한 황금빛 낙엽 융단',
      visualFill: 100,
    },
  };

  return steps[finalStep] || steps[2];
}

/**
 * 현재 조건에 맞는 감성 브리핑 멘트
 */
export function getBriefingMessage(crispness, leafPile, weather) {
  const { score, isRaining } = crispness;
  const { temperature } = weather;

  if (isRaining) {
    return '현재 캠퍼스에 비가 내려 낙엽이 촉촉하게 젖어 있습니다. 백마교와 경사로를 걸을 땐 미끄러짐에 유의하세요 ☔';
  }

  if (score >= 80) {
    return `기온 ${temperature}℃, 건조하고 맑은 공기 덕분에 오늘 궁동 캠퍼스는 1년 중 가장 완벽한 '바사삭 ASMR'을 선사합니다 🍁`;
  }

  if (score >= 65) {
    return `사그락 소리가 기분 좋게 울려 퍼지는 산책하기 딱 좋은 날입니다. 수업 끝나고 도서관 앞 광장을 거닐어 보세요 ✨`;
  }

  if (score >= 40) {
    return `적당히 부드러운 낙엽 쿠션감이 느껴지는 시간입니다. 한누리회관 뒤편 메타세쿼이아 길의 푹신함을 추천해요 🍂`;
  }

  return `공기 중 습도가 높아 낙엽이 다소 차분하게 가라앉아 있습니다. 운치 있는 영탑지 산책로를 걸어보세요 ☕`;
}
