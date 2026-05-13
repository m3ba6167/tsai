import React from 'react';
import { motion } from 'motion/react';
import { LeaderboardEntry } from '../types';
import { Trophy, Medal, Star, ArrowLeft, Crown, BadgeCheck, Users, Zap } from 'lucide-react';

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
          <h2 className="text-3xl sm:text-5xl font-black text-white premium-font uppercase">Hall of Excellence</h2>
        </div>
      </div>

      <div className="glass-panel rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
        <div className="bg-white/5 p-6 border-b border-white/10 grid grid-cols-[60px_1fr_100px] gap-4 items-center text-center sm:text-left">
          <span className="text-[10px] font-black text-white/40 uppercase tracking-widest px-2">Rank</span>
          <span className="text-[10px] font-black text-white/40 uppercase tracking-widest text-left">Strategic Partner</span>
          <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Performance Score</span>
        </div>

        <div className="divide-y divide-white/5">
          {sortedEntries.map((entry, index) => (
            <motion.div 
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 grid grid-cols-[60px_1fr_100px] gap-4 items-center group hover:bg-white/5 transition-all ${index === 0 ? 'bg-yellow-500/5' : ''}`}
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
                    <p className="text-white font-black premium-font text-lg group-hover:text-amber-400 transition-colors truncate max-w-[120px] sm:max-w-none">{entry.username}</p>
                    {entry.isVerified && (
                      <BadgeCheck className="w-4 h-4 text-[#0095f6] fill-white" />
                    )}
                    {entry.isPremium && (
                      <span className="hidden sm:flex px-2 py-0.5 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-md text-[8px] font-black uppercase tracking-widest items-center gap-1">
                        <Crown className="w-2 h-2" /> Premium
                      </span>
                    )}
                    {entry.isBanned && (
                      <span className="px-2 py-0.5 bg-red-500/20 text-red-500 border border-red-500/30 rounded-md text-[8px] font-black uppercase tracking-widest">Restricted</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Active Intelligence Session</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <span className="px-4 py-1.5 bg-amber-500/20 text-amber-500 rounded-full text-xs font-black tabular-nums border border-amber-500/30 shadow-lg shadow-amber-500/10">
                  {entry.score}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-[2rem] border border-white/5 bg-white/5 text-center space-y-2">
          <Users className="w-6 h-6 text-blue-400 mx-auto" />
          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Network Nodes</p>
          <p className="text-2xl font-black text-white">{entries.length}</p>
        </div>
        <div className="glass-panel p-6 rounded-[2rem] border border-white/5 bg-white/5 text-center space-y-2">
          <Zap className="w-6 h-6 text-amber-400 mx-auto" />
          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Average Precision</p>
          <p className="text-2xl font-black text-white">
            {entries.length > 0 ? (entries.reduce((acc, curr) => acc + curr.score, 0) / entries.length).toFixed(0) : 0}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(Leaderboard);
