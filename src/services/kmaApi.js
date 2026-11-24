/**
 * 기상청 초단기실황조회 API 연동 서비스
 * 충남대학교 대덕캠퍼스 (대전광역시 유성구 궁동)
 * nx = 67, ny = 100
 */

const API_BASE_URL = '/api/kma/getUltraSrtNcst';
const SERVICE_KEY = '8504744efdfb3a05e92169030e114bcaa3a97c40ce2ae3fba6debf77155b90f7';
const NX = 67;
const NY = 100;

/**
 * 기상청 초단기실황 base_date, base_time 계산
 * 매시 10분 이후에 데이터가 생성되므로:
 * - 분(minute) < 10: 1시간 전 (HH-1 + "00")
 * - 분(minute) >= 10: 현재 시각 (HH + "00")
 * - 00시 10분 미만: 어제 날짜 2300
 */
export function getKmaBaseDateTime(now = new Date()) {
  const target = new Date(now.getTime());
  const minutes = target.getMinutes();

  if (minutes < 10) {
    target.setHours(target.getHours() - 1);
  }

  const year = target.getFullYear();
  const month = String(target.getMonth() + 1).padStart(2, '0');
  const day = String(target.getDate()).padStart(2, '0');
  const hours = String(target.getHours()).padStart(2, '0');

  return {
    baseDate: `${year}${month}${day}`,
    baseTime: `${hours}00`,
    displayDate: `${year}.${month}.${day}`,
    displayTime: `${hours}:00`,
  };
}

/**
 * 초단기실황 데이터 요청
 */
export async function fetchCurrentWeather() {
  const { baseDate, baseTime, displayDate, displayTime } = getKmaBaseDateTime();

  const params = new URLSearchParams({
    serviceKey: SERVICE_KEY,
    pageNo: '1',
    numOfRows: '10',
    dataType: 'JSON',
    base_date: baseDate,
    base_time: baseTime,
    nx: String(NX),
    ny: String(NY),
  });

  const requestUrl = `${API_BASE_URL}?${params.toString()}`;

  const response = await fetch(requestUrl);
  if (!response.ok) {
    throw new Error(`기상청 API 응답 오류: 상태 코드 ${response.status}`);
  }

  const data = await response.json();
  const header = data?.response?.header;

  if (header?.resultCode !== '00') {
    throw new Error(header?.resultMsg || '기상청 API 데이터 조회 실패');
  }

  const items = data?.response?.body?.items?.item || [];

  // 각 관측값 추출 (T1H, REH, RN1, WSD, PTY)
  const weatherMap = {};
  items.forEach((item) => {
    weatherMap[item.category] = parseFloat(item.obsrValue);
  });

  const parsedData = {
    temperature: weatherMap.T1H ?? 14.5, // 기온 (℃)
    humidity: weatherMap.REH ?? 55,       // 상대습도 (%)
    rain1h: weatherMap.RN1 ?? 0,          // 1시간 강수량 (mm)
    windSpeed: weatherMap.WSD ?? 2.1,     // 풍속 (m/s)
    rainType: weatherMap.PTY ?? 0,        // 강수 형태 (0: 없음, 1: 비, 2: 비/눈, 3: 눈, 5: 빗방울 등)
    baseDate,
    baseTime,
    displayDate,
    displayTime,
    fetchedAt: new Date().toISOString(),
  };

  return parsedData;
}
