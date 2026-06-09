import React, { useState } from 'react';
import { toast } from 'sonner';
import { Check } from 'lucide-react';

interface CompleteButtonProps {
  problemId: string;
  initialCompleted: boolean;
  onStreakUpdate: (newStreak: number) => void;
}

export default function CompleteButton({
  problemId,
  initialCompleted,
  onStreakUpdate,
}: CompleteButtonProps) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    if (completed) return;
    setLoading(true);

    try {
      const response = await fetch('/api/streak/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ problemId }),
      });

      if (response.status === 401) {
        toast.error('Please log in to register your streak');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to mark as completed');
      }

      const data = await response.json();
      setCompleted(true);
      onStreakUpdate(data.currentStreak);
      
      if (data.alreadyDone) {
        toast.info('You have already completed a daily riddle today!');
      } else {
        toast.success(`Streak updated! You are on a ${data.currentStreak}-day streak!`);
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
      onClick={handleComplete}
      disabled={loading || completed}
      className={`group flex items-center justify-center gap-2 rounded-md px-6 py-2.5 text-sm font-semibold transition-all active:scale-[0.98] w-full sm:w-auto cursor-pointer ${
        completed
          ? 'bg-[#5db872]/10 text-[#2e7d32] border border-[#5db872]/20 cursor-default'
          : 'bg-primary text-white hover:bg-primary-active shadow-md hover:shadow-lg'
      }`}
    >
      {completed ? (
        <>
          <Check className="h-4 w-4 text-[#2e7d32]" />
          <span>Completed for Today</span>
        </>
      ) : loading ? (
        <span>Processing...</span>
      ) : (
        <span>Mark Complete for Today</span>
      )}
    </button>
  );
}
