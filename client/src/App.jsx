import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthView from './components/AuthView';
import StudentChatView from './components/StudentChatView';
import StudentGrowthRecordView from './components/StudentGrowthRecordView';
import TeacherDashboardView from './components/TeacherDashboardView';
import AdminDashboardView from './components/AdminDashboardView';
import EvolutionModal from './components/EvolutionModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null); // null means logged out
  const [studentSubTab, setStudentSubTab] = useState('chat'); // 'chat' | 'record'
  const [currentSession, setCurrentSession] = useState(4); // Default session
  const [currentStudentDetail, setCurrentStudentDetail] = useState(null);
  const [showEvolutionModal, setShowEvolutionModal] = useState(false);

  // Fetch current session settings on mount
  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.currentSession) setCurrentSession(data.currentSession);
      })
      .catch(err => console.error(err));
  }, []);

  // Fetch student detailed data if logged in as student
  const loadStudentDetailData = async (username, session) => {
    try {
      const res = await fetch(`/api/students/${username}`);
      const data = await res.json();
      data.visibleStage = session >= 8 ? data.actualStage : 1;
      setCurrentStudentDetail(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (currentUser && currentUser.role === 'student') {
      loadStudentDetailData(currentUser.username || currentUser.id, currentSession);
    }
  }, [currentUser, currentSession]);

  // Login Success Handler
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    if (user.role === 'student') {
      loadStudentDetailData(user.username || user.id, currentSession);
    }
  };

  // Logout Handler
  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentStudentDetail(null);
  };

  // Global Session Switcher
  const handleSessionChange = async (newSession) => {
    setCurrentSession(newSession);
    try {
      await fetch('/api/settings/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session: newSession })
      });
      if (newSession === 8) {
        setShowEvolutionModal(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // If not logged in, show Auth Gate Landing Page
  if (!currentUser) {
    return <AuthView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      
      {/* Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        studentSubTab={studentSubTab}
        setStudentSubTab={setStudentSubTab}
        currentSession={currentSession}
        setCurrentSession={handleSessionChange}
      />

      {/* Main Content Router */}
      <main className="flex-1 pb-12">
        {currentUser.role === 'student' ? (
          studentSubTab === 'chat' ? (
            <StudentChatView 
              student={currentStudentDetail} 
              currentSession={currentSession}
              onSubmissionSuccess={() => {
                if (currentUser) loadStudentDetailData(currentUser.username || currentUser.id, currentSession);
              }}
            />
          ) : (
            <StudentGrowthRecordView 
              student={currentStudentDetail} 
              currentSession={currentSession}
            />
          )
        ) : currentUser.role === 'teacher' ? (
          <TeacherDashboardView 
            currentSession={currentSession} 
            currentUser={currentUser}
          />
        ) : (
          <AdminDashboardView 
            currentSession={currentSession}
            onSessionChange={handleSessionChange}
          />
        )}
      </main>

      {/* Session 8 Evolution Modal */}
      {showEvolutionModal && (
        <EvolutionModal 
          student={currentStudentDetail} 
          onClose={() => setShowEvolutionModal(false)} 
        />
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-semibold text-slate-300">
            [디지털 SEL 대시보드] 심박수로 나를 알자 - 로그인 &amp; 역할별 통합 관리 시스템
          </p>
          <p className="mt-1 text-slate-500">
            접속 권한: <strong className="text-white">{currentUser.name}</strong> ({currentUser.role.toUpperCase()}) | 제출자: 나경재
          </p>
        </div>
      </footer>

    </div>
  );
}
