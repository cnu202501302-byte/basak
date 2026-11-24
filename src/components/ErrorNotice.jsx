import React from 'react';
import { AlertCircle, RefreshCw, WifiOff } from 'lucide-react';

export default function ErrorNotice({ errorMessage, onRetry }) {
  return (
    <div className="px-5 my-8">
      <div className="bg-white rounded-3xl p-6 border border-red-200 shadow-soft text-center">
        <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 mx-auto flex items-center justify-center mb-3">
          <WifiOff size={24} />
        </div>

        <h3 className="text-base font-bold text-basak-textDark">
          기상청 실시간 데이터를 불러올 수 없습니다
        </h3>

        <p className="text-xs text-basak-textMuted mt-1.5 leading-relaxed max-w-xs mx-auto">
          {errorMessage || '공공데이터포털 기상청 초단기실황 API 통신에 일시적인 지연이 발생했습니다.'}
        </p>

        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-basak-terracotta hover:bg-basak-terracottaHover text-white text-xs font-bold shadow-md active:scale-95 transition-all"
        >
          <RefreshCw size={14} />
          <span>다시 시도하기</span>
        </button>
      </div>
    </div>
  );
}
