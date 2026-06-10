import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#181715] text-[#a09d96] border-t border-[#252320]">
      <div className="mx-auto max-w-[1400px] px-6 py-12 md:py-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* Logo & Description */}
          <div className="flex flex-col gap-3 max-w-sm">
            <a href="/" className="flex items-center gap-2 group w-fit">
              <img
                src="/favicon.svg"
                alt="RiddlesMaster Logo"
                className="h-6 w-6 transition-transform group-hover:rotate-12"
              />
              <span className="text-[15px] font-bold tracking-[-0.03em] text-[#faf9f5]">RiddlesMaster</span>
            </a>
            <p className="text-xs text-[#a09d96]/80 font-normal leading-relaxed">
              Master lateral thinking, logical reasoning, and creative problem-solving through challenging riddles and puzzles.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap gap-x-8 gap-y-4 text-xs font-medium">
            <a
              href="/about"
              className="text-[#a09d96] hover:text-[#faf9f5] transition-colors"
            >
              About Us
            </a>
            <a
              href="/contact"
              className="text-[#a09d96] hover:text-[#faf9f5] transition-colors"
            >
              Contact Us
            </a>
            <a
              href="/privacy"
              className="text-[#a09d96] hover:text-[#faf9f5] transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="text-[#a09d96] hover:text-[#faf9f5] transition-colors"
            >
              Terms & Conditions
            </a>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="mt-12 pt-8 border-t border-[#252320] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-xs text-[#a09d96]/60">
            &copy; {currentYear} RiddlesMaster. All rights reserved.
          </p>
          <p className="text-xs text-[#a09d96]/40 font-mono">
            Crafted for engineers preparing to excel.
          </p>
        </div>
      </div>
    </footer>
  );
}
