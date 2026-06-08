import React from 'react';
import { Search } from 'lucide-react';

interface FilterBarProps {
  search: string;
  setSearch: (val: string) => void;
  selectedDifficulty: string;
  setSelectedDifficulty: (val: string) => void;
  selectedCompany: string;
  setSelectedCompany: (val: string) => void;
  selectedType: string;
  setSelectedType: (val: string) => void;
  companies: string[];
  types: string[];
}

export default function FilterBar({
  search,
  setSearch,
  selectedDifficulty,
  setSelectedDifficulty,
  selectedCompany,
  setSelectedCompany,
  selectedType,
  setSelectedType,
  companies,
  types,
}: FilterBarProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-lg border border-[#e6dfd8] bg-[#f5f0e8] p-4 shadow-sm">
      {/* Search Input */}
      <div className="relative flex-grow max-w-md">
        <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[#6c6a64]">
          <Search className="h-4 w-4" />
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search problems by title..."
          className="w-full h-10 rounded-md border border-[#e6dfd8] bg-[#faf9f5] pl-10 pr-4 text-[15px] text-[#141413] placeholder-[#8e8b82] transition-all focus:border-[#cc785c] focus:outline-none focus:ring-3 focus:ring-[#cc785c]/15"
        />
      </div>

      {/* Select Filters Group */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Difficulty Select */}
        <div className="flex flex-col min-w-[130px]">
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="h-10 rounded-md border border-[#e6dfd8] bg-[#faf9f5] px-3 text-[14px] font-medium text-[#3d3d3a] transition-all focus:border-[#cc785c] focus:outline-none"
          >
            <option value="">All Difficulties</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>

        {/* Company Filter */}
        <div className="flex flex-col min-w-[140px]">
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="h-10 rounded-md border border-[#e6dfd8] bg-[#faf9f5] px-3 text-[14px] font-medium text-[#3d3d3a] transition-all focus:border-[#cc785c] focus:outline-none"
          >
            <option value="">All Companies</option>
            {companies.map((company) => (
              <option key={company} value={company}>
                {company}
              </option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div className="flex flex-col min-w-[150px]">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="h-10 rounded-md border border-[#e6dfd8] bg-[#faf9f5] px-3 text-[14px] font-medium text-[#3d3d3a] transition-all focus:border-[#cc785c] focus:outline-none"
          >
            <option value="">All Types</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters Button */}
        {(search || selectedDifficulty || selectedCompany || selectedType) && (
          <button
            onClick={() => {
              setSearch('');
              setSelectedDifficulty('');
              setSelectedCompany('');
              setSelectedType('');
            }}
            className="h-10 px-4 text-xs font-semibold uppercase tracking-wider text-[#cc785c] hover:text-[#a9583e] hover:underline transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}
