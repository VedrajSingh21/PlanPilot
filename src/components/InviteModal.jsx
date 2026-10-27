import React from 'react';
import { X, Copy, Check } from 'lucide-react';

export default function InviteModal({ isOpen, onClose, inviteText, onCopyText }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#2B2A33]/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-[#EDE4DB] shadow-[0_16px_40px_rgba(91,58,87,0.15)] max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-5 border-b border-[#EDE4DB] flex items-center justify-between bg-[#FBF8F3]">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#2B2A33]">
              ✉️ Ready-to-Send Invitation Wording
            </h3>
            <p className="text-xs text-[#6E6A78]">Curated copy-paste drafts for digital cards &amp; messaging</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#6E6A78] hover:text-[#2B2A33] hover:bg-[#F7EFE8] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Option 1: Formal */}
          <div className="p-4 rounded-2xl bg-[#F7EFE8]/50 border border-[#EDE4DB]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C9A25B]">
                Option 1: Formal &amp; Elegant
              </span>
              <button
                onClick={() => onCopyText(inviteText.formal, 'Formal wording copied!')}
                className="px-2.5 py-1 rounded-lg bg-white border border-[#EDE4DB] text-xs font-medium text-[#2B2A33] hover:bg-[#F6DFDB] transition flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3 text-[#6E6A78]" />
                <span>Copy</span>
              </button>
            </div>
            <pre className="text-xs text-[#2B2A33] whitespace-pre-wrap font-sans leading-relaxed">
              {inviteText.formal}
            </pre>
          </div>

          {/* Option 2: Casual */}
          <div className="p-4 rounded-2xl bg-[#F7EFE8]/50 border border-[#EDE4DB]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2980B9]">
                Option 2: Modern &amp; Casual
              </span>
              <button
                onClick={() => onCopyText(inviteText.casual, 'Casual wording copied!')}
                className="px-2.5 py-1 rounded-lg bg-white border border-[#EDE4DB] text-xs font-medium text-[#2B2A33] hover:bg-[#F6DFDB] transition flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3 text-[#6E6A78]" />
                <span>Copy</span>
              </button>
            </div>
            <pre className="text-xs text-[#2B2A33] whitespace-pre-wrap font-sans leading-relaxed">
              {inviteText.casual}
            </pre>
          </div>

          {/* Option 3: WhatsApp Direct */}
          <div className="p-4 rounded-2xl bg-[#F7EFE8]/50 border border-[#EDE4DB]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#7E9F7A]">
                Option 3: WhatsApp / SMS Direct
              </span>
              <button
                onClick={() => onCopyText(inviteText.whatsapp, 'WhatsApp wording copied!')}
                className="px-2.5 py-1 rounded-lg bg-white border border-[#EDE4DB] text-xs font-medium text-[#2B2A33] hover:bg-[#F6DFDB] transition flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3 text-[#6E6A78]" />
                <span>Copy</span>
              </button>
            </div>
            <pre className="text-xs text-[#2B2A33] whitespace-pre-wrap font-sans leading-relaxed">
              {inviteText.whatsapp}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#EDE4DB] bg-[#FBF8F3] text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white border border-[#EDE4DB] font-medium text-xs text-[#2B2A33] hover:bg-[#F7EFE8] transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
