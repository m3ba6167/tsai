import React from 'react';
import { motion } from 'motion/react';
import { Pet, PetType } from '../types';
import { Dog, Star, Trophy, Sparkles, ArrowLeft, Zap, Coins, Trash2 } from 'lucide-react';

interface PetDisplayProps {
  pets: Pet[];
  eggs: number;
  coins: number;
  pendingCoins: number;
  isHatching: boolean;
  onHatchAll: () => void;
  onBack: () => void;
  onDeletePet: (petId: string) => void;
  onDeleteAllPets: () => void;
  onCollect: () => void;
}

const PetDisplay: React.FC<PetDisplayProps> = ({ pets, eggs, coins, pendingCoins, isHatching, onHatchAll, onBack, onDeletePet, onDeleteAllPets, onCollect }) => {
  const getPetIcon = (type: PetType) => {
    switch (type) {
      case PetType.LUCKY_STAR: return <Star className="w-8 h-8 text-amber-400" />;
      default: return <Dog className="w-8 h-8 text-slate-400" />;
    }
  };

  const getPetColor = (type: PetType) => {
    switch (type) {
      case PetType.LUCKY_STAR: return 'from-amber-500/20 to-amber-900/40 border-amber-500/30';
      default: return 'from-slate-500/20 to-slate-900/40 border-slate-500/30';
    }
  };

  const getPetIncome = (rarity: string) => {
    switch (rarity) {
      case 'Legendary': return 10;
      case 'Epic': return 4;
      case 'Rare': return 2;
      case 'Uncommon': return 1;
      default: return 0.5;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto p-6 sm:p-10 space-y-8 relative"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-3 bg-white/10 text-white rounded-2xl hover:bg-white/20 transition-all flex items-center gap-2 font-black uppercase text-[10px] tracking-widest"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-3">
            <Dog className="w-8 h-8 text-amber-400" />
            <h2 className="text-3xl sm:text-5xl font-black text-white premium-font">MY PETS</h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {pendingCoins > 0 && (
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCollect}
              className="bg-amber-500 text-white px-6 py-4 rounded-2xl flex items-center gap-3 shadow-xl shadow-amber-500/20 font-black uppercase tracking-widest text-xs"
            >
              <Coins className="w-5 h-5 animate-bounce" />
              Collect {pendingCoins.toLocaleString()} Coins
            </motion.button>
          )}
          {eggs > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onHatchAll}
            className="premium-button-gold px-8 py-4 rounded-2xl flex items-center gap-3 shadow-2xl shadow-amber-500/20"
          >
            <Zap className="w-5 h-5" />
            <span className="font-black uppercase tracking-widest text-sm">Hatch All ({eggs} Eggs)</span>
          </motion.button>
        )}
      </div>
    </div>

    {pets.length > 0 && (
      <div className="flex justify-end">
        <button 
          onClick={onDeleteAllPets}
          className="px-6 py-3 bg-red-500/10 text-red-400 rounded-2xl hover:bg-red-500/20 transition-all flex items-center gap-2 font-black uppercase text-[10px] tracking-widest border border-red-500/20 group"
        >
          <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" /> Release All Pets for Eggs
        </button>
      </div>
    )}

      {pets.length === 0 ? (
        <div className="glass-panel p-20 rounded-[3rem] text-center space-y-6 border-2 border-dashed border-white/10">
          <Dog className="w-20 h-20 text-white/10 mx-auto animate-bounce" />
          <p className="text-white/40 font-black premium-font text-xl">NO PETS YET...</p>
          <p className="text-amber-200/30 text-sm uppercase tracking-widest font-bold">Hatch eggs to find them!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <motion.div
              key={pet.id}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`glass-panel p-8 rounded-[2.5rem] border-2 bg-gradient-to-br transition-all relative overflow-hidden group ${getPetColor(pet.type)}`}
            >
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
              
              <div className="flex items-start justify-between relative z-10">
                <div className="p-4 bg-black/20 rounded-2xl">
                  {getPetIcon(pet.type)}
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{pet.rarity}</span>
                  <p className="text-[10px] font-bold text-green-400 uppercase tracking-widest mt-1">{pet.chance}% Chance</p>
                </div>
              </div>

              <div className="mt-8 relative z-10">
                <h3 className="text-2xl font-black text-white premium-font mb-2">{pet.name}</h3>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-white/60 text-xs font-bold uppercase tracking-widest">
                    <Dog className="w-4 h-4" /> Lucky Companion
                  </div>
                  <div className="flex items-center gap-2 text-amber-500 text-xs font-black uppercase tracking-widest">
                    <Coins className="w-4 h-4" /> {getPetIncome(pet.rarity)} Coins/sec
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                <button 
                  onClick={() => onDeletePet(pet.id)}
                  className="flex items-center gap-2 p-2 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest border border-red-500/20"
                >
                  <Trash2 className="w-3 h-3" /> Release
                </button>
                <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">
                  Acquired {new Date(pet.acquiredAt).toLocaleDateString()}
                </span>
              </div>

              {/* Dog Animation Overlay */}
              <motion.div 
                animate={{ 
                  y: [0, -5, 0],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute bottom-4 right-4 opacity-10 group-hover:opacity-30 transition-opacity"
              >
                <Dog className="w-20 h-20 text-white" />
              </motion.div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default React.memo(PetDisplay);
