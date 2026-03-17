import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Bug, Send, ArrowLeft, CheckCircle2, AlertTriangle, Clover } from 'lucide-react';

interface BugsPageProps {
  onBack: () => void;
}

const BugsPage: React.FC<BugsPageProps> = ({ onBack }) => {
  const [bugDescription, setBugDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bugDescription.trim()) return;
    
    // In a real app, we'd send this to a backend
    console.log('Bug reported:', bugDescription);
    setSubmitted(true);
    setBugDescription('');
    setTimeout(() => setSubmitted(false), 3000);
  };

  const knownBugs = [
    { id: 1, title: "Leprechaun Egg Theft", status: "Investigating", severity: "High" },
    { id: 2, title: "Rainbow Flicker on Mobile", status: "Fixed", severity: "Low" },
    { id: 3, title: "Clover Quest Timer Lag", status: "In Progress", severity: "Medium" },
  ];

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
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>
        <div className="flex items-center gap-3">
          <Bug className="w-6 h-6 text-green-400" />
          <h2 className="text-2xl sm:text-4xl font-black text-white premium-font">BUG ARCHIVE</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8">
        {/* Report Section */}
        <div className="glass-panel p-8 rounded-[2.5rem] border-2 border-green-500/20 bg-green-900/10 space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Send className="w-5 h-5 text-green-400" /> Report a Glitch
            </h3>
            <p className="text-green-200/50 text-xs font-bold uppercase tracking-widest">Help us fix the magical leaks</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={bugDescription}
              onChange={(e) => setBugDescription(e.target.value)}
              placeholder="Describe the bug ye found in the clovers..."
              className="w-full h-40 bg-black/20 border border-green-500/30 rounded-2xl p-4 text-white placeholder:text-green-200/20 outline-none focus:border-green-400 transition-all resize-none"
            />
            <button 
              type="submit"
              disabled={!bugDescription.trim() || submitted}
              className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                submitted 
                  ? 'bg-green-500 text-white' 
                  : 'premium-button-gold hover:scale-[1.02] active:scale-95'
              }`}
            >
              {submitted ? (
                <><CheckCircle2 className="w-5 h-5" /> Sent to the Leprechauns!</>
              ) : (
                <><Send className="w-5 h-5" /> Dispatch Report</>
              )}
            </button>
          </form>
        </div>

        {/* Known Bugs Section */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-[2rem] border border-white/5 bg-white/5">
            <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" /> Known Issues
            </h3>
            <div className="space-y-3">
              {knownBugs.map((bug) => (
                <div key={bug.id} className="p-4 bg-black/20 rounded-xl border border-white/5 flex items-center justify-between group hover:border-green-500/30 transition-all">
                  <div>
                    <p className="text-white font-bold text-sm">{bug.title}</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Severity: {bug.severity}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                    bug.status === 'Fixed' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {bug.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-[2rem] border border-green-500/20 bg-green-900/20 text-center">
            <Clover className="w-8 h-8 text-green-400 mx-auto mb-3 animate-spin-slow" />
            <p className="text-white font-black premium-font text-lg">LUCKY TIP</p>
            <p className="text-green-200/50 text-[10px] font-bold uppercase tracking-widest mt-1">
              Reporting bugs increases your luck by 12%*
            </p>
            <p className="text-[8px] text-green-200/20 mt-2 italic">*Not scientifically proven by leprechauns</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(BugsPage);
