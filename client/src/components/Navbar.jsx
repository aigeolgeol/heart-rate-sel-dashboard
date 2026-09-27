import React from 'react';
import { Heart, UserCheck, LayoutDashboard, Sparkles, Layers, LogOut, ShieldCheck, User } from 'lucide-react';

export default function Navbar({ 
  currentUser,
  onLogout,
  studentSubTab, 
  setStudentSubTab,
  currentSession,
  setCurrentSession
}) {
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
                  디지털 SEL 대시보드
                </span>
              </h1>
              <p className="text-xs text-slate-400">스마트 밴드 &amp; 뇌과학 기반 회복탄력성</p>
            </div>
          </div>

          {/* User Profile Badge & Logout Controls */}
          <div className="flex items-center space-x-3">
            
            {/* Logged in User Profile Info */}
            {currentUser && (
              <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
                {currentUser.role === 'admin' ? (
                  <ShieldCheck size={16} className="text-amber-400" />
                ) : currentUser.role === 'teacher' ? (
                  <LayoutDashboard size={16} className="text-indigo-400" />
                ) : (
                  <User size={16} className="text-rose-400" />
                )}

                <div className="text-left">
                  <span className="font-bold text-slate-200">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    {currentUser.role === 'admin' 
                      ? '총괄 관리자' 
                      : currentUser.role === 'teacher' 
                      ? '교사 권한' 
                      : `5-${currentUser.classNumber}반 (${currentUser.studentNumber}번)`
                    }
                  </span>
                </div>
              </div>
            )}

            {/* Session Switcher */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 text-xs text-slate-200">
              <Layers size={14} className="text-amber-400" />
              <select
                value={currentSession}
                onChange={(e) => setCurrentSession(Number(e.target.value))}
                className="bg-slate-900 text-amber-300 text-xs font-bold rounded px-2 py-1 outline-none border border-amber-500/50 focus:border-amber-400 cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    {s}차시 {s === 8 ? '🎉 (심동이 공개)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded-xl font-bold text-xs transition-all cursor-pointer"
            >
              <LogOut size={14} />
              <span>로그아웃</span>
            </button>

          </div>

        </div>

        {/* Sub-tabs for Student View */}
        {currentUser && currentUser.role === 'student' && (
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
