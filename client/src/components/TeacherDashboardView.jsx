import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  MessageSquare, 
  Search, 
  Filter, 
  Eye, 
  Send, 
  Sparkles, 
  X,
  LayoutGrid,
  List,
  Heart,
  TrendingUp,
  Clock
} from 'lucide-react';
import SimdongiAvatar from './SimdongiAvatar';

export default function TeacherDashboardView({ currentSession }) {
  const [selectedClass, setSelectedClass] = useState('all');
  const [riskFilterOnly, setRiskFilterOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [displayMode, setDisplayMode] = useState('card'); // 'card' | 'table'
  
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudentDetail, setSelectedStudentDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  const [teacherCommentInput, setTeacherCommentInput] = useState('');
  const [sendingComment, setSendingComment] = useState(false);

  // Fetch Class Stats & Students List
  const fetchData = async () => {
    setLoading(true);
    try {
      const statsRes = await fetch(`/api/class-stats?classNum=${selectedClass === 'all' ? '' : selectedClass}`);
      const statsData = await statsRes.json();
      setStats(statsData);

      const stuRes = await fetch(`/api/students?classNum=${selectedClass}&hasRisk=${riskFilterOnly}&session=${currentSession}`);
      const stuData = await stuRes.json();
      setStudents(stuData.students);
    } catch (err) {
      console.error("Error fetching teacher dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedClass, riskFilterOnly, currentSession]);

  // Open Student Detail Modal
  const handleOpenDetail = async (studentId) => {
    try {
      const res = await fetch(`/api/students/${studentId}`);
      const data = await res.json();
      setSelectedStudentDetail(data);
      const currentHist = data.history.find(h => h.session === currentSession);
      setTeacherCommentInput(currentHist ? currentHist.teacherComment : '');
    } catch (err) {
      console.error("Failed to load student detail:", err);
    }
  };

  // Submit Teacher Comment
  const handleSendFeedback = async () => {
    if (!selectedStudentDetail) return;
    setSendingComment(true);
    try {
      const res = await fetch('/api/teacher-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: selectedStudentDetail.id,
          session: currentSession,
          comment: teacherCommentInput
        })
      });
      const data = await res.json();
      if (data.success) {
        const updatedHist = selectedStudentDetail.history.find(h => h.session === currentSession);
        if (updatedHist) updatedHist.teacherComment = teacherCommentInput;
        fetchData();
      }
    } catch (err) {
      console.error("Failed to send teacher comment:", err);
    } finally {
      setSendingComment(false);
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.includes(searchQuery) || s.studentNumber.toString().includes(searchQuery)
  );

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-8">
      
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">교사용 학급 카드 대시보드</h2>
            <span className="px-3 py-0.5 text-xs font-semibold bg-indigo-100 text-indigo-700 rounded-full">
              {currentSession}차시 모니터링
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            개별 학생의 심박수·정서 카드 시각화, 정서 관심 알림 및 실시간 피드백 전송
          </p>
        </div>

        {/* Class Filter Tabs */}
        <div className="flex items-center space-x-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => setSelectedClass('all')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedClass === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            전체 (60명)
          </button>
          {[1, 2, 3].map(cNum => (
            <button
              key={cNum}
              onClick={() => setSelectedClass(cNum.toString())}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedClass === cNum.toString()
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              5학년 {cNum}반
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI Cards Grid */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-xs font-semibold text-slate-500">마음 돌아보기 제출률</p>
              <p className="text-3xl font-black text-slate-900 mt-1.5">{stats.submissionRate}%</p>
              <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
                <CheckCircle2 size={13} /> {stats.submittedCount}명 작성 완료
              </p>
            </div>
            <div className="p-3.5 bg-emerald-50 rounded-2xl text-emerald-600 border border-emerald-100">
              <CheckCircle2 size={28} />
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-xs font-semibold text-slate-500">평균 신체 점수 (50만점)</p>
              <p className="text-3xl font-black text-sky-600 mt-1.5">{stats.avgPhysical}점</p>
              <p className="text-xs text-sky-600/80 font-medium mt-1 flex items-center gap-1">
                <Activity size={13} /> 심박수 개선율 반영
              </p>
            </div>
            <div className="p-3.5 bg-sky-50 rounded-2xl text-sky-600 border border-sky-100">
              <Activity size={28} />
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-xs font-semibold text-slate-500">평균 정서 점수 (50만점)</p>
              <p className="text-3xl font-black text-rose-600 mt-1.5">{stats.avgEmotional}점</p>
              <p className="text-xs text-rose-600/80 font-medium mt-1 flex items-center gap-1">
                <Sparkles size={13} /> AI 감정 채점 평균
              </p>
            </div>
            <div className="p-3.5 bg-rose-50 rounded-2xl text-rose-600 border border-rose-100">
              <Sparkles size={28} />
            </div>
          </div>

          {/* Card 4 (Risk Anomaly Alert Card) */}
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-6 rounded-3xl text-white shadow-md flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-amber-100 uppercase tracking-wider">정서 관심 학생</p>
              <p className="text-3xl font-black mt-1.5">{stats.riskCount}명</p>
              <p className="text-xs text-amber-100 mt-1">교사 전용 비공개 집중 모니터링</p>
            </div>
            <div className="p-3.5 bg-white/20 rounded-2xl text-white backdrop-blur-sm">
              <AlertTriangle size={28} />
            </div>
          </div>
        </div>
      )}

      {/* Control Bar (Search, Risk Filter & View Mode Switcher) */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-3.5 top-3 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="학생 이름 또는 번호 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
            />
          </div>

          {/* Risk Only Toggle */}
          <button
            onClick={() => setRiskFilterOnly(!riskFilterOnly)}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all border ${
              riskFilterOnly
                ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <AlertTriangle size={14} />
            <span>관심 학생만 ({stats ? stats.riskCount : 0}명)</span>
          </button>
        </div>

        {/* View Mode Switcher (Card View vs Table View) */}
        <div className="flex items-center space-x-3">
          <p className="text-xs text-slate-500 hidden sm:block">
            검색된 학생: <strong className="text-slate-800">{filteredStudents.length}</strong>명
          </p>

          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setDisplayMode('card')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                displayMode === 'card'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LayoutGrid size={15} />
              <span>카드 뷰</span>
            </button>

            <button
              onClick={() => setDisplayMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                displayMode === 'table'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <List size={15} />
              <span>표 뷰</span>
            </button>
          </div>
        </div>

      </div>

      {/* STUDENT CARDS GRID DISPLAY MODE */}
      {displayMode === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((stu) => (
            <div 
              key={stu.id}
              className={`bg-white rounded-3xl p-6 border transition-all duration-300 relative flex flex-col justify-between hover:shadow-lg ${
                stu.hasRiskFlag 
                  ? 'border-amber-300 bg-gradient-to-b from-amber-50/40 via-white to-white shadow-amber-100' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              
              {/* Card Header: Avatar, Name, Risk Tag */}
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <SimdongiAvatar stage={stu.actualStage} size="small" pulse={false} />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">{stu.name}</h3>
                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          5-{stu.classNumber}반 ({stu.studentNumber}번)
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        심동이 진화 단계: <strong className="text-slate-700">{stu.actualStage}단계</strong>
                      </p>
                    </div>
                  </div>

                  {/* Submission Status Badge */}
                  {stu.hasSubmitted ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                      <CheckCircle2 size={12} /> 작성완료
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-500 text-xs font-medium rounded-full">
                      미제출
                    </span>
                  )}
                </div>

                {/* Risk Flag Alert Tag if active */}
                {stu.hasRiskFlag && (
                  <div className="mt-4 p-3 bg-amber-500/10 border border-amber-400/40 rounded-2xl text-xs text-amber-900 flex items-start gap-2 animate-pulse">
                    <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-amber-800">⚠️ 정서 이상징후 감지됨</p>
                      <p className="text-[11px] text-amber-700 mt-0.5">최근 부정 정서 반복 (교사 확인 권장)</p>
                    </div>
                  </div>
                )}

                {/* Score Stats Progress Bars */}
                <div className="mt-5 space-y-3 bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
                  
                  {/* Total Growth Score */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-700 flex items-center gap-1">
                        <TrendingUp size={13} className="text-rose-500" /> 총 성장 점수
                      </span>
                      <span className="text-rose-600 font-black">{stu.currentScore} / 100점</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-rose-500 to-red-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, stu.currentScore)}%` }}
                      />
                    </div>
                  </div>

                  {/* Physical vs Emotional breakdown */}
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/60 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">신체 영역(50점)</span>
                      <span className="font-bold text-sky-600 text-sm">{stu.physicalScore}점</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">정서 영역(50점)</span>
                      <span className="font-bold text-emerald-600 text-sm">{stu.emotionalScore}점</span>
                    </div>
                  </div>

                </div>

                {/* Heart Rate Stats & Activity preview */}
                <div className="mt-3 flex items-center justify-between text-xs px-2 text-slate-500">
                  <span className="flex items-center gap-1">
                    <Heart size={13} className="text-rose-500 fill-rose-500" />
                    최고 심박수: <strong className="text-slate-800">{stu.maxBpm} bpm</strong>
                  </span>
                  <span className="text-slate-400">
                    {stu.teacherComment ? '💬 교사 피드백 완료' : '📝 피드백 대기'}
                  </span>
                </div>
              </div>

              {/* Card Action Button */}
              <div className="mt-5 pt-3 border-t border-slate-100">
                <button
                  onClick={() => handleOpenDetail(stu.id)}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Eye size={15} />
                  <span>학생 상세 카드 &amp; 교사 피드백 작성</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      ) : (
        /* TABLE DISPLAY MODE */
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/80 text-slate-600 font-bold border-b border-slate-200">
                  <th className="py-3.5 px-4">번호</th>
                  <th className="py-3.5 px-4">학급</th>
                  <th className="py-3.5 px-4">이름</th>
                  <th className="py-3.5 px-4">제출 상태</th>
                  <th className="py-3.5 px-4">최고 심박수</th>
                  <th className="py-3.5 px-4">신체점수</th>
                  <th className="py-3.5 px-4">정서점수</th>
                  <th className="py-3.5 px-4">총 성장점수</th>
                  <th className="py-3.5 px-4">단계</th>
                  <th className="py-3.5 px-4">관심 징후</th>
                  <th className="py-3.5 px-4 text-center">상세보기</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredStudents.map((stu) => (
                  <tr 
                    key={stu.id} 
                    className={`hover:bg-slate-50 transition-colors ${stu.hasRiskFlag ? 'bg-amber-50/40' : ''}`}
                  >
                    <td className="py-3 px-4 font-bold text-slate-500">{stu.studentNumber}번</td>
                    <td className="py-3 px-4 font-semibold text-slate-700">5-{stu.classNumber}반</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{stu.name}</td>
                    <td className="py-3 px-4">
                      {stu.hasSubmitted ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full font-semibold">
                          <CheckCircle2 size={12} /> 완료
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                          미제출
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-rose-600">{stu.maxBpm} bpm</td>
                    <td className="py-3 px-4 font-semibold text-sky-600">{stu.physicalScore}점</td>
                    <td className="py-3 px-4 font-semibold text-emerald-600">{stu.emotionalScore}점</td>
                    <td className="py-3 px-4 font-black text-rose-600 text-sm">{stu.currentScore}점</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-slate-900 text-white rounded text-[11px] font-bold">
                        {stu.actualStage}단계
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {stu.hasRiskFlag && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-800 border border-amber-300 rounded-full font-bold text-[11px]">
                          <AlertTriangle size={12} className="text-amber-600" />
                          관심필요
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleOpenDetail(stu.id)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-sm flex items-center gap-1.5 mx-auto transition-colors"
                      >
                        <Eye size={14} />
                        <span>확인</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* STUDENT DETAIL & TEACHER COMMENT MODAL */}
      {selectedStudentDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-fadeIn">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <SimdongiAvatar stage={selectedStudentDetail.actualStage} size="small" pulse={false} />
                <div>
                  <h3 className="text-lg font-bold">
                    [{selectedStudentDetail.classNumber}반] {selectedStudentDetail.name} 학생 카드 결과 상세
                  </h3>
                  <p className="text-xs text-slate-400">
                    {currentSession}차시 심박수 스크린샷, AI 채점 결과 및 교사 의견 전송
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedStudentDetail(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              
              {/* Risk Flag Banner if present */}
              {selectedStudentDetail.hasRiskFlag && (
                <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-start gap-3">
                  <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
                  <div className="text-xs text-amber-900">
                    <p className="font-bold">⚠️ 정서 이상징후 플래그 안내 (교사 비공개 참고용)</p>
                    <p className="mt-0.5 text-amber-800/90 leading-relaxed">
                      이 학생의 최근 마음 돌아보기 글에서 강한 부정 정서 신호가 감지되었습니다. 
                      AI는 단정적인 진단을 내리지 않고 교사 판단에 위임합니다.
                    </p>
                  </div>
                </div>
              )}

              {/* Uploaded Screenshot & HR Extracted Data */}
              {(() => {
                const currentHist = selectedStudentDetail.history.find(h => h.session === currentSession) || selectedStudentDetail.history[0];
                return (
                  <>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-bold text-slate-700 mb-2">📷 학생 업로드 심박수 스크린샷</p>
                        <div className="bg-slate-900 rounded-xl p-2 text-center text-xs text-slate-400 min-h-[140px] flex items-center justify-center border border-slate-800">
                          {currentHist.screenshotUrl ? (
                            <img 
                              src={currentHist.screenshotUrl} 
                              alt="HR Screenshot" 
                              className="max-h-40 rounded object-contain mx-auto"
                            />
                          ) : (
                            <span>캡처 스크린샷 이미지</span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <p className="text-xs font-bold text-slate-700">📊 추출된 심박수 데이터</p>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                            <p className="text-[10px] text-slate-400">최고 심박수</p>
                            <p className="text-base font-black text-rose-600">{currentHist.maxBpm} bpm</p>
                          </div>
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                            <p className="text-[10px] text-slate-400">평균 심박수</p>
                            <p className="text-base font-black text-sky-600">{currentHist.avgBpm} bpm</p>
                          </div>
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                            <p className="text-[10px] text-slate-400">안정 심박수</p>
                            <p className="text-base font-black text-emerald-600">{currentHist.minBpm} bpm</p>
                          </div>
                        </div>

                        <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                          <p><strong className="text-slate-700">체육 외 신체활동:</strong> {currentHist.activityLog}</p>
                          <p><strong className="text-slate-700">급뛰 순간:</strong> {currentHist.spikeMoment}</p>
                        </div>
                      </div>
                    </div>

                    {/* Student Answers Breakdown */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                      <p className="font-bold text-slate-800 text-sm mb-2">💬 챗봇 대화 내용 및 SEL 평가</p>
                      
                      <p><strong className="text-slate-700">상황:</strong> {currentHist.situation}</p>
                      <p><strong className="text-slate-700">당시 기분:</strong> {currentHist.mood}</p>
                      <p><strong className="text-slate-700">조절 전략:</strong> {currentHist.regulationStrategy}</p>
                      <p><strong className="text-slate-700">한마디 표현:</strong> "{currentHist.expressSummary}"</p>

                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 mt-2 text-center">
                        <div className="bg-slate-50 p-2 rounded-lg">
                          <span className="text-slate-400">인식 채점:</span> <strong className="text-rose-600">{currentHist.scores?.recognize || 8}/10점</strong>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-lg">
                          <span className="text-slate-400">조절 채점:</span> <strong className="text-amber-600">{currentHist.scores?.regulate || 8}/10점</strong>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-lg">
                          <span className="text-slate-400">표현 채점:</span> <strong className="text-emerald-600">{currentHist.scores?.express || 8}/10점</strong>
                        </div>
                      </div>
                    </div>

                    {/* Teacher Feedback Editor */}
                    <div className="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-200 space-y-3">
                      <label className="block text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                        <MessageSquare size={16} className="text-indigo-600" />
                        담임 교사 피드백 / 조언 작성 (학생 화면에 전송됩니다)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="학생에게 전달할 격려와 지도 조언을 작성해 주세요."
                        value={teacherCommentInput}
                        onChange={(e) => setTeacherCommentInput(e.target.value)}
                        className="w-full bg-white border border-indigo-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                      />
                      <div className="flex justify-end">
                        <button
                          disabled={sendingComment}
                          onClick={handleSendFeedback}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 cursor-pointer"
                        >
                          <Send size={14} />
                          <span>{sendingComment ? '전송 중...' : '교사 피드백 전송하기'}</span>
                        </button>
                      </div>
                    </div>
                  </>
                );
              })()}

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
