import React from 'react';
import { Heart, Crown, Sparkles, Flame, ShieldCheck } from 'lucide-react';

export default function SimdongiAvatar({ stage = 1, size = 'medium', isRevealed = false, pulse = true }) {
  // Stage Configs
  const stageInfo = {
    1: {
      title: "약한 하트 (초기)",
      desc: "내 몸의 신호에 귀를 기울이기 시작한 수줍은 심동이",
      color: "from-pink-400 to-rose-400",
      glowColor: "rgba(244, 114, 182, 0.4)",
      badge: "1단계",
      bgGradient: "bg-gradient-to-tr from-pink-100 to-rose-50",
      borderColor: "border-pink-300"
    },
    2: {
      title: "건강한 하트 (중기)",
      desc: "규칙적인 운동과 마음 되돌아보기로 튼튼해진 심동이",
      color: "from-rose-500 to-red-500",
      glowColor: "rgba(244, 63, 94, 0.6)",
      badge: "2단계",
      bgGradient: "bg-gradient-to-tr from-rose-100 to-red-50",
      borderColor: "border-rose-300"
    },
    3: {
      title: "강한 하트 (후기)",
      desc: "높은 회복 탄력성과 감정 조절 능력을 갖춘 당당한 심동이",
      color: "from-red-600 to-amber-500",
      glowColor: "rgba(239, 68, 68, 0.8)",
      badge: "3단계",
      bgGradient: "bg-gradient-to-tr from-red-100 to-amber-50",
      borderColor: "border-amber-300"
    },
    4: {
      title: "전설의 하트 (마무리)",
      desc: "자기인식과 자기관리가 일상이 된 마스터 심동이!",
      color: "from-amber-400 via-orange-500 to-red-600",
      glowColor: "rgba(245, 158, 11, 0.9)",
      badge: "4단계 (전설)",
      bgGradient: "bg-gradient-to-tr from-amber-100 via-orange-50 to-amber-200",
      borderColor: "border-amber-400"
    }
  };

  const current = stageInfo[stage] || stageInfo[1];

  const sizeClasses = {
    small: "w-16 h-16 text-xl",
    medium: "w-32 h-32 text-3xl",
    large: "w-48 h-48 text-5xl",
    xlarge: "w-64 h-64 text-6xl"
  };

  const iconSizes = {
    small: 32,
    medium: 64,
    large: 96,
    xlarge: 128
  };

  return (
    <div className="flex flex-col items-center justify-center group relative">
      {/* Halo Effect for Stage 4 */}
      {stage === 4 && (
        <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-amber-300 via-orange-400 to-yellow-300 blur-xl opacity-60 animate-pulse" />
      )}

      {/* Main Avatar Container */}
      <div 
        className={`relative flex items-center justify-center rounded-full p-4 border-4 shadow-xl transition-all duration-500 ${current.bgGradient} ${current.borderColor} ${sizeClasses[size]} ${pulse ? 'animate-heartbeat' : ''}`}
        style={{ boxShadow: `0 0 25px ${current.glowColor}` }}
      >
        {/* Crown for Stage 4 */}
        {stage === 4 && (
          <div className="absolute -top-6 text-amber-500 animate-bounce">
            <Crown size={size === 'large' || size === 'xlarge' ? 44 : 24} className="fill-amber-400 text-amber-600 drop-shadow-md" />
          </div>
        )}

        {/* Floating Sparkles for Stage 3 & 4 */}
        {(stage >= 3) && (
          <div className="absolute -top-2 -right-2 text-amber-400 animate-spin" style={{ animationDuration: '6s' }}>
            <Sparkles size={24} />
          </div>
        )}

        {/* Heart Icon with Gradient Effect */}
        <div className={`relative flex items-center justify-center bg-gradient-to-br ${current.color} text-white rounded-full p-4 shadow-inner`}>
          <Heart 
            size={iconSizes[size] || 64} 
            className="fill-current transform hover:scale-110 transition-transform duration-300 drop-shadow-lg" 
          />
          
          {/* Face Expression */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white pointer-events-none select-none font-bold">
            {stage === 1 && <span className="text-sm sm:text-base opacity-90 mt-1">◕ ‿ ◕</span>}
            {stage === 2 && <span className="text-base sm:text-lg opacity-95 mt-1">♥ ‿ ♥</span>}
            {stage === 3 && <span className="text-lg sm:text-xl font-extrabold mt-1">★ ‿ ★</span>}
            {stage === 4 && <span className="text-xl sm:text-2xl font-black mt-1">👑 ‿ 👑</span>}
          </div>
        </div>
      </div>

      {/* Stage Badge */}
      <div className="mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 text-white font-semibold text-xs sm:text-sm shadow-md border border-slate-700">
        {stage === 4 ? <Flame size={14} className="text-amber-400 fill-amber-400" /> : <ShieldCheck size={14} className="text-rose-400" />}
        <span>심동이 {current.badge}</span>
      </div>

      {/* Description text if medium or larger */}
      {(size === 'large' || size === 'xlarge') && (
        <div className="mt-2 text-center max-w-xs">
          <p className="font-bold text-slate-800 text-base">{current.title}</p>
          <p className="text-xs text-slate-500 mt-0.5">{current.desc}</p>
        </div>
      )}
    </div>
  );
}
