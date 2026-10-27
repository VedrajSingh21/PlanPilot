import { X, Copy, Mail } from 'lucide-react';

interface VendorMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  draftText: string;
  onCopy: (text: string, msg: string) => void;
}

export default function VendorMessageModal({
  isOpen,
  onClose,
  category,
  draftText,
  onCopy
}: VendorMessageModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-text/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-border shadow-[0_16px_40px_rgba(91,58,87,0.15)] max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-bg">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" aria-hidden="true" />
            <div>
              <h3 className="font-serif text-lg font-bold text-text">
                Draft Inquiry: {category} Partner
              </h3>
              <p className="text-[11px] text-text-muted">
                Professional message template with critical questions &amp; policy checks
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface-soft transition cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1 text-xs">
          <p className="text-text-muted">
            Personalize the bracketed fields [Vendor Name, Date] and paste into email or messaging:
          </p>
          <pre className="p-4 rounded-2xl bg-surface-soft/60 border border-border text-xs text-text leading-relaxed whitespace-pre-wrap font-sans">
            {draftText}
          </pre>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-bg flex justify-between items-center text-xs">
          <button
            type="button"
            onClick={() => onCopy(draftText, 'Vendor inquiry copied to clipboard!')}
            className="px-4 py-2 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition flex items-center gap-1.5 cursor-pointer shadow-2xs min-h-[44px]"
          >
            <Copy className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Copy Inquiry Draft</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white border border-border font-medium text-text hover:bg-surface-soft transition cursor-pointer min-h-[44px]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
