import React, { useState } from 'react';
import { X, Key, Sparkles, Check, ExternalLink } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, apiKey, onSaveApiKey }) {
  const [keyInput, setKeyInput] = useState(apiKey || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSaveApiKey(keyInput.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 bg-text/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-border shadow-[0_16px_40px_rgba(91,58,87,0.15)] max-w-md w-full overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-bg">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-primary" />
            <h3 className="font-serif text-xl font-bold text-text">
              GenAI Engine Settings
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-text-muted hover:text-text hover:bg-surface-soft transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
              Gemini API Key (Optional)
            </label>
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-soft/60 border border-border focus:border-primary text-sm text-text outline-none font-mono"
            />
            <p className="text-[11px] text-text-muted mt-1.5 leading-relaxed">
              If left blank or unset, PlanPilot seamlessly runs in <strong>Smart Template Mode</strong> using built-in deterministic planning rules with exact 100% budget math.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-soft/40 border border-border text-xs text-text-muted space-y-1">
            <div className="font-semibold text-text flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-accent-gold" />
              <span>How Gemini API is called:</span>
            </div>
            <p>
              Calls are handled via a secure server proxy with structured JSON output schema validation. Your key is never exposed on client surfaces.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white border border-border text-xs font-medium text-text hover:bg-surface-soft transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-semibold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Key</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
