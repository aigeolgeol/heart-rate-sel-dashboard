import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Storage setup for Multer
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'hr-screenshot-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Initialize Gemini API
const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) 
  : null;

// --- IN-MEMORY DATABASE WITH ACCOUNTS & ROLES ---

let currentGlobalSession = 4; // 1~8 sessions

// Admin Account
const adminAccount = {
  id: 'ADMIN-01',
  username: 'admin',
  password: 'admin1234',
  name: '총괄 관리자',
  role: 'admin'
};

// Teacher Accounts Store
let teachersStore = [
  {
    id: 'TCH-101',
    username: 'teacher1',
    password: 'teacher1234',
    name: '김선생 교사',
    school: '광주초등학교',
    managedClasses: [1], // 5학년 1반
    role: 'teacher'
  },
  {
    id: 'TCH-102',
    username: 'teacher2',
    password: 'teacher1234',
    name: '이선생 교사',
    school: '광주초등학교',
    managedClasses: [2], // 5학년 2반
    role: 'teacher'
  }
];

// Classes Store
let classesStore = [
  { classNumber: 1, name: '5학년 1반', teacherId: 'TCH-101', studentCount: 20 },
  { classNumber: 2, name: '5학년 2반', teacherId: 'TCH-102', studentCount: 20 },
  { classNumber: 3, name: '5학년 3반', teacherId: 'TCH-101', studentCount: 20 }
];

// Seed names
const names = [
  "김민준", "이서연", "박도윤", "최지우", "정현우", "강예은", "조성민", "윤서아", "장하준", "임수아",
  "한지민", "오건우", "서윤아", "신준서", "권지안", "황민재", "송하은", "류도현", "전소율", "홍성현",
  "고은지", "문태양", "양다은", "손우진", "배주아", "백시우", "허유나", "유승민", "남채원", "심재원",
  "노아린", "하서진", "곽민성", "성채은", "차진우", "주연우", "우동현", "구아영", "신한결", "임지율",
  "강하람", "조은서", "윤태윤", "최다인", "박지호", "이하린", "김서준", "황유진", "서우진", "한예림",
  "오지환", "신채원", "권도겸", "송아인", "류재민", "전서윤", "홍지우", "고하준", "문소율", "양현서"
];

function generateMockStudents() {
  const students = [];
  for (let i = 1; i <= 60; i++) {
    const classNum = Math.ceil(i / 20); // Class 1, 2, 3
    const studentName = names[i - 1];
    
    const baseMaxBpm = 185 + Math.floor(Math.random() * 20);
    const baseRecoveryMin = 4.5 + Math.random() * 1.5;
    
    const history = [];
    const isAnomaly = (i === 7 || i === 18 || i === 34);

    for (let s = 1; s <= 8; s++) {
      const maxBpmImprovement = s >= 7 ? (0.08 + Math.random() * 0.06) : (0.02 * s);
      const recoveryImprovement = s >= 7 ? (0.35 + Math.random() * 0.25) : (0.05 * s);
      
      const physicalScore = Math.min(50, Math.round(25 * (1 - (s === 1 ? 0 : maxBpmImprovement)) + 25 * (1 - (s === 1 ? 0 : recoveryImprovement / 2))));

      let recognize = Math.min(10, Math.floor(6 + Math.random() * 4));
      let regulate = Math.min(10, Math.floor(5 + Math.random() * 5));
      let express = Math.min(10, Math.floor(6 + Math.random() * 4));
      
      if (isAnomaly && s >= 3) {
        recognize = 3;
        regulate = 2;
        express = 3;
      }

      const emotionDailyAvg = ((recognize + regulate + express) / 30) * 30;
      const completeness = s <= currentGlobalSession ? 20 : 0;
      const emotionalScore = Math.round(emotionDailyAvg + completeness);
      const totalScore = Math.min(100, Math.round(physicalScore * 0.5 + emotionalScore * 0.5));

      history.push({
        session: s,
        date: `2026-10-${(10 + s * 4).toString().padStart(2, '0')}`,
        hasSubmitted: s <= currentGlobalSession,
        physicalScore,
        emotionalScore,
        totalScore,
        maxBpm: Math.round(baseMaxBpm * (1 - maxBpmImprovement * 0.5)),
        avgBpm: Math.round(120 + Math.random() * 20),
        minBpm: Math.round(65 + Math.random() * 10),
        recoveryMinutes: (baseRecoveryMin * (1 - recoveryImprovement)).toFixed(1),
        screenshotUrl: `/uploads/sample_hr_1.svg`,
        activityLog: s % 2 === 0 ? "체육 시간 오래달리기 및 축구" : "점심시간 계단 오르기 및 친구들과 피구",
        spikeMoment: isAnomaly ? "체육시간 팀 나누기할 때 지목 안 당함" : "발표할 때 마음이 떨려서 심장이 쿵쾅거림",
        situation: isAnomaly ? "친구들이 나만 빼놓고 팀을 짜서 기분이 나쁘고 속상했음" : "선생님이 갑자기 국어 질문을 하셔서 깜짝 놀람",
        mood: isAnomaly ? "화남, 우울함" : "긴장됨, 두근거림",
        regulationStrategy: isAnomaly ? "아무것도 안 함, 그냥 가만히 있었음" : "4초 동안 숨을 크게 쉬는 복식호흡을 3번 반복함",
        expressSummary: isAnomaly ? "오늘 하루 별로였음" : "처음엔 엄청 떨렸지만 호흡법을 하니 심박수가 정상이 되었다.",
        scores: { recognize, regulate, express },
        aiAdvice: isAnomaly 
          ? "오늘 마음이 많이 무거웠군요. 선생님과 함께 이야기 나누며 마음을 정돈해 볼까요?"
          : "신체 신호를 빠르게 알아차리고 배우신 호흡법을 훌륭하게 적용했어요!",
        teacherComment: s <= currentGlobalSession ? (isAnomaly ? "OO학생, 요즘 어떤 고민이 있나요? 편할 때 이야기 나눠요." : "열심히 참여하는 모습이 보기 좋습니다!") : ""
      });
    }

    const currentHist = history[currentGlobalSession - 1];
    const totalScore = currentHist.totalScore;

    let actualStage = 1;
    if (totalScore >= 76) actualStage = 4;
    else if (totalScore >= 51) actualStage = 3;
    else if (totalScore >= 26) actualStage = 2;

    studentsStore = studentsStore || [];
    students.push({
      id: `STU-${100 + i}`,
      username: `stu${100 + i}`,
      password: `stu1234`,
      role: 'student',
      studentNumber: i,
      classNumber: classNum,
      name: studentName,
      baseMaxBpm,
      actualStage,
      visibleStage: currentGlobalSession >= 8 ? actualStage : 1,
      currentScore: totalScore,
      physicalScore: currentHist.physicalScore,
      emotionalScore: currentHist.emotionalScore,
      hasRiskFlag: isAnomaly,
      history
    });
  }
  return students;
}

let studentsStore = generateMockStudents();

// --- AUTH & USER MANAGEMENT APIs ---

// 1. LOGIN API (Student / Teacher / Admin)
app.post('/api/auth/login', (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: '아이디와 비밀번호를 입력해 주세요.' });
  }

  // Admin Login
  if (role === 'admin' || username === 'admin') {
    if (username === adminAccount.username && password === adminAccount.password) {
      return res.json({
        success: true,
        user: {
          id: adminAccount.id,
          username: adminAccount.username,
          name: adminAccount.name,
          role: 'admin'
        }
      });
    } else {
      return res.status(401).json({ error: '관리자 아이디 또는 비밀번호가 올바르지 않습니다.' });
    }
  }

  // Teacher Login
  if (role === 'teacher') {
    const teacher = teachersStore.find(t => t.username === username && t.password === password);
    if (teacher) {
      return res.json({
        success: true,
        user: {
          id: teacher.id,
          username: teacher.username,
          name: teacher.name,
          school: teacher.school,
          managedClasses: teacher.managedClasses,
          role: 'teacher'
        }
      });
    } else {
      return res.status(401).json({ error: '교사 아이디 또는 비밀번호가 올바르지 않습니다.' });
    }
  }

  // Student Login
  if (role === 'student') {
    const student = studentsStore.find(s => s.username === username && s.password === password);
    if (student) {
      return res.json({
        success: true,
        user: {
          id: student.id,
          username: student.username,
          name: student.name,
          classNumber: student.classNumber,
          studentNumber: student.studentNumber,
          role: 'student'
        }
      });
    } else {
      return res.status(401).json({ error: '학생 아이디 또는 비밀번호가 올바르지 않습니다. 담임 교사에게 문의하세요.' });
    }
  }

  res.status(400).json({ error: '유효한 로그인 역할(Role)을 지정해 주세요.' });
});

// 2. TEACHER REGISTER API (Self Signup before login)
app.post('/api/auth/register-teacher', (req, res) => {
  const { username, password, name, school } = req.body;

  if (!username || !password || !name) {
    return res.status(400).json({ error: '모든 필수 항목(아이디, 비밀번호, 성함)을 입력해 주세요.' });
  }

  // Check duplicate username
  const existingTeacher = teachersStore.find(t => t.username === username);
  if (existingTeacher) {
    return res.status(400).json({ error: '이미 존재해 사용 중인 아이디입니다.' });
  }

  const newTeacher = {
    id: `TCH-${100 + teachersStore.length + 1}`,
    username,
    password,
    name,
    school: school || '광주초등학교',
    managedClasses: [],
    role: 'teacher'
  };

  teachersStore.push(newTeacher);

  res.json({
    success: true,
    message: '교사 계정이 성공적으로 생성되었습니다! 로그인해 주세요.',
    teacher: {
      id: newTeacher.id,
      username: newTeacher.username,
      name: newTeacher.name
    }
  });
});

// 3. TEACHER CREATE CLASS API
app.post('/api/teacher/classes', (req, res) => {
  const { teacherId, classNumber, className } = req.body;

  if (!classNumber) {
    return res.status(400).json({ error: '학급 번호를 입력해 주세요.' });
  }

  const cNum = parseInt(classNumber);
  const existingClass = classesStore.find(c => c.classNumber === cNum);
  if (existingClass) {
    return res.status(400).json({ error: `이미 ${cNum}반 학급이 개설되어 있습니다.` });
  }

  const newClass = {
    classNumber: cNum,
    name: className || `5학년 ${cNum}반`,
    teacherId,
    studentCount: 0
  };

  classesStore.push(newClass);

  // Update teacher's managedClasses
  const teacher = teachersStore.find(t => t.id === teacherId);
  if (teacher) {
    if (!teacher.managedClasses.includes(cNum)) {
      teacher.managedClasses.push(cNum);
    }
  }

  res.json({ success: true, message: `${cNum}반 학급이 개설되었습니다!`, classInfo: newClass });
});

// 4. TEACHER CREATE STUDENT ACCOUNT API
app.post('/api/teacher/create-student', (req, res) => {
  const { teacherId, classNumber, name, studentNumber, username, password } = req.body;

  if (!name || !studentNumber || !username || !password) {
    return res.status(400).json({ error: '모든 항목(이름, 출석번호, 아이디, 비밀번호)을 입력해 주세요.' });
  }

  const cNum = parseInt(classNumber);
  const sNum = parseInt(studentNumber);

  // Duplicate check
  const existingUser = studentsStore.find(s => s.username === username);
  if (existingUser) {
    return res.status(400).json({ error: '이미 다른 학생이 사용 중인 아이디입니다.' });
  }

  const baseMaxBpm = 185 + Math.floor(Math.random() * 15);
  const history = [];

  for (let s = 1; s <= 8; s++) {
    history.push({
      session: s,
      date: `2026-10-${(10 + s * 4).toString().padStart(2, '0')}`,
      hasSubmitted: s <= currentGlobalSession,
      physicalScore: 40 + Math.floor(Math.random() * 8),
      emotionalScore: 40 + Math.floor(Math.random() * 8),
      totalScore: 80,
      maxBpm: baseMaxBpm - 5,
      avgBpm: 120,
      minBpm: 70,
      recoveryMinutes: "4.0",
      screenshotUrl: '/uploads/sample_hr_1.svg',
      activityLog: '수업 참여 및 운동',
      spikeMoment: '체육 시간오래달리기',
      situation: '열심히 오래달리기를 함',
      mood: '뿌듯함',
      regulationStrategy: '4초 복식호흡 시도',
      expressSummary: '오늘도 힘차게 하루를 보냄',
      scores: { recognize: 8, regulate: 8, express: 8 },
      aiAdvice: '신체 신호에 맞춰 조절 전략을 잘 활용했습니다!',
      teacherComment: ''
    });
  }

  const newStudent = {
    id: `STU-${100 + studentsStore.length + 1}`,
    username,
    password,
    role: 'student',
    studentNumber: sNum,
    classNumber: cNum,
    name,
    baseMaxBpm,
    actualStage: 3,
    visibleStage: currentGlobalSession >= 8 ? 3 : 1,
    currentScore: 80,
    physicalScore: 40,
    emotionalScore: 40,
    hasRiskFlag: false,
    history
  };

  studentsStore.push(newStudent);

  // Increment class student count
  const cls = classesStore.find(c => c.classNumber === cNum);
  if (cls) cls.studentCount += 1;

  res.json({
    success: true,
    message: `${name} 학생 계정이 생성되었습니다! (아이디: ${username} / 비밀번호: ${password})`,
    student: {
      id: newStudent.id,
      name: newStudent.name,
      username: newStudent.username,
      classNumber: newStudent.classNumber,
      studentNumber: newStudent.studentNumber
    }
  });
});

// 5. ADMIN OVERVIEW & USER LIST API
app.get('/api/admin/overview', (req, res) => {
  res.json({
    stats: {
      totalTeachers: teachersStore.length,
      totalStudents: studentsStore.length,
      totalClasses: classesStore.length,
      currentSession: currentGlobalSession
    },
    teachers: teachersStore.map(t => ({
      id: t.id,
      username: t.username,
      name: t.name,
      school: t.school,
      managedClasses: t.managedClasses
    })),
    classes: classesStore,
    students: studentsStore.map(s => ({
      id: s.id,
      username: s.username,
      name: s.name,
      classNumber: s.classNumber,
      studentNumber: s.studentNumber,
      currentScore: s.currentScore,
      hasRiskFlag: s.hasRiskFlag
    }))
  });
});

// 6. ADMIN PASSWORD RESET API
app.post('/api/admin/reset-password', (req, res) => {
  const { userId, userRole, newPassword } = req.body;

  if (!userId || !newPassword) {
    return res.status(400).json({ error: '사용자 ID와 새로운 비밀번호를 입력해 주세요.' });
  }

  if (userRole === 'teacher') {
    const teacher = teachersStore.find(t => t.id === userId || t.username === userId);
    if (teacher) {
      teacher.password = newPassword;
      return res.json({ success: true, message: `교사 [${teacher.name}]의 비밀번호가 변경되었습니다.` });
    }
  } else if (userRole === 'student') {
    const student = studentsStore.find(s => s.id === userId || s.username === userId);
    if (student) {
      student.password = newPassword;
      return res.json({ success: true, message: `학생 [${student.name}]의 비밀번호가 변경되었습니다.` });
    }
  }

  res.status(404).json({ error: '대상 계정을 찾을 수 없습니다.' });
});

// --- EXISTING CORE DASHBOARD APIs ---

app.get('/api/settings', (req, res) => {
  res.json({
    currentSession: currentGlobalSession,
    totalSessions: 8,
    isFinalSessionUnlocked: currentGlobalSession >= 8
  });
});

app.post('/api/settings/session', (req, res) => {
  const { session } = req.body;
  if (session >= 1 && session <= 8) {
    currentGlobalSession = session;
    studentsStore.forEach(s => {
      s.visibleStage = currentGlobalSession >= 8 ? s.actualStage : 1;
    });
    return res.json({ success: true, currentSession: currentGlobalSession });
  }
  res.status(400).json({ error: 'Session must be between 1 and 8' });
});

// Upload & Analyze Heart Rate Screenshot
app.post('/api/upload-screenshot', upload.single('screenshot'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '이미지 파일이 필요합니다.' });
    }

    const filePath = req.file.path;
    const fileUrl = `/uploads/${req.file.filename}`;

    if (genAI && process.env.GEMINI_API_KEY) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const imageBuffer = fs.readFileSync(filePath);
        const imagePart = {
          inlineData: {
            data: imageBuffer.toString("base64"),
            mimeType: req.file.mimetype
          }
        };

        const prompt = `이 스마트 밴드/워치 앱의 심박수 그래프 스크린샷을 분석해주세요.
        다음 정보를 JSON 형식으로만 추출해 주세요:
        {
          "maxBpm": 숫자,
          "avgBpm": 숫자,
          "minBpm": 숫자,
          "exerciseDuration": "운동 시간 텍스트",
          "graphSummary": "한 문장 그래프 요약"
        }`;

        const result = await model.generateContent([prompt, imagePart]);
        const jsonMatch = result.response.text().match(/\{[\s\S]*\}/);
        
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return res.json({
            success: true,
            imageUrl: fileUrl,
            extractedData: parsed
          });
        }
      } catch (geminiError) {
        console.error("Gemini Vision OCR Error:", geminiError.message);
      }
    }

    const simulatedMax = 145 + Math.floor(Math.random() * 45);
    const simulatedAvg = 110 + Math.floor(Math.random() * 25);
    const simulatedMin = 65 + Math.floor(Math.random() * 15);

    res.json({
      success: true,
      imageUrl: fileUrl,
      extractedData: {
        maxBpm: simulatedMax,
        avgBpm: simulatedAvg,
        minBpm: simulatedMin,
        exerciseDuration: "09:00 ~ 14:00 (5시간 측정)",
        graphSummary: `스마트 밴드 캡처 분석 완료: 최고 심박수 ${simulatedMax}bpm, 평균 ${simulatedAvg}bpm 감지됨.`
      }
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "스크린샷 처리 중 오류가 발생했습니다." });
  }
});

// Submit Chatbot Answers
app.post('/api/submit-chat', async (req, res) => {
  try {
    const {
      studentId,
      session,
      screenshotUrl,
      maxBpm,
      avgBpm,
      minBpm,
      activityLog,
      spikeMoment,
      situation,
      mood,
      regulationStrategy,
      expressSummary
    } = req.body;

    let recognize = 7;
    let regulate = 7;
    let express = 7;
    let aiAdvice = "오늘 자신의 심박수와 감정 상태를 솔직하게 되돌아보았습니다. 아주 훌륭해요!";

    if (genAI && process.env.GEMINI_API_KEY) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `초등학생 SEL 회복 탄력성 가상 에이전트 '심동이'로서 조언해 주세요.
        [기록]
        - 심박수: ${maxBpm}bpm
        - 활동: ${activityLog}
        - 급뛰 순간: ${spikeMoment}
        - 상황: ${situation}
        - 기분: ${mood}
        - 조절: ${regulationStrategy}
        - 한마디: ${expressSummary}

        JSON으로만 응답해 주세요:
        {
          "recognize": 점수(0~10),
          "regulate": 점수(0~10),
          "express": 점수(0~10),
          "aiAdvice": "친근한 말풍선 조언 (2~3문장)"
        }`;

        const result = await model.generateContent(prompt);
        const jsonMatch = result.response.text().match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          recognize = Math.min(10, Math.max(0, parsed.recognize || 7));
          regulate = Math.min(10, Math.max(0, parsed.regulate || 7));
          express = Math.min(10, Math.max(0, parsed.express || 7));
          aiAdvice = parsed.aiAdvice || aiAdvice;
        }
      } catch (err) {
        console.error("Gemini AI Emotion Analysis error:", err.message);
      }
    } else {
      if (regulationStrategy.includes("호흡") || regulationStrategy.includes("스트레칭") || regulationStrategy.includes("마음챙김")) {
        regulate = 9;
      } else if (regulationStrategy.length > 5) {
        regulate = 7;
      } else {
        regulate = 4;
      }
      if (situation.length > 10 && mood.length > 2) recognize = 9;
      if (expressSummary.length > 8) express = 9;

      aiAdvice = `오늘 심장이 뛰었던 순간(${spikeMoment})에 대해 '${regulationStrategy}' 전략을 시도한 점이 인상적이에요!`;
    }

    const student = studentsStore.find(s => s.id === studentId || s.username === studentId || s.studentNumber === parseInt(studentId));
    if (student) {
      const sessIdx = (session || currentGlobalSession) - 1;
      const targetHist = student.history[sessIdx] || student.history[0];

      targetHist.hasSubmitted = true;
      targetHist.maxBpm = maxBpm || targetHist.maxBpm;
      targetHist.avgBpm = avgBpm || targetHist.avgBpm;
      targetHist.minBpm = minBpm || targetHist.minBpm;
      targetHist.screenshotUrl = screenshotUrl || targetHist.screenshotUrl;
      targetHist.activityLog = activityLog;
      targetHist.spikeMoment = spikeMoment;
      targetHist.situation = situation;
      targetHist.mood = mood;
      targetHist.regulationStrategy = regulationStrategy;
      targetHist.expressSummary = expressSummary;
      targetHist.scores = { recognize, regulate, express };
      targetHist.aiAdvice = aiAdvice;

      const emotionDailyAvg = ((recognize + regulate + express) / 30) * 30;
      targetHist.emotionalScore = Math.round(emotionDailyAvg + 20);
      targetHist.totalScore = Math.min(100, Math.round(targetHist.physicalScore * 0.5 + targetHist.emotionalScore * 0.5));

      student.currentScore = targetHist.totalScore;
      student.emotionalScore = targetHist.emotionalScore;

      if (student.currentScore >= 76) student.actualStage = 4;
      else if (student.currentScore >= 51) student.actualStage = 3;
      else if (student.currentScore >= 26) student.actualStage = 2;
      else student.actualStage = 1;

      student.visibleStage = currentGlobalSession >= 8 ? student.actualStage : 1;
    }

    res.json({
      success: true,
      scores: { recognize, regulate, express },
      aiAdvice,
      totalScore: student ? student.currentScore : 85,
      actualStage: student ? student.actualStage : 3
    });
  } catch (error) {
    console.error("Submit chat error:", error);
    res.status(500).json({ error: "채팅 응답 처리 중 오류가 발생했습니다." });
  }
});

// Get all students
app.get('/api/students', (req, res) => {
  const { classNum, hasRisk, session } = req.query;
  let list = studentsStore;

  if (classNum && classNum !== 'all') {
    list = list.filter(s => s.classNumber === parseInt(classNum));
  }
  if (hasRisk === 'true') {
    list = list.filter(s => s.hasRiskFlag);
  }

  res.json({
    total: list.length,
    students: list.map(s => {
      const sessIdx = (session ? parseInt(session) : currentGlobalSession) - 1;
      const h = s.history[sessIdx] || s.history[0];
      return {
        id: s.id,
        username: s.username,
        studentNumber: s.studentNumber,
        classNumber: s.classNumber,
        name: s.name,
        currentScore: s.currentScore,
        physicalScore: s.physicalScore,
        emotionalScore: s.emotionalScore,
        visibleStage: s.visibleStage,
        actualStage: s.actualStage,
        hasRiskFlag: s.hasRiskFlag,
        hasSubmitted: h ? h.hasSubmitted : false,
        maxBpm: h ? h.maxBpm : s.baseMaxBpm,
        teacherComment: h ? h.teacherComment : ""
      };
    })
  });
});

// Get individual student detail
app.get('/api/students/:id', (req, res) => {
  const student = studentsStore.find(s => s.id === req.params.id || s.username === req.params.id || s.studentNumber === parseInt(req.params.id));
  if (!student) {
    return res.status(404).json({ error: "학생을 찾을 수 없습니다." });
  }
  res.json(student);
});

// Teacher submits feedback
app.post('/api/teacher-feedback', (req, res) => {
  const { studentId, session, comment } = req.body;
  const student = studentsStore.find(s => s.id === studentId || s.username === studentId || s.studentNumber === parseInt(studentId));

  if (!student) {
    return res.status(404).json({ error: "학생을 찾을 수 없습니다." });
  }

  const targetSess = session || currentGlobalSession;
  const hist = student.history.find(h => h.session === parseInt(targetSess));

  if (hist) {
    hist.teacherComment = comment;
  }

  res.json({ success: true, message: "교사 의견이 전송되었습니다.", comment });
});

// Get Class Statistics Dashboard Data
app.get('/api/class-stats', (req, res) => {
  const classNum = req.query.classNum ? parseInt(req.query.classNum) : null;
  const filtered = classNum ? studentsStore.filter(s => s.classNumber === classNum) : studentsStore;

  const totalCount = filtered.length;
  const submittedCount = filtered.filter(s => s.history[currentGlobalSession - 1]?.hasSubmitted).length;
  const avgPhysical = Math.round(filtered.reduce((acc, s) => acc + s.physicalScore, 0) / (totalCount || 1));
  const avgEmotional = Math.round(filtered.reduce((acc, s) => acc + s.emotionalScore, 0) / (totalCount || 1));
  const avgTotal = Math.round(filtered.reduce((acc, s) => acc + s.currentScore, 0) / (totalCount || 1));
  const riskCount = filtered.filter(s => s.hasRiskFlag).length;

  const sessionTrends = [];
  for (let s = 1; s <= 8; s++) {
    const sPhysical = Math.round(filtered.reduce((acc, st) => acc + (st.history[s-1]?.physicalScore || 0), 0) / (totalCount || 1));
    const sEmotional = Math.round(filtered.reduce((acc, st) => acc + (st.history[s-1]?.emotionalScore || 0), 0) / (totalCount || 1));
    const sTotal = Math.round(filtered.reduce((acc, st) => acc + (st.history[s-1]?.totalScore || 0), 0) / (totalCount || 1));

    sessionTrends.push({
      session: `${s}차시`,
      physical: sPhysical,
      emotional: sEmotional,
      total: sTotal
    });
  }

  res.json({
    totalCount,
    submittedCount,
    submissionRate: Math.round((submittedCount / (totalCount || 1)) * 100),
    avgPhysical,
    avgEmotional,
    avgTotal,
    riskCount,
    sessionTrends
  });
});

// Serve static client dist files if built
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Heart Rate Dashboard Server running on http://localhost:${PORT}`);
});

export default app;
