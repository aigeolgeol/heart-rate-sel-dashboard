import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Crown, Award, X } from 'lucide-react';
import SimdongiAvatar from './SimdongiAvatar';

export default function EvolutionModal({ student, onClose }) {
  if (!student) return null;

  useEffect(() => {
    // Launch confetti celebration
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log("Confetti trigger error:", e);
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-rose-950 text-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-amber-500/40 text-center relative animate-fadeIn">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X size={20} />
        </button>

        {/* Header Icon */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/40 text-xs font-bold mb-4 animate-pulse">
          <Sparkles size={16} />
          <span>8차시 최종 AI 진단 리포트 공개!</span>
        </div>

        <h3 className="text-2xl font-black mb-1">
          {student.name} 학생의 진짜 심동이 공개!
        </h3>
        <p className="text-xs text-slate-300 mb-6">
          지난 8차시 동안 차곡차곡 쌓은 신체 및 정서 성장 점수 결과입니다.
        </p>

        {/* Unlocked Simdongi Avatar */}
        <div className="my-6">
          <SimdongiAvatar stage={student.actualStage} size="xlarge" pulse={true} />
        </div>

        {/* Score Summary */}
        <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 my-6 grid grid-cols-3 gap-2">
          <div>
            <p className="text-[10px] text-slate-400">총 성장 점수</p>
            <p className="text-xl font-black text-rose-400">{student.currentScore}점</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400">신체 영역</p>
            <p className="text-base font-bold text-sky-400">{student.physicalScore}점</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400">정서 영역</p>
            <p className="text-base font-bold text-emerald-400">{student.emotionalScore}점</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-gradient-to-r from-amber-400 via-rose-500 to-red-600 hover:from-amber-300 hover:to-red-500 font-extrabold text-sm rounded-xl shadow-lg cursor-pointer transition-all"
        >
          나만의 회복 탄력성 진단 리포트 확인하기
        </button>

      </div>
    </div>
  );
}
