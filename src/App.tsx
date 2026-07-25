import { useCallback, useEffect, useRef, useState } from 'react';
import { quizData, filterQuestions, shuffleArray } from './lib/quiz';
import { loadSession, questionKey, saveSession } from './lib/storage';
import { useProgress } from './hooks/useProgress';
import Filters from './components/Filters';
import QuizCard from './components/QuizCard';
import FlashCard from './components/FlashCard';
import ProgressBar from './components/ProgressBar';
import ScoreSummary from './components/ScoreSummary';
import type { OptionKey, QuizQuestion, SectionFilter, StudyMode } from './types';

const keyToQuestion = new Map(quizData.map((item) => [questionKey(item), item]));

function restoreSession() {
  const saved = loadSession();
  if (!saved) return null;
  const sessionQuestions = saved.questionKeys
    .map((key) => keyToQuestion.get(key))
    .filter((item): item is QuizQuestion => Boolean(item));
  if (sessionQuestions.length !== saved.questionKeys.length) return null;
  return { ...saved, sessionQuestions };
}

export default function App() {
  const { progress, recordAnswer, resetProgress } = useProgress();

  const restoredRef = useRef<ReturnType<typeof restoreSession> | undefined>(undefined);
  if (restoredRef.current === undefined) {
    restoredRef.current = restoreSession();
  }
  const restored = restoredRef.current;

  const [moduleFilter, setModuleFilter] = useState(restored?.moduleFilter ?? 'all');
  const [sectionFilter, setSectionFilter] = useState<SectionFilter>(restored?.sectionFilter ?? 'all');
  const [mode, setMode] = useState<StudyMode>(restored?.mode ?? 'quiz');
  const [shuffle, setShuffle] = useState(restored?.shuffle ?? false);
  const [reviewMode, setReviewMode] = useState(restored?.reviewMode ?? false);

  const [sessionQuestions, setSessionQuestions] = useState<QuizQuestion[]>(restored?.sessionQuestions ?? []);
  const [currentIndex, setCurrentIndex] = useState(restored?.currentIndex ?? 0);
  const [sessionCorrect, setSessionCorrect] = useState(restored?.sessionCorrect ?? 0);
  const [sessionWrong, setSessionWrong] = useState(restored?.sessionWrong ?? 0);
  const [sessionAnswers, setSessionAnswers] = useState<Record<string, OptionKey>>(restored?.sessionAnswers ?? {});
  const [sessionRevealed, setSessionRevealed] = useState<Record<string, boolean>>(restored?.sessionRevealed ?? {});

  const skipNextAutoSession = useRef(Boolean(restored));

  const startNewSession = useCallback(() => {
    const base = reviewMode
      ? quizData.filter((q) => progress.mistakes[questionKey(q)])
      : filterQuestions(quizData, moduleFilter, sectionFilter);
    const ordered = shuffle ? shuffleArray(base) : base;
    setSessionQuestions(ordered);
    setCurrentIndex(0);
    setSessionCorrect(0);
    setSessionWrong(0);
    setSessionAnswers({});
    setSessionRevealed({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleFilter, sectionFilter, shuffle, reviewMode]);

  useEffect(() => {
    if (skipNextAutoSession.current) {
      skipNextAutoSession.current = false;
      return;
    }
    startNewSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleFilter, sectionFilter, shuffle, reviewMode]);

  useEffect(() => {
    saveSession({
      moduleFilter,
      sectionFilter,
      shuffle,
      reviewMode,
      mode,
      questionKeys: sessionQuestions.map((q) => questionKey(q)),
      currentIndex,
      sessionCorrect,
      sessionWrong,
      sessionAnswers,
      sessionRevealed,
    });
  }, [
    moduleFilter,
    sectionFilter,
    shuffle,
    reviewMode,
    mode,
    sessionQuestions,
    currentIndex,
    sessionCorrect,
    sessionWrong,
    sessionAnswers,
    sessionRevealed,
  ]);

  const currentQuestion = sessionQuestions[currentIndex];
  const finished = sessionQuestions.length > 0 && currentIndex >= sessionQuestions.length;

  function handleSelectAnswer(key: OptionKey) {
    if (!currentQuestion) return;
    const qKey = questionKey(currentQuestion);
    if (sessionAnswers[qKey] !== undefined) return;
    const correct = key === currentQuestion.answer;
    setSessionAnswers((prev) => ({ ...prev, [qKey]: key }));
    recordAnswer(qKey, correct);
    if (correct) setSessionCorrect((c) => c + 1);
    else setSessionWrong((w) => w + 1);
  }

  function handleReveal() {
    if (!currentQuestion) return;
    const qKey = questionKey(currentQuestion);
    setSessionRevealed((prev) => (prev[qKey] ? prev : { ...prev, [qKey]: true }));
  }

  function goNext() {
    setCurrentIndex((i) => Math.min(i + 1, sessionQuestions.length));
  }

  function goPrevious() {
    setCurrentIndex((i) => Math.max(i - 1, 0));
  }

  function toggleReviewMode() {
    setReviewMode((v) => !v);
    if (!reviewMode) setMode('quiz');
  }

  return (
    <div className="min-h-screen pb-16">
      <header className="border-b border-slate-200 bg-white">
        <div className="w-full px-4 py-5 sm:px-6 lg:px-10 2xl:px-16">
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl lg:text-3xl">Ôn thi trắc nghiệm PRM393</h1>
          <p className="text-sm text-slate-500 lg:text-base">Mobile Programming — Flutter/Dart · 416 câu hỏi</p>
        </div>
      </header>

      <main className="flex w-full flex-col gap-6 px-4 py-6 sm:px-6 lg:gap-8 lg:px-10 lg:py-8 2xl:px-16">
        <div className="min-w-0 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex gap-2">
              <button
                type="button"
                onClick={() => setMode('quiz')}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  mode === 'quiz' ? 'bg-flutter-blue text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Chế độ Quiz
              </button>
              <button
                type="button"
                onClick={() => setMode('flashcard')}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  mode === 'flashcard' ? 'bg-flutter-blue text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Chế độ Flashcard
              </button>
            </div>

            <Filters
              moduleFilter={moduleFilter}
              sectionFilter={sectionFilter}
              shuffle={shuffle}
              disabled={reviewMode}
              onModuleChange={setModuleFilter}
              onSectionChange={setSectionFilter}
              onShuffleChange={setShuffle}
            />

            {reviewMode && (
              <div className="mt-3 flex items-center justify-between rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
                <span>Đang ôn lại các câu đã từng làm sai</span>
                <button type="button" onClick={toggleReviewMode} className="font-semibold underline">
                  Thoát
                </button>
              </div>
            )}
          </div>

          {sessionQuestions.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
              {reviewMode
                ? 'Bạn chưa làm sai câu nào phù hợp — chưa có gì để ôn lại.'
                : 'Không có câu hỏi nào khớp với bộ lọc hiện tại.'}
            </div>
          ) : finished ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <h2 className="mb-2 text-lg font-bold text-slate-900">Hoàn thành phiên học!</h2>
              <p className="mb-5 text-sm text-slate-500">
                Đúng {sessionCorrect}/{sessionQuestions.length} câu (
                {Math.round((sessionCorrect / sessionQuestions.length) * 100)}%)
              </p>
              <div className="flex flex-col justify-center gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={goPrevious}
                  className="rounded-lg border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                >
                  ← Xem lại câu cuối
                </button>
                <button
                  type="button"
                  onClick={startNewSession}
                  className="rounded-lg bg-flutter-blue px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700"
                >
                  Làm lại phiên này
                </button>
              </div>
            </div>
          ) : (
            <>
              <ProgressBar
                current={currentIndex + 1}
                total={sessionQuestions.length}
                correct={sessionCorrect}
                wrong={sessionWrong}
              />
              {mode === 'quiz' ? (
                <QuizCard
                  question={currentQuestion}
                  selected={sessionAnswers[questionKey(currentQuestion)] ?? null}
                  onSelect={handleSelectAnswer}
                  onNext={goNext}
                  onPrevious={goPrevious}
                  hasPrevious={currentIndex > 0}
                  isLast={currentIndex === sessionQuestions.length - 1}
                />
              ) : (
                <FlashCard
                  question={currentQuestion}
                  revealed={sessionRevealed[questionKey(currentQuestion)] ?? false}
                  onReveal={handleReveal}
                  onNext={goNext}
                  onPrevious={goPrevious}
                  hasPrevious={currentIndex > 0}
                  isLast={currentIndex === sessionQuestions.length - 1}
                />
              )}
            </>
          )}
        </div>

        <ScoreSummary
          progress={progress}
          onReviewMistakes={toggleReviewMode}
          onReset={resetProgress}
          reviewDisabled={reviewMode}
        />
      </main>
    </div>
  );
}
