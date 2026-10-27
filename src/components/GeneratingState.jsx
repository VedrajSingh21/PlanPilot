import React, { useState, useEffect } from 'react';

export default function GeneratingState() {
  const messages = [
    'Balancing your budget to the exact penny...',
    'Building your backward-planned timeline...',
    'Curating vendor checklists & contract questions...',
    'Personalizing creative wow moments & savings...'
  ];

  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % messages.length);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-[720px] mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-20 flex flex-col items-center text-center">
      <div className="w-full p-8 sm:p-12 rounded-[20px] bg-white border border-[#EDE4DB] shadow-[0_8px_30px_rgba(91,58,87,0.06)] flex flex-col items-center">
        {/* Soft spinner */}
        <div className="w-12 h-12 rounded-2xl bg-[#F6DFDB] flex items-center justify-center mb-6">
          <div className="w-6 h-6 border-2 border-[#D9695F] border-t-transparent rounded-full animate-spin" />
        </div>

        {/* Calm Rotating Message */}
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2B2A33] mb-2 transition-all">
          {messages[messageIndex]}
        </h3>
        <p className="text-sm text-[#6E6A78] mb-8">
          PlanPilot AI is structuring your complete event blueprint.
        </p>

        {/* Calm Skeleton Bars */}
        <div className="w-full max-w-md space-y-3">
          <div className="h-4 bg-[#F7EFE8] rounded-full animate-pulse w-full" />
          <div className="h-4 bg-[#F7EFE8] rounded-full animate-pulse w-5/6 mx-auto" />
          <div className="h-4 bg-[#F7EFE8] rounded-full animate-pulse w-4/6 mx-auto" />
        </div>
      </div>
    </div>
  );
}
