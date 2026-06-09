import React from 'react';
import ProblemForm from '@/components/admin/ProblemForm';

interface Tag {
  id: string;
  name: string;
  type: 'COMPANY' | 'TYPE';
}

interface ProblemsOnTags {
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

interface EditProblemPageProps {
  problem: Problem;
  allTags: Tag[];
}

export default function EditProblemPage({ problem, allTags }: EditProblemPageProps) {
  return (
    <div className="space-y-6">
      <div className="border-b border-[#e6dfd8] pb-5">
        <h1 className="text-3xl font-normal font-serif tracking-tight text-[#141413]">
          Edit Riddle #{problem.number}
        </h1>
        <p className="text-sm text-[#6c6a64] mt-1.5 font-sans">
          Update the details, statement description, editorial key, and tag associations for <strong className="text-[#141413]">{problem.title}</strong>.
        </p>
      </div>

      <div className="mt-6">
        <ProblemForm initialData={problem} allTags={allTags} />
      </div>
    </div>
  );
}
