import { X, Copy } from 'lucide-react';
import { InviteText } from '../lib/schema';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  inviteText: InviteText;
  onCopyText: (text: string, msg: string) => void;
}

export default function InviteModal({ isOpen, onClose, inviteText, onCopyText }: InviteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-text/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-border shadow-[0_16px_40px_rgba(91,58,87,0.15)] max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-bg">
          <div>
            <h3 className="font-serif text-xl font-bold text-text">
              ✉️ Ready-to-Send Invitation Wording
            </h3>
            <p className="text-xs text-text-muted">Curated copy-paste drafts for digital cards &amp; messaging</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-text-muted hover:text-text hover:bg-surface-soft transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close invite wording modal"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Option 1: Formal */}
          <div className="p-4 rounded-2xl bg-surface-soft/50 border border-border">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-accent-gold">
                Option 1: Formal &amp; Elegant
              </span>
              <button
                type="button"
                onClick={() => onCopyText(inviteText.formal, 'Formal wording copied!')}
                className="px-2.5 py-1 rounded-lg bg-white border border-border text-xs font-medium text-text hover:bg-blush transition flex items-center gap-1 cursor-pointer min-h-[36px]"
              >
                <Copy className="w-3 h-3 text-text-muted" aria-hidden="true" />
                <span>Copy</span>
              </button>
            </div>
            <pre className="text-xs text-text whitespace-pre-wrap font-sans leading-relaxed">
              {inviteText.formal}
            </pre>
          </div>

          {/* Option 2: Casual */}
          <div className="p-4 rounded-2xl bg-surface-soft/50 border border-border">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2980B9]">
                Option 2: Modern &amp; Casual
              </span>
              <button
                type="button"
                onClick={() => onCopyText(inviteText.casual, 'Casual wording copied!')}
                className="px-2.5 py-1 rounded-lg bg-white border border-border text-xs font-medium text-text hover:bg-blush transition flex items-center gap-1 cursor-pointer min-h-[36px]"
              >
                <Copy className="w-3 h-3 text-text-muted" aria-hidden="true" />
                <span>Copy</span>
              </button>
            </div>
            <pre className="text-xs text-text whitespace-pre-wrap font-sans leading-relaxed">
              {inviteText.casual}
            </pre>
          </div>

          {/* Option 3: WhatsApp Direct */}
          <div className="p-4 rounded-2xl bg-surface-soft/50 border border-border">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#7E9F7A]">
                Option 3: WhatsApp / SMS Direct
              </span>
              <button
                type="button"
                onClick={() => onCopyText(inviteText.whatsapp, 'WhatsApp wording copied!')}
                className="px-2.5 py-1 rounded-lg bg-white border border-border text-xs font-medium text-text hover:bg-blush transition flex items-center gap-1 cursor-pointer min-h-[36px]"
              >
                <Copy className="w-3 h-3 text-text-muted" aria-hidden="true" />
                <span>Copy</span>
              </button>
            </div>
            <pre className="text-xs text-text whitespace-pre-wrap font-sans leading-relaxed">
              {inviteText.whatsapp}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-bg text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white border border-border font-medium text-xs text-text hover:bg-surface-soft transition cursor-pointer min-h-[44px]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
