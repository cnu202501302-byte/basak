/**
 * 충남대학교 대덕캠퍼스 4개 핵심 낙엽 스팟 데이터 & 공간 보정 로직
 */

export const CNU_ZONES = [
  {
    id: 'library-baekma',
    name: '중앙도서관 앞 광장 ~ 백마교 구간',
    shortName: '중앙도서관 & 백마교',
    treeType: '플라타너스',
    sunFactor: 1.2, // 일조 보정계수 (개활지 건조 최속)
    isCushionMode: false,
    tagColor: 'orange',
    accentColor: '#D96B27',
    badgeText: '바삭함 특화 코스',
    oneLiner: '넓은 잎이 햇살에 바싹 말라 캠퍼스 최고의 크런치 사운드를 자랑해요.',
    description:
      '중앙도서관에서 백마교로 이어지는 탁 트인 메인 보행로는 일조량이 가장 풍부하여 낙엽 건조 속도가 캠퍼스 내 1위입니다. 손바닥만 한 플라타너스 잎을 밟을 때 터지는 통쾌한 파열음을 느껴보세요.',
    locationInfo: '대덕캠퍼스 중심축 보행로 · 중앙도서관 정문 앞',
    bestTime: '오후 1시 ~ 3시 (햇볕이 가장 쨍쨍할 때)',
    cautionNote: null,
  },
  {
    id: 'hannuri-meta',
    name: '한누리회관 뒤편 메타세쿼이아 길',
    shortName: '한누리 메타세쿼이아 숲길',
    treeType: '메타세쿼이아',
    sunFactor: 0.75, // 일조 보정계수 (그늘진 숲길)
    isCushionMode: true, // 바삭함 대신 '푹신함 지수'로 표시
    tagColor: 'green',
    accentColor: '#2D4739',
    badgeText: '푹신함 힐링 코스',
    oneLiner: '바삭함보다는 구름 위를 걷는 듯한 도톰하고 아늑한 쿠션감!',
    description:
      '하늘 높이 솟은 메타세쿼이아 군락 아래로 붉은 갈색 침엽이 수북이 융단처럼 깔려 있습니다. 햇볕이 덜 들어 바삭하기보다는 스펀지처럼 부드럽고 푹신한 감촉이 마음을 편안하게 해줍니다.',
    locationInfo: '학생회관 한누리회관 뒤편 숲길 산책로',
    bestTime: '오전 10시 ~ 12시 (숲 사이로 아침 햇살이 스며들 때)',
    cautionNote: null,
  },
  {
    id: 'yeongtap-agri',
    name: '영탑지 및 농대 주변 산책로',
    shortName: '영탑지 & 농생대 산책로',
    treeType: '벚나무 · 단풍나무',
    sunFactor: 0.95, // 일조 보정계수
    isCushionMode: false,
    tagColor: 'yellow',
    accentColor: '#E5A93C',
    badgeText: '고즈넉한 사색 코스',
    oneLiner: '잔잔한 호숫물과 오색 단풍잎이 어우러진 캠퍼스 최고의 감성 스팟.',
    description:
      '영탑지의 잔잔한 수변과 농대 주변의 단풍나무·벚나무 잎이 다채롭게 흩날립니다. 수분기가 살짝 남아 사각사각 은은한 소리가 나며, 벤치에 앉아 사색하거나 가을 사진을 남기기에 가장 아름답습니다.',
    locationInfo: '영탑지 수변 둘레길 및 농업생명과학대학 둘레길',
    bestTime: '오후 4시 ~ 5시 30분 (노을빛이 물드는 골든아워)',
    cautionNote: null,
  },
  {
    id: 'eng-sci-slope',
    name: '공과대학 ~ 자연대학 경사로 언덕길',
    shortName: '공대-자연대 은행나무 언덕',
    treeType: '은행나무',
    sunFactor: 0.85, // 일조 보정계수
    isCushionMode: false,
    tagColor: 'yellow',
    accentColor: '#E5A93C',
    badgeText: '황금빛 은행 터널',
    oneLiner: '노란 카펫이 장관이지만, 경사로 특성상 미끄럼 안전 확인 필수!',
    description:
      '공대 1호관에서 자연대 방면으로 이어지는 완만한 언덕길은 가을마다 찬란한 은행나무 잎으로 뒤덮입니다. 샛노란 풍경이 매력적이지만, 비가 오거나 습도가 높으면 낙엽이 매우 미끄러워집니다.',
    locationInfo: '공과대학 본관 ~ 자연과학대학 사이 경사 보행로',
    bestTime: '오전 11시 ~ 오후 2시 (환한 채광 추천)',
    cautionNote: '경사로 미끄럼 주의', // 바삭함 <= 30% 일 때 경고 배지
  },
];

/**
 * 캠퍼스 평균 바삭함 지수를 각 구역의 일조 보정계수와 특성에 맞춰 보정
 * @param {number} baseScore 캠퍼스 평균 바삭함 점수 (0~100)
 * @param {boolean} isRaining 비 여부
 */
export function calculateZoneScores(baseScore, isRaining) {
  return CNU_ZONES.map((zone) => {
    let adjustedScore;

    if (isRaining) {
      adjustedScore = Math.max(5, Math.min(25, Math.round(baseScore * zone.sunFactor)));
    } else {
      adjustedScore = Math.max(5, Math.min(100, Math.round(baseScore * zone.sunFactor)));
    }

    // 메타세쿼이아 길은 푹신함 지수로 환산: 건조할수록 약간 푹신, 습기 적당하면 쿠션 극대화
    let cushionScore = 0;
    if (zone.isCushionMode) {
      // 푹신함은 60~95 사이에서 안락하게 분포
      cushionScore = Math.round(75 + (100 - adjustedScore) * 0.2);
    }

    // 경사로 미끄럼 주의 여부 (바삭함 지수 30% 이하일 때)
    const showSlipWarning = zone.id === 'eng-sci-slope' && adjustedScore <= 30;

    return {
      ...zone,
      score: adjustedScore,
      cushionScore,
      showSlipWarning,
      statusLabel: zone.isCushionMode
        ? cushionScore >= 80
          ? '극상의 푹신함'
          : '적당한 쿠션감'
        : adjustedScore >= 71
        ? '바삭바삭 ASMR'
        : adjustedScore >= 31
        ? '은은하게 밟힘'
        : '눅눅함 (미끄럼 주의)',
    };
  });
}
