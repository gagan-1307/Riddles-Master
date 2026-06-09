import React, { useState, useMemo } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { 
  Edit2, 
  Trash2, 
  Lock, 
  Search, 
  ArrowUpDown, 
  ChevronUp, 
  ChevronDown 
} from 'lucide-react';
import { toast } from 'sonner';

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
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  isPremium: boolean;
  tags: ProblemsOnTags[];
}

interface AdminProblemsPageProps {
  initialProblems: Problem[];
}

type SortField = 'number' | 'title' | 'difficulty' | 'isPremium' | 'tagCount';
type SortDirection = 'asc' | 'desc';

export default function AdminProblemsPage({ initialProblems }: AdminProblemsPageProps) {
  const [problems, setProblems] = useState<Problem[]>(initialProblems);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('number');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  
  // AlertDialog state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [problemToDelete, setProblemToDelete] = useState<Problem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Difficulty order for sorting
  const difficultyOrder = { EASY: 1, MEDIUM: 2, HARD: 3 };

  // Handle Sort Toggle
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter & Sort Problems
  const processedProblems = useMemo(() => {
    let result = [...problems];

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.number.toString().includes(q) ||
          p.tags.some((t) => t.tag.name.toLowerCase().includes(q))
      );
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'number':
          comparison = a.number - b.number;
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'difficulty':
          comparison = difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
          break;
        case 'isPremium':
          comparison = (a.isPremium ? 1 : 0) - (b.isPremium ? 1 : 0);
          break;
        case 'tagCount':
          comparison = a.tags.length - b.tags.length;
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [problems, search, sortField, sortDirection]);

  // Request Delete Problem
  const requestDelete = (problem: Problem) => {
    setProblemToDelete(problem);
    setDeleteConfirmOpen(true);
  };

  // Confirm Delete Problem
  const confirmDelete = async () => {
    if (!problemToDelete) return;
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/admin/problems/${problemToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProblems((prev) => prev.filter((p) => p.id !== problemToDelete.id));
        toast.success(`Problem #${problemToDelete.number} deleted successfully.`);
      } else {
        const data = await response.json().catch(() => ({}));
        toast.error(data.error || 'Failed to delete problem.');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while deleting the problem.');
    } finally {
      setIsDeleting(false);
      setDeleteConfirmOpen(false);
      setProblemToDelete(null);
    }
  };

  // Styles for difficulty badges
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

  const SortHeader = ({ field, label }: { field: SortField; label: string }) => {
    const isSorted = sortField === field;
    return (
      <button
        onClick={() => handleSort(field)}
        className="flex items-center gap-1 hover:text-[#141413] transition-colors border-none bg-transparent cursor-pointer font-semibold uppercase tracking-wider text-xs p-0 text-left"
      >
        {label}
        {isSorted ? (
          sortDirection === 'asc' ? (
            <ChevronUp className="h-3 w-3 text-[#cc785c]" />
          ) : (
            <ChevronDown className="h-3 w-3 text-[#cc785c]" />
          )
        ) : (
          <ArrowUpDown className="h-3 w-3 text-[#8e8b82] opacity-40 group-hover:opacity-100" />
        )}
      </button>
    );
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-normal font-serif tracking-tight text-[#141413]">
            Problem Directory
          </h1>
          <p className="text-sm text-[#6c6a64] mt-1 font-sans">
            Add, update, or remove technical riddles and interview puzzles.
          </p>
        </div>
        <div>
          <a
            href="/admin/problems/new"
            className="inline-flex h-10 items-center justify-center rounded-[8px] bg-[#cc785c] px-6 text-sm font-semibold text-white shadow-lg shadow-[#cc785c]/10 transition-all hover:bg-[#a9583e] active:scale-[0.98] decoration-none"
          >
            Create Problem
          </a>
        </div>
      </div>

      {/* Filters bar */}
      <div className="flex items-center rounded-lg border border-[#e6dfd8] bg-[#faf9f5] px-3 py-2 shadow-sm">
        <Search className="h-4 w-4 text-[#8e8b82] mr-2" />
        <input
          type="text"
          placeholder="Search by title, number, or tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent border-none text-sm text-[#141413] placeholder-[#8e8b82] focus:outline-none"
        />
      </div>

      {/* Problems Table */}
      <div className="overflow-x-auto rounded-lg border border-[#e6dfd8] bg-[#faf9f5] shadow-sm">
        <Table>
          <TableHeader className="bg-[#f5f0e8] border-b border-[#e6dfd8]">
            <TableRow>
              <TableHead className="w-20 px-6 py-4 text-center">
                <SortHeader field="number" label="#" />
              </TableHead>
              <TableHead className="px-6 py-4">
                <SortHeader field="title" label="Title" />
              </TableHead>
              <TableHead className="px-6 py-4 w-36">
                <SortHeader field="difficulty" label="Difficulty" />
              </TableHead>
              <TableHead className="px-6 py-4 w-28">
                <SortHeader field="isPremium" label="Access" />
              </TableHead>
              <TableHead className="px-6 py-4 w-28 text-center">
                <SortHeader field="tagCount" label="Tags" />
              </TableHead>
              <TableHead className="px-6 py-4 w-32 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-[#e6dfd8] text-[#3d3d3a]">
            {processedProblems.length > 0 ? (
              processedProblems.map((problem) => (
                <TableRow key={problem.id} className="hover:bg-[#f5f0e8]/30 transition-colors">
                  <TableCell className="px-6 py-4 font-mono text-center text-[#6c6a64] font-medium">
                    {problem.number}
                  </TableCell>
                  <TableCell className="px-6 py-4 font-medium text-[#141413]">
                    <div className="flex flex-col gap-1">
                      <a
                        href={`/problems/${problem.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-[#cc785c] hover:underline transition-colors duration-150 decoration-none"
                      >
                        {problem.title}
                      </a>
                      {problem.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {problem.tags.map(({ tag }) => (
                            <span
                              key={tag.id}
                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                tag.type === 'COMPANY'
                                  ? 'bg-[#cc785c]/10 text-[#cc785c] border border-[#cc785c]/10'
                                  : 'bg-[#efe9de] text-[#141413] border border-[#e6dfd8]'
                              }`}
                            >
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${getDifficultyStyles(
                        problem.difficulty
                      )}`}
                    >
                      {problem.difficulty}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {problem.isPremium ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#cc785c]/10 px-2.5 py-0.5 text-xs font-bold text-[#cc785c] border border-[#cc785c]/20">
                        <Lock className="h-3 w-3" /> Premium
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#5db872]/10 px-2.5 py-0.5 text-xs font-bold text-[#2e7d32] border border-[#5db872]/20">
                        Free
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center font-mono text-xs text-[#6c6a64]">
                    {problem.tags.length}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/admin/problems/${problem.id}/edit`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#e6dfd8] bg-[#faf9f5] text-[#6c6a64] hover:text-[#141413] hover:bg-[#efe9de]/30 transition-all active:scale-95"
                        title="Edit Riddle"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </a>
                      <button
                        onClick={() => requestDelete(problem)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-red-200 bg-[#faf9f5] text-red-600 hover:bg-red-50 hover:text-red-700 transition-all active:scale-95 cursor-pointer"
                        title="Delete Riddle"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="px-6 py-12 text-center text-[#6c6a64] italic">
                  No problems found matching your query.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation AlertDialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent className="bg-[#faf9f5] border border-[#e6dfd8]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif text-lg text-[#141413] font-normal">
              Delete Problem
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-[#6c6a64] font-sans">
              Are you sure you want to delete{' '}
              <strong className="text-[#141413]">
                #{problemToDelete?.number} - {problemToDelete?.title}
              </strong>
              ? This action is permanent and cannot be undone. All user solve attempts, likes, and history associated with this riddle will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel 
              disabled={isDeleting}
              className="border border-[#e6dfd8] hover:bg-[#efe9de]/30 text-[#141413]"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              disabled={isDeleting}
              className="bg-[#c64545] hover:bg-[#a53636] text-white"
            >
              {isDeleting ? 'Deleting...' : 'Delete Problem'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
