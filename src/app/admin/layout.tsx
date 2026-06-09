import React, { createContext, useContext } from 'react';
import { LayoutDashboard, List, Plus, Tag, Users, ArrowLeft } from 'lucide-react';

const PathnameContext = createContext<string>('');

export function usePathname() {
  return useContext(PathnameContext);
}

export function notFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#faf9f5] px-6 py-24 text-center">
      <div className="w-full max-w-[600px] animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="font-serif text-8xl font-normal tracking-[-0.04em] text-[#141413]/10">404</h1>
        <h2 className="mt-4 font-serif text-3xl font-normal tracking-[-0.03em] text-[#141413] sm:text-4xl">
          Lost in the labyrinth
        </h2>
        <p className="mt-6 text-[16px] leading-relaxed text-[#3d3d3a] max-w-[480px] w-full mx-auto font-sans">
          The page you seek is currently out of reach. The page might have been solved, relocated, or never existed in this timeline.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/"
            className="w-full sm:w-auto inline-flex h-10 items-center justify-center rounded-[8px] border border-[#e6dfd8] bg-[#faf9f5] px-6 text-[14px] font-semibold text-[#141413] transition-all hover:bg-[#efe9de]/30 active:scale-[0.98] decoration-none"
          >
            Go Back Home
          </a>
        </div>
      </div>
    </div>
  );
}

interface AdminLayoutProps {
  children: React.ReactNode;
  userRole?: string;
  currentPath: string;
}

export default function AdminLayout({ children, userRole, currentPath }: AdminLayoutProps) {
  // Wrap in auth check — if user role !== ADMIN return notFound()
  const isAdmin = userRole === 'ADMIN' || userRole === 'admin';

  if (!isAdmin) {
    return notFound();
  }

  const navLinks = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/problems', label: 'All Problems', icon: List },
    { href: '/admin/problems/new', label: 'Add Problem', icon: Plus },
    { href: '/admin/tags', label: 'Tags', icon: Tag },
    { href: '/admin/users', label: 'Users', icon: Users },
  ];

  return (
    <PathnameContext.Provider value={currentPath}>
      <div className="flex min-h-screen bg-[#faf9f5] text-[#141413]">
        {/* Fixed Left Sidebar (240px wide) */}
        <aside className="fixed inset-y-0 left-0 z-20 w-[240px] border-r border-[#e6dfd8] bg-[#f5f0e8]/50 flex flex-col">
          {/* Logo Section */}
          <div className="h-16 flex items-center px-6 border-b border-[#e6dfd8]">
            <a href="/" className="flex items-center gap-2 group decoration-none">
              <div className="h-6 w-6 rounded-md bg-[#181715] flex items-center justify-center transition-transform group-hover:rotate-12">
                <span className="text-[#faf9f5] text-[10px] font-bold">R</span>
              </div>
              <span className="text-[15px] font-bold tracking-[-0.03em] text-[#181715]">RiddlesMaster</span>
            </a>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              // Link highlights when active
              const isActive = currentPath === link.href || (link.href !== '/admin' && currentPath.startsWith(link.href));
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors decoration-none ${
                    isActive
                      ? 'bg-[#efe9de] text-[#141413] border border-[#e6dfd8]/50'
                      : 'text-[#6c6a64] hover:bg-[#efe9de]/30 hover:text-[#141413]'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-[#cc785c]' : 'text-[#6c6a64]'}`} />
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Bottom section (Return to main site) */}
          <div className="p-4 border-t border-[#e6dfd8]">
            <a
              href="/problems"
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[#cc785c] hover:text-[#a9583e] transition-colors decoration-none"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Exit Admin Terminal
            </a>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 pl-[240px]">
          <header className="h-16 border-b border-[#e6dfd8] flex items-center justify-between px-8 bg-[#faf9f5]/80 backdrop-blur-md sticky top-0 z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#6c6a64]">
              Administrative Interface
            </span>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#3d3d3a] bg-[#efe9de] px-2.5 py-1 rounded-full border border-[#e6dfd8]">
              <span className="h-2 w-2 rounded-full bg-[#5db872]"></span>
              Admin Session
            </div>
          </header>
          
          <main className="p-8 max-w-[1200px] mx-auto animate-in fade-in duration-300">
            {children}
          </main>
        </div>
      </div>
    </PathnameContext.Provider>
  );
}
