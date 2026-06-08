import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';

interface LikeButtonProps {
  problemId: string;
  initialLiked: boolean;
  initialLikesCount: number;
}

export default function LikeButton({ problemId, initialLiked, initialLikesCount }: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/problems/${problemId}/like`, {
        method: 'POST',
      });

      if (response.status === 401) {
        toast.error('Please log in to like this problem');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to toggle like');
      }

      const data = await response.json();
      setLiked(data.liked);
      setLikesCount(data.likesCount);
    } catch (err) {
      toast.error('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`inline-flex h-9 items-center justify-center rounded-md border px-4 text-xs font-semibold transition-all active:scale-[0.98] cursor-pointer ${
        liked
          ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100/55'
          : 'border-[#e6dfd8] bg-[#faf9f5] text-[#3d3d3a] hover:bg-[#f5f0e8]/30'
      }`}
    >
      <Heart className={`mr-1.5 h-3.5 w-3.5 ${liked ? 'fill-red-600 text-red-600' : 'text-[#6c6a64]'}`} />
      <span>{liked ? 'Liked' : 'Like'}</span>
      {likesCount > 0 && <span className="ml-1.5 font-mono text-[10px] bg-[#e6dfd8]/50 px-1.5 py-0.5 rounded">{likesCount}</span>}
    </button>
  );
}
