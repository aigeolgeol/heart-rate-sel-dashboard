import React from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { Sparkles, Heart, Activity, Award, MessageSquare, Calendar, ChevronRight, Lock } from 'lucide-react';
import SimdongiAvatar from './SimdongiAvatar';

export default function StudentGrowthRecordView({ student, currentSession }) {
  if (!student) return null;

  // Recharts score trend dataset
  const chartData = student.history.map(h => ({
    session: `${h.session}차시`,
    '신체 영역(50점)': h.physicalScore,
    '정서 영역(50점)': h.emotionalScore,
    '총 성장 점수(100점)': h.totalScore
  }));

  const isFinalSession = currentSession >= 8;

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-8">
      
      {/* Top Banner: Simdongi Growth Stage Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-rose-950 rounded-3xl p-6 text-white shadow-xl border border-slate-700 relative overflow-hidden">
        
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Avatar Display */}
          <div className="flex items-center gap-6">
            <SimdongiAvatar 
              stage={student.visibleStage} 
              size="large" 
              pulse={true} 
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black">{student.name} 학생의 심동이</h2>
                {isFinalSession ? (
                  <span className="px-3 py-1 bg-amber-400 text-slate-900 text-xs font-black rounded-full shadow animate-bounce">
                    🎉 8차시 성장 완료 공개!
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-slate-800 text-slate-300 text-xs font-semibold rounded-full border border-slate-700">
                    1~7차시 기본 모습
                  </span>
                )}
              </div>

              <p className="text-sm text-slate-300 mt-1 max-w-md">
                {!isFinalSession 
                  ? "1~7차시 동안 쌓은 성장 점수는 8차시 리포트 공개 순간에 심동이의 진짜 멋진 변화 모습으로 밝혀집니다!"
                  : `축하합니다! 총 ${student.currentScore}점으로 ${student.actualStage}단계 심동이로 성장했습니다.`
                }
              </p>

              {/* Score Badges */}
              <div className="flex flex-wrap gap-3 mt-4">
                <div className="bg-slate-800/90 px-3.5 py-1.5 rounded-xl border border-slate-700">
                  <span className="text-xs text-slate-400">총 성장 점수</span>
                  <p className="text-lg font-black text-rose-400">{student.currentScore}점</p>
                </div>
                <div className="bg-slate-800/90 px-3.5 py-1.5 rounded-xl border border-slate-700">
                  <span className="text-xs text-slate-400">신체 점수 (50만점)</span>
                  <p className="text-lg font-black text-sky-400">{student.physicalScore}점</p>
                </div>
                <div className="bg-slate-800/90 px-3.5 py-1.5 rounded-xl border border-slate-700">
                  <span className="text-xs text-slate-400">정서 점수 (50만점)</span>
                  <p className="text-lg font-black text-emerald-400">{student.emotionalScore}점</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reveal teaser card if sessions < 8 */}
          {!isFinalSession && (
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-amber-500/30 max-w-xs text-center">
              <Lock className="w-8 h-8 text-amber-400 mx-auto mb-1 animate-pulse" />
              <p className="text-xs font-bold text-amber-300">8차시 최종 진단 리포트 공개 예정</p>
              <p className="text-[11px] text-slate-400 mt-1">
                현재 실제 성장 단계: <span className="font-bold text-white">{student.actualStage}단계</span>
                <br/>(8차시에 최종 공개됩니다!)
              </p>
            </div>
          )}

        </div>
      </div>

      {/* Score Trend Chart Section */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Activity className="text-rose-500" size={20} />
              차시별 성장 점수 추이 (1~8차시)
            </h3>
            <p className="text-xs text-slate-500">신체 영역 개선율 + AI 정서 채점 및 성실도의 통합 그래프</p>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="session" stroke="#64748b" fontSize={12} />
              <YAxis domain={[0, 100]} stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Line type="monotone" dataKey="신체 영역(50점)" stroke="#38bdf8" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="정서 영역(50점)" stroke="#34d399" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="총 성장 점수(100점)" stroke="#f43f5e" strokeWidth={3.5} dot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* History Timeline */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Calendar className="text-indigo-500" size={20} />
          나의 마음 돌아보기 대화 히스토리
        </h3>

        <div className="space-y-4">
          {student.history.filter(h => h.hasSubmitted).map((item) => (
            <div 
              key={item.session}
              className="p-5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-200 flex flex-col md:flex-row gap-4 justify-between"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-slate-900 text-white text-xs font-bold rounded-lg">
                    {item.session}차시
                  </span>
                  <span className="text-xs text-slate-500">{item.date}</span>
                  <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    최고 심박수: {item.maxBpm} bpm
                  </span>
                </div>

                <p className="text-sm font-bold text-slate-800">
                  급뛰 순간: <span className="font-normal text-slate-700">{item.spikeMoment}</span>
                </p>
                <p className="text-xs text-slate-600">
                  <strong className="text-slate-700">시도한 조절 전략:</strong> {item.regulationStrategy}
                </p>
                <p className="text-xs text-slate-600">
                  <strong className="text-slate-700">하루 한마디:</strong> "{item.expressSummary}"
                </p>

                {/* AI Advice Bubble */}
                <div className="mt-3 bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-700 flex items-start gap-2">
                  <Sparkles size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800">AI 심동이 조언: </span>
                    {item.aiAdvice}
                  </div>
                </div>

                {/* Teacher Comment if available */}
                {item.teacherComment && (
                  <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-200 text-xs text-indigo-900 flex items-start gap-2">
                    <MessageSquare size={14} className="text-indigo-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-indigo-900">담임 교사 피드백: </span>
                      {item.teacherComment}
                    </div>
                  </div>
                )}
              </div>

              {/* Detailed Scores */}
              <div className="flex md:flex-col justify-around gap-2 text-right border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-4 min-w-[120px]">
                <div>
                  <p className="text-[10px] text-slate-400">인식 점수</p>
                  <p className="text-sm font-bold text-slate-800">{item.scores?.recognize || 8}점</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">조절 점수</p>
                  <p className="text-sm font-bold text-slate-800">{item.scores?.regulate || 8}점</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">표현 점수</p>
                  <p className="text-sm font-bold text-slate-800">{item.scores?.express || 8}점</p>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
