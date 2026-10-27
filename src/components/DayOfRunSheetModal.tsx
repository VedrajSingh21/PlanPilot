import { X, Clock, Copy } from 'lucide-react';

interface DayOfRunSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventType: string;
  onCopyText: (text: string, msg: string) => void;
}

export default function DayOfRunSheetModal({
  isOpen,
  onClose,
  eventType,
  onCopyText
}: DayOfRunSheetModalProps) {
  if (!isOpen) return null;

  const schedules: Record<string, Array<{ time: string; event: string }>> = {
    wedding: [
      { time: '09:00 AM', event: 'Venue Handover & Decor/Floral installation load-in begins' },
      { time: '11:00 AM', event: 'Bridal & Groom hair, styling, and makeup session starts' },
      { time: '02:00 PM', event: 'Lead photographer arrives: bridal details, portraits & first-look shoot' },
      { time: '04:00 PM', event: 'AV & Sound Engineer test ceremony microphones, music cues & lighting' },
      { time: '05:00 PM', event: 'Guest Arrival: Welcome drinks & live acoustic melodies' },
      { time: '05:45 PM', event: 'Processional / Main Ceremony commences' },
      { time: '07:00 PM', event: 'Sunset Cocktail Hour & Appetizer tray pass' },
      { time: '08:15 PM', event: 'Grand Entrance, Welcome Speeches & Cake Cutting' },
      { time: '08:45 PM', event: 'Dinner Buffet stations opened' },
      { time: '09:30 PM', event: 'Dance Floor Opens & Headline DJ set' },
      { time: '11:30 PM', event: 'Late Night send-off & Venue load-out begins' }
    ],
    birthday: [
      { time: '04:00 PM', event: 'Decor setup: backdrop wall, balloon garland & ambient fairy lighting' },
      { time: '05:30 PM', event: 'Designer cake delivered and placed in temperature-controlled cooler' },
      { time: '06:30 PM', event: 'Host & guest of honor arrive for candid family photos' },
      { time: '07:00 PM', event: 'Guest arrival: signature welcome mocktails & curated background music' },
      { time: '07:45 PM', event: 'Interactive smartphone trivia roast / party game session' },
      { time: '08:30 PM', event: 'Gathering around the cake, toast & celebratory milestone cake cutting' },
      { time: '09:00 PM', event: 'Dinner buffet open; music transitions to high-energy dance party' },
      { time: '10:30 PM', event: 'Artisanal return favors distributed; heartfelt thank you farewell' }
    ],
    community: [
      { time: '07:00 AM', event: 'Site access, crowd barrier positioning & stage rigging setup' },
      { time: '08:00 AM', event: 'Sound check, registration booth setup, volunteer team briefing' },
      { time: '09:00 AM', event: 'Gates Open: Attendee QR check-in, badges & welcome chai/coffee' },
      { time: '09:45 AM', event: 'Opening Keynote & Community Welcome Address' },
      { time: '11:15 AM', event: 'Breakout workshops & community discussion panels' },
      { time: '01:00 PM', event: 'Networking lunch & local vendor marketplace exploration' },
      { time: '02:30 PM', event: 'Community Showcase & Live Cultural Performances' },
      { time: '04:30 PM', event: 'Closing awards ceremony, volunteer appreciation & group photo' },
      { time: '05:30 PM', event: 'Volunteer debrief, site clean-up & venue handover' }
    ]
  };

  const key = eventType.toLowerCase().includes('wed')
    ? 'wedding'
    : eventType.toLowerCase().includes('communit') || eventType.toLowerCase().includes('fund')
    ? 'community'
    : 'birthday';

  const currentSchedule = schedules[key] || schedules.birthday;

  const copySchedule = () => {
    const text = currentSchedule.map(s => `${s.time} - ${s.event}`).join('\n');
    onCopyText(text, 'Run sheet copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-text/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-border shadow-[0_16px_40px_rgba(91,58,87,0.15)] max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-bg">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" aria-hidden="true" />
            <h3 className="font-serif text-xl font-bold text-text">
              🕒 Master Day-Of Run Sheet
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-text-muted hover:text-text hover:bg-surface-soft transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close day of run sheet modal"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-2.5 flex-1">
          <p className="text-xs text-text-muted mb-3">
            Hour-by-hour choreography to keep hosts, coordinators, and venue staff synchronized without panic.
          </p>
          {currentSchedule.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-surface-soft/50 border border-border flex items-start gap-3 text-xs sm:text-sm"
            >
              <span className="font-mono font-bold text-primary shrink-0 w-20">
                {item.time}
              </span>
              <span className="text-text font-medium leading-relaxed">
                {item.event}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-bg flex justify-between items-center text-xs">
          <button
            type="button"
            onClick={copySchedule}
            className="px-4 py-2 rounded-xl bg-blush hover:bg-primary hover:text-white font-medium text-primary-dark transition flex items-center gap-1.5 cursor-pointer min-h-[44px]"
          >
            <Copy className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Copy Run Sheet</span>
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
