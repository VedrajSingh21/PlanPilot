import { Calendar, MapPin, Users, Info, AlertTriangle } from 'lucide-react';
import { Snapshot, formatCurrency } from '../../lib/schema';

interface SnapshotHeaderProps {
  snapshot: Snapshot;
}

export default function SnapshotHeader({ snapshot }: SnapshotHeaderProps) {
  return (
    <div className="p-6 rounded-[24px] bg-white border border-border shadow-[0_8px_30px_rgba(91,58,87,0.06)] space-y-4">
      {/* Event Title & Pacing */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/70">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blush text-primary-dark">
              {snapshot.eventType} · {snapshot.mode}
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-text">
            {snapshot.eventName}
          </h2>
          <p className="text-xs sm:text-sm text-text-muted mt-0.5">
            {snapshot.tagline}
          </p>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
            Exact Total Budget
          </span>
          <span className="font-serif text-2xl sm:text-3xl font-bold text-primary">
            {formatCurrency(snapshot.totalBudget, snapshot.currency)}
          </span>
        </div>
      </div>

      {/* Meta Pills: Headcount, Location, Date */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted">
        <div className="flex items-center gap-1.5 bg-surface-soft/60 px-3 py-1.5 rounded-xl border border-border">
          <Users className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
          <span className="font-semibold text-text">{snapshot.guests} Guests</span>
        </div>

        <div className="flex items-center gap-1.5 bg-surface-soft/60 px-3 py-1.5 rounded-xl border border-border">
          <MapPin className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
          <span className="font-semibold text-text">{snapshot.location}</span>
        </div>

        <div className="flex items-center gap-1.5 bg-surface-soft/60 px-3 py-1.5 rounded-xl border border-border">
          <Calendar className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
          <span className="font-semibold text-text">{snapshot.timingText}</span>
        </div>
      </div>

      {/* Why This Plan (Assumptions note) */}
      {snapshot.whyThisPlan && (
        <div className="p-3.5 rounded-xl bg-surface-soft/50 border border-border/80 flex items-start gap-2.5 text-xs text-text-muted leading-relaxed">
          <Info className="w-4 h-4 text-plum shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <strong className="text-text font-semibold">Why this plan: </strong>
            <span>{snapshot.whyThisPlan}</span>
          </div>
        </div>
      )}

      {/* Reality Check Alert if budget is tight/unrealistic for headcount */}
      {snapshot.realityCheck?.isUnrealistic && (
        <div className="p-4 rounded-xl bg-[#FFF3CD] border border-[#FFEEBA] text-[#856404] text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-1">
            <span className="font-bold block">Feasibility Notice</span>
            <p>{snapshot.realityCheck.message}</p>
            {snapshot.realityCheck.suggestions && snapshot.realityCheck.suggestions.length > 0 && (
              <ul className="list-disc list-inside mt-1 space-y-0.5">
                {snapshot.realityCheck.suggestions.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
