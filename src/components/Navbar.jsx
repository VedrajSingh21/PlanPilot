import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Bookmark, Plus, Menu, X } from 'lucide-react';

export default function Navbar({ onNewPlan, onOpenSaved, savedCount }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-[#EDE4DB] z-50 transition-all">
      <div className="max-w-6xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
        {/* Left: Brand */}
        <button
          type="button"
          onClick={onNewPlan}
          className="flex items-center gap-2.5 text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9695F] rounded-lg"
        >
          <div className="w-8 h-8 rounded-xl bg-[#F6DFDB] flex items-center justify-center text-sm font-bold text-[#D9695F]">
            🌸
          </div>
          <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#2B2A33]">
            PlanPilot
          </span>
        </button>

        {/* Right Desktop: only TWO items */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenSaved}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-[#2B2A33] hover:bg-[#F7EFE8] transition cursor-pointer border border-transparent hover:border-[#EDE4DB]"
          >
            <Bookmark className="w-4 h-4 text-[#6E6A78]" />
            <span>My Plans</span>
            {savedCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-md bg-[#F6DFDB] text-[#B9524A] text-xs font-semibold">
                {savedCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onNewPlan}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D9695F] hover:bg-[#B9524A] text-white text-xs sm:text-sm font-medium shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New plan</span>
          </button>
        </div>

        {/* Right Mobile: single menu icon collapsing into dropdown */}
        <div className="sm:hidden relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-[#2B2A33] hover:bg-[#F7EFE8] transition cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {mobileMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-[20px] bg-white border border-[#EDE4DB] shadow-[0_8px_30px_rgba(91,58,87,0.12)] p-2 z-50 animate-fade-in text-xs">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSaved();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left font-medium text-[#2B2A33] hover:bg-[#F7EFE8] transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-[#6E6A78]" />
                  <span>My Plans</span>
                </div>
                {savedCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-md bg-[#F6DFDB] text-[#B9524A] text-[10px] font-bold">
                    {savedCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNewPlan();
                }}
                className="w-full flex items-center gap-2 px-3 py-2.5 mt-1 rounded-xl text-left font-semibold text-white bg-[#D9695F] hover:bg-[#B9524A] transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>New plan</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
