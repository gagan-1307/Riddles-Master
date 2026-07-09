import React, { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from '@/components/ui/table';
import {
  Avatar,
  AvatarImage,
  AvatarFallback
} from '@/components/ui/avatar';

interface LeaderboardEntry {
  userId: string;
  userName: string;
  userAvatar: string | null;
  totalScore: number;
  totalAttempted: number;
  overallAccuracy: number;
  setsCompleted: number;
  rank: number;
}

interface LeaderboardTableProps {
  topicId: string;
  currentUserId?: string;
}

export function LeaderboardTable({ topicId, currentUserId }: LeaderboardTableProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);
  const [currentUserEntry, setCurrentUserEntry] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);

  // Silence unused state warning
  useEffect(() => {
    if (currentUserRank) {
      // no-op
    }
  }, [currentUserRank]);

  useEffect(() => {
    let active = true;
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);

        let resolvedUserId = currentUserId;
        if (!resolvedUserId) {
          try {
            const userRes = await fetch(`/api/practice/user-state?topicId=${topicId}`);
            if (userRes.ok) {
              const userData = await userRes.json();
              if (userData.isLoggedIn) {
                resolvedUserId = userData.userId;
              }
            }
          } catch (e) {
            console.error('Failed to resolve current user session client-side:', e);
          }
        }

        const url = `/api/practice/leaderboard?topicId=${topicId}${resolvedUserId ? `&userId=${resolvedUserId}` : ''}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch leaderboard');
        const data = await res.json();

        if (active) {
          setEntries(data.leaderboard || []);
          setCurrentUserRank(data.currentUserRank || null);
          setCurrentUserEntry(data.currentUserEntry || null);
        }
      } catch (err) {
        console.error('Error loading leaderboard:', err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchLeaderboard();
    return () => {
      active = false;
    };
  }, [topicId, currentUserId]);

  // Shimmer Skeleton Loader
  if (loading) {
    return (
      <div id="leaderboard" className="w-full rounded-xl border border-[#e6dfd8] bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-[#141413] mb-6 font-sans">Leaderboard</h3>
        <div className="animate-pulse space-y-3.5">
          <div className="h-9 bg-muted rounded-md w-full"></div>
          <div className="h-12 bg-muted rounded-md w-full"></div>
          <div className="h-12 bg-muted rounded-md w-full"></div>
          <div className="h-12 bg-muted rounded-md w-full"></div>
          <div className="h-12 bg-muted rounded-md w-full"></div>
        </div>
      </div>
    );
  }

  const isCurrentUserInTop20 = currentUserId && entries.some(e => e.userId === currentUserId);
  const showCurrentUserAtBottom = currentUserId && currentUserEntry && !isCurrentUserInTop20;

  const renderRank = (rank: number, isCurrentUser: boolean) => {
    const boldClass = isCurrentUser ? 'font-bold' : 'font-medium';
    if (rank === 1) return <span className="text-lg">🥇</span>;
    if (rank === 2) return <span className="text-lg">🥈</span>;
    if (rank === 3) return <span className="text-lg">🥉</span>;
    return <span className={`text-xs text-zinc-500 ${boldClass}`}>{rank}</span>;
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return 'bg-[#16a34a]'; // green
    if (accuracy >= 50) return 'bg-[#d4a017]'; // amber
    return 'bg-[#c64545]'; // red
  };

  const renderRow = (entry: LeaderboardEntry) => {
    const isCurrentUser = currentUserId === entry.userId;
    const highlightClass = isCurrentUser
      ? 'bg-[#cc785c]/5 hover:bg-[#cc785c]/8'
      : 'hover:bg-[#faf9f5]/50';

    return (
      <TableRow key={entry.userId} className={`${highlightClass} transition-colors border-b border-[#e6dfd8]`}>
        {/* Rank */}
        <TableCell className="w-12 text-center py-3.5">
          {renderRank(entry.rank, isCurrentUser)}
        </TableCell>

        {/* User */}
        <TableCell className="py-3.5">
          <div className="flex items-center gap-3">
            <Avatar className="h-7 w-7 flex-shrink-0">
              {entry.userAvatar && (
                <AvatarImage src={entry.userAvatar} alt={entry.userName} />
              )}
              <AvatarFallback className="bg-zinc-100 text-zinc-600 font-semibold text-[10px] uppercase">
                {entry.userName.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <span className={`text-sm text-[#141413] ${isCurrentUser ? 'font-semibold' : 'font-medium'}`}>
              {entry.userName}
            </span>
          </div>
        </TableCell>

        {/* Accuracy */}
        <TableCell className="py-3.5">
          <div className="flex flex-col gap-1 w-28">
            <span className={`text-xs font-semibold ${isCurrentUser ? 'text-[#141413]' : 'text-zinc-700'}`}>
              {entry.overallAccuracy}%
            </span>
            <div className="w-full bg-[#f5f0e8] h-1 rounded-full overflow-hidden">
              <div
                className={`h-full ${getAccuracyColor(entry.overallAccuracy)}`}
                style={{ width: `${entry.overallAccuracy}%` }}
              />
            </div>
          </div>
        </TableCell>

        {/* Questions Attempted */}
        <TableCell className={`py-3.5 text-center text-xs font-medium ${isCurrentUser ? 'text-[#141413] font-bold' : 'text-zinc-600'}`}>
          {entry.totalAttempted}
        </TableCell>

        {/* Sets Done */}
        <TableCell className={`py-3.5 text-center text-xs font-medium ${isCurrentUser ? 'text-[#141413] font-bold' : 'text-zinc-600'}`}>
          {entry.setsCompleted}
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div id="leaderboard" className="w-full rounded-xl border border-[#e6dfd8] bg-white p-6 shadow-sm scroll-mt-20">
      <h3 className="text-base font-semibold text-[#141413] mb-6 font-sans">Leaderboard</h3>

      {entries.length === 0 ? (
        <div className="py-12 px-4 flex flex-col items-center justify-center text-center font-sans">
          <div className="h-12 w-12 rounded-full bg-[#f5f0e8] flex items-center justify-center text-[#cc785c] mb-4">
            <Trophy className="h-6 w-6" />
          </div>
          <h4 className="text-sm font-bold text-[#141413] mb-1">
            No test attempts yet — be the first on the leaderboard!
          </h4>
          <p className="text-xs text-zinc-500 max-w-[320px] leading-relaxed">
            Complete a set in Test mode to appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-[#e6dfd8]">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-12 text-center text-[10px] font-bold tracking-wider text-[#8e8b82] uppercase pb-2">
                  Rank
                </TableHead>
                <TableHead className="text-left text-[10px] font-bold tracking-wider text-[#8e8b82] uppercase pb-2">
                  User
                </TableHead>
                <TableHead className="text-left text-[10px] font-bold tracking-wider text-[#8e8b82] uppercase pb-2">
                  Accuracy
                </TableHead>
                <TableHead className="text-center text-[10px] font-bold tracking-wider text-[#8e8b82] uppercase pb-2">
                  Questions Attempted
                </TableHead>
                <TableHead className="text-center text-[10px] font-bold tracking-wider text-[#8e8b82] uppercase pb-2">
                  Sets Done
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map(renderRow)}

              {showCurrentUserAtBottom && currentUserEntry && (
                <>
                  <TableRow className="hover:bg-transparent border-none">
                    <TableCell colSpan={5} className="text-center text-zinc-400 py-2.5 font-mono font-bold tracking-widest select-none">
                      •••
                    </TableCell>
                  </TableRow>
                  {renderRow(currentUserEntry)}
                </>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default LeaderboardTable;
