import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  School, 
  Key, 
  RotateCcw, 
  Search, 
  CheckCircle2, 
  AlertCircle,
  X,
  Layers
} from 'lucide-react';

export default function AdminDashboardView({ currentSession, onSessionChange }) {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('teachers'); // 'teachers' | 'students' | 'classes'
  const [searchQuery, setSearchQuery] = useState('');

  // Password reset modal state
  const [resetTarget, setResetTarget] = useState(null); // { id, name, username, role }
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [resetMsg, setResetMsg] = useState('');

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/overview');
      const data = await res.json();
      setOverview(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const handleResetPasswordSubmit = async () => {
    if (!resetTarget || !newPasswordInput) return;
    try {
      const res = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: resetTarget.id,
          userRole: resetTarget.role,
          newPassword: newPasswordInput
        })
      });

      const data = await res.json();
      if (data.success) {
        setResetMsg(data.message);
        setTimeout(() => {
          setResetTarget(null);
          setNewPasswordInput('');
          setResetMsg('');
          fetchOverview();
        }, 1500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !overview) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 text-center text-slate-500">
        관리자 데이터 로딩 중...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-8">
      
      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black">총괄 관리자(Admin) 마스터 패널</h2>
            <p className="text-xs text-amber-100 mt-1">
              전체 교사 계정 관리, 학급 개설 현황, 학생 계정 정보 및 비밀번호 리셋 총괄
            </p>
          </div>
        </div>

        {/* Global Session Switcher for Admin */}
        <div className="bg-slate-900/80 px-4 py-2 rounded-2xl border border-amber-400/40 text-xs flex items-center gap-2">
          <Layers size={16} className="text-amber-400" />
          <span>전체 수업 진행:</span>
          <select
            value={currentSession}
            onChange={(e) => onSessionChange(Number(e.target.value))}
            className="bg-slate-800 text-amber-300 font-bold px-2 py-1 rounded border border-amber-500/50 outline-none"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
              <option key={s} value={s}>{s}차시 {s === 8 ? '(심동이 공개)' : ''}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">등록된 교사 계정</p>
            <p className="text-3xl font-black text-indigo-600 mt-1">{overview.stats.totalTeachers}명</p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
            <Users size={24} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">개설된 학급 수</p>
            <p className="text-3xl font-black text-amber-600 mt-1">{overview.stats.totalClasses}개 학급</p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
            <School size={24} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">등록된 학생 수</p>
            <p className="text-3xl font-black text-rose-600 mt-1">{overview.stats.totalStudents}명</p>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
            <Users size={24} />
          </div>
        </div>
      </div>

      {/* Main Control Panel Tabs */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Tab Switcher & Search Bar */}
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('teachers')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'teachers'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              교사 계정 관리 ({overview.teachers.length})
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'students'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              학생 계정 관리 ({overview.students.length})
            </button>
            <button
              onClick={() => setActiveTab('classes')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'classes'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              학급 개설 현황 ({overview.classes.length})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-3 text-slate-400" size={15} />
            <input 
              type="text" 
              placeholder="이름 또는 아이디 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* TAB 1: TEACHERS TABLE */}
        {activeTab === 'teachers' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/80 text-slate-600 font-bold border-b border-slate-200">
                  <th className="py-3.5 px-4">교사 ID</th>
                  <th className="py-3.5 px-4">아이디</th>
                  <th className="py-3.5 px-4">이름</th>
                  <th className="py-3.5 px-4">소속 학교</th>
                  <th className="py-3.5 px-4">담당 학급</th>
                  <th className="py-3.5 px-4 text-center">비밀번호 초기화</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {overview.teachers
                  .filter(t => t.name.includes(searchQuery) || t.username.includes(searchQuery))
                  .map(t => (
                    <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-500">{t.id}</td>
                      <td className="py-3 px-4 font-bold text-indigo-600">{t.username}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{t.name}</td>
                      <td className="py-3 px-4 text-slate-600">{t.school}</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 font-bold rounded-md">
                          {t.managedClasses.map(c => `5-${c}반`).join(', ') || '개설 학급 없음'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => setResetTarget({ id: t.id, name: t.name, username: t.username, role: 'teacher' })}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg shadow-sm flex items-center gap-1.5 mx-auto transition-colors"
                        >
                          <Key size={13} />
                          <span>비밀번호 변경</span>
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: STUDENTS TABLE */}
        {activeTab === 'students' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/80 text-slate-600 font-bold border-b border-slate-200">
                  <th className="py-3.5 px-4">학생 ID</th>
                  <th className="py-3.5 px-4">학급</th>
                  <th className="py-3.5 px-4">출석번호</th>
                  <th className="py-3.5 px-4">이름</th>
                  <th className="py-3.5 px-4">로그인 아이디</th>
                  <th className="py-3.5 px-4">현재 점수</th>
                  <th className="py-3.5 px-4 text-center">비밀번호 초기화</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {overview.students
                  .filter(s => s.name.includes(searchQuery) || s.username.includes(searchQuery))
                  .map(s => (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-500">{s.id}</td>
                      <td className="py-3 px-4 font-semibold text-slate-700">5-{s.classNumber}반</td>
                      <td className="py-3 px-4 font-semibold text-slate-600">{s.studentNumber}번</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{s.name}</td>
                      <td className="py-3 px-4 font-bold text-rose-600">{s.username}</td>
                      <td className="py-3 px-4 font-black text-rose-600">{s.currentScore}점</td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => setResetTarget({ id: s.id, name: s.name, username: s.username, role: 'student' })}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg shadow-sm flex items-center gap-1.5 mx-auto transition-colors"
                        >
                          <Key size={13} />
                          <span>비밀번호 리셋</span>
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: CLASSES TABLE */}
        {activeTab === 'classes' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/80 text-slate-600 font-bold border-b border-slate-200">
                  <th className="py-3.5 px-4">학급 번호</th>
                  <th className="py-3.5 px-4">학급 명칭</th>
                  <th className="py-3.5 px-4">담당 교사 ID</th>
                  <th className="py-3.5 px-4">소속 학생 수</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {overview.classes.map(c => (
                  <tr key={c.classNumber} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-amber-600">5-{c.classNumber}반</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{c.name}</td>
                    <td className="py-3 px-4 font-medium text-slate-600">{c.teacherId}</td>
                    <td className="py-3 px-4 font-bold text-indigo-600">{c.studentCount}명</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* ADMIN RESET PASSWORD MODAL */}
      {resetTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-fadeIn">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Key className="text-amber-500" size={18} />
                [{resetTarget.role === 'teacher' ? '교사' : '학생'}] 비밀번호 초기화
              </h3>
              <button onClick={() => setResetTarget(null)} className="text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>

            {resetMsg && (
              <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 rounded-xl text-xs flex items-center gap-2 border border-emerald-200">
                <CheckCircle2 size={16} />
                <span>{resetMsg}</span>
              </div>
            )}

            <div className="space-y-3 text-xs mb-4">
              <p><strong className="text-slate-700">이름:</strong> {resetTarget.name}</p>
              <p><strong className="text-slate-700">로그인 아이디:</strong> <code className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded">{resetTarget.username}</code></p>
              
              <div>
                <label className="block font-bold text-slate-800 mb-1">새로운 비밀번호 입력</label>
                <input
                  type="text"
                  placeholder="새로운 비밀번호를 입력하세요"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setResetTarget(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                취소
              </button>
              <button
                onClick={handleResetPasswordSubmit}
                className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs shadow-md"
              >
                비밀번호 변경하기
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
