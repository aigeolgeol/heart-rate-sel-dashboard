import React, { useState } from 'react';
import { 
  UserCheck, 
  LayoutDashboard, 
  ShieldCheck, 
  Heart, 
  Sparkles, 
  Lock, 
  UserPlus, 
  Key, 
  School,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function AuthView({ onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState('student'); // 'student' | 'teacher' | 'admin'
  
  // Login form state
  const [username, setUsername] = useState('stu101');
  const [password, setPassword] = useState('stu1234');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Teacher Signup Modal state
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [signupForm, setSignupForm] = useState({
    username: '',
    password: '',
    name: '',
    school: '광주초등학교'
  });
  const [signupSuccessMsg, setSignupSuccessMsg] = useState('');
  const [signupErrorMsg, setSignupErrorMsg] = useState('');

  // Tab switch handler
  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setErrorMsg('');
    if (tab === 'student') {
      setUsername('stu101');
      setPassword('stu1234');
    } else if (tab === 'teacher') {
      setUsername('teacher1');
      setPassword('teacher1234');
    } else if (tab === 'admin') {
      setUsername('admin');
      setPassword('admin1234');
    }
  };

  // Submit Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role: activeTab })
      });

      const data = await res.json();
      if (data.success) {
        onLoginSuccess(data.user);
      } else {
        setErrorMsg(data.error || '로그인에 실패하였습니다.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('서버 연결 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // Submit Teacher Registration
  const handleRegisterTeacher = async (e) => {
    e.preventDefault();
    setSignupErrorMsg('');
    setSignupSuccessMsg('');

    try {
      const res = await fetch('/api/auth/register-teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupForm)
      });

      const data = await res.json();
      if (data.success) {
        setSignupSuccessMsg(data.message);
        setTimeout(() => {
          setShowSignupModal(false);
          setActiveTab('teacher');
          setUsername(signupForm.username);
          setPassword(signupForm.password);
        }, 1500);
      } else {
        setSignupErrorMsg(data.error || '회원가입에 실패했습니다.');
      }
    } catch (err) {
      setSignupErrorMsg('서버 연결 실패');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Header Logo */}
      <div className="text-center mb-8 relative z-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-red-600 shadow-xl mb-4 animate-bounce">
          <Heart className="w-10 h-10 text-white fill-current" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
          심박수로 나를 알자
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          초등 5학년 신체·정서 회복 탄력성(SEL) 데이터 대시보드
        </p>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-slate-800/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-700/80 relative z-10">
        
        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-700 mb-6">
          <button
            onClick={() => handleTabSwitch('student')}
            className={`py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'student'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck size={16} />
            <span>학생</span>
          </button>

          <button
            onClick={() => handleTabSwitch('teacher')}
            className={`py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'teacher'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard size={16} />
            <span>교사</span>
          </button>

          <button
            onClick={() => handleTabSwitch('admin')}
            className={`py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'admin'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck size={16} />
            <span>관리자</span>
          </button>
        </div>

        {/* Header Notice Banner per role */}
        <div className="mb-6 p-3.5 rounded-2xl text-xs font-medium border bg-slate-900/70 border-slate-700/80">
          {activeTab === 'student' && (
            <p className="text-slate-300 flex items-center gap-2">
              <Sparkles size={16} className="text-rose-400 flex-shrink-0" />
              담임 선생님께서 부여해 주신 <strong className="text-rose-300">학생 아이디/비밀번호</strong>로 로그인하세요.
            </p>
          )}
          {activeTab === 'teacher' && (
            <div className="flex items-center justify-between">
              <p className="text-slate-300 flex items-center gap-2">
                <School size={16} className="text-indigo-400 flex-shrink-0" />
                학급 개설 및 학생 계정 생성을 위한 <strong className="text-indigo-300">교사 전용 로그인</strong>입니다.
              </p>
            </div>
          )}
          {activeTab === 'admin' && (
            <p className="text-slate-300 flex items-center gap-2">
              <ShieldCheck size={16} className="text-amber-400 flex-shrink-0" />
              전체 교사·학생 계정 및 학급 관리를 위한 <strong className="text-amber-300">총괄 관리자 전용 로그인</strong>입니다.
            </p>
          )}
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">아이디 (ID)</label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="아이디를 입력하세요"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">비밀번호 (Password)</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'student'
                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                : activeTab === 'teacher'
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                : 'bg-amber-600 hover:bg-amber-500 text-white'
            }`}
          >
            <span>{loading ? '로그인 처리 중...' : `${activeTab === 'student' ? '학생' : activeTab === 'teacher' ? '교사' : '관리자'} 로그인`}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Teacher Signup Option button */}
        {activeTab === 'teacher' && (
          <div className="mt-4 text-center border-t border-slate-700/80 pt-4">
            <p className="text-xs text-slate-400 mb-2">아직 교사 계정이 없으신가요?</p>
            <button
              onClick={() => setShowSignupModal(true)}
              className="w-full py-2.5 bg-slate-700 hover:bg-slate-600 text-indigo-300 font-bold text-xs rounded-xl border border-indigo-500/30 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <UserPlus size={14} />
              <span>교사 회원가입 (계정 생성하기)</span>
            </button>
          </div>
        )}

        {/* Quick Demo Account Hints Box */}
        <div className="mt-6 pt-4 border-t border-slate-700/60 text-[11px] text-slate-400 space-y-1">
          <p className="font-bold text-slate-300 mb-1">💡 바로 테스트해볼 수 있는 체험용 계정:</p>
          {activeTab === 'student' && <p>• 학생: <code className="text-rose-400">stu101</code> / 비밀번호: <code className="text-rose-400">stu1234</code> (김민준)</p>}
          {activeTab === 'teacher' && <p>• 교사: <code className="text-indigo-400">teacher1</code> / 비밀번호: <code className="text-indigo-400">teacher1234</code> (5학년 1반)</p>}
          {activeTab === 'admin' && <p>• 관리자: <code className="text-amber-400">admin</code> / 비밀번호: <code className="text-amber-400">admin1234</code> (총괄)</p>}
        </div>

      </div>

      {/* TEACHER SIGNUP MODAL */}
      {showSignupModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-fadeIn">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <UserPlus size={18} className="text-indigo-400" />
                교사 계정 신규 생성
              </h3>
              <button 
                onClick={() => setShowSignupModal(false)}
                className="text-slate-400 hover:text-white text-xs p-1"
              >
                닫기
              </button>
            </div>

            {signupSuccessMsg && (
              <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>{signupSuccessMsg}</span>
              </div>
            )}

            {signupErrorMsg && (
              <div className="mb-4 p-3 bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{signupErrorMsg}</span>
              </div>
            )}

            <form onSubmit={handleRegisterTeacher} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">교사 성함</label>
                <input 
                  type="text"
                  required
                  placeholder="예: 박성진 교사"
                  value={signupForm.name}
                  onChange={(e) => setSignupForm({...signupForm, name: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">소속 학교</label>
                <input 
                  type="text"
                  required
                  value={signupForm.school}
                  onChange={(e) => setSignupForm({...signupForm, school: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">사용할 아이디 (ID)</label>
                <input 
                  type="text"
                  required
                  placeholder="예: teacher3"
                  value={signupForm.username}
                  onChange={(e) => setSignupForm({...signupForm, username: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">비밀번호</label>
                <input 
                  type="password"
                  required
                  placeholder="비밀번호 입력"
                  value={signupForm.password}
                  onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg transition-colors cursor-pointer"
                >
                  교사 계정 생성 완료
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
