import React from 'react';
import { motion } from 'motion/react';
import { LeaderboardEntry } from '../types';
import { Trophy, Medal, Star, Clover, Dog, ArrowLeft, Crown, Coins, BadgeCheck } from 'lucide-react';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  onBack: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ entries, onBack }) => {
  const sortedEntries = [...entries].sort((a, b) => b.score - a.score);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-6 sm:p-10 space-y-8"
    >
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="p-3 bg-white/10 text-white rounded-2xl hover:bg-white/20 transition-all flex items-center gap-2 font-black uppercase text-[10px] tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-3">
          <Trophy className="w-8 h-8 text-yellow-400" />
          <h2 className="text-3xl sm:text-5xl font-black text-white premium-font uppercase">Hall of Luck</h2>
        </div>
      </div>

      <div className="glass-panel rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
        <div className="bg-white/5 p-6 border-b border-white/10 grid grid-cols-[60px_1fr_100px_100px_100px] gap-4 items-center">
          <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Rank</span>
          <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Player</span>
          <span className="text-[10px] font-black text-white/40 uppercase tracking-widest text-center">Eggs</span>
          <span className="text-[10px] font-black text-white/40 uppercase tracking-widest text-center">Coins</span>
          <span className="text-[10px] font-black text-white/40 uppercase tracking-widest text-center">Score</span>
        </div>

        <div className="divide-y divide-white/5">
          {sortedEntries.map((entry, index) => (
            <motion.div 
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 grid grid-cols-[60px_1fr_100px_100px_100px] gap-4 items-center group hover:bg-white/5 transition-all ${index === 0 ? 'bg-yellow-500/5' : ''}`}
            >
              <div className="flex justify-center">
                {index === 0 ? <Crown className="w-6 h-6 text-yellow-400" /> : 
                 index === 1 ? <Medal className="w-6 h-6 text-slate-300" /> :
                 index === 2 ? <Medal className="w-6 h-6 text-amber-600" /> :
                 <span className="text-xl font-black text-white/20">{index + 1}</span>}
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center font-black text-white uppercase text-xs">
                  {entry.username.substring(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-white font-black premium-font text-lg group-hover:text-green-400 transition-colors">{entry.username}</p>
                    {entry.isVerified && (
                      <BadgeCheck className="w-4 h-4 text-[#0095f6] fill-white" />
                    )}
                    {entry.isPremium && (
                      <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-md text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                        <Crown className="w-2 h-2" /> Premium
                      </span>
                    )}
                    {entry.isBanned && (
                      <span className="px-2 py-0.5 bg-red-500/20 text-red-500 border border-red-500/30 rounded-md text-[8px] font-black uppercase tracking-widest">Banned</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Dog className="w-3 h-3 text-green-400" />
                    <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">{entry.petsCount} Pets</span>
                    {entry.rareItems.length > 0 && (
                      <>
                        <span className="text-white/20">•</span>
                        <Star className="w-3 h-3 text-amber-400" />
                        <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest">{entry.rareItems.length} Rares</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-center">
                <span className="text-xl font-black text-white tabular-nums">🥚 {entry.eggs}</span>
              </div>

              <div className="text-center">
                <span className="text-sm font-black text-amber-400 tabular-nums">
                  <Coins className="w-3 h-3 inline mr-1" />
                  {(entry.coins || 0).toLocaleString()}
                </span>
              </div>

              <div className="text-center">
                <span className="px-4 py-1.5 bg-green-500/20 text-green-400 rounded-full text-xs font-black tabular-nums border border-green-500/30 shadow-lg shadow-green-500/10">
                  {entry.score}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-[2rem] border border-white/5 bg-white/5 text-center space-y-2">
          <Clover className="w-6 h-6 text-green-400 mx-auto" />
          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Total Players</p>
          <p className="text-2xl font-black text-white">{entries.length}</p>
        </div>
        <div className="glass-panel p-6 rounded-[2rem] border border-white/5 bg-white/5 text-center space-y-2">
          <Star className="w-6 h-6 text-amber-400 mx-auto" />
          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Rare Items Found</p>
          <p className="text-2xl font-black text-white">{entries.reduce((acc, curr) => acc + curr.rareItems.length, 0)}</p>
        </div>
        <div className="glass-panel p-6 rounded-[2rem] border border-white/5 bg-white/5 text-center space-y-2">
          <Dog className="w-6 h-6 text-blue-400 mx-auto" />
          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Pets Adopted</p>
          <p className="text-2xl font-black text-white">{entries.reduce((acc, curr) => acc + curr.petsCount, 0)}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(Leaderboard);
