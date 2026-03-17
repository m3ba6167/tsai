import React, { useState, useEffect } from 'react';
import { Coins, Clock, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface StatsBarProps {
  coins: number;
  pendingCoins: number;
  multiplierEndTime: number;
  onCollect: () => void;
}

const StatsBar: React.FC<StatsBarProps> = ({ coins, pendingCoins, multiplierEndTime, onCollect }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      if (multiplierEndTime > now) {
        setTimeLeft(Math.ceil((multiplierEndTime - now) / 60000));
      } else {
        setTimeLeft(0);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [multiplierEndTime]);

  return (
    <div className="flex items-center gap-4">
      <div className="glass-panel px-4 py-2 rounded-xl border border-white/10 flex items-center gap-2">
        <Coins className="w-4 h-4 text-amber-500" />
        <span className="text-xs font-black text-white tabular-nums">{coins.toLocaleString()}</span>
      </div>
      
      {pendingCoins > 0 && (
        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCollect}
          className="bg-amber-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/20 font-black uppercase tracking-widest text-[10px]"
        >
          <Zap className="w-3 h-3 animate-bounce" />
          Collect {pendingCoins.toLocaleString()}
        </motion.button>
      )}

      {timeLeft > 0 && (
        <div className="glass-panel px-4 py-2 rounded-xl border border-green-500/30 bg-green-500/10 flex items-center gap-2">
          <Clock className="w-3 h-3 text-green-500 animate-pulse" />
          <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">{timeLeft}m Booster</span>
        </div>
      )}
    </div>
  );
};

export default React.memo(StatsBar);
