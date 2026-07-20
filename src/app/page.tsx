import React, { useState, useEffect } from 'react';
import { Zap, Target, BookOpen, ArrowRight, Flame, Lock } from 'lucide-react';

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
  tags?: ProblemsOnTags[];
}

interface HomePageProps {
  todaysProblem?: Problem | null;
  streakCount?: number | null;
}

export default function HomePage({
  todaysProblem: initialProblem = null,
  streakCount: initialStreak = null,
}: HomePageProps = {}) {
  const [todaysProblem, setTodaysProblem] = useState<Problem | null>(initialProblem);
  const [streakCount, setStreakCount] = useState<number | null>(initialStreak);
  const [isLoading, setIsLoading] = useState<boolean>(!initialProblem);

  useEffect(() => {
    // If initial data wasn't provided via SSR props, fetch client-side
    if (!initialProblem) {
      let isMounted = true;
      fetch('/api/daily')
        .then((res) => res.json())
        .then((data) => {
          if (isMounted) {
            if (data.todaysProblem) setTodaysProblem(data.todaysProblem);
            if (data.streakCount !== undefined) setStreakCount(data.streakCount);
            setIsLoading(false);
          }
        })
        .catch((err) => {
          console.error('Failed to fetch daily problem:', err);
          if (isMounted) setIsLoading(false);
        });

      return () => {
        isMounted = false;
      };
    }
  }, [initialProblem]);

  return (
    <div className="w-full bg-[#faf9f5] text-[#141413] font-sans antialiased overflow-x-hidden">
      {/* Floating Ambient Gradients for Hero */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes float-slow-1 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(60px, -80px) scale(1.15); }
        }
        @keyframes float-slow-2 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(-70px, 50px) scale(1.2); }
        }
        @keyframes float-slow-3 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(60px, 40px) scale(0.9); }
        }
        .animate-float-1 { animation: float-slow-1 25s infinite ease-in-out; }
        .animate-float-2 { animation: float-slow-2 30s infinite ease-in-out; }
        .animate-float-3 { animation: float-slow-3 28s infinite ease-in-out; }
      `}} />

      {/* (a) HERO SECTION */}
      <section className="relative overflow-hidden py-24 sm:py-32 border-b border-[#e6dfd8]">
        {/* Ambient blurred spheres */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-15%] w-[600px] h-[600px] rounded-full bg-[#cc785c]/8 blur-[120px] animate-float-1"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#5db8a6]/8 blur-[120px] animate-float-2"></div>
          <div className="absolute top-[20%] left-[30%] w-[450px] h-[450px] rounded-full bg-[#e8a55a]/7 blur-[100px] animate-float-3"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-[1200px] px-6 text-center">
          <h1 className="text-4xl sm:text-6xl font-normal tracking-tight text-[#141413] font-serif max-w-4xl mx-auto leading-[1.08] mb-6">
            Riddles, Brain Teasers & Aptitude Puzzles for Every Curious Mind
          </h1>
          <p className="text-lg sm:text-xl text-[#3d3d3a] max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
            Practice daily riddles, logic puzzles, aptitude questions, and reasoning tests — free for curious minds of all ages.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/login"
              className="w-full sm:w-auto h-12 inline-flex items-center justify-center rounded-md bg-[#cc785c] px-8 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#a9583e] active:scale-[0.98]"
            >
              Start Solving Free
            </a>
            <a
              href="/problems"
              className="w-full sm:w-auto h-12 inline-flex items-center justify-center rounded-md border border-[#e6dfd8] bg-[#faf9f5] px-8 text-sm font-semibold text-[#141413] transition-all hover:bg-[#f5f0e8] active:scale-[0.98]"
            >
              Browse Problems
            </a>
          </div>
        </div>
      </section>

      {/* (b) DAILY RIDDLE WIDGET */}
      <section className="py-20 bg-[#faf9f5]">
        <div className="mx-auto max-w-[800px] px-6">
          <div className="rounded-xl border border-[#e6dfd8] bg-[#efe9de]/40 p-8 sm:p-10 shadow-sm relative overflow-hidden">
            {/* Soft decorative background highlight */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#cc785c]/5 rounded-bl-full pointer-events-none"></div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#e6dfd8] pb-6 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6c6a64] bg-[#efe9de] px-3 py-1 rounded-md">
                  Today's Daily Riddle
                </span>
                {isLoading ? (
                  <span className="h-5 w-24 bg-[#efe9de] rounded-full animate-pulse"></span>
                ) : todaysProblem ? (
                  <span className="text-xs font-semibold text-[#cc785c] bg-[#cc785c]/10 px-2.5 py-1 rounded-full border border-[#cc785c]/20">
                    Riddle #{todaysProblem.number}
                  </span>
                ) : null}
              </div>
              {isLoading ? (
                <div className="h-6 w-28 bg-[#efe9de] rounded-full animate-pulse"></div>
              ) : streakCount !== null && streakCount > 0 ? (
                <div className="flex items-center gap-1.5 text-sm font-semibold text-[#cc785c] bg-[#cc785c]/10 px-3 py-1 rounded-full border border-[#cc785c]/20 w-fit">
                  <Flame className="h-4 w-4 fill-current animate-pulse" />
                  <span>{streakCount} Day Streak</span>
                </div>
              ) : null}
            </div>

            {isLoading ? (
              <div className="animate-pulse space-y-4 py-2">
                <div className="h-7 bg-[#efe9de] rounded-md w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-[#efe9de] rounded-md w-full"></div>
                  <div className="h-4 bg-[#efe9de] rounded-md w-5/6"></div>
                </div>
                <div className="flex items-center justify-between pt-3">
                  <div className="h-6 bg-[#efe9de] rounded-full w-20"></div>
                  <div className="h-6 bg-[#efe9de] rounded-md w-24"></div>
                </div>
              </div>
            ) : todaysProblem ? (
              <div>
                <h3 className="text-xl sm:text-2xl font-normal text-[#141413] font-serif mb-3">
                  {todaysProblem.title}
                </h3>
                <p className="text-sm sm:text-base text-[#3d3d3a] leading-relaxed mb-6 italic">
                  "{todaysProblem.statement.replace(/<[^>]*>/g, '').substring(0, 150)}..."
                </p>
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold border ${todaysProblem.difficulty === 'EASY' ? 'bg-[#5db872]/10 text-[#2e7d32] border-[#5db872]/20' :
                      todaysProblem.difficulty === 'MEDIUM' ? 'bg-[#e8a55a]/10 text-[#b26a00] border-[#e8a55a]/20' :
                        'bg-[#c64545]/10 text-[#c64545] border-[#c64545]/20'
                    }`}>
                    {todaysProblem.difficulty}
                  </span>
                  <a
                    href="/daily"
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-[#cc785c] hover:text-[#a9583e] transition-colors"
                  >
                    Solve It <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-[#6c6a64] italic">
                No daily riddle is available for today. Check back later!
              </div>
            )}
          </div>
        </div>
      </section>

      {/* PRACTICE BY CATEGORY SECTION */}
      <section className="py-20 bg-[#f5f0e8]/20 border-t border-[#e6dfd8]">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-16 text-center">
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-[#141413] font-serif mb-4 animate-in fade-in duration-700">
              Practice by Assessment Category
            </h2>
            <p className="text-base text-[#6c6a64] max-w-xl mx-auto font-sans">
              Strengthen your cognitive framework with our free career aptitude and reasoning mock tests.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Aptitude Card */}
            <a 
              href="/practice?category=aptitude" 
              className="group flex flex-col justify-between bg-[#fdfcf7] border border-[#e6dfd8] rounded-xl p-8 transition-all duration-300 hover:bg-white hover:border-[#cc785c] hover:shadow-[0_8px_30px_rgba(204,120,92,0.06)] hover:-translate-y-1 cursor-pointer decoration-none"
            >
              <div>
                <div className="w-12 h-12 rounded-lg bg-[#efe9de]/40 border border-[#e6dfd8] flex items-center justify-center text-[#6c6a64] mb-6 transition-all duration-300 group-hover:scale-105 group-hover:bg-[#cc785c]/10 group-hover:border-[#cc785c]/20 group-hover:text-[#cc785c]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-serif text-lg font-normal text-[#141413] group-hover:text-[#cc785c] transition-colors leading-tight mb-3">
                  Quantitative Aptitude
                </h3>
                <p className="text-sm text-[#5c5952] font-sans leading-relaxed">
                  Practice numerical reasoning, percentage charts, averages, and job aptitude tests with solved examples.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-1.5 text-xs font-bold text-[#cc785c] transition-colors group-hover:text-[#a9583e]">
                <span>Practice Aptitude</span>
                <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </a>

            {/* Logical Reasoning Card */}
            <a 
              href="/practice?category=logical_reasoning" 
              className="group flex flex-col justify-between bg-[#fdfcf7] border border-[#e6dfd8] rounded-xl p-8 transition-all duration-300 hover:bg-white hover:border-[#cc785c] hover:shadow-[0_8px_30px_rgba(204,120,92,0.06)] hover:-translate-y-1 cursor-pointer decoration-none"
            >
              <div>
                <div className="w-12 h-12 rounded-lg bg-[#efe9de]/40 border border-[#e6dfd8] flex items-center justify-center text-[#6c6a64] mb-6 transition-all duration-300 group-hover:scale-105 group-hover:bg-[#cc785c]/10 group-hover:border-[#cc785c]/20 group-hover:text-[#cc785c]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="font-serif text-lg font-normal text-[#141413] group-hover:text-[#cc785c] transition-colors leading-tight mb-3">
                  Logical Reasoning
                </h3>
                <p className="text-sm text-[#5c5952] font-sans leading-relaxed">
                  Improve deductive vs inductive reasoning, syllogisms, circular reasoning fallacies, and abductive scenarios.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-1.5 text-xs font-bold text-[#cc785c] transition-colors group-hover:text-[#a9583e]">
                <span>Practice Logic</span>
                <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </a>

            {/* Verbal Reasoning Card */}
            <a 
              href="/practice?category=verbal_reasoning" 
              className="group flex flex-col justify-between bg-[#fdfcf7] border border-[#e6dfd8] rounded-xl p-8 transition-all duration-300 hover:bg-white hover:border-[#cc785c] hover:shadow-[0_8px_30px_rgba(204,120,92,0.06)] hover:-translate-y-1 cursor-pointer decoration-none"
            >
              <div>
                <div className="w-12 h-12 rounded-lg bg-[#efe9de]/40 border border-[#e6dfd8] flex items-center justify-center text-[#6c6a64] mb-6 transition-all duration-300 group-hover:scale-105 group-hover:bg-[#cc785c]/10 group-hover:border-[#cc785c]/20 group-hover:text-[#cc785c]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="font-serif text-lg font-normal text-[#141413] group-hover:text-[#cc785c] transition-colors leading-tight mb-3">
                  Verbal Reasoning
                </h3>
                <p className="text-sm text-[#5c5952] font-sans leading-relaxed">
                  Succeed in verbal reasoning tests with analogies, sentence correction, reading comprehension, synonyms & antonyms.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-1.5 text-xs font-bold text-[#cc785c] transition-colors group-hover:text-[#a9583e]">
                <span>Practice Verbal</span>
                <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </a>

            {/* Non-Verbal Reasoning Card */}
            <a 
              href="/practice?category=nonverbal_reasoning" 
              className="group flex flex-col justify-between bg-[#fdfcf7] border border-[#e6dfd8] rounded-xl p-8 transition-all duration-300 hover:bg-white hover:border-[#cc785c] hover:shadow-[0_8px_30px_rgba(204,120,92,0.06)] hover:-translate-y-1 cursor-pointer decoration-none"
            >
              <div>
                <div className="w-12 h-12 rounded-lg bg-[#efe9de]/40 border border-[#e6dfd8] flex items-center justify-center text-[#6c6a64] mb-6 transition-all duration-300 group-hover:scale-105 group-hover:bg-[#cc785c]/10 group-hover:border-[#cc785c]/20 group-hover:text-[#cc785c]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <h3 className="font-serif text-lg font-normal text-[#141413] group-hover:text-[#cc785c] transition-colors leading-tight mb-3">
                  Non-Verbal Reasoning
                </h3>
                <p className="text-sm text-[#5c5952] font-sans leading-relaxed">
                  Solve visual non-verbal reasoning questions, mirror images, figure matrix grids, and shape pattern completions.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-1.5 text-xs font-bold text-[#cc785c] transition-colors group-hover:text-[#a9583e]">
                <span>Practice Visual</span>
                <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* (c) STATS BAR */}
      <section className="border-y border-[#e6dfd8] bg-[#f5f0e8]/30 py-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 text-center md:divide-x md:divide-[#e6dfd8]">
            <div className="flex flex-col items-center">
              <span className="text-5xl font-light text-[#141413] font-serif mb-2">
                105
              </span>
              <span className="text-xs uppercase tracking-[0.1em] font-semibold text-[#6c6a64]">
                Curated Riddles
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-5xl font-light text-[#141413] font-serif mb-2">
                117
              </span>
              <span className="text-xs uppercase tracking-[0.1em] font-semibold text-[#6c6a64]">
                Active Thinkers
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-5xl font-light text-[#141413] font-serif mb-2">
                12
              </span>
              <span className="text-xs uppercase tracking-[0.1em] font-semibold text-[#6c6a64]">
                Company Tracks
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* (d) FEATURES SECTION */}
      <section className="py-24 bg-[#faf9f5]">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-16 text-center">
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-[#141413] font-serif mb-4">
              Everything you need to grow
            </h2>
            <p className="text-base text-[#6c6a64] max-w-xl mx-auto font-sans">
              Our platform is designed specifically to help curious minds build critical reasoning, logical deduction, and spatial awareness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group flex flex-col items-start bg-[#fdfcf7] border border-[#e6dfd8] rounded-xl p-8 sm:p-10 transition-all duration-300 hover:bg-white hover:border-[#cc785c] hover:shadow-[0_8px_30px_rgba(204,120,92,0.06)] hover:-translate-y-1">
              <div className="w-12 h-12 rounded-lg bg-[#efe9de]/40 border border-[#e6dfd8] flex items-center justify-center text-[#6c6a64] mb-6 transition-all duration-300 group-hover:scale-105 group-hover:bg-[#cc785c]/10 group-hover:border-[#cc785c]/20 group-hover:text-[#cc785c]">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-lg font-normal text-[#141413] group-hover:text-[#cc785c] transition-colors mb-3">Daily Puzzles</h3>
              <p className="text-sm text-[#5c5952] font-sans leading-relaxed">
                Receive a fresh, handpicked logic challenge or riddle every single day to form a consistent and engaging daily brain training habit.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group flex flex-col items-start bg-[#fdfcf7] border border-[#e6dfd8] rounded-xl p-8 sm:p-10 transition-all duration-300 hover:bg-white hover:border-[#cc785c] hover:shadow-[0_8px_30px_rgba(204,120,92,0.06)] hover:-translate-y-1">
              <div className="w-12 h-12 rounded-lg bg-[#efe9de]/40 border border-[#e6dfd8] flex items-center justify-center text-[#6c6a64] mb-6 transition-all duration-300 group-hover:scale-105 group-hover:bg-[#cc785c]/10 group-hover:border-[#cc785c]/20 group-hover:text-[#cc785c]">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-lg font-normal text-[#141413] group-hover:text-[#cc785c] transition-colors mb-3">Curated Tracks</h3>
              <p className="text-sm text-[#5c5952] font-sans leading-relaxed">
                Browse categories from math riddles for adults to puzzles for kids, or target specific interview brain teasers and placement exams.
              </p>
            </div>

            {/* Card 3 */}
            <div className="group flex flex-col items-start bg-[#fdfcf7] border border-[#e6dfd8] rounded-xl p-8 sm:p-10 transition-all duration-300 hover:bg-white hover:border-[#cc785c] hover:shadow-[0_8px_30px_rgba(204,120,92,0.06)] hover:-translate-y-1">
              <div className="w-12 h-12 rounded-lg bg-[#efe9de]/40 border border-[#e6dfd8] flex items-center justify-center text-[#6c6a64] mb-6 transition-all duration-300 group-hover:scale-105 group-hover:bg-[#cc785c]/10 group-hover:border-[#cc785c]/20 group-hover:text-[#cc785c]">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-lg font-normal text-[#141413] group-hover:text-[#cc785c] transition-colors mb-3">In-Depth Editorials</h3>
              <p className="text-sm text-[#5c5952] font-sans leading-relaxed">
                Learn the step-by-step logic behind every puzzle. Explore mathematical derivations, conceptual models, and lateral thinking techniques.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* (e) HOW IT WORKS */}
      <section className="py-24 border-t border-[#e6dfd8] bg-[#f5f0e8]/10">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-20 text-center">
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-[#141413] font-serif mb-4">
              How It Works
            </h2>
            <p className="text-base text-[#6c6a64] max-w-xl mx-auto font-sans">
              Three simple steps to build your daily cognitive and logical frameworks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="group relative flex flex-col justify-between bg-[#fdfcf7] border border-[#e6dfd8] rounded-xl p-8 transition-all duration-300 hover:border-[#cc785c] hover:shadow-[0_8px_30px_rgba(204,120,92,0.05)] hover:-translate-y-0.5">
              <span className="absolute top-4 right-6 text-7xl font-serif font-light text-[#cc785c]/10 select-none transition-colors duration-300 group-hover:text-[#cc785c]/20">
                01
              </span>
              <div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#cc785c] mb-6"></div>
                <h3 className="font-serif text-lg font-normal text-[#141413] group-hover:text-[#cc785c] transition-colors mb-3">
                  Select a Puzzle
                </h3>
                <p className="text-sm text-[#5c5952] font-sans leading-relaxed">
                  Pick a riddle, logic puzzle, or reasoning test from our curated categories. Filter by difficulty, age-suitability, or exam track.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="group relative flex flex-col justify-between bg-[#fdfcf7] border border-[#e6dfd8] rounded-xl p-8 transition-all duration-300 hover:border-[#cc785c] hover:shadow-[0_8px_30px_rgba(204,120,92,0.05)] hover:-translate-y-0.5">
              <span className="absolute top-4 right-6 text-7xl font-serif font-light text-[#cc785c]/10 select-none transition-colors duration-300 group-hover:text-[#cc785c]/20">
                02
              </span>
              <div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#cc785c] mb-6"></div>
                <h3 className="font-serif text-lg font-normal text-[#141413] group-hover:text-[#cc785c] transition-colors mb-3">
                  Solve & Reason
                </h3>
                <p className="text-sm text-[#5c5952] font-sans leading-relaxed">
                  Work through the problem step-by-step. Draft your analytical thoughts and submit your answer directly on our interactive platform.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="group relative flex flex-col justify-between bg-[#fdfcf7] border border-[#e6dfd8] rounded-xl p-8 transition-all duration-300 hover:border-[#cc785c] hover:shadow-[0_8px_30px_rgba(204,120,92,0.05)] hover:-translate-y-0.5">
              <span className="absolute top-4 right-6 text-7xl font-serif font-light text-[#cc785c]/10 select-none transition-colors duration-300 group-hover:text-[#cc785c]/20">
                03
              </span>
              <div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#cc785c] mb-6"></div>
                <h3 className="font-serif text-lg font-normal text-[#141413] group-hover:text-[#cc785c] transition-colors mb-3">
                  Review the Editorial
                </h3>
                <p className="text-sm text-[#5c5952] font-sans leading-relaxed">
                  Compare your answer with our in-depth editorials. Learn the core mathematical concepts and lateral thinking frameworks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* (f) PRICING TEASER */}
      <section className="py-24 border-t border-[#e6dfd8] bg-[#faf9f5]">
        <div className="mx-auto max-w-[1000px] px-6">
          <div className="mb-16 text-center">
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-[#141413] font-serif mb-4">
              Simple, transparent plans
            </h2>
            <p className="text-base text-[#6c6a64] font-sans">
              Start training for free and upgrade to unlock detailed step-by-step breakdowns and premium tracks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mb-12">
            {/* Free Plan Card */}
            <div className="group rounded-xl border border-[#e6dfd8] bg-[#fdfcf7] p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 hover:bg-white hover:border-[#cc785c]/30 hover:shadow-[0_8px_30px_rgba(204,120,92,0.04)] hover:-translate-y-1">
              <div>
                <h3 className="font-serif text-xl font-normal text-[#141413]">Free</h3>
                <p className="text-sm text-[#6c6a64] font-sans mt-1">Perfect for casual solvers and daily logic practice.</p>
                <div className="my-6 flex items-baseline gap-1">
                  <span className="text-5xl font-light font-serif text-[#141413]">₹0</span>
                  <span className="text-xs text-[#6c6a64] font-sans">/ always free</span>
                </div>
                <ul className="space-y-3.5 mb-8 border-t border-[#e6dfd8]/60 pt-6">
                  <li className="flex items-center gap-2.5 text-sm text-[#5c5952] font-sans">
                    <svg className="h-4.5 w-4.5 text-[#cc785c] flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span>Unlimited problems</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-[#5c5952] font-sans">
                    <svg className="h-4.5 w-4.5 text-[#cc785c] flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span>Full solutions & editorial explanations</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-[#5c5952] font-sans">
                    <svg className="h-4.5 w-4.5 text-[#cc785c] flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span>Unlimited quizzes & exams</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-[#5c5952] font-sans">
                    <svg className="h-4.5 w-4.5 text-[#cc785c] flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span>Daily streak tracking</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-[#5c5952] font-sans">
                    <svg className="h-4.5 w-4.5 text-[#cc785c] flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span>Access to community tags</span>
                  </li>
                </ul>
              </div>
              <a
                href="/register"
                className="w-full h-11 inline-flex items-center justify-center rounded-lg border border-[#e6dfd8] bg-transparent hover:bg-[#cc785c]/5 hover:border-[#cc785c] px-4 text-sm font-semibold text-[#141413] hover:text-[#cc785c] transition-all duration-300 decoration-none"
              >
                Sign Up Now
              </a>
            </div>
 
            {/* Premium Plan Card (Featured) */}
            <div className="group rounded-xl bg-[#181715] text-[#faf9f5] p-8 sm:p-10 flex flex-col justify-between shadow-md relative overflow-hidden transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] hover:-translate-y-1">
              {/* Popular indicator */}
              <div className="absolute top-4 right-4 bg-[#cc785c] text-white text-[10px] font-semibold uppercase tracking-[0.1em] px-2.5 py-1 rounded-full select-none">
                Most Popular
              </div>
 
              <div>
                <h3 className="font-serif text-xl font-normal text-white">1 Month Premium</h3>
                <p className="text-sm text-[#a09d96] font-sans mt-1">Level up your logic — structure, insight, and tools for serious solvers.</p>
                <div className="my-6 flex items-baseline gap-1">
                  <span className="text-5xl font-light font-serif text-[#faf9f5]">₹99</span>
                  <span className="text-xs text-[#a09d96] font-sans">/ month</span>
                </div>
                <ul className="space-y-3.5 mb-8 border-t border-[#252320] pt-6">
                  <li className="flex items-center gap-2.5 text-sm text-[#e6dfd8] font-sans">
                    <svg className="h-4.5 w-4.5 text-[#cc785c] flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span>Curated learning tracks (SAT, Coding, Brain-training)</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-[#e6dfd8] font-sans">
                    <svg className="h-4.5 w-4.5 text-[#cc785c] flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span>Performance analytics dashboard</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-[#e6dfd8] font-sans">
                    <svg className="h-4.5 w-4.5 text-[#cc785c] flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span>Custom quiz builder (Experimental)</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-[#e6dfd8] font-sans">
                    <svg className="h-4.5 w-4.5 text-[#cc785c] flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span>PDF export of solved sets (Experimental)</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-[#e6dfd8] font-sans">
                    <svg className="h-4.5 w-4.5 text-[#cc785c] flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span>Verified profile badge & priority support</span>
                  </li>
                </ul>
              </div>
              <a
                href="/pricing"
                className="w-full h-11 inline-flex items-center justify-center rounded-lg bg-[#cc785c] hover:bg-[#a9583e] active:scale-[0.98] transition-all duration-300 px-4 text-sm font-semibold text-white decoration-none"
              >
                Upgrade to Pro
              </a>
            </div>
          </div>

          <div className="text-center">
            <a
              href="/pricing"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#cc785c] hover:text-[#a9583e] transition-colors group"
            >
              <span>View All Plans</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </section>

      {/* (g) FAQ SECTION */}
      <section className="py-24 border-t border-[#e6dfd8] bg-[#f5f0e8]/30">
        <div className="mx-auto max-w-[800px] px-6">
          <div className="mb-16 text-center">
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-[#141413] font-serif mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-base text-[#6c6a64]">
              Everything you need to know about RiddlesMaster, logic puzzles, and interview prep.
            </p>
          </div>

          <div className="divide-y divide-[#e6dfd8]">
            {/* FAQ Item 1 */}
            <details className="group py-6 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between cursor-pointer list-none text-left select-none">
                <h3 className="text-lg font-serif text-[#141413] group-hover:text-[#cc785c] transition-colors">
                  What are some good "what am i" riddles with answers?
                </h3>
                <span className="ml-4 flex-shrink-0 text-[#cc785c] transition-transform duration-200 group-open:rotate-180">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </span>
              </summary>
              <div className="mt-4 text-sm sm:text-base text-[#3d3d3a] leading-relaxed max-w-3xl">
                <p>
                  "What am I" riddles are classic brain teasers where an object or concept describes its traits using clever metaphors, prompting the reader to guess its identity. If you want to solve some good riddles, here is a popular example:
                </p>
                <p className="mt-3 italic border-l-2 border-[#cc785c] pl-4 my-2 text-[#cc785c] bg-[#cc785c]/5 py-2 pr-2 rounded-r-md">
                  "I have a neck but no head, and I wear a cap but have no hair. What am I?" (Answer: A bottle).
                </p>
                <p className="mt-3">
                  On RiddlesMaster, we provide a collection of curated "what am i" riddles with answers, ranging from quick warmups to complex logic puzzles designed to sharpen your thinking.
                </p>
              </div>
            </details>

            {/* FAQ Item 2 */}
            <details className="group py-6 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between cursor-pointer list-none text-left select-none">
                <h3 className="text-lg font-serif text-[#141413] group-hover:text-[#cc785c] transition-colors">
                  Are these logic puzzles and riddles suitable as puzzles for kids or brain training?
                </h3>
                <span className="ml-4 flex-shrink-0 text-[#cc785c] transition-transform duration-200 group-open:rotate-180">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </span>
              </summary>
              <div className="mt-4 text-sm sm:text-base text-[#3d3d3a] leading-relaxed max-w-3xl">
                <p>
                  Yes, they are excellent for curious minds of all ages. While we feature hard logic puzzles for adult career prep, we also have simpler riddles that serve as engaging puzzles for kids to develop critical thinking, spatial logic, and association skills early. Incorporating these into a daily routine acts as a fun and structured form of brain training.
                </p>
              </div>
            </details>

            {/* FAQ Item 3 */}
            <details className="group py-6 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between cursor-pointer list-none text-left select-none">
                <h3 className="text-lg font-serif text-[#141413] group-hover:text-[#cc785c] transition-colors">
                  What are the different types of puzzles available on RiddlesMaster?
                </h3>
                <span className="ml-4 flex-shrink-0 text-[#cc785c] transition-transform duration-200 group-open:rotate-180">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </span>
              </summary>
              <div className="mt-4 text-sm sm:text-base text-[#3d3d3a] leading-relaxed max-w-3xl">
                <p>
                  We feature several main categories of puzzles to test different areas of your cognitive ability:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li><strong>Lateral Thinking Puzzles:</strong> Creative problems where the solution requires looking at the situation from unexpected angles.</li>
                  <li><strong>Math & Probability Riddles:</strong> Quantitative challenges frequently asked in software engineering and quant trading interviews.</li>
                  <li><strong>Linguistic & Word Teasers:</strong> Tricky wordplay, classic riddles, and vocabulary-based challenges.</li>
                  <li><strong>Grid & Sequence Puzzles:</strong> Logical deduction challenges. While we don't host standard number grids (like how to play sudoku puzzles or how to solve sudoku puzzles), we focus on high-impact logic and algorithmic puzzles that build analytical skills.</li>
                </ul>
              </div>
            </details>

            {/* FAQ Item 4 */}
            <details className="group py-6 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between cursor-pointer list-none text-left select-none">
                <h3 className="text-lg font-serif text-[#141413] group-hover:text-[#cc785c] transition-colors">
                  How do you solve lateral thinking puzzles and cryptic puzzles?
                </h3>
                <span className="ml-4 flex-shrink-0 text-[#cc785c] transition-transform duration-200 group-open:rotate-180">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </span>
              </summary>
              <div className="mt-4 text-sm sm:text-base text-[#3d3d3a] leading-relaxed max-w-3xl">
                <p>
                  Solving cryptic and lateral thinking puzzles requires questioning your core assumptions. Here is a framework:
                </p>
                <ol className="list-decimal pl-5 mt-2 space-y-2">
                  <li><strong>Identify the constraints:</strong> Read the riddle carefully and list what is explicitly stated versus what you are assuming.</li>
                  <li><strong>Look for double meanings:</strong> Many cryptic puzzles rely on words that have multiple definitions.</li>
                  <li><strong>Work backwards:</strong> Start from the desired outcome and trace the logical path back to the starting state.</li>
                </ol>
                <p className="mt-4">
                  Developing these frameworks not only helps you crack logic puzzles, but also trains you to solve escape room puzzles faster or debug complex code under pressure.
                </p>
              </div>
            </details>

            {/* FAQ Item 5 */}
            <details className="group py-6 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between cursor-pointer list-none text-left select-none">
                <h3 className="text-lg font-serif text-[#141413] group-hover:text-[#cc785c] transition-colors">
                  Is solving daily riddles and brain teasers good for brain training?
                </h3>
                <span className="ml-4 flex-shrink-0 text-[#cc785c] transition-transform duration-200 group-open:rotate-180">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </span>
              </summary>
              <div className="mt-4 text-sm sm:text-base text-[#3d3d3a] leading-relaxed max-w-3xl">
                <p>
                  Absolutely. Much like physical exercise builds muscles, solving daily riddles, logic puzzles, and brain teasers serves as a powerful form of cognitive brain training. Working through diverse reasoning questions regularly stimulates neuroplasticity, which keeps your brain active, improves working memory, and sharpens analytical clarity.
                </p>
              </div>
            </details>

            {/* FAQ Item 6 */}
            <details className="group py-6 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between cursor-pointer list-none text-left select-none">
                <h3 className="text-lg font-serif text-[#141413] group-hover:text-[#cc785c] transition-colors">
                  How can I prepare for interview brain teasers and reasoning questions?
                </h3>
                <span className="ml-4 flex-shrink-0 text-[#cc785c] transition-transform duration-200 group-open:rotate-180">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </span>
              </summary>
              <div className="mt-4 text-sm sm:text-base text-[#3d3d3a] leading-relaxed max-w-3xl">
                <p>
                  Preparing for placement exams or company assessments is best done by practicing interview brain teasers and reasoning questions under timed conditions. Rather than memorizing answers, focus on building step-by-step logical frameworks. RiddlesMaster offers a structured environment with categorized aptitude questions and logic puzzles, complete with comprehensive editorials to guide your learning.
                </p>
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* (h) SEO CONTENT SECTION */}
      <section className="py-24 border-t border-[#e6dfd8] bg-[#efe9de]/15">
        <div className="mx-auto max-w-[800px] px-6 text-left">
          <h2 className="text-2xl sm:text-3xl font-normal tracking-tight text-[#141413] font-serif mb-6">
            RiddlesMaster: The Ultimate Hub for Riddles, Brain Teasers & Logic Puzzles
          </h2>
          <div className="text-sm sm:text-[15px] text-[#3d3d3a] leading-relaxed space-y-6">
            <p>
              In the fast-paced world of technical assessments and cognitive tests, analytical speed is your greatest asset. Welcome to <span className="font-semibold text-[#cc785c]">RiddlesMaster</span>, a premier platform designed to challenge your intellect, build lateral thinking, and support daily <span className="font-medium">brain training</span>. Whether you are looking for hard <span className="font-medium">riddles</span> with solutions to test your limits or easy <span className="font-medium">brain teasers</span> for a quick warm-up, our repository covers the full spectrum of cognitive training. We specialize in curating puzzles that break down complex problem-solving patterns.
            </p>
            
            <h3 className="text-lg font-serif text-[#141413] pt-4 font-normal">
              Master Technical Prep with Placement & Interview Brain Teasers
            </h3>
            <p>
              Are you preparing for a career at top tech firms? RiddlesMaster offers real <span className="font-medium">interview brain teasers</span> and logic riddles asked at major tech companies like Google, Microsoft, and Amazon. These challenges are designed to test your deduction skills, grid reasoning, and algorithmic approach. Beyond tech, we cater to finance and consulting roles, providing realistic case-study frameworks and <span className="font-medium">reasoning questions</span>. Every riddle comes with detailed, step-by-step editorials to help you break down mathematical proofs and constraints, allowing you to approach any test with confidence.
            </p>

            <h3 className="text-lg font-serif text-[#141413] pt-4 font-normal">
              Practice Solved Aptitude Questions & Free Assessment Sets
            </h3>
            <p>
              An aptitude test evaluates a candidate's suitability to perform a particular task. RiddlesMaster offers a wide collection of free <span className="font-medium">aptitude questions</span> covering numerical logic, percentage charts, averages, and arithmetic reasoning. Practicing these assessment questions daily is the single most effective way to improve your score on placement tests and mechanical reasoning exams.
            </p>

            <h3 className="text-lg font-serif text-[#141413] pt-4 font-normal">
              Explore Diverse Categories: Logic Puzzles, Math, and Lateral Thinking
            </h3>
            <p>
              Puzzles come in all shapes and sizes. At RiddlesMaster, we categorize our content so you can focus on building specific cognitive dimensions:
            </p>
            <ul className="list-disc pl-5 space-y-3">
              <li>
                <strong>Logic Puzzles & Deduction:</strong> Classic grid-deduction problems and sequence puzzles. These solved <span className="font-medium">logic puzzles</span> help build rigorous, step-by-step analytical reasoning.
              </li>
              <li>
                <strong>Math & Probability:</strong> Perfect for quantitative developers and finance professionals. Dive into probability distributions, game theory, and algebra.
              </li>
              <li>
                <strong>Linguistic Word Teasers:</strong> Tricky wordplay, classic riddles, and vocabulary-based challenges for curious minds of all ages.
              </li>
              <li>
                <strong>Puzzles for Kids & Families:</strong> Simple logical challenges, riddle games, and funny <span className="font-medium">puzzles for kids</span> to build early spatial reasoning and make learning a fun activity.
              </li>
            </ul>

            <h3 className="text-lg font-serif text-[#141413] pt-4 font-normal">
              Deductive vs Inductive Reasoning Questions
            </h3>
            <p>
              Understanding the difference between deductive, inductive, and abductive reasoning is essential for logical problem solving. Deductive reasoning starts with general premises and applies them to reach a guaranteed specific conclusion. Inductive reasoning looks at specific observations to form general trends, which are probable but not guaranteed. By practicing our structured <span className="font-medium">reasoning questions</span>, you'll master these critical logical frameworks.
            </p>

            <p>
              Start your daily <span className="font-medium">brain training</span> routine on RiddlesMaster today, browse our collections of <span className="font-medium">riddles</span> and <span className="font-medium">brain teasers</span>, and ace your preparation with the best logic puzzles online.
            </p>

            <div className="pt-8 border-t border-[#e6dfd8] flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold uppercase tracking-wider text-[#6c6a64]">
              <span className="text-gray-400 normal-case font-normal">Explore:</span>
              <a href="/about" className="hover:text-[#cc785c] transition-colors">About Us</a>
              <a href="/contact" className="hover:text-[#cc785c] transition-colors">Contact Us</a>
              <a href="/privacy" className="hover:text-[#cc785c] transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-[#cc785c] transition-colors">Terms & Conditions</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}



