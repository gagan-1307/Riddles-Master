import React, { useState, useEffect } from 'react';
import { XCircle } from 'lucide-react';
import FeedbackPopup from './FeedbackPopup';
import { toast } from 'sonner';

interface QuizInterfaceProps {
  userId: string | null;
  setId: string;
  mode: 'practice' | 'test';
}

interface Question {
  id: string;
  order: number;
  statement: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctOption?: string;
  solution?: string;
}

interface QuizData {
  setId: string;
  setTitle: string;
  topicName: string;
  topicSlug: string;
  setNumber: number;
  totalQuestions: number;
  questions: Question[];
}

export function QuizInterface({ userId, setId, mode }: QuizInterfaceProps) {
  // State variables
  const [phase, setPhase] = useState<'loading' | 'already_attempted' | 'quiz' | 'popup' | 'submitting' | 'results'>('loading');
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [existingAttempt, setExistingAttempt] = useState<{ score: number; totalAttempted: number } | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [startTime, setStartTime] = useState<number>(0);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [correctOptionForCurrent, setCorrectOptionForCurrent] = useState<string | null>(null);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [pendingAnswer, setPendingAnswer] = useState<{
    questionId: string;
    selectedLetter: string;
    questionTimeTaken: number;
  } | null>(null);
  const [popupData, setPopupData] = useState<{
    correct: boolean;
    selectedOption: string;
    correctOption: string;
    solution: string;
    timeTakenThisQuestion: number;
  } | null>(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});

  // Silence unused prop/state warnings
  useEffect(() => {
    if (userId && setId && popupVisible) {
      // no-op
    }
  }, [userId, setId, popupVisible]);

  // 1. Mount checks and JSON reading
  useEffect(() => {
    const raw = document.getElementById('quiz-data')?.textContent;
    if (!raw) return;

    try {
      const data: QuizData = JSON.parse(raw);
      setQuizData(data);

      if (mode === 'test') {
        fetch(`/api/practice/check-attempt?setId=${data.setId}&mode=TEST`)
          .then((res) => {
            if (res.status === 401) {
              window.location.href = '/login';
              return;
            }
            return res.json();
          })
          .then((resData) => {
            if (resData && resData.attempted) {
              setExistingAttempt(resData);
              setPhase('already_attempted');
            } else {
              setPhase('quiz');
              const now = Date.now();
              setStartTime(now);
              setQuestionStartTime(now);
            }
          })
          .catch((err) => {
            console.error('Error checking test attempt:', err);
            // Default to quiz phase on check error
            setPhase('quiz');
            const now = Date.now();
            setStartTime(now);
            setQuestionStartTime(now);
          });
      } else {
        setPhase('quiz');
        const now = Date.now();
        setStartTime(now);
        setQuestionStartTime(now);
      }
    } catch (err) {
      console.error('Error parsing quiz-data:', err);
    }
  }, [mode]);

  // 2. Elapsed Timer (TEST mode only)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if ((phase === 'quiz' || phase === 'popup') && mode === 'test') {
      timer = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [phase, mode]);

  // 2.5. Answer verification trigger when phase is 'popup'
  useEffect(() => {
    if (phase !== 'popup' || !pendingAnswer || !quizData) return;

    const verifyAnswer = async () => {
      // 1. Optimize: Read answer instantly if it's already pre-loaded on the client (e.g. in Practice mode)
      const currentQ = quizData.questions[currentQuestion];
      if (currentQ && currentQ.correctOption && currentQ.solution) {
        const isCorrect = pendingAnswer.selectedLetter === currentQ.correctOption;
        
        // Set the correct visual state on the options instantly
        setCorrectOptionForCurrent(currentQ.correctOption);

        // Set popup content instantly
        setPopupData({
          correct: isCorrect,
          selectedOption: pendingAnswer.selectedLetter,
          correctOption: currentQ.correctOption,
          solution: currentQ.solution,
          timeTakenThisQuestion: pendingAnswer.questionTimeTaken
        });
        setPopupVisible(true);
        return;
      }

      // 2. Fallback: Fetch answer from the server API if not pre-loaded (e.g. in Test mode)
      try {
        const res = await fetch('/api/practice/verify-answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            questionId: pendingAnswer.questionId,
            setId: quizData.setId
          })
        });
        const data = await res.json();

        const isCorrect = pendingAnswer.selectedLetter === data.correctOption;

        // Set the correct visual state on the options
        setCorrectOptionForCurrent(data.correctOption);

        // Set popup content
        setPopupData({
          correct: isCorrect,
          selectedOption: pendingAnswer.selectedLetter,
          correctOption: data.correctOption,
          solution: data.solution,
          timeTakenThisQuestion: pendingAnswer.questionTimeTaken
        });
        setPopupVisible(true);
      } catch (err) {
        console.error('Error verifying answer:', err);
      }
    };

    verifyAnswer();
  }, [phase, pendingAnswer, quizData, currentQuestion]);

  // 3. Option Selection Handler
  const handleOptionClick = (questionId: string, selectedLetter: string) => {
    if (buttonsDisabled) return;

    // If the user is not logged in, redirect to login page with query parameter back to this set
    if (!userId) {
      const currentUrl = window.location.pathname + window.location.search;
      window.location.href = `/login?redirect=${encodeURIComponent(currentUrl)}`;
      return;
    }

    // Record answer
    setAnswers((prev) => ({ ...prev, [questionId]: selectedLetter }));

    // Record time taken
    const timeTaken = (Date.now() - questionStartTime) / 1000;

    // Visual active state
    setSelectedOption(selectedLetter);

    // Disable all options immediately
    setButtonsDisabled(true);

    // Transition to popup phase
    setPhase('popup');

    // Store pending trigger data for the feedback component
    setPendingAnswer({
      questionId,
      selectedLetter,
      questionTimeTaken: timeTaken,
    });
  };

  // 4. Callback from Popup Component after feedback completes
  const handlePopupDismiss = (correctLetter: string) => {
    // Show correct/wrong colors
    setCorrectOptionForCurrent(correctLetter);

    const totalQuestions = quizData?.questions.length ?? 0;

    if (currentQuestion < totalQuestions - 1) {
      setTimeout(() => {
        setCurrentQuestion((q) => q + 1);
        setSelectedOption(null);
        setCorrectOptionForCurrent(null);
        setButtonsDisabled(false);
        setQuestionStartTime(Date.now());
        setPendingAnswer(null);
        setPopupData(null);
        setPopupVisible(false);
        setPhase('quiz');
      }, 150); // brief transition delay
    } else {
      submitQuiz();
    }
  };

  // 5. Submit Quiz logic
  const submitQuiz = async () => {
    if (!quizData) return;
    setPhase('submitting');
    
    try {
      const timeTaken = Math.round((Date.now() - startTime) / 1000);
      
      const res = await fetch('/api/practice/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          setId: quizData.setId,
          answers,
          timeTaken,
          mode: mode.toUpperCase() // 'PRACTICE' or 'TEST'
        })
      });
      
      if (!res.ok) {
        const err = await res.json();
        if (err.error === 'TEST_ALREADY_ATTEMPTED') {
          setPhase('already_attempted');
          setExistingAttempt(err.existingAttempt);
          return;
        }
        throw new Error(err.message);
      }
      
      const data = await res.json();
      setResult(data);
      setPhase('results');
      
    } catch (err: any) {
      console.error('Quiz submission error:', err);
      toast.error(err.message || 'An error occurred during submission.');
      setPhase('quiz'); // revert to quiz phase on error
      setButtonsDisabled(false);
    }
  };

  const toggleQuestionExpand = (id: string) => {
    setExpandedQuestions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Render SUBMITTING screen
  if (phase === 'submitting') {
    return (
      <div className="max-w-[600px] mx-auto py-16 px-4 text-center">
        <div className="rounded-lg border border-[#e6dfd8] bg-[#faf9f5] p-8 shadow-sm">
          <h2 className="text-xl font-bold font-serif text-[#141413] mb-4">Submitting your answers...</h2>
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-[#f5f0e8] rounded-md w-full"></div>
            <div className="h-10 bg-[#f5f0e8] rounded-md w-full"></div>
            <div className="h-10 bg-[#f5f0e8] rounded-md w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  // Render LOADING screen
  if (phase === 'loading' || !quizData) {
    return (
      <div className="max-w-[680px] mx-auto py-12 space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-6 bg-[#f5f0e8] rounded-md w-1/4"></div>
          <div className="h-28 bg-[#f5f0e8] rounded-md w-full"></div>
          <div className="space-y-3">
            <div className="h-12 bg-[#f5f0e8] rounded-md w-full"></div>
            <div className="h-12 bg-[#f5f0e8] rounded-md w-full"></div>
            <div className="h-12 bg-[#f5f0e8] rounded-md w-full"></div>
            <div className="h-12 bg-[#f5f0e8] rounded-md w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  // Render ALREADY ATTEMPTED screen (TEST mode constraint)
  if (phase === 'already_attempted') {
    const accuracy = existingAttempt
      ? Math.round((existingAttempt.score / existingAttempt.totalAttempted) * 100)
      : 0;

    return (
      <div className="flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-[480px] rounded-lg border border-[#e6dfd8] bg-[#faf9f5] p-8 text-center shadow-sm">
          <div className="mx-auto h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-4">
            <XCircle className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold font-serif text-[#141413] mb-2">Already Attempted</h2>
          <p className="text-sm text-[#6c6a64] mb-6 leading-relaxed">
            You have already completed this set in Test mode.
          </p>

          {existingAttempt && (
            <div className="inline-flex items-center justify-center gap-3 bg-[#f5f0e8] px-4 py-2 rounded-full text-xs font-semibold text-[#3d3d3a] border border-[#e6dfd8] mb-8">
              <span>Score: {existingAttempt.score}/{existingAttempt.totalAttempted}</span>
              <span className="text-[#e6dfd8]">|</span>
              <span>Accuracy: {accuracy}%</span>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                window.location.href = `/practice/${quizData.topicSlug}/set/${quizData.topicSlug}?mode=practice`;
              }}
              className="inline-flex h-10 items-center justify-center rounded-[8px] bg-[#cc785c] px-6 text-sm font-semibold text-white shadow-lg shadow-[#cc785c]/10 transition-all hover:bg-[#a9583e] active:scale-[0.98] cursor-pointer"
            >
              Switch to Practice Mode
            </button>
            <button
              onClick={() => {
                window.location.href = `/practice/${quizData.topicSlug}`;
              }}
              className="inline-flex h-10 items-center justify-center rounded-[8px] border border-[#e6dfd8] bg-[#faf9f5] px-6 text-sm font-semibold text-[#3d3d3a] hover:bg-[#f5f0e8]/30 transition-all active:scale-[0.98] cursor-pointer"
            >
              Back to Topic
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { questions, totalQuestions } = quizData;
  const currentQ = questions[currentQuestion];

  // Helper formatting for timer
  const mins = Math.floor(elapsedSeconds / 60).toString().padStart(2, '0');
  const secs = (elapsedSeconds % 60).toString().padStart(2, '0');
  const timerStr = `${mins}:${secs}`;

  // Render RESULTS screen
  if (phase === 'results' && result) {
    const rMins = Math.floor(result.timeTaken / 60);
    const rSecs = result.timeTaken % 60;
    const timeTakenStr = rMins > 0 ? `${rMins}m ${rSecs}s` : `${rSecs}s`;

    const scoreColor = result.accuracy >= 80 
      ? 'text-green-600' 
      : result.accuracy >= 50 
      ? 'text-amber-600' 
      : 'text-red-600';

    return (
      <div className="max-w-[600px] mx-auto py-12 px-4 font-sans">
        <div className="rounded-lg border border-[#e6dfd8] bg-white p-8 shadow-sm text-center mb-6">
          {/* Score Hero */}
          <div className="flex items-baseline justify-center mb-2">
            <span className={`text-6xl font-bold ${scoreColor}`}>
              {result.score}
            </span>
            <span className="text-3xl text-zinc-400 font-light ml-1">
              / {result.totalAttempted}
            </span>
          </div>
          <p className="text-sm text-[#6c6a64] font-medium mb-6">Correct Answers</p>

          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
            {/* Card 1: Accuracy */}
            <div className="bg-white border border-[#e6dfd8] rounded-lg p-4 text-center">
              <div className="text-[10px] font-bold text-[#8e8b82] uppercase mb-1">Accuracy</div>
              <div className={`text-xl font-bold ${scoreColor}`}>{result.accuracy}%</div>
            </div>

            {/* Card 2: Time Taken (TEST mode only) */}
            {mode === 'test' && (
              <div className="bg-white border border-[#e6dfd8] rounded-lg p-4 text-center">
                <div className="text-[10px] font-bold text-[#8e8b82] uppercase mb-1">Time Taken</div>
                <div className="text-xl font-bold text-zinc-800">{timeTakenStr}</div>
              </div>
            )}

            {/* Card 3: Rank (TEST mode only) */}
            {mode === 'test' && (
              <div className="bg-white border border-[#e6dfd8] rounded-lg p-4 text-center">
                <div className="text-[10px] font-bold text-[#8e8b82] uppercase mb-1">Leaderboard Rank</div>
                <div className="text-xl font-bold text-[#cc785c]">#{result.rank}</div>
                <div className="text-[9px] text-[#6c6a64] mt-0.5">on {quizData.topicName}</div>
              </div>
            )}
          </div>
        </div>

        {/* Question Review Section */}
        <div className="mb-8 text-left">
          <h3 className="text-base font-semibold text-[#141413] mb-4">Question Review</h3>
          <div className="space-y-3">
            {result.questionsWithSolutions.map((q: any) => {
              const isExpanded = !!expandedQuestions[q.id];
              const matched = quizData.questions.find(orig => orig.id === q.id);
              const selectedOptionLetter = answers[q.id];
              const isCorrect = selectedOptionLetter === q.correctOption;
              const selectedText = selectedOptionLetter && matched ? matched.options[selectedOptionLetter as 'A'|'B'|'C'|'D'] : '';
              const correctText = matched ? matched.options[q.correctOption as 'A'|'B'|'C'|'D'] : '';
              const qOrder = matched ? matched.order : q.order;
              const qStatement = matched ? matched.statement : q.statement;

              return (
                <div key={q.id} className="border border-[#e6dfd8] rounded-xl overflow-hidden bg-white shadow-sm transition-all duration-200">
                  {/* Summary Row */}
                  <div
                    onClick={() => toggleQuestionExpand(q.id)}
                    className={`flex items-center justify-between p-3.5 cursor-pointer select-none transition-colors duration-150 ${
                      isCorrect ? 'bg-[#f0fdf4]/50 hover:bg-[#f0fdf4]' : 'bg-[#fef2f2]/50 hover:bg-[#fef2f2]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate mr-4">
                      <span className="text-sm leading-none flex-shrink-0 select-none">
                        {isCorrect ? '✅' : '❌'}
                      </span>
                      <span className="font-bold text-xs text-[#8e8b82] font-mono flex-shrink-0">
                        Q{qOrder}
                      </span>
                      <span className="text-sm text-[#141413] truncate font-medium">
                        {qStatement}
                      </span>
                    </div>
                    <span className="text-xs text-[#8e8b82] font-semibold whitespace-nowrap">
                      Ans: {q.correctOption}
                    </span>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="p-5 border-t border-[#e6dfd8] bg-zinc-50/40 space-y-4 text-left">
                      <div>
                        <div className="text-[10px] font-bold tracking-wider text-[#8e8b82] uppercase mb-1.5 font-sans">
                          Full Statement
                        </div>
                        <p className="text-sm text-[#3d3d3a] leading-relaxed whitespace-pre-line font-medium font-sans">
                          {qStatement}
                        </p>
                      </div>

                      <div className="space-y-2 font-sans">
                        <div>
                          <span className="text-xs font-semibold text-[#6c6a64] mr-2">Your Answer:</span>
                          <span className={`text-sm font-bold ${isCorrect ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>
                            {selectedOptionLetter ? `${selectedOptionLetter} — ${selectedText}` : 'Unanswered'}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-[#6c6a64] mr-2">Correct Answer:</span>
                          <span className="text-sm font-bold text-[#16a34a]">
                            {q.correctOption} — {correctText}
                          </span>
                        </div>
                      </div>

                      <hr className="border-[#e6dfd8] my-3" />

                      <div className="font-sans">
                        <div className="text-[10px] font-bold tracking-wider text-[#8e8b82] uppercase mb-1">
                          Solution Description
                        </div>
                        <p className="text-[13px] leading-relaxed text-[#3d3d3a] whitespace-pre-line font-medium">
                          {q.solution}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          {mode === 'test' ? (
            <>
              <button
                onClick={() => {
                  window.location.href = `/practice/${quizData.topicSlug}#leaderboard`;
                }}
                className="inline-flex h-10 items-center justify-center rounded-[8px] bg-[#cc785c] px-6 text-sm font-semibold text-white shadow-lg shadow-[#cc785c]/10 transition-all hover:bg-[#a9583e] active:scale-[0.98] cursor-pointer"
              >
                View Leaderboard
              </button>
              <button
                onClick={() => {
                  window.location.href = `/practice/${quizData.topicSlug}`;
                }}
                className="inline-flex h-10 items-center justify-center rounded-[8px] border border-[#e6dfd8] bg-[#faf9f5] px-6 text-sm font-semibold text-[#3d3d3a] hover:bg-[#f5f0e8]/30 transition-all active:scale-[0.98] cursor-pointer"
              >
                Back to Topic
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  window.location.reload();
                }}
                className="inline-flex h-10 items-center justify-center rounded-[8px] bg-[#cc785c] px-6 text-sm font-semibold text-white shadow-lg shadow-[#cc785c]/10 transition-all hover:bg-[#a9583e] active:scale-[0.98] cursor-pointer"
              >
                Try Again
              </button>
              <button
                onClick={() => {
                  window.location.href = `/practice/${quizData.topicSlug}`;
                }}
                className="inline-flex h-10 items-center justify-center rounded-[8px] border border-[#e6dfd8] bg-[#faf9f5] px-6 text-sm font-semibold text-[#3d3d3a] hover:bg-[#f5f0e8]/30 transition-all active:scale-[0.98] cursor-pointer"
              >
                Back to Topic
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#e6dfd8] w-full py-4 px-6 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-[#cc785c] mb-1.5">
            Question {currentQuestion + 1} of {totalQuestions}
          </div>
          {/* Step Dots Row */}
          <div className="flex items-center gap-1 overflow-x-auto sm:overflow-visible py-1">
            {Array.from({ length: totalQuestions }).map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full flex-shrink-0 transition-all duration-300 ${
                  idx < currentQuestion
                    ? 'bg-[#cc785c]'
                    : idx === currentQuestion
                    ? 'border-2 border-[#cc785c] bg-white'
                    : 'border-2 border-[#e6dfd8] bg-white'
                } ${totalQuestions > 15 ? 'hidden sm:block' : ''}`}
              />
            ))}
          </div>
        </div>

        {mode === 'test' && (
          <div className="text-sm font-semibold font-mono text-[#141413] bg-[#f5f0e8] px-3 py-1.5 rounded-md border border-[#e6dfd8]">
            {timerStr}
          </div>
        )}
      </div>

      {/* Progress Bar Track */}
      <div className="w-full h-[3px] bg-[#e6dfd8]">
        <div
          className="h-full bg-[#cc785c] transition-all duration-300 ease-out"
          style={{ width: `${Math.round((currentQuestion / totalQuestions) * 100)}%` }}
        />
      </div>

      {/* Main Question Card Content */}
      <div className="max-w-[680px] mx-auto py-12 px-4">
        <div className="rounded-lg border border-[#e6dfd8] bg-white p-8 shadow-sm">
            <span className="inline-block text-[12px] font-bold text-[#8e8b82] tracking-wider uppercase mb-3">
              Q{currentQuestion + 1}
            </span>
            <div className="text-[15px] leading-relaxed text-[#141413] font-sans mb-8 whitespace-pre-line font-medium">
              {currentQ.statement}
            </div>

            {/* Options List */}
            <div className="flex flex-col gap-2.5">
              {(Object.keys(currentQ.options) as Array<'A' | 'B' | 'C' | 'D'>).map((key) => {
                const optionText = currentQ.options[key];
                const isSelected = selectedOption === key;

                // Compute styling classes
                let buttonStyle = 'bg-white border border-[#e6dfd8] text-[#141413]';
                let badgeStyle = 'bg-[#f5f0e8] text-[#cc785c]';

                if (correctOptionForCurrent) {
                  const isCorrect = correctOptionForCurrent === key;
                  if (isCorrect) {
                    // Correct answer style (revealed green)
                    buttonStyle = 'border-[#16a34a] bg-[#f0fdf4] text-zinc-900';
                    badgeStyle = 'bg-[#16a34a] text-white';
                  } else if (isSelected) {
                    // Wrong selected style (red)
                    buttonStyle = 'border-[#dc2626] bg-[#fef2f2] text-zinc-900';
                    badgeStyle = 'bg-[#dc2626] text-white';
                  } else {
                    // Other options unselected
                    buttonStyle = 'border-[#e6dfd8] bg-white text-[#141413] opacity-45';
                  }
                } else if (isSelected) {
                  // Option is clicked but correctOption is not resolved yet (during popup phase)
                  buttonStyle = 'border-[#cc785c] bg-[#f5f0e8] text-zinc-900';
                  badgeStyle = 'bg-[#cc785c] text-white';
                } else if (buttonsDisabled) {
                  // Other options while selection is loading/popup is up
                  buttonStyle = 'border-[#e6dfd8] bg-white text-[#141413] opacity-45';
                } else {
                  // Default state
                  buttonStyle += ' hover:border-[#c4bbb0] hover:bg-[#faf9f5]/60';
                }

                return (
                  <button
                    key={key}
                    onClick={() => handleOptionClick(currentQ.id, key)}
                    disabled={buttonsDisabled}
                    className={`flex items-center gap-3 w-full rounded-[10px] p-[14px_16px] transition-all duration-150 text-left border ${buttonStyle} ${
                      buttonsDisabled ? 'pointer-events-none cursor-default' : 'cursor-pointer'
                    }`}
                  >
                    <span className={`w-7 h-7 rounded-[6px] font-bold text-[13px] flex items-center justify-center flex-shrink-0 transition-colors duration-150 ${badgeStyle}`}>
                      {key}
                    </span>
                    <span className="text-sm leading-relaxed font-sans">{optionText}</span>
                  </button>
                );
              })}
          </div>
        </div>
      </div>

      {/* Render FeedbackPopup component */}
      {phase === 'popup' && popupData && (
        <FeedbackPopup
          data={popupData}
          mode={mode}
          onDismiss={() => handlePopupDismiss(popupData.correctOption)}
          questions={quizData.questions}
          currentQuestionIndex={currentQuestion}
        />
      )}
    </div>
  );
}

export default QuizInterface;
