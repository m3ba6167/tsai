import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clover, Star, Sparkles, Trophy, ArrowLeft, RefreshCw, Brain, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface CloverQuestProps {
  grade: string;
  eggs: number;
  onHatchAll: () => void;
  onComplete: (lucky: boolean) => void;
  onClose: () => void;
}

const CloverQuest: React.FC<CloverQuestProps> = ({ grade, eggs, onHatchAll, onComplete, onClose }) => {
  const [step, setStep] = useState<'intro' | 'question' | 'result'>('intro');
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState<{ text: string; options: string[]; correct: string } | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.API_KEY });

  const fetchQuestion = async () => {
    setLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a multiple choice question about history (the past) for a student in grade: ${grade}. 
        Return ONLY a JSON object with this structure: {"text": "question text", "options": ["opt1", "opt2", "opt3", "opt4"], "correct": "the correct option text"}.
        Make it challenging but appropriate for the grade level.`,
        config: { responseMimeType: "application/json" }
      });
      
      const data = JSON.parse(response.text);
      setQuestion(data);
      setStep('question');
    } catch (error) {
      console.error("Error fetching question:", error);
      // Fallback question
      setQuestion({
        text: "Who was the first President of the United States?",
        options: ["Thomas Jefferson", "George Washington", "Abraham Lincoln", "John Adams"],
        correct: "George Washington"
      });
      setStep('question');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (option: string) => {
    setSelectedOption(option);
    const correct = option === question?.correct;
    setIsCorrect(correct);
    setTimeout(() => {
      setStep('result');
      onComplete(correct);
    }, 1500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel w-full p-8 sm:p-12 rounded-[2.5rem] sm:rounded-[4rem] shadow-2xl relative overflow-hidden text-center border-2 border-green-500/20 bg-green-900/10 min-h-[500px] flex flex-col justify-center"
      >
        <button 
          onClick={onClose}
          className="absolute top-8 left-8 p-3 bg-white/10 text-white rounded-2xl hover:bg-white/20 transition-all flex items-center gap-2 font-black uppercase text-[10px] tracking-widest z-20"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <AnimatePresence mode="wait">
          {step === 'intro' && (
            <motion.div 
              key="intro"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="space-y-8 relative z-10"
            >
              <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="w-12 h-12 text-green-400 animate-pulse" />
              </div>
              <h2 className="text-4xl sm:text-6xl font-black text-white premium-font tracking-tight">HISTORY CHALLENGE</h2>
              <p className="text-green-200/70 text-lg sm:text-xl font-medium max-w-md mx-auto">
                Answer the Leprechaun's riddle about the past to earn your gold and a chance for a rare pet!
              </p>
              <button 
                onClick={fetchQuestion}
                disabled={loading}
                className="px-10 py-5 bg-green-500 hover:bg-green-400 text-white rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-green-500/20 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : "Accept Challenge"}
              </button>
            </motion.div>
          )}

          {step === 'question' && question && (
            <motion.div 
              key="question"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-8 relative z-10"
            >
              <div className="inline-block px-4 py-1 bg-green-500/20 rounded-full text-green-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                Grade {grade} Difficulty
              </div>
              <h3 className="text-2xl sm:text-4xl font-black text-white premium-font leading-tight">
                {question.text}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 w-full max-w-2xl mx-auto">
                {question.options.map((option, i) => (
                  <button
                    key={i}
                    disabled={selectedOption !== null}
                    onClick={() => handleAnswer(option)}
                    className={`p-5 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border-2 transition-all text-left font-bold text-base sm:text-lg relative overflow-hidden group flex items-center gap-4 ${
                      selectedOption === option
                        ? isCorrect 
                          ? 'border-green-500 bg-green-500/20 text-white' 
                          : 'border-red-500 bg-red-500/20 text-white'
                        : 'border-white/10 bg-white/5 text-green-100 hover:border-green-500/40 hover:bg-green-500/10'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black uppercase shrink-0 ${
                      selectedOption === option ? 'bg-white text-green-600' : 'bg-white/10 text-white/40'
                    }`}>
                      {String.fromCharCode(97 + i)}.
                    </div>
                    <span className="relative z-10 flex-1">{option}</span>
                    {selectedOption === option && (
                      <div className="shrink-0">
                        {isCorrect ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <XCircle className="w-5 h-5 text-red-400" />}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'result' && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8 relative z-10"
            >
              <div className="text-8xl mb-6">
                {isCorrect ? '🍀✨' : '💨'}
              </div>
              <h2 className={`text-4xl sm:text-6xl font-black premium-font tracking-tight ${isCorrect ? 'text-green-400' : 'text-slate-400'}`}>
                {isCorrect ? "KNOWLEDGE IS GOLD!" : "THE MISTS OF TIME..."}
              </h2>
              <p className="text-green-100/60 text-lg sm:text-xl max-w-md mx-auto">
                {isCorrect 
                  ? "You've answered correctly! The leprechauns are impressed with your wisdom." 
                  : "That wasn't quite right. The past is a tricky place, but don't stop learning!"}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {isCorrect && eggs > 0 && (
                  <button 
                    onClick={onHatchAll}
                    className="px-8 py-4 bg-amber-500 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20"
                  >
                    Hatch All Eggs ({eggs})
                  </button>
                )}
                <button 
                  onClick={fetchQuestion}
                  className="px-8 py-4 bg-white/10 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-white/20 transition-all"
                >
                  <RefreshCw className="w-4 h-4 mr-2 inline" /> New Question
                </button>
                <button 
                  onClick={onClose}
                  className="px-8 py-4 bg-green-500 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-green-400 transition-all"
                >
                  Claim Rewards
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Decorative Elements */}
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-gradient-to-tr from-red-500 via-yellow-500 to-blue-500 rounded-full blur-[100px] opacity-10 pointer-events-none" />
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-green-500 rounded-full blur-[100px] opacity-10 pointer-events-none" />
      </motion.div>
    </div>
  );
};

export default React.memo(CloverQuest);
