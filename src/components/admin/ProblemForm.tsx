import React, { useState, useEffect } from 'react';
import TiptapEditor from './TiptapEditor';
import { toast } from 'sonner';

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

interface ProblemFormProps {
  initialData?: Problem;
  allTags: Tag[];
}

// Helper to generate kebab-case slug prepended by problem number
const generateSlug = (number: number | string, title: string) => {
  const numPrefix = number.toString().trim();
  const cleanTitle = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word characters
    .replace(/[\s_]+/g, '-')  // Replace spaces/underscores with hyphen
    .replace(/-+/g, '-');     // Remove multiple hyphens
  
  if (numPrefix && cleanTitle) {
    return `${numPrefix}-${cleanTitle}`;
  }
  return cleanTitle || numPrefix;
};

export default function ProblemForm({ initialData, allTags }: ProblemFormProps) {
  const isEdit = !!initialData;

  // Form states
  const [title, setTitle] = useState(initialData?.title || '');
  const [number, setNumber] = useState(initialData?.number ? initialData.number.toString() : '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>(initialData?.difficulty || 'EASY');
  const [isPremium, setIsPremium] = useState(initialData?.isPremium || false);
  
  const [statement, setStatement] = useState(initialData?.statement || '');
  const [answer, setAnswer] = useState(initialData?.answer || '');
  const [editorial, setEditorial] = useState(initialData?.editorial || '');
  
  // Tag Selection state (extract selected tags in edit mode)
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    initialData?.tags?.map(t => t.tagId) || []
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Group tags by type
  const companyTags = allTags.filter(t => t.type === 'COMPANY');
  const typeTags = allTags.filter(t => t.type === 'TYPE');

  // Generate slug on title or number change
  useEffect(() => {
    if (!isEdit) {
      setSlug(generateSlug(number, title));
    }
  }, [title, number, isEdit]);

  // Handle Tag toggle
  const toggleTag = (tagId: string) => {
    setSelectedTagIds(prev => 
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    );
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !number.trim() || !slug.trim() || !statement.trim()) {
      toast.error('Title, Number, Slug, and Statement are required fields.');
      return;
    }

    const problemNum = parseInt(number, 10);
    if (isNaN(problemNum)) {
      toast.error('Problem Number must be a valid integer.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      title: title.trim(),
      number: problemNum,
      slug: slug.trim(),
      difficulty,
      isPremium,
      statement: statement.trim(),
      answer: answer.trim() || null,
      editorial: editorial.trim() || null,
      tagIds: selectedTagIds
    };

    const url = isEdit ? `/api/admin/problems/${initialData.id}` : '/api/admin/problems';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(isEdit ? 'Problem updated successfully.' : 'Problem created successfully.');
        setTimeout(() => {
          window.location.href = '/admin/problems';
        }, 1200);
      } else {
        toast.error(result.error || 'Failed to save problem.');
      }
    } catch (err) {
      console.error(err);
      toast.error('An unexpected error occurred while saving.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Grid of basic parameters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 rounded-lg border border-[#e6dfd8] bg-[#faf9f5] p-6 shadow-sm">
        
        {/* Title Field */}
        <div className="md:col-span-2 space-y-1.5">
          <label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-[#6c6a64]">
            Riddle Title *
          </label>
          <input
            id="title"
            type="text"
            required
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              // Slug can still be edited manually, but defaults to auto-generating on creation
              if (!isEdit) setSlug(generateSlug(number, e.target.value));
            }}
            placeholder="e.g. The Bridge Riddle"
            className="block w-full rounded-md border border-[#e6dfd8] bg-[#faf9f5] px-4 py-2 text-[15px] placeholder-[#8e8b82] shadow-inner-sm transition-all focus:border-[#cc785c] focus:outline-none focus:ring-0"
          />
        </div>

        {/* Problem Number */}
        <div className="space-y-1.5">
          <label htmlFor="number" className="text-xs font-bold uppercase tracking-wider text-[#6c6a64]">
            Problem Number *
          </label>
          <input
            id="number"
            type="number"
            required
            value={number}
            onChange={(e) => {
              setNumber(e.target.value);
              if (!isEdit) setSlug(generateSlug(e.target.value, title));
            }}
            placeholder="e.g. 42"
            className="block w-full rounded-md border border-[#e6dfd8] bg-[#faf9f5] px-4 py-2 text-[15px] placeholder-[#8e8b82] shadow-inner-sm transition-all focus:border-[#cc785c] focus:outline-none focus:ring-0"
          />
        </div>

        {/* Slug Display */}
        <div className="md:col-span-3 space-y-1.5">
          <label htmlFor="slug" className="text-xs font-bold uppercase tracking-wider text-[#6c6a64]">
            SEO Url Slug (Prepopulated)
          </label>
          <input
            id="slug"
            type="text"
            readOnly={isEdit}
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="Auto-generated: e.g. 42-the-bridge-riddle"
            className={`block w-full rounded-md border border-[#e6dfd8] px-4 py-2 text-[15px] font-mono text-[#6c6a64] focus:outline-none ${
              isEdit ? 'bg-[#efe9de]/40 cursor-not-allowed' : 'bg-[#faf9f5] focus:border-[#cc785c]'
            }`}
          />
        </div>

        {/* Difficulty Selector */}
        <div className="space-y-1.5">
          <label htmlFor="difficulty" className="text-xs font-bold uppercase tracking-wider text-[#6c6a64]">
            Difficulty Level
          </label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as any)}
            className="block w-full rounded-md border border-[#e6dfd8] bg-[#faf9f5] px-4 py-2 text-[15px] focus:border-[#cc785c] focus:outline-none"
          >
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>

        {/* Switch for Premium Status */}
        <div className="flex items-center md:col-span-2 pt-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isPremium}
              onChange={(e) => setIsPremium(e.target.checked)}
              className="h-4.5 w-4.5 rounded border-[#e6dfd8] text-[#cc785c] focus:ring-[#cc785c]/10"
            />
            <div>
              <span className="text-sm font-semibold text-[#141413]">Premium Gated Riddle</span>
              <p className="text-xs text-[#6c6a64] font-normal">Restricts statement and detailed editorial to subscribers.</p>
            </div>
          </label>
        </div>

      </div>

      {/* statement (tiptap) */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-[#6c6a64]">
          Problem Statement * (Supports Rich Text)
        </label>
        <TiptapEditor value={statement} onChange={setStatement} placeholder="Write the puzzle/riddle statement..." />
      </div>

      {/* Answer */}
      <div className="space-y-2">
        <label htmlFor="answer" className="text-xs font-bold uppercase tracking-wider text-[#6c6a64]">
          Quick Answer Explanation (Shown when user clicks reveal)
        </label>
        <textarea
          id="answer"
          rows={4}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="e.g. The answer is 17 minutes. The crossing order is..."
          className="block w-full rounded-md border border-[#e6dfd8] bg-[#faf9f5] px-4 py-3 text-[15px] placeholder-[#8e8b82] shadow-inner-sm transition-all focus:border-[#cc785c] focus:outline-none focus:ring-0"
        />
      </div>

      {/* Editorial (tiptap) */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-[#6c6a64]">
          Detailed Editorial Solution (Premium analytical breakdown)
        </label>
        <TiptapEditor value={editorial} onChange={setEditorial} placeholder="Write the complete analytical editorial breakdown..." />
      </div>

      {/* Tags section */}
      <div className="rounded-lg border border-[#e6dfd8] bg-[#faf9f5] p-6 shadow-sm space-y-6">
        <h3 className="font-serif text-[17px] font-normal text-[#141413] border-b border-[#e6dfd8] pb-2">
          Riddle Categorization & Tags
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Company Tags */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#cc785c]">
              Target Companies
            </h4>
            {companyTags.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto pr-2">
                {companyTags.map(tag => (
                  <label key={tag.id} className="flex items-center gap-2 text-xs font-medium text-[#3d3d3a] hover:text-[#141413] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedTagIds.includes(tag.id)}
                      onChange={() => toggleTag(tag.id)}
                      className="h-4 w-4 rounded border-[#e6dfd8] text-[#cc785c] focus:ring-[#cc785c]/10"
                    />
                    {tag.name}
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#6c6a64] italic">No company tags defined in system.</p>
            )}
          </div>

          {/* Type Tags */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#cc785c]">
              Riddle Classification / Types
            </h4>
            {typeTags.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto pr-2">
                {typeTags.map(tag => (
                  <label key={tag.id} className="flex items-center gap-2 text-xs font-medium text-[#3d3d3a] hover:text-[#141413] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedTagIds.includes(tag.id)}
                      onChange={() => toggleTag(tag.id)}
                      className="h-4 w-4 rounded border-[#e6dfd8] text-[#cc785c] focus:ring-[#cc785c]/10"
                    />
                    {tag.name}
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#6c6a64] italic">No type tags defined in system.</p>
            )}
          </div>

        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4 border-t border-[#e6dfd8] pt-6">
        <a
          href="/admin/problems"
          className="inline-flex h-10 items-center justify-center rounded-[8px] border border-[#e6dfd8] bg-[#faf9f5] px-6 text-sm font-semibold text-[#141413] transition-all hover:bg-[#efe9de]/30 active:scale-[0.98] decoration-none"
        >
          Cancel
        </a>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-10 items-center justify-center rounded-[8px] bg-[#cc785c] px-6 text-sm font-semibold text-white shadow-lg shadow-[#cc785c]/10 transition-all hover:bg-[#a9583e] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : isEdit ? 'Update Riddle' : 'Publish Riddle'}
        </button>
      </div>

    </form>
  );
}
