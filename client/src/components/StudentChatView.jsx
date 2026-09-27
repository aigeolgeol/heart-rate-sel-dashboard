import React, { useState } from 'react';
import { 
  Upload, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Activity, 
  Zap, 
  Brain, 
  Smile, 
  HelpCircle,
  RefreshCw,
  FileImage,
  ArrowRight
} from 'lucide-react';
import SimdongiAvatar from './SimdongiAvatar';

export default function StudentChatView({ student, currentSession, onSubmissionSuccess }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [screenshotData, setScreenshotData] = useState(null);
  
  // Chat answers form state
  const [answers, setAnswers] = useState({
    activityLog: '',
    spikeMoment: '',
    situation: '',
    mood: '',
    regulationStrategy: '',
    expressSummary: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  // Pre-fill quick chips for easy interactive typing on Galaxy Tab
  const quickChips = {
    2: ["점심시간에 피구하기", "계단 3층까지 뛰어오르기", "청소 시간에 쓰레기 분리수거하기", "하교 때 친구랑 걷기"],
    3: ["체육시간 셔틀런 탈락할 때", "발표할 때 긴장되어서", "친구랑 장난치다가 갑자기", "선생님이 부르셨을 때"],
    4: ["친구들과 다툼이 있었을 때", "어려운 수학 문제를 풀 때", "발표 기회를 잡아서 떨릴 때", "원하던 팀에 안 뽑혔을 때"],
    5: ["가슴이 떨리고 두근거렸음", "속상하고 화가 났음", "너무 당황스럽고 신났음", "불안하고 걱정되었음"],
    6: ["4초 복식호흡 3회 하기", "어깨 스트레칭하고 눈 감기", "마음속으로 1부터 10까지 세기", "물 한 모금 마시고 마음 챙김"],
    7: ["신체 신호를 알아차린 보람찬 하루!", "호흡법으로 마음을 가라앉힌 나 자신 뿌듯해", "심박수가 올라가도 당황하지 말자", "오늘 운동 많이 해서 기분 좋아!"]
  };

  // 1. Screenshot Upload handler
  const handleFileUpload = async (file) => {
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append('screenshot', file);

    try {
      const res = await fetch('/api/upload-screenshot', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setScreenshotData(data);
      }
    } catch (err) {
      console.error("Upload error:", err);
      // Fallback local sample preview
      setScreenshotData({
        success: true,
        imageUrl: '/uploads/sample_hr_1.svg',
        extractedData: {
          maxBpm: 188,
          avgBpm: 124,
          minBpm: 68,
          exerciseDuration: "09:00~14:00 캡처 분석",
          graphSummary: "체육 활동 시간대(10:30)에 최고 188bpm 감지됨."
        }
      });
    } finally {
      setUploading(false);
    }
  };

  const handleUseSampleImage = () => {
    setScreenshotData({
      success: true,
      imageUrl: '/uploads/sample_hr_1.svg',
      extractedData: {
        maxBpm: 184,
        avgBpm: 122,
        minBpm: 66,
        exerciseDuration: "오늘 일과시간 밴드 심박수 캡처",
        graphSummary: "스마트 밴드 분석 완료: 최고 심박수 184bpm, 평균 122bpm"
      }
    });
  };

  // 2. Chat Step Submission
  const handleNextStep = () => {
    if (currentStep < 7) {
      setCurrentStep(prev => prev + 1);
    }
  };

  // 3. Final Form Submission
  const handleSubmitAll = async () => {
    setSubmitting(true);
    try {
      const payload = {
        studentId: student ? student.id : 'STU-101',
        session: currentSession,
        screenshotUrl: screenshotData ? screenshotData.imageUrl : '',
        maxBpm: screenshotData?.extractedData?.maxBpm || 180,
        avgBpm: screenshotData?.extractedData?.avgBpm || 120,
        minBpm: screenshotData?.extractedData?.minBpm || 65,
        ...answers
      };

      const res = await fetch('/api/submit-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      setResult(data);
      if (onSubmissionSuccess) onSubmissionSuccess(data);
    } catch (err) {
      console.error("Submission failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      
      {/* Top Banner with Student Info */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SimdongiAvatar stage={student ? student.visibleStage : 1} size="small" pulse={true} />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-800">
                {student ? `${student.classNumber}반 ${student.name}` : '학생'}의 마음 돌아보기 대화
              </h2>
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-rose-100 text-rose-700 rounded-full">
                {currentSession}차시 수업
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              챗봇 '심동이'와 이야기를 나누며 오늘의 신체 신호와 감정을 대화로 기록해 보세요.
            </p>
          </div>
        </div>

        <div className="text-right hidden sm:block">
          <p className="text-xs text-slate-400">현재 성장 점수</p>
          <p className="text-2xl font-black text-rose-600">
            {student ? student.currentScore : 0}<span className="text-sm font-normal text-slate-500"> / 100점</span>
          </p>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-800 flex flex-col min-h-[580px]">
        
        {/* Chat Header */}
        <div className="bg-slate-800/80 px-6 py-4 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold text-slate-100 text-sm">3D 에이전트 '심동이' 실시간 대화</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-700">
            <span>진행률:</span>
            <span className="font-bold text-rose-400">{currentStep} / 7 단계</span>
          </div>
        </div>

        {/* Chat History & Interactive Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-gradient-to-b from-slate-900 to-slate-950">
          
          {/* STEP 1: Screenshot Upload */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <SimdongiAvatar stage={student ? student.visibleStage : 1} size="small" pulse={false} />
              </div>
              <div className="bg-slate-800 text-slate-100 p-4 rounded-2xl rounded-tl-none max-w-lg shadow-md border border-slate-700 text-sm sm:text-base leading-relaxed">
                <p className="font-bold text-rose-400 mb-1">① 심동이의 발문:</p>
                안녕! 오늘 하루도 수고 많았어. 밴드 앱에서 캡처한 <span className="text-amber-300 font-semibold">'오늘의 심박수 스크린샷'</span>을 올려줄래?
              </div>
            </div>

            {/* Step 1 Interactive Input Box */}
            <div className="ml-14 max-w-lg bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
              {!screenshotData ? (
                <div className="space-y-3">
                  <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-rose-500/40 rounded-xl cursor-pointer bg-slate-900/60 hover:bg-slate-800 transition-colors">
                    <Upload className="w-8 h-8 text-rose-400 mb-2 animate-bounce" />
                    <span className="text-xs sm:text-sm font-semibold text-slate-300">스마트 밴드 캡처 사진 업로드</span>
                    <span className="text-xs text-slate-500 mt-1">클릭하거나 이미지 파일 첨부</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => handleFileUpload(e.target.files[0])}
                    />
                  </label>

                  <button
                    onClick={handleUseSampleImage}
                    className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <FileImage size={14} className="text-amber-400" />
                    <span>[샘플 이미지로 바로 시험해보기]</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold bg-emerald-950/50 p-2.5 rounded-lg border border-emerald-500/30">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 size={16} /> AI 심박수 스크린샷 분석 완료!
                    </span>
                    <button 
                      onClick={() => setScreenshotData(null)}
                      className="text-slate-400 hover:text-slate-200 underline"
                    >
                      다시 첨부
                    </button>
                  </div>

                  {/* OCR Result Stats */}
                  <div className="grid grid-cols-3 gap-2 text-center bg-slate-900 p-3 rounded-xl border border-slate-700">
                    <div>
                      <p className="text-[10px] text-slate-400">최고 심박수</p>
                      <p className="text-lg font-black text-rose-400">{screenshotData.extractedData.maxBpm} <span className="text-xs font-normal">bpm</span></p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400">평균 심박수</p>
                      <p className="text-lg font-black text-sky-400">{screenshotData.extractedData.avgBpm} <span className="text-xs font-normal">bpm</span></p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400">안정 심박수</p>
                      <p className="text-lg font-black text-emerald-400">{screenshotData.extractedData.minBpm} <span className="text-xs font-normal">bpm</span></p>
                    </div>
                  </div>
                  
                  <p className="text-xs text-slate-400 bg-slate-900/80 p-2.5 rounded-lg border border-slate-700">
                    💡 <span className="text-slate-300">{screenshotData.extractedData.graphSummary}</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* STEP 2 ~ 7 Chat Questions */}
          {currentStep >= 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-start gap-3">
                <SimdongiAvatar stage={student ? student.visibleStage : 1} size="small" pulse={false} />
                <div className="bg-slate-800 text-slate-100 p-4 rounded-2xl rounded-tl-none max-w-lg shadow-md border border-slate-700 text-sm leading-relaxed">
                  <p className="font-bold text-rose-400 mb-1">② 심동이의 발문:</p>
                  오늘 체육 시간 말고 몸을 움직인 신체 활동이 있었어? (운동 원인 구분용)
                </div>
              </div>
              <div className="ml-14 max-w-lg">
                <input 
                  type="text"
                  placeholder="예: 점심시간에 피구하기, 계단 오르기 등"
                  value={answers.activityLog}
                  onChange={(e) => setAnswers({...answers, activityLog: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
                {/* Quick Chips */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {quickChips[2].map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => setAnswers({...answers, activityLog: chip})}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 rounded-lg border border-slate-700 transition-colors"
                    >
                      + {chip}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {currentStep >= 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-start gap-3">
                <SimdongiAvatar stage={student ? student.visibleStage : 1} size="small" pulse={false} />
                <div className="bg-slate-800 text-slate-100 p-4 rounded-2xl rounded-tl-none max-w-lg shadow-md border border-slate-700 text-sm leading-relaxed">
                  <p className="font-bold text-rose-400 mb-1">③ 심동이의 발문 [인식 - 신체]:</p>
                  오늘 심장이 좀 빨리 뛰었다 싶은 순간이 언제였어?
                </div>
              </div>
              <div className="ml-14 max-w-lg">
                <input 
                  type="text"
                  placeholder="예: 체육시간 오래달리기 할 때, 국어 시간에 발표할 때"
                  value={answers.spikeMoment}
                  onChange={(e) => setAnswers({...answers, spikeMoment: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {quickChips[3].map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => setAnswers({...answers, spikeMoment: chip})}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 rounded-lg border border-slate-700"
                    >
                      + {chip}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {currentStep >= 4 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-start gap-3">
                <SimdongiAvatar stage={student ? student.visibleStage : 1} size="small" pulse={false} />
                <div className="bg-slate-800 text-slate-100 p-4 rounded-2xl rounded-tl-none max-w-lg shadow-md border border-slate-700 text-sm leading-relaxed">
                  <p className="font-bold text-rose-400 mb-1">④ 심동이의 발문 [인식 - 상황]:</p>
                  그때 정확히 무슨 일이 있었는지 조금 더 자세히 말해줄래?
                </div>
              </div>
              <div className="ml-14 max-w-lg">
                <textarea 
                  rows={2}
                  placeholder="상황에 대해 자유롭게 적어주세요."
                  value={answers.situation}
                  onChange={(e) => setAnswers({...answers, situation: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          )}

          {/* STEP 5 */}
          {currentStep >= 5 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-start gap-3">
                <SimdongiAvatar stage={student ? student.visibleStage : 1} size="small" pulse={false} />
                <div className="bg-slate-800 text-slate-100 p-4 rounded-2xl rounded-tl-none max-w-lg shadow-md border border-slate-700 text-sm leading-relaxed">
                  <p className="font-bold text-rose-400 mb-1">⑤ 심동이의 발문 [인식 - 정서]:</p>
                  그 순간 너의 기분과 정서 상태는 어땠어?
                </div>
              </div>
              <div className="ml-14 max-w-lg">
                <input 
                  type="text"
                  placeholder="예: 긴장됨, 속상함, 떨림, 신남 등"
                  value={answers.mood}
                  onChange={(e) => setAnswers({...answers, mood: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          )}

          {/* STEP 6 */}
          {currentStep >= 6 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-start gap-3">
                <SimdongiAvatar stage={student ? student.visibleStage : 1} size="small" pulse={false} />
                <div className="bg-slate-800 text-slate-100 p-4 rounded-2xl rounded-tl-none max-w-lg shadow-md border border-slate-700 text-sm leading-relaxed">
                  <p className="font-bold text-rose-400 mb-1">⑥ 심동이의 발문 [조절 - 전략]:</p>
                  마음을 가라앉히거나 조절하기 위해 어떤 조절 전략을 시도해 봤어? (복식호흡, 스트레칭 등)
                </div>
              </div>
              <div className="ml-14 max-w-lg">
                <input 
                  type="text"
                  placeholder="예: 4초 동안 숨을 들이마시고 뱉는 복식호흡 3회"
                  value={answers.regulationStrategy}
                  onChange={(e) => setAnswers({...answers, regulationStrategy: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {quickChips[6].map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => setAnswers({...answers, regulationStrategy: chip})}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 rounded-lg border border-slate-700"
                    >
                      + {chip}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 7 */}
          {currentStep >= 7 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-start gap-3">
                <SimdongiAvatar stage={student ? student.visibleStage : 1} size="small" pulse={false} />
                <div className="bg-slate-800 text-slate-100 p-4 rounded-2xl rounded-tl-none max-w-lg shadow-md border border-slate-700 text-sm leading-relaxed">
                  <p className="font-bold text-rose-400 mb-1">⑦ 심동이의 발문 [표현]:</p>
                  마지막으로, 오늘 하루를 나의 한마디로 솔직하게 표현해 줘!
                </div>
              </div>
              <div className="ml-14 max-w-lg">
                <input 
                  type="text"
                  placeholder="예: 신체 신호를 알아차려서 뿌듯했던 멋진 하루!"
                  value={answers.expressSummary}
                  onChange={(e) => setAnswers({...answers, expressSummary: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          )}

          {/* Submission Result Screen */}
          {result && (
            <div className="mt-6 bg-gradient-to-r from-slate-800 to-rose-950 p-6 rounded-2xl border border-rose-500/40 shadow-2xl animate-fadeIn">
              <div className="flex items-center gap-3 text-rose-300 font-bold text-lg border-b border-rose-500/30 pb-3">
                <Sparkles className="text-amber-400 animate-spin" />
                <span>AI 심동이의 회복 탄력성 진단 피드백</span>
              </div>

              {/* SEL Criteria Scores */}
              <div className="grid grid-cols-3 gap-3 my-4">
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-700 text-center">
                  <p className="text-xs text-slate-400">인식 (신체·정서연결)</p>
                  <p className="text-xl font-black text-rose-400">{result.scores.recognize} <span className="text-xs font-normal">/ 10점</span></p>
                </div>
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-700 text-center">
                  <p className="text-xs text-slate-400">조절 (전략 사용)</p>
                  <p className="text-xl font-black text-amber-400">{result.scores.regulate} <span className="text-xs font-normal">/ 10점</span></p>
                </div>
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-700 text-center">
                  <p className="text-xs text-slate-400">표현 (자기 언어)</p>
                  <p className="text-xl font-black text-emerald-400">{result.scores.express} <span className="text-xs font-normal">/ 10점</span></p>
                </div>
              </div>

              {/* AI Advice Bubble */}
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700 flex items-start gap-3">
                <SimdongiAvatar stage={result.actualStage || 1} size="small" pulse={true} />
                <div>
                  <p className="text-xs font-bold text-amber-300 mb-1">심동이의 조언:</p>
                  <p className="text-sm text-slate-200 leading-relaxed">{result.aiAdvice}</p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Chat Control Footer */}
        <div className="bg-slate-800/90 px-6 py-4 border-t border-slate-700/80 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            {!screenshotData 
              ? '① 먼저 스마트 밴드 심박수 스크린샷을 업로드해 주세요.'
              : currentStep < 7 
              ? `다음 발문으로 이동하려면 버튼을 눌러주세요.`
              : '모든 답변 작성이 완료되었습니다! 데이터 전송을 눌러주세요.'
            }
          </p>

          <div className="flex items-center gap-3">
            {currentStep < 7 ? (
              <button
                disabled={!screenshotData}
                onClick={handleNextStep}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
                  screenshotData
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg cursor-pointer'
                    : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                }`}
              >
                <span>다음 단계로</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                disabled={submitting || result}
                onClick={handleSubmitAll}
                className="px-6 py-2.5 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white font-bold text-sm rounded-xl shadow-lg flex items-center gap-2 transition-all cursor-pointer"
              >
                {submitting ? <RefreshCw size={16} className="animate-spin" /> : <Send size={16} />}
                <span>{result ? '기록 제출 완료!' : '기록 제출 및 AI 분석받기'}</span>
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
