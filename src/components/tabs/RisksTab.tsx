import { AlertCircle, ShieldAlert } from 'lucide-react';
import { Risk } from '../../lib/schema';

interface RisksTabProps {
  risks: Risk[];
}

export default function RisksTab({ risks }: RisksTabProps) {
  const riskList = risks || [];

  if (riskList.length === 0) {
    return (
      <div className="p-8 text-center text-text-muted text-sm bg-white rounded-[20px] border border-border">
        No critical risks identified for this scenario.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <ShieldAlert className="w-4 h-4 text-primary" aria-hidden="true" />
        <h3 className="font-serif text-lg font-bold text-text">
          Top 3 Risks &amp; Practical Backup Plans
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-3.5">
        {riskList.slice(0, 3).map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-[20px] bg-white border border-border shadow-2xs hover:border-primary/30 transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-blush text-primary-dark flex items-center justify-center shrink-0 mt-0.5">
                <AlertCircle className="w-4 h-4" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary-dark block mb-1">
                  Risk 0{idx + 1}
                </span>
                <h4 className="font-bold text-sm sm:text-base text-text mb-1.5">
                  {item.risk}
                </h4>
                <div className="p-3 rounded-xl bg-surface-soft/70 border border-border text-xs sm:text-sm text-text-muted leading-relaxed">
                  <span className="font-bold text-text mr-1.5">Backup Plan:</span>
                  <span>{item.mitigation}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
