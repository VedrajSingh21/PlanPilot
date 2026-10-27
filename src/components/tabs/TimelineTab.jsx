import React from 'react';
import { Square, CheckSquare, Zap } from 'lucide-react';

export default function TimelineTab({ timeline, onToggleTask }) {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="p-8 text-center text-[#6E6A78] text-sm bg-white rounded-[20px] border border-[#EDE4DB]">
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
                ? 'bg-[#F6DFDB]/40 border-[#D9695F]/30 shadow-2xs'
                : 'bg-white border-[#EDE4DB]'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <h3 className={`font-serif text-base sm:text-lg font-bold flex items-center gap-2 ${
                isThisWeek ? 'text-[#B9524A]' : 'text-[#2B2A33]'
              }`}>
                <span>{phase.phase}</span>
              </h3>
              {isThisWeek && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#D9695F] text-white flex items-center gap-1 shadow-2xs">
                  <Zap className="w-3 h-3" />
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
                  className={`w-full p-3 rounded-xl border text-left transition flex items-start gap-3 cursor-pointer ${
                    task.completed
                      ? 'bg-[#DCE8DA]/40 border-[#DCE8DA] text-[#6E6A78]'
                      : 'bg-white/80 border-[#EDE4DB] hover:border-[#D9695F]/40 text-[#2B2A33]'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {task.completed ? (
                      <CheckSquare className="w-4 h-4 text-[#7E9F7A]" />
                    ) : (
                      <Square className="w-4 h-4 text-[#6E6A78]" />
                    )}
                  </div>
                  <span
                    className={`text-xs sm:text-sm font-medium leading-relaxed ${
                      task.completed ? 'line-through text-[#6E6A78]' : 'text-[#2B2A33]'
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
