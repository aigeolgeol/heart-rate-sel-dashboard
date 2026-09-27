import React from 'react';
import { Heart, UserCheck, LayoutDashboard, Sparkles, AlertTriangle, Layers } from 'lucide-react';

export default function Navbar({ 
  viewMode, 
  setViewMode, 
  studentSubTab, 
  setStudentSubTab,
  currentStudentId,
  setCurrentStudentId,
  studentsList,
  currentSession,
  setCurrentSession
}) {
  const currentStudent = studentsList.find(s => s.id === currentStudentId) || studentsList[0];

  return (
    <header className="sticky top-0 z-50 bg-slate-900 text-white shadow-lg border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-red-600 shadow-md animate-pulse-glow">
              <Heart className="w-6 h-6 text-white fill-current" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                심박수로 나를 알자
                <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold bg-rose-500/20 text-rose-300 rounded-md border border-rose-500/30">
                  초등 5학년 디지털 SEL
                </span>
              </h1>
              <p className="text-xs text-slate-400">스마트 밴드 &amp; 뇌과학 기반 신체·정서 회복탄력성</p>
            </div>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="flex items-center space-x-2 bg-slate-800/90 p-1.5 rounded-xl border border-slate-700">
            <button
              onClick={() => setViewMode('student')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium text-xs sm:text-sm transition-all duration-200 ${
                viewMode === 'student'
                  ? 'bg-rose-600 text-white shadow-md font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <UserCheck size={16} />
              <span>학생용 (갤럭시탭)</span>
            </button>

            <button
              onClick={() => setViewMode('teacher')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium text-xs sm:text-sm transition-all duration-200 ${
                viewMode === 'teacher'
                  ? 'bg-indigo-600 text-white shadow-md font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <LayoutDashboard size={16} />
              <span>교사용 대시보드</span>
            </button>
          </div>

          {/* Controls: Student Selector & Session Switcher */}
          <div className="flex items-center space-x-3">
            
            {/* Student selector (when in Student View) */}
            {viewMode === 'student' && studentsList.length > 0 && (
              <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-200">
                <span className="text-slate-400 font-medium">학생:</span>
                <select
                  value={currentStudentId}
                  onChange={(e) => setCurrentStudentId(e.target.value)}
                  className="bg-slate-900 text-white text-xs font-semibold rounded px-2 py-1 outline-none border border-slate-600 focus:border-rose-400 cursor-pointer"
                >
                  {studentsList.map((s) => (
                    <option key={s.id} value={s.id}>
                      [{s.classNumber}반] {s.name} ({s.currentScore}점 {s.hasRiskFlag ? '⚠️' : ''})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Session Switcher */}
            <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-200">
              <Layers size={14} className="text-amber-400" />
              <span className="text-slate-400 font-medium hidden md:inline">차시:</span>
              <select
                value={currentSession}
                onChange={(e) => setCurrentSession(Number(e.target.value))}
                className="bg-slate-900 text-amber-300 text-xs font-bold rounded px-2 py-1 outline-none border border-amber-500/50 focus:border-amber-400 cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    {s}차시 {s === 8 ? '🎉 (심동이 공개!)' : ''}
                  </option>
                ))}
              </select>
            </div>

          </div>

        </div>

        {/* Sub-tabs for Student View */}
        {viewMode === 'student' && (
          <div className="flex space-x-6 border-t border-slate-800 py-2">
            <button
              onClick={() => setStudentSubTab('chat')}
              className={`flex items-center gap-2 text-xs sm:text-sm font-medium py-1 px-3 rounded-md transition-colors ${
                studentSubTab === 'chat'
                  ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Heart size={15} />
              <span>① 심동이와 대화하기 (홈)</span>
            </button>

            <button
              onClick={() => setStudentSubTab('record')}
              className={`flex items-center gap-2 text-xs sm:text-sm font-medium py-1 px-3 rounded-md transition-colors ${
                studentSubTab === 'record'
                  ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles size={15} />
              <span>② 나의 성장 기록</span>
            </button>
          </div>
        )}

      </div>
    </header>
  );
}
