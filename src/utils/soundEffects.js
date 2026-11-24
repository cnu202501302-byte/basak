/**
 * Web Audio API 기반 실시간 낙엽 바스락(Crisp ASMR) 효과음 합성기
 * 외부 오디오 파일 없이 브라우저 오디오 엔진으로 바스락거리는 질감을 합성합니다.
 */

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * 바삭함 단계별 낙엽 밟는 소리 재생
 * @param {'crisp' | 'moderate' | 'cushion' | 'soggy'} type 
 */
export function playLeafCrunchSound(type = 'crisp') {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // 지속시간 & 파라미터 세팅
    const duration = type === 'crisp' ? 0.35 : type === 'cushion' ? 0.45 : 0.25;
    const sampleRate = ctx.sampleRate;
    const bufferSize = sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);

    // 노이즈 버퍼 생성 (바스락거리는 크랙클 질감)
    for (let i = 0; i < bufferSize; i++) {
      // 핑크/브라운 계열 노이즈 + 간헐적 스파이크(낙엽 깨지는 소리)
      const crackle = Math.random() < (type === 'crisp' ? 0.12 : 0.05) ? (Math.random() * 2 - 1) * 1.5 : 0;
      data[i] = (Math.random() * 2 - 1) * 0.4 + crackle;
    }

    const noiseNode = ctx.createBufferSource();
    noiseNode.buffer = buffer;

    // 필터 세팅: 바삭할수록 높은 주파수 대역 통과
    const filter = ctx.createBiquadFilter();
    if (type === 'crisp') {
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2800, ctx.currentTime);
      filter.Q.setValueAtTime(1.8, ctx.currentTime);
    } else if (type === 'cushion') {
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, ctx.currentTime);
      filter.Q.setValueAtTime(0.8, ctx.currentTime);
    } else {
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1600, ctx.currentTime);
      filter.Q.setValueAtTime(1.2, ctx.currentTime);
    }

    // 볼륨 엔벨로프
    const gainNode = ctx.createGain();
    const now = ctx.currentTime;
    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.exponentialRampToValueAtTime(0.35, now + 0.04);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noiseNode.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    noiseNode.start(now);
    noiseNode.stop(now + duration);
  } catch (err) {
    console.warn('Audio playback error:', err);
  }
}
