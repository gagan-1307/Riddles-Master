import React, { useState } from 'react';
import { Lock, HelpCircle, Flame } from 'lucide-react';
import CompleteButton from './CompleteButton';

interface Tag {
  id: string;
  name: string;
  type: 'COMPANY' | 'TYPE';
}

interface ProblemsOnTags {
  problemId: string;
  tagId: string;
  tag: Tag;
}

interface Problem {
  id: string;
  number: number;
  slug: string;
  title: string;
  statement: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  isPremium: boolean;
  answer: string | null;
  editorial: string | null;
  tags: ProblemsOnTags[];
}

interface DailyPageProps {
  problem: Problem;
  user: { id: string; email: string } | null;
  isCompletedToday: boolean;
  initialStreak: number;
  dateStr: string; // YYYY-MM-DD
}

export default function DailyPage({
  problem,
  user,
  isCompletedToday,
  initialStreak,
  dateStr,
}: DailyPageProps) {
  const [revealAnswer, setRevealAnswer] = useState(false);
  const [streak, setStreak] = useState(initialStreak);

  // Format YYYY-MM-DD into a human-readable long date (e.g. Tuesday, June 9, 2026)
  const formatFriendlyDate = (dateString: string) => {
    try {
      const [year, month, day] = dateString.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (e) {
      return dateString;
    }
  };

  const getDifficultyStyles = (difficulty: 'EASY' | 'MEDIUM' | 'HARD') => {
    switch (difficulty) {
      case 'EASY':
        return 'bg-[#5db872]/10 text-[#2e7d32] border border-[#5db872]/20';
      case 'MEDIUM':
        return 'bg-[#e8a55a]/10 text-[#b26a00] border border-[#e8a55a]/20';
      case 'HARD':
        return 'bg-[#c64545]/10 text-[#c64545] border border-[#c64545]/20';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const companyTags = problem.tags.filter(({ tag }) => tag.type === 'COMPANY');
  const typeTags = problem.tags.filter(({ tag }) => tag.type === 'TYPE');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header section with streak indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#e6dfd8] pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#cc785c]">
            Daily Challenge
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#141413] mt-1">
            Today's Daily Riddle
          </h1>
          <p className="text-[15px] text-[#6c6a64] mt-1.5 font-medium">
            {formatFriendlyDate(dateStr)}
          </p>
        </div>

        {user && (
          <div className="self-start sm:self-center flex items-center gap-2 rounded-full bg-[#fdf6e2] border border-[#f5d996] px-4 py-1.5 text-sm font-semibold text-[#b25e00] shadow-sm">
            <Flame className="h-4 w-4 text-orange-500 fill-orange-500 animate-pulse" />
            <span>Daily Streak:</span>
            <span className="font-bold">{streak} {streak === 1 ? 'day' : 'days'}</span>
          </div>
        )}
      </div>

      {/* Main Problem Statement Card */}
      <div className="rounded-lg border border-[#e6dfd8] bg-[#faf9f5] p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e6dfd8] pb-5 mb-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-mono text-sm font-bold text-[#6c6a64]">
              Problem #{problem.number}
            </span>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${getDifficultyStyles(
                problem.difficulty
              )}`}
            >
              {problem.difficulty}
            </span>
            {problem.isPremium && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#cc785c]/10 px-2.5 py-0.5 text-xs font-bold text-[#cc785c] border border-[#cc785c]/20">
                <Lock className="h-3 w-3" /> Premium
              </span>
            )}
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#141413] mb-4">
          {problem.title}
        </h2>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {companyTags.map(({ tag }) => (
            <span
              key={tag.id}
              className="inline-flex items-center rounded-full bg-[#cc785c]/10 px-2.5 py-0.5 text-xs font-medium text-[#cc785c] border border-[#cc785c]/20"
            >
              {tag.name}
            </span>
          ))}
          {typeTags.map(({ tag }) => (
            <span
              key={tag.id}
              className="inline-flex items-center rounded-full bg-[#efe9de] px-2.5 py-0.5 text-xs font-medium text-[#141413] border border-[#e6dfd8]"
            >
              {tag.name}
            </span>
          ))}
        </div>

        {/* Problem Statement text */}
        <div className="prose max-w-none text-[#3d3d3a] leading-relaxed space-y-4 whitespace-pre-line text-[16px] border-t border-[#e6dfd8] pt-6">
          {problem.statement}
        </div>
      </div>

      {/* Answer Gated Section */}
      <div className="rounded-lg border border-[#e6dfd8] bg-[#faf9f5] p-8 shadow-sm">
        <h3 className="text-xl font-bold font-serif text-[#141413] mb-4 border-b border-[#e6dfd8] pb-3 flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-[#cc785c]" />
          <span>Answer & Quick Explanation</span>
        </h3>

        {user ? (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setRevealAnswer(!revealAnswer)}
                className="inline-flex h-10 items-center justify-center rounded-md bg-[#cc785c] px-5 text-sm font-semibold text-white transition-all hover:bg-[#a9583e] active:scale-[0.98] cursor-pointer"
              >
                {revealAnswer ? 'Hide Answer' : 'Reveal Answer'}
              </button>

              <CompleteButton
                problemId={problem.id}
                initialCompleted={isCompletedToday}
                onStreakUpdate={(newStreak) => setStreak(newStreak)}
              />
            </div>

            {revealAnswer && (
              <div className="rounded-md border border-[#e6dfd8] bg-[#f5f0e8]/30 p-5 text-[#3d3d3a] leading-relaxed text-[15px] whitespace-pre-line animate-in fade-in duration-200">
                {problem.answer}
              </div>
            )}
          </div>
        ) : (
          /* Inline Login Prompt container matching Claude design styling */
          <div className="rounded-md border border-dashed border-[#e6dfd8] bg-[#f5f0e8]/20 p-8 text-center max-w-md mx-auto my-4">
            <div className="mx-auto h-12 w-12 rounded-full bg-[#cc785c]/10 flex items-center justify-center text-[#cc785c] mb-4">
              <Lock className="h-5 w-5 text-[#cc785c]" />
            </div>
            <h4 className="text-lg font-bold text-[#141413] mb-2 font-serif">Logged-in Users Only</h4>
            <p className="text-sm text-[#6c6a64] mb-6 leading-relaxed">
              You must be logged in to view the answer and check your solution. Signing up is free and takes less than a minute.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/login"
                className="inline-flex h-10 items-center justify-center rounded-md bg-[#181715] px-6 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
              >
                Log In
              </a>
              <a
                href="/signup"
                className="inline-flex h-10 items-center justify-center rounded-md border border-[#e6dfd8] bg-[#faf9f5] px-6 text-sm font-semibold text-[#3d3d3a] hover:bg-[#f5f0e8]/30 transition-all active:scale-[0.98]"
              >
                Sign Up Free
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
