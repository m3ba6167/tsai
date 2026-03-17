import React, { useMemo } from 'react';

const BackgroundEffect: React.FC<{ density?: number; theme?: 'default' | 'st-patrick' }> = ({ density = 60, theme = 'default' }) => {
  const snowflakes = useMemo(() => {
    return Array.from({ length: density }).map((_, i) => {
      const isClover = theme === 'st-patrick' && Math.random() > 0.7;
      const isCoin = theme === 'st-patrick' && !isClover && Math.random() > 0.8;
      return {
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * -100}vh`,
        duration: `${10 + Math.random() * 20}s`,
        delay: `${Math.random() * -20}s`,
        size: theme === 'st-patrick' ? `${Math.random() * 12 + 6}px` : `${Math.random() * 3 + 1}px`,
        opacity: 0.2 + Math.random() * 0.4,
        drift: `${Math.random() * 30 - 15}px`,
        color: theme === 'st-patrick' ? (Math.random() > 0.5 ? '#22c55e' : '#fbbf24') : '#ffffff',
        isClover,
        isCoin
      };
    });
  }, [density, theme]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <style>
        {`
          @keyframes subtleSnow {
            0% { transform: translate3d(0, -10vh, 0) rotate(0deg); }
            50% { transform: translate3d(var(--drift), 50vh, 0) rotate(180deg); }
            100% { transform: translate3d(0, 110vh, 0) rotate(360deg); }
          }
          .animate-snow {
            animation: subtleSnow linear infinite;
            will-change: transform;
          }
        `}
      </style>
      {snowflakes.map((s) => (
        <div
          key={s.id}
          className={`absolute animate-snow ${s.isClover || s.isCoin ? '' : 'rounded-full'} shadow-[0_0_8px_rgba(255,255,255,0.3)]`}
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
            backgroundColor: (s.isClover || s.isCoin) ? 'transparent' : s.color,
            animationDuration: s.duration,
            animationDelay: s.delay,
            filter: 'blur(0.5px)',
            // @ts-ignore
            '--drift': s.drift,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: s.size,
          }}
        >
          {s.isClover && <span style={{ color: s.color }}>☘</span>}
          {s.isCoin && <span style={{ color: s.color }}>🪙</span>}
        </div>
      ))}
      <div className={`absolute inset-0 ${theme === 'st-patrick' ? 'bg-gradient-to-b from-green-900/10 via-transparent to-green-900/5' : 'bg-gradient-to-b from-white/20 via-transparent to-white/10'}`} />
      
      {theme === 'st-patrick' && (
        <div className="absolute -bottom-40 -left-40 w-[80vw] h-[80vw] rounded-full border-[60px] border-transparent opacity-20 blur-3xl pointer-events-none" 
             style={{
               background: 'radial-gradient(circle, transparent 40%, red 45%, orange 50%, yellow 55%, green 60%, blue 65%, indigo 70%, violet 75%, transparent 80%)'
             }}
        />
      )}
    </div>
  );
};

export default React.memo(BackgroundEffect);
