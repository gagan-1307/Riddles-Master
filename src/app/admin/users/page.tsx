import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Subscription {
  id: string;
  plan: 'ONE_MONTH' | 'THREE_MONTH' | 'SIX_MONTH';
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  endDate: string;
}

interface UserRow {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  subscription: Subscription | null;
}

interface UsersPageProps {
  users: UserRow[];
  currentPage: number;
  totalPages: number;
  totalUsers: number;
}

export default function UsersPage({ users, currentPage, totalPages, totalUsers }: UsersPageProps) {
  
  const getInitials = (name: string | null, email: string) => {
    if (name && name.trim()) {
      const parts = name.trim().split(/\s+/);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return parts[0][0].toUpperCase();
    }
    return email[0].toUpperCase();
  };

  const getSubscriptionStatus = (user: UserRow) => {
    if (!user.subscription) return 'None';
    const isActive = user.subscription.status === 'ACTIVE' && new Date(user.subscription.endDate) > new Date();
    return isActive ? 'Active' : 'None';
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="border-b border-[#e6dfd8] pb-5">
        <h1 className="text-3xl font-normal font-serif tracking-tight text-[#141413]">
          User Directory
        </h1>
        <p className="text-sm text-[#6c6a64] mt-1.5 font-sans">
          Review user registrations, authorization status, and active memberships.
        </p>
      </div>

      {/* Users table */}
      <div className="overflow-x-auto rounded-lg border border-[#e6dfd8] bg-[#faf9f5] shadow-sm">
        <Table>
          <TableHeader className="bg-[#f5f0e8] border-b border-[#e6dfd8]">
            <TableRow>
              <TableHead className="px-6 py-4 w-12 text-center"></TableHead>
              <TableHead className="px-6 py-4">Name</TableHead>
              <TableHead className="px-6 py-4">Email</TableHead>
              <TableHead className="px-6 py-4 w-28">Role</TableHead>
              <TableHead className="px-6 py-4 w-36">Subscription</TableHead>
              <TableHead className="px-6 py-4 w-40 text-right">Joined Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-[#e6dfd8] text-[#3d3d3a]">
            {users.length > 0 ? (
              users.map((u) => {
                const subStatus = getSubscriptionStatus(u);
                return (
                  <TableRow key={u.id} className="hover:bg-[#f5f0e8]/30 transition-colors">
                    {/* User Avatar / Initials */}
                    <TableCell className="px-6 py-4 text-center">
                      <div className="h-8 w-8 rounded-full bg-[#cc785c]/10 border border-[#cc785c]/20 flex items-center justify-center text-[#cc785c] text-xs font-semibold overflow-hidden">
                        {u.avatarUrl ? (
                          <img src={u.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                        ) : (
                          <span>{getInitials(u.name, u.email)}</span>
                        )}
                      </div>
                    </TableCell>
                    
                    {/* User Name */}
                    <TableCell className="px-6 py-4 font-medium text-[#141413] font-serif">
                      {u.name || <span className="text-[#8e8b82] italic text-xs font-sans">No name provided</span>}
                    </TableCell>

                    {/* Email */}
                    <TableCell className="px-6 py-4 font-sans font-medium text-sm text-[#3d3d3a]">
                      {u.email}
                    </TableCell>

                    {/* RoleBadge */}
                    <TableCell className="px-6 py-4">
                      {u.role === 'ADMIN' ? (
                        <span className="inline-flex items-center rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-bold text-violet-700 border border-violet-200">
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-[#efe9de] px-2.5 py-0.5 text-xs font-medium text-[#6c6a64] border border-[#e6dfd8]">
                          User
                        </span>
                      )}
                    </TableCell>

                    {/* Subscription Plan Status */}
                    <TableCell className="px-6 py-4">
                      {subStatus === 'Active' ? (
                        <span className="inline-flex items-center rounded-full bg-[#5db872]/10 px-2.5 py-0.5 text-xs font-bold text-[#2e7d32] border border-[#5db872]/20">
                          Active Premium
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500 border border-gray-200">
                          None
                        </span>
                      )}
                    </TableCell>

                    {/* Joined Date */}
                    <TableCell className="px-6 py-4 text-right font-mono text-xs text-[#6c6a64]">
                      {formatDate(u.createdAt)}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="px-6 py-12 text-center text-[#6c6a64] italic">
                  No users found in this directory.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-[#e6dfd8] pt-4">
          <span className="text-xs text-[#6c6a64] font-sans">
            Showing Page <strong className="text-[#141413]">{currentPage}</strong> of <strong className="text-[#141413]">{totalPages}</strong> ({totalUsers} total users)
          </span>
          <div className="flex items-center gap-2">
            <a
              href={`/admin/users?page=${currentPage - 1}`}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#e6dfd8] bg-[#faf9f5] text-[#6c6a64] hover:bg-[#efe9de]/30 transition-all ${
                currentPage <= 1 ? 'pointer-events-none opacity-40' : ''
              }`}
              title="Previous Page"
            >
              <ChevronLeft className="h-4 w-4" />
            </a>
            <a
              href={`/admin/users?page=${currentPage + 1}`}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#e6dfd8] bg-[#faf9f5] text-[#6c6a64] hover:bg-[#efe9de]/30 transition-all ${
                currentPage >= totalPages ? 'pointer-events-none opacity-40' : ''
              }`}
              title="Next Page"
            >
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
