import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, Crown, UserPlus, ArrowRight, BookOpen } from 'lucide-react';

interface Stats {
  totalProblems: number;
  totalUsers: number;
  activeSubscriptions: number;
  newUsersThisWeek: number;
}

interface AdminDashboardProps {
  stats: Stats;
}

export default function AdminDashboard({ stats }: AdminDashboardProps) {
  const cards = [
    {
      title: 'Total Problems',
      value: stats.totalProblems,
      description: 'Curated technical riddles in DB',
      icon: BookOpen,
      iconColor: 'text-[#cc785c]',
      bgColor: 'bg-[#cc785c]/5',
      href: '/admin/problems',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      description: 'Registered accounts',
      icon: Users,
      iconColor: 'text-[#cc785c]',
      bgColor: 'bg-[#cc785c]/5',
      href: '/admin/users',
    },
    {
      title: 'Active Subscriptions',
      value: stats.activeSubscriptions,
      description: 'Active Premium memberships',
      icon: Crown,
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-500/5',
      href: '/admin/subscriptions',
    },
    {
      title: 'New Users This Week',
      value: stats.newUsersThisWeek,
      description: 'Registered in the last 7 days',
      icon: UserPlus,
      iconColor: 'text-teal-600',
      bgColor: 'bg-teal-500/5',
      href: '/admin/users',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div>
        <h1 className="text-3xl font-normal font-serif tracking-tight text-[#141413]">
          System Overview
        </h1>
        <p className="text-sm text-[#6c6a64] mt-1 font-sans">
          Real-time metrics and statistics for the Riddle Master platform.
        </p>
      </div>

      {/* Grid of Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card 
              key={card.title} 
              className="border border-[#e6dfd8] bg-[#faf9f5] hover:bg-[#efe9de]/30 transition-all duration-300 shadow-sm rounded-lg"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 px-6 pt-6">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-[#6c6a64] font-sans">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor} ${card.iconColor}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="text-4xl font-normal font-serif text-[#141413] tracking-tight">
                  {card.value.toLocaleString()}
                </div>
                <CardDescription className="text-xs text-[#8e8b82] mt-1.5 font-sans flex items-center justify-between">
                  <span>{card.description}</span>
                  {card.href && (
                    <a 
                      href={card.href} 
                      className="inline-flex items-center gap-0.5 text-[#cc785c] hover:text-[#a9583e] font-semibold tracking-wide hover:underline text-[11px] uppercase decoration-none"
                    >
                      View
                      <ArrowRight className="h-3 w-3" />
                    </a>
                  )}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Management Links (Claude editorial card) */}
      <div className="mt-8 rounded-lg border border-[#e6dfd8] bg-[#efe9de]/50 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-serif font-normal text-[#141413]">
            Quick Administration Actions
          </h2>
          <p className="text-xs text-[#6c6a64] mt-0.5">
            Create new content, review user feedback, or check user database records.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href="/admin/problems/new"
            className="inline-flex h-9 items-center justify-center rounded-[8px] bg-[#cc785c] px-4 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#a9583e] active:scale-[0.98] decoration-none"
          >
            Create New Riddle
          </a>
          <a
            href="/admin/problems"
            className="inline-flex h-9 items-center justify-center rounded-[8px] border border-[#e6dfd8] bg-[#faf9f5] px-4 text-xs font-semibold text-[#141413] transition-all hover:bg-[#efe9de]/30 active:scale-[0.98] decoration-none"
          >
            Manage Riddles
          </a>
        </div>
      </div>
    </div>
  );
}
