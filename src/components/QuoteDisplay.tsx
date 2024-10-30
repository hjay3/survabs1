import React, { useEffect, useState } from 'react';
import { Quote } from '../types/types';

interface QuoteDisplayProps {
  quote: string;
}

export const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ quote }) => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    // Zoom effect on quote change
    setScale(1.1);
    const timer = setTimeout(() => setScale(1), 300);
    return () => clearTimeout(timer);
  }, [quote]);

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <div 
        className="text-center text-white max-w-3xl p-8 rounded-2xl backdrop-blur-md bg-black/30
                   shadow-[0_0_50px_rgba(255,255,255,0.1)] transition-all duration-700"
        style={{
          transform: `scale(${scale})`,
          textShadow: '0 0 20px rgba(255,255,255,0.2)',
        }}
      >
        <p className="text-2xl md:text-3xl font-light leading-relaxed tracking-wide">
          {quote}
        </p>
      </div>
    </div>
  );
};