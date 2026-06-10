import React from 'react';
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
  todaysProblem: Problem | null;
  streakCount: number | null;
  totalProblemsCount: number;
  totalUsersCount: number;
  totalCompanyTagsCount: number;
}

export default function HomePage({
  todaysProblem,
  streakCount,
  totalProblemsCount,
  totalUsersCount,
  totalCompanyTagsCount,
}: HomePageProps) {

  // Format numbers to have commas
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

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
            Crack the Riddles That Crack Interviews
          </h1>
          <p className="text-lg sm:text-xl text-[#3d3d3a] max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
            Master the brain teasers and logic puzzles used in real technical interviews at Google, Amazon, and Microsoft.
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
                {todaysProblem && (
                  <span className="text-xs font-semibold text-[#cc785c] bg-[#cc785c]/10 px-2.5 py-1 rounded-full border border-[#cc785c]/20">
                    Riddle #{todaysProblem.number}
                  </span>
                )}
              </div>
              {streakCount !== null && streakCount > 0 && (
                <div className="flex items-center gap-1.5 text-sm font-semibold text-[#cc785c] bg-[#cc785c]/10 px-3 py-1 rounded-full border border-[#cc785c]/20 w-fit">
                  <Flame className="h-4 w-4 fill-current animate-pulse" />
                  <span>{streakCount} Day Streak</span>
                </div>
              )}
            </div>

            {todaysProblem ? (
              <div>
                <h3 className="text-xl sm:text-2xl font-normal text-[#141413] font-serif mb-3">
                  {todaysProblem.title}
                </h3>
                <p className="text-sm sm:text-base text-[#3d3d3a] leading-relaxed mb-6 italic">
                  "{todaysProblem.statement.substring(0, 150)}..."
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

      {/* (c) STATS BAR */}
      <section className="border-y border-[#e6dfd8] bg-[#f5f0e8]/30 py-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 text-center md:divide-x md:divide-[#e6dfd8]">
            <div className="flex flex-col items-center">
              <span className="text-5xl font-light text-[#141413] font-serif mb-2">
                {formatNumber(totalProblemsCount)}
              </span>
              <span className="text-xs uppercase tracking-[0.1em] font-semibold text-[#6c6a64]">
                Curated Riddles
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-5xl font-light text-[#141413] font-serif mb-2">
                {formatNumber(totalUsersCount)}
              </span>
              <span className="text-xs uppercase tracking-[0.1em] font-semibold text-[#6c6a64]">
                Active Thinkers
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-5xl font-light text-[#141413] font-serif mb-2">
                {formatNumber(totalCompanyTagsCount)}
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
              Everything you need to succeed
            </h2>
            <p className="text-base text-[#6c6a64] max-w-xl mx-auto">
              Our platform is designed specifically to help software developers and analysts build key logic frameworks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="rounded-xl border border-[#e6dfd8] bg-[#efe9de] p-8 sm:p-10 flex flex-col items-start shadow-sm">
              <div className="h-10 w-10 rounded-lg bg-[#cc785c]/10 flex items-center justify-center text-[#cc785c] mb-6">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-[#141413] mb-3">Daily Riddles</h3>
              <p className="text-sm text-[#3d3d3a] leading-relaxed">
                Receive a fresh handpicked logic puzzle every single day to build a habit of structured troubleshooting and sharp analytical execution.
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-xl border border-[#e6dfd8] bg-[#efe9de] p-8 sm:p-10 flex flex-col items-start shadow-sm">
              <div className="h-10 w-10 rounded-lg bg-[#cc785c]/10 flex items-center justify-center text-[#cc785c] mb-6">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-[#141413] mb-3">Company Tagged</h3>
              <p className="text-sm text-[#3d3d3a] leading-relaxed">
                Filter and browse challenges tagged with Google, Microsoft, Netflix, or Jane Street. Target the actual questions asked by your dream companies.
              </p>
            </div>

            {/* Card 3 */}
            <div className="rounded-xl border border-[#e6dfd8] bg-[#efe9de] p-8 sm:p-10 flex flex-col items-start shadow-sm">
              <div className="h-10 w-10 rounded-lg bg-[#cc785c]/10 flex items-center justify-center text-[#cc785c] mb-6">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-[#141413] mb-3">Full Editorials</h3>
              <p className="text-sm text-[#3d3d3a] leading-relaxed">
                Learn the mental model behind every puzzle. Our detailed editorials cover the mathematical derivations, edge cases, and lateral thinking techniques.
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
            <p className="text-base text-[#6c6a64]">
              Three simple steps to level up your lateral thinking capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            <div className="flex flex-col">
              <span className="text-5xl font-light text-[#cc785c]/30 font-serif mb-6">01</span>
              <h3 className="text-lg font-semibold text-[#141413] mb-3">Select a Riddle</h3>
              <p className="text-sm text-[#3d3d3a] leading-relaxed">
                Choose from easy logic warmups to complex probability questions. Filter by your target company track or puzzle category.
              </p>
            </div>

            <div className="flex flex-col">
              <span className="text-5xl font-light text-[#cc785c]/30 font-serif mb-6">02</span>
              <h3 className="text-lg font-semibold text-[#141413] mb-3">Draft Your Solution</h3>
              <p className="text-sm text-[#3d3d3a] leading-relaxed">
                Use our built-in code editor and editor window to experiment with inputs and outline your logical step-by-step reasoning.
              </p>
            </div>

            <div className="flex flex-col">
              <span className="text-5xl font-light text-[#cc785c]/30 font-serif mb-6">03</span>
              <h3 className="text-lg font-semibold text-[#141413] mb-3">Analyze the Editorial</h3>
              <p className="text-sm text-[#3d3d3a] leading-relaxed">
                Compare your work against the official editorial. Learn the mathematical shortcuts and conceptual patterns to apply next time.
              </p>
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
            <p className="text-base text-[#6c6a64]">
              Start for free and upgrade to unlock detailed step-by-step breakdowns and company filters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mb-12">
            {/* Free Plan Card */}
            <div className="rounded-xl border border-[#e6dfd8] bg-[#faf9f5] p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div>
                <h3 className="text-lg font-bold text-[#141413]">Free Tier</h3>
                <p className="text-xs text-[#6c6a64] mt-1">Perfect for casual practice.</p>
                <div className="my-6">
                  <span className="text-4xl font-normal font-serif text-[#141413]">₹0</span>
                  <span className="text-xs text-[#6c6a64] ml-1">/ always free</span>
                </div>
                <ul className="space-y-3 mb-8 border-t border-[#e6dfd8]/60 pt-6">
                  <li className="flex items-center gap-2 text-sm text-[#3d3d3a]">
                    <svg className="h-4.5 w-4.5 text-[#cc785c]" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span>Limited questions</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-[#3d3d3a]">
                    <svg className="h-4.5 w-4.5 text-[#cc785c]" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span>View problem statements</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-[#3d3d3a]">
                    <svg className="h-4.5 w-4.5 text-[#cc785c]" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span>Daily streak tracking</span>
                  </li>
                </ul>
              </div>
              <a
                href="/register"
                className="w-full h-11 inline-flex items-center justify-center rounded-md border border-[#e6dfd8] bg-[#faf9f5] px-4 text-sm font-semibold text-[#141413] hover:bg-[#f5f0e8] transition-colors"
              >
                Sign Up Now
              </a>
            </div>

            {/* Premium Plan Card (Featured) */}
            <div className="rounded-xl bg-[#181715] text-[#faf9f5] p-8 flex flex-col justify-between shadow-lg relative overflow-hidden">
              {/* Popular indicator */}
              <div className="absolute top-0 right-0 bg-[#cc785c] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-bl-lg">
                Most Popular
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#faf9f5]">Premium Access</h3>
                <p className="text-xs text-[#a09d96] mt-1">The complete interview prep toolkit.</p>
                <div className="my-6">
                  <span className="text-4xl font-normal font-serif text-[#faf9f5]">₹99</span>
                  <span className="text-xs text-[#a09d96] ml-1">/ month</span>
                </div>
                <ul className="space-y-3 mb-8 border-t border-[#252320] pt-6">
                  <li className="flex items-center gap-2 text-sm text-[#faf9f5]">
                    <svg className="h-4.5 w-4.5 text-[#cc785c]" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span>Unlimited daily questions</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-[#faf9f5]">
                    <svg className="h-4.5 w-4.5 text-[#cc785c]" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span>Full step-by-step solutions</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-[#faf9f5]">
                    <svg className="h-4.5 w-4.5 text-[#cc785c]" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span>Access to all premium problems</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-[#faf9f5]">
                    <svg className="h-4.5 w-4.5 text-[#cc785c]" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span>Company-wise filtered sets</span>
                  </li>
                </ul>
              </div>
              <a
                href="/pricing"
                className="w-full h-11 inline-flex items-center justify-center rounded-md bg-[#cc785c] px-4 text-sm font-semibold text-white hover:bg-[#a9583e] transition-colors"
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
                  Are riddles for kids different from hard riddles for adults?
                </h3>
                <span className="ml-4 flex-shrink-0 text-[#cc785c] transition-transform duration-200 group-open:rotate-180">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </span>
              </summary>
              <div className="mt-4 text-sm sm:text-base text-[#3d3d3a] leading-relaxed max-w-3xl">
                <p>
                  Yes, they differ in complexity and the depth of logical thinking required. Riddles for kids "what am i?" typically use concrete concepts and simple wordplay (like <em>"I have keys but open no locks, what am I?"</em> for a piano) to build foundational vocabulary and association skills. 
                </p>
                <p className="mt-3">
                  Conversely, what are some hard riddles for adults? They often involve conditional logic, probability theory, or mathematical constraints that simulate real-world problem-solving. RiddlesMaster separates puzzles by difficulty, letting you easily find simple wordplay as well as hard, interview-grade brain teasers.
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
                  Are puzzles good for your brain and cognitive health?
                </h3>
                <span className="ml-4 flex-shrink-0 text-[#cc785c] transition-transform duration-200 group-open:rotate-180">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </span>
              </summary>
              <div className="mt-4 text-sm sm:text-base text-[#3d3d3a] leading-relaxed max-w-3xl">
                <p>
                  Absolutely. Much like physical exercise builds muscles, solving logical challenges keeps your mind active. Engaging with lateral thinking, sudoku, and riddles stimulates neuroplasticity.
                </p>
                <p className="mt-3">
                  So, are puzzles good for your brain? Yes—they strengthen deductive logic, memory, and cognitive speed. Whether you are doing quick "what am i" riddles or spending hours learning how to solve cryptic puzzles, you are training your brain to identify patterns and handle complex reasoning.
                </p>
              </div>
            </details>

            {/* FAQ Item 6 */}
            <details className="group py-6 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between cursor-pointer list-none text-left select-none">
                <h3 className="text-lg font-serif text-[#141413] group-hover:text-[#cc785c] transition-colors">
                  Can I practice gaming riddles here, like in Where Winds Meet?
                </h3>
                <span className="ml-4 flex-shrink-0 text-[#cc785c] transition-transform duration-200 group-open:rotate-180">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </span>
              </summary>
              <div className="mt-4 text-sm sm:text-base text-[#3d3d3a] leading-relaxed max-w-3xl">
                <p>
                  Open-world RPG games like <em>Where Winds Meet</em> frequently challenge players with cryptic riddles and historical puzzles to unlock secret areas or solve quests.
                </p>
                <p className="mt-3">
                  While RiddlesMaster is primarily designed for tech interview prep, the core logical frameworks are identical. By practicing our lateral thinking puzzles, you'll train your mind to spot the logical connections needed to solve quest riddles in gaming. Best of all, unlike physical stores where you have to buy puzzles, our platform is fully digital and free to start solving immediately.
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
            Riddles Master: The Ultimate Hub for Brain Teasers and Logic Puzzles
          </h2>
          <div className="text-sm sm:text-[15px] text-[#3d3d3a] leading-relaxed space-y-6">
            <p>
              In the fast-paced world of technical interviews and cognitive assessments, analytical thinking is your greatest asset. Welcome to <span className="font-semibold text-[#cc785c]">Riddles Master</span>, a premier platform designed to stretch your intellect, hone your lateral thinking, and prepare you for any analytical challenge. Whether you are seeking <span className="font-medium">hard riddles with answers</span> to test your limits or <span className="font-medium">easy riddles</span> for a quick warm-up, our extensive repository covers the full spectrum of cognitive training. We specialize in curating <span className="font-medium">riddles to test intelligence</span> that challenge conventional assumptions and build sharp problem-solving habits.
            </p>
            
            <h3 className="text-lg font-serif text-[#141413] pt-4 font-normal">
              Master Technical Prep with Actual Puzzle Interview Questions
            </h3>
            <p>
              Are you preparing for a career at top tech firms? Riddles Master offers actual <span className="font-medium">puzzle interview questions</span> asked at major tech companies. Candidates often face complex logical scenarios, and our repository is structured to help you succeed. Try our <span className="font-medium">google interview riddles</span>, <span className="font-medium">amazon interview riddles</span>, and <span className="font-medium">microsoft interview riddles</span> to experience the exact challenges candidates face. These <span className="font-medium">logic riddles for interviews</span> are designed to test your deduction skills, grid reasoning, and algorithmic approach.
            </p>
            <p>
              Beyond tech, we cater to finance and business roles. Our <span className="font-medium">consulting interview riddles</span> provide realistic case-study frameworks and problem-solving scenarios. Every riddle comes with detailed, step-by-step <span className="font-medium">puzzle answers</span> and editorials to help you break down the mathematical proofs and assumptions. By reviewing these detailed explanations, you’ll learn how to approach tricky questions with confidence.
            </p>

            <h3 className="text-lg font-serif text-[#141413] pt-4 font-normal">
              Explore Diverse Categories: Math, Logic, and Lateral Thinking
            </h3>
            <p>
              Puzzles come in all shapes and sizes. At Riddles Master, we categorize our content so you can focus on building specific skills:
            </p>
            <ul className="list-disc pl-5 space-y-3">
              <li>
                <strong>Math Puzzles & Math Riddles:</strong> Perfect for quantitative developers and finance professionals. Dive into probability distributions, game theory, and algebra. Try <span className="font-medium">math riddles for adults</span> to keep your math skills sharp.
              </li>
              <li>
                <strong>Logic Puzzles & Logic Riddles:</strong> Classic deduction puzzles where you use grid analysis or boolean logic. These <span className="font-medium">logic puzzles</span> and riddles help build rigorous thinking.
              </li>
              <li>
                <strong>Brain Puzzles & Brain Teasers:</strong> General problem-solving tasks. We host <span className="font-medium">brain teasers for adults</span> that demand a high degree of cognitive flexibility.
              </li>
              <li>
                <strong>Lateral Thinking Puzzles:</strong> Problems that cannot be solved by direct calculation alone. These <span className="font-medium">lateral thinking riddles</span> force you to look at variables from entirely new angles.
              </li>
              <li>
                <strong>Visual Puzzles & Mystery Puzzles:</strong> Build spatial awareness and detective deduction skills with visual and scenario-based queries.
              </li>
            </ul>

            <p>
              We understand that every learner is different. That is why you can filter challenges from simple <span className="font-medium">funny riddles</span> up to extremely hard and <span className="font-medium">impossible riddles with answers</span>. Each difficulty tier provides unique value to build a robust mindset.
            </p>
            <h3 className="text-lg font-serif text-[#141413] pt-4 font-normal">
              Interactive Practice and Daily Puzzles
            </h3>
            <p>
              We believe in building habits. Our <span className="font-medium">daily puzzles</span> keep your mind active with one handpicked challenge every single day, complete with streak tracking. If you are looking for flexibility, we offer <span className="font-medium">free puzzles</span> and <span className="font-medium">online puzzles</span> that can be solved directly on our platform. Prefer offline practice? Download <span className="font-medium">printable puzzles</span> to work away from your screen.
            </p>
            <p>
              We also cater to a wide audience. Explore <span className="font-medium">puzzles for adults</span> for professional growth, or <span className="font-medium">puzzles for kids</span> to build logic early. Parents can find <span className="font-medium">funny riddles for kids</span> and <span className="font-medium">educational puzzles</span> to make learning a fun activity, creating memorable <span className="font-medium">family puzzles</span> that everyone can enjoy together.
            </p>

            <h3 className="text-lg font-serif text-[#141413] pt-4 font-normal">
              Why Solve Riddles?
            </h3>
            <p>
              Engaging with <span className="font-medium">tricky riddles with answers</span> stimulates neuroplasticity. When you solve <span className="font-medium">interview riddles with answers</span>, you develop frameworks that make you a better programmer, analyst, and strategist. Join Riddles Master today, start solving, and master your technical prep with the best logic challenges online.
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



