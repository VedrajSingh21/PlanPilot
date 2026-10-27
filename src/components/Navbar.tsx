import { useState, useRef, useEffect } from 'react';
import { Bookmark, Plus, Menu, X } from 'lucide-react';

interface NavbarProps {
  onNewPlan: () => void;
  onOpenSaved: () => void;
  savedCount: number;
}

export default function Navbar({ onNewPlan, onOpenSaved, savedCount }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-border z-50 transition-all">
      <div className="max-w-6xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
        {/* Left: Brand */}
        <button
          type="button"
          onClick={onNewPlan}
          className="flex items-center gap-2.5 text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg min-h-[44px]"
        >
          <div className="w-8 h-8 rounded-xl bg-blush flex items-center justify-center text-sm font-bold text-primary" aria-hidden="true">
            🌸
          </div>
          <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-text">
            PlanPilot
          </span>
        </button>

        {/* Right Desktop: only TWO items */}
        <nav aria-label="Main Navigation" className="hidden sm:flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenSaved}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-text hover:bg-surface-soft transition cursor-pointer border border-transparent hover:border-border min-h-[44px]"
          >
            <Bookmark className="w-4 h-4 text-text-muted" aria-hidden="true" />
            <span>My Plans</span>
            {savedCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-md bg-blush text-primary-dark text-xs font-semibold">
                {savedCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onNewPlan}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs sm:text-sm font-medium shadow-xs transition cursor-pointer min-h-[44px]"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>New plan</span>
          </button>
        </nav>

        {/* Mobile menu toggle */}
        <div className="sm:hidden relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-text hover:bg-surface-soft transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {mobileMenuOpen && (
            <div className="absolute right-0 top-12 w-48 rounded-2xl bg-white border border-border shadow-lg p-2 space-y-1 z-50">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSaved();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-medium text-text hover:bg-surface-soft text-left cursor-pointer min-h-[44px]"
              >
                <div className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-text-muted" aria-hidden="true" />
                  <span>My Plans</span>
                </div>
                {savedCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-md bg-blush text-primary-dark text-xs font-semibold">
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
                className="w-full flex items-center gap-2 p-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition cursor-pointer min-h-[44px]"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                <span>New plan</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
