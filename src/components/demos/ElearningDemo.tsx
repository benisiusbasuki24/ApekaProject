import React, { useState } from 'react';
import { GraduationCap, PlayCircle, CheckCircle, Award, BookOpen } from 'lucide-react';

export const ElearningDemo: React.FC = () => {
  const [activeLesson, setActiveLesson] = useState(1);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});

  const lessons = [
    { id: 1, title: 'Modul 1: Konsep Dasar Pemrograman Web Modern', duration: '20 Menit', completed: true },
    { id: 2, title: 'Modul 2: Arsitektur Client-Server & Protokol HTTP', duration: '35 Menit', completed: true },
    { id: 3, title: 'Modul 3: Manajemen State & Database Relasional', duration: '40 Menit', completed: false }
  ];

  const questions = [
    {
      id: 1,
      q: 'Protokol apa yang digunakan browser untuk mentransmisikan data terenkripsi secara aman?',
      options: ['HTTP', 'HTTPS (TLS/SSL)', 'FTP', 'SMTP'],
      correct: 1
    },
    {
      id: 2,
      q: 'Manakah di bawah ini yang merupakan keuntungan arsitektur Single Page Application (SPA)?',
      options: ['Reload penuh tiap halaman', 'User experience cepat tanpa full page refresh', 'Tidak mendukung JavaScript', 'Memerlukan server PHP lama'],
      correct: 1
    }
  ];

  const handleSelectAnswer = (qId: number, optIdx: number) => {
    setSelectedAnswers({ ...selectedAnswers, [qId]: optIdx });
  };

  const handleFinishQuiz = () => {
    let score = 0;
    questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correct) {
        score += 50;
      }
    });
    setQuizScore(score);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl text-slate-200">
      <div className="border-b border-slate-800 bg-slate-950/70 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Platform E-Learning Sederhana</h3>
              <span className="text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full">
                Demo Langsung
              </span>
            </div>
            <p className="text-xs text-slate-400">Modul Belajar Ringan · Kuis Online Interaktif Auto-Grading</p>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Playlist */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Silabus Mata Pelajaran</h4>
          {lessons.map(l => (
            <button
              key={l.id}
              onClick={() => setActiveLesson(l.id)}
              className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                activeLesson === l.id 
                  ? 'bg-blue-600/15 border-blue-500/40 text-blue-300' 
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <PlayCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-xs text-white">{l.title}</div>
                <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                  <span>{l.duration}</span>
                  {l.completed && <span className="text-emerald-400 text-[10px]">✓ Selesai</span>}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Content & Quiz Area */}
        <div className="lg:col-span-2 bg-slate-950 p-5 rounded-xl border border-slate-800">
          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-400" />
                Materi Belajar Digital: Modul {activeLesson}
              </span>
              <span className="text-[11px] text-cyan-400 font-mono">108 Siswa Telah Mengakses</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Selamat datang di modul e-learning apeka project. Format materi dirancang seringan mungkin agar ramah perangkat smartphone siswa dengan konsumsi kuota data minimal.
            </p>
          </div>

          {/* Interactive Quiz Simulation */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h5 className="text-xs font-bold text-white uppercase tracking-wider">Simulasi Kuis Ujian Singkat</h5>
              {quizScore !== null && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <Award className="w-4 h-4" />
                  <span>Nilai Anda: {quizScore}/100</span>
                </div>
              )}
            </div>

            {questions.map((q, idx) => (
              <div key={q.id} className="p-3 bg-slate-900/60 rounded-lg border border-slate-800/80">
                <p className="text-xs font-medium text-slate-200 mb-2">{idx + 1}. {q.q}</p>
                <div className="space-y-1.5">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[q.id] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectAnswer(q.id, optIdx)}
                        className={`w-full text-left px-3 py-1.5 rounded text-xs transition-colors ${
                          isSelected 
                            ? 'bg-blue-600 text-white font-medium' 
                            : 'bg-slate-950 hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}. {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <button
              onClick={handleFinishQuiz}
              disabled={Object.keys(selectedAnswers).length < questions.length}
              className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold text-xs transition-all shadow-md"
            >
              Kirim Jawaban &amp; Cek Nilai Langsung
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
