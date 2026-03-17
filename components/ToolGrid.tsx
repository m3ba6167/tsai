import React from 'react';
import { motion } from 'motion/react';
import { 
  Binary, 
  TrendingUp, 
  FlaskConical, 
  Code2, 
  Flame, 
  BrainCircuit, 
  Network, 
  ShoppingBag 
} from 'lucide-react';
import { ToolType, ViewState } from '../types';

interface ToolGridProps {
  onOpenTool: (tool: ToolType) => void;
  onOpenShop: () => void;
}

const ToolGrid: React.FC<ToolGridProps> = ({ onOpenTool, onOpenShop }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <button onClick={() => onOpenTool(ToolType.MATH)} className="group glass-panel p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] hover:translate-y-[-8px] transition-all text-center">
        <div className="w-12 sm:w-16 h-12 sm:h-16 tool-icon-silver rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-sm group-hover:border-amber-400 group-hover:scale-105 transition-all">
          <Binary className="w-6 sm:w-8 h-6 sm:h-8" />
        </div>
        <h2 className="text-xs sm:text-sm font-black ai-title-text premium-font leading-tight">Math Solver</h2>
        <p className="text-slate-400 text-[7px] sm:text-[8px] uppercase tracking-widest font-extrabold mt-1">Logic</p>
      </button>
      <button onClick={() => onOpenTool(ToolType.FACT)} className="group glass-panel p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] hover:translate-y-[-8px] transition-all text-center">
        <div className="w-12 sm:w-16 h-12 sm:h-16 tool-icon-silver rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-sm group-hover:border-amber-400 group-hover:scale-105 transition-all">
          <TrendingUp className="w-6 sm:w-8 h-6 sm:h-8" />
        </div>
        <h2 className="text-xs sm:text-sm font-black ai-title-text premium-font leading-tight">Elite Fact</h2>
        <p className="text-slate-400 text-[7px] sm:text-[8px] uppercase tracking-widest font-extrabold mt-1">Archive</p>
      </button>
      <button onClick={() => onOpenTool(ToolType.SCIENCE)} className="group glass-panel p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] hover:translate-y-[-8px] transition-all text-center">
        <div className="w-12 sm:w-16 h-12 sm:h-16 tool-icon-silver rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-sm group-hover:border-amber-400 group-hover:scale-105 transition-all">
          <FlaskConical className="w-6 sm:w-8 h-6 sm:h-8" />
        </div>
        <h2 className="text-xs sm:text-sm font-black ai-title-text premium-font leading-tight">Science Lab</h2>
        <p className="text-slate-400 text-[7px] sm:text-[8px] uppercase tracking-widest font-extrabold mt-1">Research</p>
      </button>
      <button onClick={() => onOpenTool(ToolType.CODING)} className="group glass-panel p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] hover:translate-y-[-8px] transition-all text-center">
        <div className="w-12 sm:w-16 h-12 sm:h-16 tool-icon-silver rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-sm group-hover:border-amber-400 group-hover:scale-105 transition-all">
          <Code2 className="w-6 sm:w-8 h-6 sm:h-8" />
        </div>
        <h2 className="text-xs sm:text-sm font-black ai-title-text premium-font leading-tight">Code Astro</h2>
        <p className="text-slate-400 text-[7px] sm:text-[8px] uppercase tracking-widest font-extrabold mt-1">Forge</p>
      </button>
      <button onClick={() => onOpenTool(ToolType.MOTIVATION)} className="group glass-panel p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] hover:translate-y-[-8px] transition-all text-center">
        <div className="w-12 sm:w-16 h-12 sm:h-16 tool-icon-silver rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-sm group-hover:border-amber-400 group-hover:scale-105 transition-all">
          <Flame className="w-6 sm:w-8 h-6 sm:h-8" />
        </div>
        <h2 className="text-xs sm:text-sm font-black ai-title-text premium-font leading-tight">Motivation</h2>
        <p className="text-slate-400 text-[7px] sm:text-[8px] uppercase tracking-widest font-extrabold mt-1">Drive</p>
      </button>
      <button onClick={() => onOpenTool(ToolType.STUDY)} className="group glass-panel p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] hover:translate-y-[-8px] transition-all text-center">
        <div className="w-12 sm:w-16 h-12 sm:h-16 tool-icon-silver rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-sm group-hover:border-amber-400 group-hover:scale-105 transition-all">
          <BrainCircuit className="w-6 sm:w-8 h-6 sm:h-8" />
        </div>
        <h2 className="text-xs sm:text-sm font-black ai-title-text premium-font leading-tight">Study Gen</h2>
        <p className="text-slate-400 text-[7px] sm:text-[8px] uppercase tracking-widest font-extrabold mt-1">Mastery</p>
      </button>
      <button onClick={() => onOpenTool(ToolType.VOICE_CONCEPT)} className="group glass-panel p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] hover:translate-y-[-8px] transition-all text-center">
        <div className="w-12 sm:w-16 h-12 sm:h-16 tool-icon-silver rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-sm group-hover:border-amber-400 group-hover:scale-105 transition-all">
          <Network className="w-6 sm:w-8 h-6 sm:h-8" />
        </div>
        <h2 className="text-xs sm:text-sm font-black ai-title-text premium-font leading-tight">Voice Architect</h2>
        <p className="text-slate-400 text-[7px] sm:text-[8px] uppercase tracking-widest font-extrabold mt-1">Concept Map</p>
      </button>
      <button onClick={onOpenShop} className="group glass-panel p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] hover:translate-y-[-8px] transition-all text-center bg-amber-500/5 border-amber-500/20">
        <div className="w-12 sm:w-16 h-12 sm:h-16 bg-amber-500/20 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-sm group-hover:scale-105 transition-all">
          <ShoppingBag className="w-6 sm:w-8 h-6 sm:h-8 text-amber-500" />
        </div>
        <h2 className="text-xs sm:text-sm font-black text-amber-500 premium-font leading-tight">The Emporium</h2>
        <p className="text-amber-600 text-[7px] sm:text-[8px] uppercase tracking-widest font-extrabold mt-1">Shop</p>
      </button>
    </div>
  );
};

export default React.memo(ToolGrid);
