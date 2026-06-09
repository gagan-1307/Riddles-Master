import React, { useState, useMemo } from 'react';
import FilterBar from './FilterBar';
import { Lock } from 'lucide-react';

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
  createdAt: any;
  updatedAt: any;
  tags: ProblemsOnTags[];
}

interface ProblemsPageProps {
  initialProblems: Problem[];
}

export default function ProblemsPage({ initialProblems }: ProblemsPageProps) {
  const [search, setSearch] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedType, setSelectedType] = useState('');

  // Extract all unique companies and types for filters
  const { companies, types } = useMemo(() => {
    const comps = new Set<string>();
    const typs = new Set<string>();

    initialProblems.forEach((problem) => {
      problem.tags.forEach(({ tag }) => {
        if (tag.type === 'COMPANY') {
          comps.add(tag.name);
        } else if (tag.type === 'TYPE') {
          typs.add(tag.name);
        }
      });
    });

    return {
      companies: Array.from(comps).sort(),
      types: Array.from(typs).sort(),
    };
  }, [initialProblems]);

  // Filter problems client-side
  const filteredProblems = useMemo(() => {
    return initialProblems.filter((problem) => {
      // 1. Search term match
      if (search && !problem.title.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }

      // 2. Difficulty match
      if (selectedDifficulty && problem.difficulty !== selectedDifficulty) {
        return false;
      }

      // 3. Company match
      if (selectedCompany) {
        const hasCompany = problem.tags.some(
          ({ tag }) => tag.type === 'COMPANY' && tag.name === selectedCompany
        );
        if (!hasCompany) return false;
      }

      // 4. Type match
      if (selectedType) {
        const hasType = problem.tags.some(
          ({ tag }) => tag.type === 'TYPE' && tag.name === selectedType
        );
        if (!hasType) return false;
      }

      return true;
    });
  }, [initialProblems, search, selectedDifficulty, selectedCompany, selectedType]);

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

  return (
    <div className="w-full">
      <FilterBar
        search={search}
        setSearch={setSearch}
        selectedDifficulty={selectedDifficulty}
        setSelectedDifficulty={setSelectedDifficulty}
        selectedCompany={selectedCompany}
        setSelectedCompany={setSelectedCompany}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        companies={companies}
        types={types}
      />

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-[#e6dfd8] bg-[#faf9f5]">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[#e6dfd8] bg-[#f5f0e8] text-xs font-semibold uppercase tracking-wider text-[#6c6a64]">
              <th className="px-6 py-4 w-16 text-center">#</th>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Tags</th>
              <th className="px-6 py-4 w-32">Difficulty</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e6dfd8] text-[#3d3d3a]">
            {filteredProblems.length > 0 ? (
              filteredProblems.map((problem) => {
                const companyTags = problem.tags.filter(({ tag }) => tag.type === 'COMPANY');
                const typeTags = problem.tags.filter(({ tag }) => tag.type === 'TYPE');

                return (
                  <tr key={problem.id} className="hover:bg-[#f5f0e8]/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-center text-[#6c6a64] font-medium">
                      {problem.number}
                    </td>
                    <td className="px-6 py-4 font-medium text-[#141413]">
                      <div className="flex items-center gap-2">
                        <a
                          href={`/problems/${problem.slug}`}
                          className="hover:text-[#cc785c] hover:underline transition-colors duration-150"
                        >
                          {problem.title}
                        </a>
                        {problem.isPremium && (
                          <span className="inline-flex items-center justify-center rounded-sm bg-[#cc785c]/10 p-1 text-[#cc785c]" title="Premium Riddle">
                            <Lock className="h-3.5 w-3.5" />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5">
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
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${getDifficultyStyles(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-[#6c6a64] italic">
                  No problems found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View */}
      <div className="block md:hidden space-y-4">
        {filteredProblems.length > 0 ? (
          filteredProblems.map((problem) => {
            const companyTags = problem.tags.filter(({ tag }) => tag.type === 'COMPANY');
            const typeTags = problem.tags.filter(({ tag }) => tag.type === 'TYPE');

            return (
              <div
                key={problem.id}
                className="rounded-lg border border-[#e6dfd8] bg-[#faf9f5] p-5 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-xs font-semibold text-[#6c6a64]">
                    Riddle #{problem.number}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {problem.isPremium && (
                      <span className="inline-flex items-center justify-center rounded-sm bg-[#cc785c]/10 p-1 text-[#cc785c]" title="Premium Riddle">
                        <Lock className="h-3 w-3" />
                      </span>
                    )}
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${getDifficultyStyles(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-semibold text-[#141413] mb-3">
                  <a
                    href={`/problems/${problem.slug}`}
                    className="hover:text-[#cc785c] hover:underline transition-colors duration-150"
                  >
                    {problem.title}
                  </a>
                </h3>

                {/* Tags list */}
                {problem.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {companyTags.map(({ tag }) => (
                      <span
                        key={tag.id}
                        className="inline-flex items-center rounded-full bg-[#cc785c]/10 px-2.5 py-0.5 text-[10px] font-medium text-[#cc785c] border border-[#cc785c]/20"
                      >
                        {tag.name}
                      </span>
                    ))}
                    {typeTags.map(({ tag }) => (
                      <span
                        key={tag.id}
                        className="inline-flex items-center rounded-full bg-[#efe9de] px-2.5 py-0.5 text-[10px] font-medium text-[#141413] border border-[#e6dfd8]"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="rounded-lg border border-[#e6dfd8] bg-[#faf9f5] px-6 py-12 text-center text-[#6c6a64] italic shadow-sm">
            No problems found matching your filters.
          </div>
        )}
      </div>
    </div>
  );
}
