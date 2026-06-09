import React from 'react';
import ProblemForm from '@/components/admin/ProblemForm';

interface Tag {
  id: string;
  name: string;
  type: 'COMPANY' | 'TYPE';
}

interface NewProblemPageProps {
  allTags: Tag[];
}

export default function NewProblemPage({ allTags }: NewProblemPageProps) {
  return (
    <div className="space-y-6">
      <div className="border-b border-[#e6dfd8] pb-5">
        <h1 className="text-3xl font-normal font-serif tracking-tight text-[#141413]">
          Create New Riddle
        </h1>
        <p className="text-sm text-[#6c6a64] mt-1.5 font-sans">
          Publish a new interview logic riddle or lateral thinking puzzle to the platform.
        </p>
      </div>

      <div className="mt-6">
        <ProblemForm allTags={allTags} />
      </div>
    </div>
  );
}
