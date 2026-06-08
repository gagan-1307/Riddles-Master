import React from 'react';

export default function ProblemsLoading() {
  return (
    <div className="w-full">
      {/* Skeleton FilterBar */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-lg border border-[#e6dfd8] bg-[#f5f0e8] p-4 shadow-sm animate-pulse">
        <div className="h-10 w-full max-w-md rounded-md bg-[#faf9f5]/50 border border-[#e6dfd8]/50"></div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="h-10 w-32 rounded-md bg-[#faf9f5]/50 border border-[#e6dfd8]/50"></div>
          <div className="h-10 w-36 rounded-md bg-[#faf9f5]/50 border border-[#e6dfd8]/50"></div>
          <div className="h-10 w-36 rounded-md bg-[#faf9f5]/50 border border-[#e6dfd8]/50"></div>
        </div>
      </div>

      {/* Skeleton Table */}
      <div className="overflow-x-auto rounded-lg border border-[#e6dfd8] bg-[#faf9f5]">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[#e6dfd8] bg-[#f5f0e8] text-xs font-semibold uppercase tracking-wider text-[#6c6a64]">
              <th className="px-6 py-4 w-16 text-center">#</th>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Tags</th>
              <th className="px-6 py-4 w-32">Difficulty</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e6dfd8]">
            {Array.from({ length: 10 }).map((_, index) => (
              <tr key={index} className="animate-pulse">
                <td className="px-6 py-5 text-center">
                  <div className="mx-auto h-4 w-6 rounded bg-[#efe9de]"></div>
                </td>
                <td className="px-6 py-5">
                  <div className="h-4 w-2/3 rounded bg-[#efe9de]"></div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex gap-2">
                    <div className="h-5 w-16 rounded-full bg-[#cc785c]/10"></div>
                    <div className="h-5 w-20 rounded-full bg-[#efe9de]"></div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="h-5 w-16 rounded-full bg-[#efe9de]"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
