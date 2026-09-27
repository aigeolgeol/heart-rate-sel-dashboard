import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import StudentChatView from './components/StudentChatView';
import StudentGrowthRecordView from './components/StudentGrowthRecordView';
import TeacherDashboardView from './components/TeacherDashboardView';
import EvolutionModal from './components/EvolutionModal';

export default function App() {
  const [viewMode, setViewMode] = useState('student'); // 'student' | 'teacher'
  const [studentSubTab, setStudentSubTab] = useState('chat'); // 'chat' | 'record'
  
  const [currentSession, setCurrentSession] = useState(4); // Default session
  const [studentsList, setStudentsList] = useState([]);
  const [currentStudentId, setCurrentStudentId] = useState('');
  const [currentStudent, setCurrentStudent] = useState(null);

  const [showEvolutionModal, setShowEvolutionModal] = useState(false);

  // Fetch initial student list
  const loadStudents = async () => {
    try {
      const res = await fetch(`/api/students?session=${currentSession}`);
      const data = await res.json();
      setStudentsList(data.students);
      if (data.students.length > 0 && !currentStudentId) {
        setCurrentStudentId(data.students[0].id);
      }
    } catch (err) {
      console.error("Failed to load students:", err);
    }
  };

  // Fetch detailed student data when selection or session changes
  const loadCurrentStudentDetail = async (id, session) => {
    if (!id) return;
    try {
      const res = await fetch(`/api/students/${id}`);
      const data = await res.json();
      // Update visibleStage based on currentSession
      data.visibleStage = session >= 8 ? data.actualStage : 1;
      setCurrentStudent(data);
    } catch (err) {
      console.error("Failed to load student detail:", err);
    }
  };

  useEffect(() => {
    loadStudents();
  }, [currentSession]);

  useEffect(() => {
    if (currentStudentId) {
      loadCurrentStudentDetail(currentStudentId, currentSession);
    }
  }, [currentStudentId, currentSession]);

  // Handle Session Change
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

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      
      {/* Navigation Bar */}
      <Navbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        studentSubTab={studentSubTab}
        setStudentSubTab={setStudentSubTab}
        currentStudentId={currentStudentId}
        setCurrentStudentId={setCurrentStudentId}
        studentsList={studentsList}
        currentSession={currentSession}
        setCurrentSession={handleSessionChange}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-12">
        {viewMode === 'student' ? (
          studentSubTab === 'chat' ? (
            <StudentChatView 
              student={currentStudent} 
              currentSession={currentSession}
              onSubmissionSuccess={() => {
                loadStudents();
                if (currentStudentId) loadCurrentStudentDetail(currentStudentId, currentSession);
              }}
            />
          ) : (
            <StudentGrowthRecordView 
              student={currentStudent} 
              currentSession={currentSession}
            />
          )
        ) : (
          <TeacherDashboardView currentSession={currentSession} />
        )}
      </main>

      {/* Celebratory 8th Session Evolution Unlocked Modal */}
      {showEvolutionModal && (
        <EvolutionModal 
          student={currentStudent} 
          onClose={() => setShowEvolutionModal(false)} 
        />
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-semibold text-slate-300">
            [개발기획서 구현물] 심박수로 나를 알자 - 초등 5학년 신체·정서 SEL 모니터링 웹앱
          </p>
          <p className="mt-1 text-slate-500">
            제출자: 나경재 | 기술 스택: React, Tailwind CSS, Express, Gemini Multimodal Vision &amp; SEL Analyzer
          </p>
        </div>
      </footer>

    </div>
  );
}
