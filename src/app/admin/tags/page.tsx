import React, { useState } from 'react';
import { Tag as TagIcon, Plus, Trash2, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Tag {
  id: string;
  name: string;
  type: 'COMPANY' | 'TYPE';
  problemsCount: number;
}

interface TagsPageProps {
  initialTags: Tag[];
}

export default function TagsPage({ initialTags }: TagsPageProps) {
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [name, setName] = useState('');
  const [type, setType] = useState<'COMPANY' | 'TYPE'>('COMPANY');
  const [isAdding, setIsAdding] = useState(false);

  // Group tags
  const companyTags = tags.filter(t => t.type === 'COMPANY').sort((a, b) => a.name.localeCompare(b.name));
  const typeTags = tags.filter(t => t.type === 'TYPE').sort((a, b) => a.name.localeCompare(b.name));

  // Submit Handler for Add Tag
  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Tag name cannot be empty.');
      return;
    }

    setIsAdding(true);

    try {
      const response = await fetch('/api/admin/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), type }),
      });

      const data = await response.json();

      if (response.ok) {
        setTags(prev => [...prev, { ...data.tag, problemsCount: 0 }]);
        toast.success(`Tag "${name.trim()}" created successfully.`);
        setName('');
      } else {
        toast.error(data.error || 'Failed to create tag.');
      }
    } catch (err) {
      console.error(err);
      toast.error('An unexpected error occurred.');
    } finally {
      setIsAdding(false);
    }
  };

  // Delete Handler for Tag
  const handleDeleteTag = async (tagId: string, tagName: string) => {
    try {
      const response = await fetch(`/api/admin/tags/${tagId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        setTags(prev => prev.filter(t => t.id !== tagId));
        toast.success(`Tag "${tagName}" deleted successfully.`);
      } else {
        toast.error(data.error || 'Failed to delete tag.');
      }
    } catch (err) {
      console.error(err);
      toast.error('An unexpected error occurred while deleting.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-[#e6dfd8] pb-5">
        <h1 className="text-3xl font-normal font-serif tracking-tight text-[#141413]">
          Tag Classification
        </h1>
        <p className="text-sm text-[#6c6a64] mt-1.5 font-sans">
          Manage target companies and category classifications for interview riddles.
        </p>
      </div>

      {/* Grid of Add Form and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Add Tag Card */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-[#e6dfd8] bg-[#faf9f5] p-6 shadow-sm sticky top-24">
            <h2 className="font-serif text-lg font-normal text-[#141413] border-b border-[#e6dfd8] pb-3 mb-4">
              Add New Tag
            </h2>
            <form onSubmit={handleAddTag} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="tagName" className="text-xs font-bold uppercase tracking-wider text-[#6c6a64]">
                  Tag Name
                </label>
                <input
                  id="tagName"
                  type="text"
                  required
                  placeholder="e.g. Netflix, Probability"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full rounded-md border border-[#e6dfd8] bg-[#faf9f5] px-4 py-2 text-[15px] placeholder-[#8e8b82] transition-all focus:border-[#cc785c] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="tagType" className="text-xs font-bold uppercase tracking-wider text-[#6c6a64]">
                  Tag Classification
                </label>
                <select
                  id="tagType"
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="block w-full rounded-md border border-[#e6dfd8] bg-[#faf9f5] px-4 py-2 text-[15px] focus:border-[#cc785c] focus:outline-none"
                >
                  <option value="COMPANY">Company Tag</option>
                  <option value="TYPE">Type Tag</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isAdding}
                className="w-full inline-flex h-10 items-center justify-center rounded-[8px] bg-[#cc785c] px-6 text-sm font-semibold text-white shadow-lg shadow-[#cc785c]/10 transition-all hover:bg-[#a9583e] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed gap-1.5"
              >
                <Plus className="h-4 w-4" />
                {isAdding ? 'Adding...' : 'Add Tag'}
              </button>
            </form>
          </div>
        </div>

        {/* Right columns: Grouped tag lists */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Company tags column */}
          <div className="rounded-lg border border-[#e6dfd8] bg-[#faf9f5] p-6 shadow-sm flex flex-col min-h-[300px]">
            <div className="flex items-center gap-2 border-b border-[#e6dfd8] pb-3 mb-4">
              <TagIcon className="h-4.5 w-4.5 text-[#cc785c]" />
              <h3 className="font-serif text-lg font-normal text-[#141413]">
                Company Tags
              </h3>
              <span className="ml-auto text-xs font-mono text-[#6c6a64] bg-[#efe9de] px-2 py-0.5 rounded border border-[#e6dfd8]">
                {companyTags.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[500px] space-y-2 pr-1">
              {companyTags.length > 0 ? (
                companyTags.map(tag => (
                  <TagRow key={tag.id} tag={tag} onDelete={handleDeleteTag} />
                ))
              ) : (
                <p className="text-xs text-[#6c6a64] italic text-center py-8">No company tags found.</p>
              )}
            </div>
          </div>

          {/* Classification tags column */}
          <div className="rounded-lg border border-[#e6dfd8] bg-[#faf9f5] p-6 shadow-sm flex flex-col min-h-[300px]">
            <div className="flex items-center gap-2 border-b border-[#e6dfd8] pb-3 mb-4">
              <TagIcon className="h-4.5 w-4.5 text-[#cc785c]" />
              <h3 className="font-serif text-lg font-normal text-[#141413]">
                Type Tags
              </h3>
              <span className="ml-auto text-xs font-mono text-[#6c6a64] bg-[#efe9de] px-2 py-0.5 rounded border border-[#e6dfd8]">
                {typeTags.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[500px] space-y-2 pr-1">
              {typeTags.length > 0 ? (
                typeTags.map(tag => (
                  <TagRow key={tag.id} tag={tag} onDelete={handleDeleteTag} />
                ))
              ) : (
                <p className="text-xs text-[#6c6a64] italic text-center py-8">No type tags found.</p>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

// Inline Row Component for displaying a Tag with delete actions and tooltips
function TagRow({ tag, onDelete }: { tag: Tag; onDelete: (id: string, name: string) => void }) {
  const isUsed = tag.problemsCount > 0;

  return (
    <div className="flex items-center justify-between px-3 py-2 rounded-md border border-[#e6dfd8]/60 bg-[#faf9f5] hover:bg-[#efe9de]/20 transition-all">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-[#141413]">{tag.name}</span>
        {isUsed && (
          <span className="text-[10px] font-mono text-[#6c6a64] bg-[#efe9de] border border-[#e6dfd8] px-1.5 py-0.5 rounded-full" title={`Assigned to ${tag.problemsCount} problem(s)`}>
            {tag.problemsCount}p
          </span>
        )}
      </div>
      
      {/* Delete button (with conditional disabled state and tooltip) */}
      <div className="relative group">
        <button
          type="button"
          disabled={isUsed}
          onClick={() => onDelete(tag.id, tag.name)}
          className={`p-1.5 rounded-md border transition-all active:scale-95 cursor-pointer ${
            isUsed
              ? 'border-[#e6dfd8] text-[#8e8b82] bg-[#efe9de]/30 cursor-not-allowed'
              : 'border-red-200 text-red-600 bg-[#faf9f5] hover:bg-red-50 hover:text-red-700'
          }`}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
        {isUsed && (
          <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block w-48 bg-[#181715] text-[#faf9f5] text-[10px] leading-normal p-2 rounded shadow-lg z-20 font-sans border border-white/10">
            This tag is currently assigned to {tag.problemsCount} riddle(s) and cannot be deleted.
          </div>
        )}
      </div>
    </div>
  );
}
