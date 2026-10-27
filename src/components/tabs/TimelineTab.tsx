import { Square, CheckSquare, Zap } from 'lucide-react';
import { TimelinePhase } from '../../lib/schema';

interface TimelineTabProps {
  timeline: TimelinePhase[];
  onToggleTask: (taskId: string) => void;
}

export default function TimelineTab({ timeline, onToggleTask }: TimelineTabProps) {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="p-8 text-center text-text-muted text-sm bg-white rounded-[20px] border border-border">
        No timeline milestones available.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {timeline.map((phase, pIdx) => {
        const isThisWeek = Boolean(phase.isThisWeek);
        return (
          <div
            key={pIdx}
            className={`p-5 rounded-[20px] border transition-all ${
              isThisWeek
                ? 'bg-blush/40 border-primary/30 shadow-2xs'
                : 'bg-white border-border'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <h3 className={`font-serif text-base sm:text-lg font-bold flex items-center gap-2 ${
                isThisWeek ? 'text-primary-dark' : 'text-text'
              }`}>
                <span>{phase.phase}</span>
              </h3>
              {isThisWeek && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary text-white flex items-center gap-1 shadow-2xs">
                  <Zap className="w-3 h-3" aria-hidden="true" />
                  <span>This week</span>
                </span>
              )}
            </div>

            <div className="space-y-2">
              {phase.tasks.map((task) => (
                <button
                  type="button"
                  key={task.id}
                  onClick={() => onToggleTask(task.id)}
                  className={`w-full p-3 rounded-xl border text-left transition flex items-start gap-3 cursor-pointer min-h-[44px] ${
                    task.completed
                      ? 'bg-sage/40 border-sage text-text-muted'
                      : 'bg-white/80 border-border hover:border-primary/40 text-text'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {task.completed ? (
                      <CheckSquare className="w-4 h-4 text-[#7E9F7A]" aria-hidden="true" />
                    ) : (
                      <Square className="w-4 h-4 text-text-muted" aria-hidden="true" />
                    )}
                  </div>
                  <span
                    className={`text-xs sm:text-sm font-medium leading-relaxed ${
                      task.completed ? 'line-through text-text-muted' : 'text-text'
                    }`}
                  >
                    {task.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
