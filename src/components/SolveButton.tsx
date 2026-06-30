import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface SolveButtonProps {
  problemId: string;
  initialSolved: boolean;
}

export default function SolveButton({ problemId, initialSolved }: SolveButtonProps) {
  const [solved, setSolved] = useState(initialSolved);
  const [loading, setLoading] = useState(false);

  const handleSolve = async () => {
    if (solved) return; // Already solved

    setLoading(true);
    try {
      const response = await fetch(`/api/problems/${problemId}/solve`, {
        method: 'POST',
      });

      if (response.status === 401) {
        toast.error('Please log in to submit your solution');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to mark as solved');
      }

      const data = await response.json();
      if (data.solved) {
        setSolved(true);
        toast.success('Problem marked as solved! Streak updated!');
      }
    } catch (err) {
      toast.error('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSolve}
      disabled={loading || solved}
      className={`inline-flex h-9 items-center justify-center rounded-md border px-4 text-xs font-semibold transition-all active:scale-[0.98] cursor-pointer ${solved
          ? 'border-[#5db872]/20 bg-[#5db872]/10 text-[#2e7d32] cursor-default'
          : 'border-[#cc785c] bg-[#cc785c] text-white hover:bg-[#a9583e]'
        }`}
    >
      <CheckCircle className={`mr-1.5 h-3.5 w-3.5 ${solved ? 'text-[#2e7d32]' : 'text-white'}`} />
      <span>{solved ? 'Solved' : 'Mark as Solved'}</span>
    </button>
  );
}
