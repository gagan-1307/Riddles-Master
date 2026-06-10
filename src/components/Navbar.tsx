import React, { useState, useRef, useEffect } from 'react';

interface NavbarProps {
  user: {
    id: string;
    email: string;
    name?: string | null;
    avatarUrl?: string | null;
  } | null;
  role?: string;
  streakCount?: number;
}

export default function Navbar({ user, role = 'user', streakCount = 0 }: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { href: '/problems', label: 'Problems' },
    { href: '/daily', label: 'Daily Riddle' },
    { href: '/pricing', label: 'Pricing' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#e6dfd8] bg-[#faf9f5]/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-6">
        
        {/* Left: Logo */}
        <div className="flex items-center gap-6">
          <a href="/" className="flex items-center gap-2 group decoration-none">
            <img
              src="/favicon.svg"
              alt="RiddlesMaster Logo"
              className="h-6 w-6 transition-transform group-hover:rotate-12"
            />
            <span className="text-[15px] font-bold tracking-[-0.03em] text-[#181715]">RiddlesMaster</span>
          </a>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full px-3 py-1.5 text-[13px] font-medium text-[#6c6a64] transition-colors hover:bg-[#faf9f5] hover:text-[#181715] decoration-none"
              >
                {link.label}
              </a>
            ))}
            {role === 'admin' && (
              <a
                href="/admin"
                className="rounded-full px-3 py-1.5 text-[13px] font-bold text-violet-600 transition-colors hover:bg-violet-50 decoration-none"
              >
                Admin
              </a>
            )}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-4">


              {/* Avatar Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 rounded-full px-3 py-1.5 text-[13px] font-medium text-[#181715] transition-colors hover:bg-[#e6dfd8]/30 border border-[#e6dfd8] bg-[#faf9f5]"
                >
                  <div className="h-5 w-5 rounded-full bg-[#181715]/5 flex items-center justify-center border border-[#e6dfd8] overflow-hidden">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name || 'Avatar'} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-[10px] font-bold text-[#181715]/40 capitalize">{user.email?.[0]}</span>
                    )}
                  </div>
                  <span className="max-w-[100px] truncate">{user.name || user.email?.split('@')[0]}</span>
                  <svg className={`h-4 w-4 text-[#6c6a64] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md border border-[#e6dfd8] bg-[#faf9f5] py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-4 py-2 border-b border-[#e6dfd8] text-xs text-[#6c6a64] truncate">
                      Signed in as<br />
                      <span className="font-semibold text-[#181715]">{user.email}</span>
                    </div>
                    <a
                      href="/profile"
                      className="block px-4 py-2 text-sm text-[#181715] hover:bg-[#e6dfd8]/30 decoration-none"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Your Profile
                    </a>
                    {role === 'admin' && (
                      <a
                        href="/admin"
                        className="block px-4 py-2 text-sm text-[#181715] hover:bg-[#e6dfd8]/30 decoration-none"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Admin Dashboard
                      </a>
                    )}
                    <form action="/logout" method="POST" className="m-0 border-t border-[#e6dfd8]">
                      <button
                        type="submit"
                        className="block w-full text-left px-4 py-2 text-sm text-[#c64545] hover:bg-red-50 border-none bg-transparent cursor-pointer"
                      >
                        Log Out
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <a
                href="/login"
                className="rounded-full px-4 py-1.5 text-[13px] font-semibold text-[#6c6a64] hover:text-[#181715] decoration-none"
              >
                Log In
              </a>
              <a
                href="/signup"
                className="rounded-full bg-[#cc785c] hover:bg-[#a9583e] px-4 py-1.5 text-[13px] font-semibold text-white shadow-lg shadow-[#cc785c]/10 transition-all hover:opacity-90 active:scale-[0.98] decoration-none"
              >
                Sign Up
              </a>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}
