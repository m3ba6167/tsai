import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, ArrowLeft, Zap, Star, Coins, Sparkles, TrendingUp, Clock, Clover, Crown } from 'lucide-react';

interface ShopProps {
  coins: number;
  multiplierEndTime: number;
  isPremium: boolean;
  shopStock: Record<string, number>;
  onBack: () => void;
  onBuyItem: (item: any) => void;
}

const Shop: React.FC<ShopProps> = ({ coins, multiplierEndTime, isPremium, shopStock, onBack, onBuyItem }) => {
  const isMultiplierActive = multiplierEndTime > Date.now();
  const timeLeft = isMultiplierActive ? Math.ceil((multiplierEndTime - Date.now()) / 60000) : 0;

  const shopItems = [
    { id: 'eggs-10', name: 'Egg Bundle', amount: 10, cost: 1000, icon: <Zap className="w-6 h-6 text-amber-500" />, description: 'A small bundle of eggs to get you started.', type: 'eggs' },
    { id: 'eggs-50', name: 'Egg Crate', amount: 50, cost: 4500, icon: <Sparkles className="w-6 h-6 text-yellow-500" />, description: 'A larger crate of eggs with a bulk discount.', type: 'eggs' },
    { id: 'eggs-200', name: 'Egg Vault', amount: 200, cost: 15000, icon: <Star className="w-6 h-6 text-purple-500" />, description: 'The ultimate egg collection for serious hunters.', type: 'eggs' },
    { id: 'multiplier-2x', name: 'Coin Booster', amount: 2, cost: 10000, icon: <TrendingUp className="w-6 h-6 text-green-500" />, description: 'Double your coin income for 1 hour!', type: 'multiplier' },
    { id: 'multiplier-5x', name: 'Mega Booster', amount: 5, cost: 50000, icon: <Zap className="w-6 h-6 text-red-500" />, description: '5x coin income for 1 hour! High risk, high reward.', type: 'multiplier' },
    { id: 'luck-charm', name: 'Luck Charm', amount: 1, cost: 25000, icon: <Clover className="w-6 h-6 text-green-400" />, description: 'Permanently increase your hatch rates for rare pets!', type: 'luck' },
    { id: 'rainbow-charm', name: 'Rainbow Charm', amount: 1, cost: 250000, icon: <Sparkles className="w-6 h-6 text-purple-400" />, description: 'Massively boost your chances for Legendary pets!', type: 'luck_mega' },
    { 
      id: 'golden-egg-bundle', 
      name: 'Golden Vault', 
      amount: 1000, 
      cost: 1000000, 
      icon: <Star className="w-6 h-6 text-yellow-400" />, 
      description: 'A massive hoard of 1,000 eggs for the elite.', 
      type: 'eggs',
      stock: shopStock['golden-egg-bundle'] ?? 10000,
      maxStock: 10000,
      rarity: 'RARE ELITE'
    },
    { 
      id: 'premium-access', 
      name: 'Premium Access', 
      amount: 1, 
      cost: 1000000, 
      icon: <Crown className="w-6 h-6 text-yellow-400" />, 
      description: 'Unlock Elite AI features: Deep Think & Advanced Analysis.', 
      type: 'premium', 
      disabled: isPremium,
      stock: shopStock['premium-access'] ?? 10000,
      maxStock: 10000,
      rarity: 'ULTIMATE'
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShoppingBag className="w-8 h-8 text-amber-500" />
          <h2 className="text-3xl sm:text-5xl font-black text-white premium-font uppercase">The Emporium</h2>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">New Release Available</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-[2rem] border border-white/10 bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/20 rounded-2xl">
              <Coins className="w-8 h-8 text-amber-500" />
            </div>
            <div>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Available Balance</p>
              <h3 className="text-3xl font-black text-white tabular-nums">{coins.toLocaleString()} <span className="text-amber-500">Coins</span></h3>
            </div>
          </div>
        </div>

        <div className={`glass-panel p-6 rounded-[2rem] border border-white/10 transition-all ${isMultiplierActive ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5'}`}>
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${isMultiplierActive ? 'bg-green-500/20' : 'bg-white/10'}`}>
              <Clock className={`w-8 h-8 ${isMultiplierActive ? 'text-green-500 animate-pulse' : 'text-white/20'}`} />
            </div>
            <div>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Active Booster</p>
              <h3 className={`text-xl font-black ${isMultiplierActive ? 'text-green-400' : 'text-white/20'}`}>
                {isMultiplierActive ? `ACTIVE (${timeLeft}m left)` : 'NO ACTIVE BOOSTER'}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {shopItems.map((item: any) => (
          <motion.div 
            key={item.id}
            whileHover={item.disabled ? {} : { scale: 1.02 }}
            className={`glass-panel p-6 rounded-[2.5rem] border border-white/10 bg-white/5 flex flex-col justify-between group relative overflow-hidden ${item.disabled ? 'opacity-50 grayscale' : ''} ${
              item.rarity === 'ULTIMATE' ? 'border-amber-500/50 bg-amber-500/10' : 
              item.rarity === 'RARE ELITE' ? 'border-yellow-500/30 bg-yellow-500/5' : 
              ''
            }`}
          >
            {item.rarity && (
              <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[8px] font-black tracking-widest border ${
                item.rarity === 'ULTIMATE' ? 'bg-amber-500 text-white border-amber-400 shadow-lg shadow-amber-500/50' : 
                item.rarity === 'RARE ELITE' ? 'bg-yellow-500 text-black border-yellow-400' :
                'bg-purple-500 text-white border-purple-400'
              }`}>
                {item.rarity}
              </div>
            )}
            
            <div className="space-y-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform ${
                item.rarity === 'ULTIMATE' ? 'bg-amber-500/20' : 
                item.rarity === 'RARE ELITE' ? 'bg-yellow-500/20' : 
                'bg-white/10'
              }`}>
                {item.icon}
              </div>
              <div>
                <h4 className="text-xl font-black text-white premium-font">{item.name}</h4>
                <p className="text-xs text-slate-400 font-medium mt-1">{item.description}</p>
              </div>

              {item.stock !== undefined && (
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Limited Stock</span>
                    <span className={`text-[8px] font-black uppercase tracking-widest ${item.rarity === 'ULTIMATE' ? 'text-amber-500' : 'text-yellow-500'}`}>
                      {item.stock}/{item.maxStock}
                    </span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${item.rarity === 'ULTIMATE' ? 'bg-amber-500' : 'bg-yellow-500'}`}
                      style={{ width: `${(item.stock / item.maxStock) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-white/5">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Reward</p>
                <p className="text-xl font-black text-white">
                  {item.type === 'multiplier' ? `🚀 ${item.amount}x Coin Income` : 
                   item.type === 'premium' ? '👑 Elite AI Access' :
                   item.type === 'luck' ? '🍀 Permanent Luck' :
                   `🥚 ${item.amount} Eggs`}
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => onBuyItem(item)}
              disabled={coins < item.cost || item.disabled}
              className={`w-full mt-6 p-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${
                coins >= item.cost && !item.disabled
                ? (item.rarity === 'ULTIMATE' ? 'bg-amber-500 text-white hover:bg-amber-400 shadow-lg shadow-amber-500/40' : 
                   item.rarity === 'RARE ELITE' ? 'bg-yellow-500 text-black hover:bg-yellow-400 shadow-lg shadow-yellow-500/40' :
                   'bg-white/10 text-white hover:bg-white/20')
                : 'bg-white/5 text-white/20 cursor-not-allowed'
              } active:scale-95`}
            >
              {item.disabled ? 'Already Owned' : (coins >= item.cost ? `Buy for ${item.cost.toLocaleString()}` : 'Insufficient Funds')}
            </button>
          </motion.div>
        ))}
      </div>

      <div className="glass-panel p-12 rounded-[3rem] border border-dashed border-white/10 bg-white/5 text-center">
        <Sparkles className="w-12 h-12 text-white/10 mx-auto mb-4" />
        <h3 className="text-2xl font-black text-white/20 premium-font uppercase">More Items Coming Soon</h3>
        <p className="text-white/10 text-xs font-bold uppercase tracking-widest mt-2">The architect is preparing new treasures...</p>
      </div>
    </div>
  );
};

export default React.memo(Shop);
