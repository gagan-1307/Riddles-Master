import React, { useState, useEffect } from 'react';

interface PopupData {
  correct: boolean;
  selectedOption: string;
  correctOption: string;
  solution: string;
  timeTakenThisQuestion: number;
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
}

interface FeedbackPopupProps {
  data: PopupData;
  mode: 'practice' | 'test';
  onDismiss: () => void;
  questions: Question[];
  currentQuestionIndex: number;
}

export function FeedbackPopup({ data, mode, onDismiss, questions, currentQuestionIndex }: FeedbackPopupProps) {
  const [dismissing, setDismissing] = useState(false);

  const triggerDismiss = () => {
    setDismissing(true);
    setTimeout(() => {
      onDismiss();
    }, 150); // wait for fade-out animation
  };

  // 1. TEST mode auto-dismiss after 3s
  useEffect(() => {
    if (mode !== 'test') return;
    const timer = setTimeout(triggerDismiss, 3000);
    return () => clearTimeout(timer);
  }, [mode]);

  // 2. Escape key listener to dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        triggerDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Get active question details to show option recap
  const currentQ = questions[currentQuestionIndex];

  return (
    <>
      {/* Styles injection for keyframes and animations */}
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .animate-popup-in {
            animation: popupIn 200ms ease-out forwards;
          }
          .animate-popup-out {
            animation: popupOut 150ms ease-out forwards;
          }
          .animate-shrink-bar {
            animation: shrinkBar 3000ms linear forwards;
          }
        }

        @keyframes popupIn {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes popupOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        @keyframes shrinkBar {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>

      {/* Transparent Click-Outside Overlay */}
      <div 
        className="fixed inset-0 z-49 bg-transparent cursor-default"
        onClick={triggerDismiss}
      />

      {/* Popup Window Container */}
      <div
        className={`fixed bottom-6 right-6 z-50 w-[320px] max-w-[calc(100vw-48px)] bg-white rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] border-2 flex flex-col overflow-hidden transition-all duration-150 ${
          data.correct ? 'border-[#16a34a]' : 'border-[#dc2626]'
        } ${dismissing ? 'animate-popup-out' : 'animate-popup-in'}`}
      >
        {/* Header Row */}
        <div className="flex items-center justify-between px-4 pt-3.5 pb-2.5">
          <div className="flex items-center">
            <span className="text-[18px] leading-none select-none">
              {data.correct ? '✅' : '❌'}
            </span>
            <span className={`ml-2 text-[15px] font-semibold font-sans ${
              data.correct ? 'text-[#15803d]' : 'text-[#b91c1c]'
            }`}>
              {data.correct ? 'Correct!' : 'Incorrect'}
            </span>
          </div>
          <span className="text-xs text-[#8e8b82] font-semibold font-mono">
            {data.timeTakenThisQuestion.toFixed(1)}s
          </span>
        </div>

        <hr className="border-[#e6dfd8] my-0" />

        {/* Options Recap */}
        {currentQ && (
          <div className="px-4 py-2.5">
            {(Object.keys(currentQ.options) as Array<'A' | 'B' | 'C' | 'D'>).map((key) => {
              const optionText = currentQ.options[key];
              const isCorrectOption = data.correctOption === key;
              const isSelectedOption = data.selectedOption === key;

              let rowStyle = 'text-[#6c6a64]';
              let badgeStyle = 'bg-[#f5f0e8] text-[#cc785c]';
              let prefix = '';

              if (isCorrectOption) {
                rowStyle = 'bg-[#f0fdf4] border-l-[3px] border-[#16a34a] text-zinc-900 font-medium';
                badgeStyle = 'bg-[#16a34a] text-white';
                prefix = '✓ ';
              } else if (isSelectedOption) {
                rowStyle = 'bg-[#fef2f2] border-l-[3px] border-[#dc2626] text-zinc-900';
                badgeStyle = 'bg-[#dc2626] text-white';
                prefix = '✗ ';
              }

              return (
                <div
                  key={key}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-md mb-1 text-[13px] ${rowStyle}`}
                >
                  {prefix && (
                    <span className={`text-[13px] font-bold ${
                      isCorrectOption ? 'text-[#16a34a]' : 'text-[#dc2626]'
                    }`}>
                      {prefix}
                    </span>
                  )}
                  <span className={`w-5 h-5 text-[10px] rounded font-bold flex items-center justify-center flex-shrink-0 ${badgeStyle}`}>
                    {key}
                  </span>
                  <span className="truncate flex-1 font-sans">{optionText}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Solution section */}
        <div className="px-4 pb-3">
          <div className="text-[10px] font-bold tracking-wider text-[#8e8b82] uppercase mb-1 font-sans">
            Solution
          </div>
          <p className="text-[13px] leading-relaxed text-[#3d3d3a] font-sans whitespace-pre-line font-medium max-h-[120px] overflow-y-auto pr-1">
            {data.solution}
          </p>
        </div>

        {/* Practice Mode Next Button */}
        {mode === 'practice' && (
          <div className="px-4 pb-3.5 pt-1">
            <button
              onClick={triggerDismiss}
              className="inline-flex h-9 w-full items-center justify-center rounded-[8px] border border-[#e6dfd8] bg-[#faf9f5] px-4 text-xs font-semibold text-[#3d3d3a] hover:bg-[#f5f0e8]/30 transition-all active:scale-[0.98] cursor-pointer"
            >
              Next →
            </button>
          </div>
        )}

        {/* Timer countdown bar (TEST mode only) */}
        {mode === 'test' && (
          <div className="w-full h-1 bg-zinc-100 mt-auto">
            <div
              className={`h-full animate-shrink-bar ${
                data.correct ? 'bg-[#16a34a]' : 'bg-[#dc2626]'
              }`}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default FeedbackPopup;
