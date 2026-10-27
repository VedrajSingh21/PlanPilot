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
    <div className="fixed inset-0 z-50 bg-[#2B2A33]/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-[#EDE4DB] shadow-[0_16px_40px_rgba(91,58,87,0.15)] max-w-md w-full overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-5 border-b border-[#EDE4DB] flex items-center justify-between bg-[#FBF8F3]">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-[#D9695F]" />
            <h3 className="font-serif text-xl font-bold text-[#2B2A33]">
              GenAI Engine Settings
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#6E6A78] hover:text-[#2B2A33] hover:bg-[#F7EFE8] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6E6A78] mb-1.5">
              Gemini API Key (Optional)
            </label>
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7EFE8]/60 border border-[#EDE4DB] focus:border-[#D9695F] text-sm text-[#2B2A33] outline-none font-mono"
            />
            <p className="text-[11px] text-[#6E6A78] mt-1.5 leading-relaxed">
              If left blank or unset, PlanPilot seamlessly runs in <strong>Smart Template Mode</strong> using built-in deterministic planning rules with exact 100% budget math.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F7EFE8]/40 border border-[#EDE4DB] text-xs text-[#6E6A78] space-y-1">
            <div className="font-semibold text-[#2B2A33] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A25B]" />
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
              className="px-4 py-2 rounded-xl bg-white border border-[#EDE4DB] text-xs font-medium text-[#2B2A33] hover:bg-[#F7EFE8] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#D9695F] hover:bg-[#B9524A] text-white text-xs font-semibold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
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
