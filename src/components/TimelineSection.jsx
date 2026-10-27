import React from 'react';
import { Clock, CheckSquare, Square, Zap, Flag } from 'lucide-react';

export default function TimelineSection({ timeline, onToggleTask }) {
  return (
    <section id="sec-timeline" className="mb-10 print-card">
      <div className="bg-white rounded-3xl border border-[#EDE4DB] p-6 sm:p-8 shadow-[0_8px_30px_rgba(91,58,87,0.06)]">
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-[#EDE4DB]">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#D9695F]">
              Section 3 of 7
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B2A33]">
              ⏱️ Backward-Planned Timeline
            </h2>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#F7EFE8] text-[#5B3A57] border border-[#EDE4DB]">
            Interactive Checkpoints
          </span>
        </div>

        {/* Timeline Phases */}
        <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-gradient-to-b before:from-[#D9695F] before:via-[#C9A25B] before:to-[#DCE8DA] before:pointer-events-none">
          {timeline.map((phase, pIdx) => {
            const isThisWeek = phase.isThisWeek;
            return (
              <div key={pIdx} className="relative pl-9">
                {/* Timeline Dot */}
                <div className={`absolute left-2 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs ${
                  isThisWeek ? 'bg-[#D9695F] ring-4 ring-[#F6DFDB]' : 'bg-[#C9A25B]'
                }`} />

                {/* Phase Container */}
                <div className={`p-5 rounded-2xl border transition-all ${
                  isThisWeek 
                    ? 'bg-[#F6DFDB]/40 border-[#D9695F]/40 shadow-xs' 
                    : 'bg-[#F7EFE8]/50 border-[#EDE4DB]'
                }`}>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <h3 className={`font-serif text-lg font-bold flex items-center gap-2 ${
                      isThisWeek ? 'text-[#B9524A]' : 'text-[#2B2A33]'
                    }`}>
                      <span>{phase.phase}</span>
                    </h3>
                    {isThisWeek && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#D9695F] text-white flex items-center gap-1 shadow-2xs">
                        <Zap className="w-3 h-3" />
                        Focus: This Week
                      </span>
                    )}
                  </div>

                  {/* Tasks List */}
                  <div className="space-y-2">
                    {phase.tasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => onToggleTask(task.id)}
                        className={`p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                          task.completed
                            ? 'bg-[#DCE8DA]/40 border-[#DCE8DA] text-[#6E6A78]'
                            : 'bg-white border-[#EDE4DB] hover:border-[#D9695F]/30 text-[#2B2A33]'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {task.completed ? (
                            <CheckSquare className="w-4 h-4 text-[#7E9F7A]" />
                          ) : (
                            <Square className="w-4 h-4 text-[#6E6A78]" />
                          )}
                        </div>
                        <span className={`text-xs sm:text-sm font-medium leading-relaxed ${
                          task.completed ? 'line-through text-[#6E6A78]' : 'text-[#2B2A33]'
                        }`}>
                          {task.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
