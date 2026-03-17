import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { 
  Globe, 
  SendHorizontal, 
  ChevronLeft, 
  Binary, 
  Loader2, 
  GraduationCap, 
  Trash2, 
  History, 
  X, 
  LogIn, 
  Mail, 
  AlertCircle, 
  User, 
  LogOut, 
  Sparkles, 
  Clock, 
  Calendar, 
  Edit2, 
  Check, 
  BadgeCheck,
  BookOpen, 
  Star, 
  Ban, 
  Mic, 
  MicOff, 
  UserCheck,
  RefreshCw,
  Play,
  RotateCcw,
  FlaskConical,
  Code2,
  Flame,
  TrendingUp,
  Diamond,
  Files,
  Search,
  Layout,
  Settings,
  ArrowLeft,
  FileUp,
  BrainCircuit,
  BookOpenCheck,
  ChevronRight,
  Eye,
  CheckCircle2,
  Accessibility,
  Network,
  Send,
  Volume2,
  Square,
  Clover,
  Bug,
  Dog,
  Trophy,
  Zap,
  Camera,
  ShoppingBag,
  Coins,
  Plus
} from 'lucide-react';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import ResponseView from './components/ResponseView.tsx';
import BackgroundEffect from './components/BackgroundEffect.tsx';
import CloverQuest from './components/CloverQuest.tsx';
import BugsPage from './components/BugsPage.tsx';
import PetDisplay from './components/PetDisplay.tsx';
import Leaderboard from './components/Leaderboard.tsx';
import Shop from './components/Shop.tsx';
import StatsBar from './components/StatsBar.tsx';
import ToolGrid from './components/ToolGrid.tsx';
import { getGeminiResponse } from './services/geminiService.ts';
import { db } from './firebase';
import { doc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { ToolType, HistoryItem, ViewState, PersonalityType, Pet, PetType, LeaderboardEntry } from './types.ts';

const GRADES = [
  'Elementary (K-5)',
  'Middle School (6-8)',
  'High School (9-12)',
  'College/University',
  'Professional'
];

const PERSONALITIES = Object.values(PersonalityType);

const FORBIDDEN_WORDS = ['badword1', 'badword2', 'idiot', 'stupid', 'fuck', 'shit', 'asshole', 'bitch', 'dumb'];
const ADMIN_EMAIL = 'kanimation641@gmail.com';
const DUMB_EMAILS = ['dumb@gmail.com', 'test@gmail.com', 'admin@gmail.com', 'stupid@gmail.com', 'idiot@gmail.com'];

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.AUTH);
  const [activeTab, setActiveTab] = useState<ToolType>(ToolType.MATH);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const [email, setEmail] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  
  const [banUntil, setBanUntil] = useState<number>(() => {
    const saved = localStorage.getItem('tsai-ban-until');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [isBanned, setIsBanned] = useState(false);
  const [banTimeRemaining, setBanTimeRemaining] = useState(0);

  const [examName, setExamName] = useState(() => localStorage.getItem('tsai-exam-name') || 'Strategic Assessment');
  const [examDate, setExamDate] = useState(() => localStorage.getItem('tsai-exam-date') || '');
  const [isEditingExam, setIsEditingExam] = useState(false);
  const [tempExamName, setTempExamName] = useState(examName);
  const [tempDays, setTempDays] = useState('1');
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  const [response, setResponse] = useState('');
  const [sources, setSources] = useState<{ title: string; uri: string }[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [grade, setGrade] = useState(GRADES[3]); 
  const [personality, setPersonality] = useState<PersonalityType>(PersonalityType.TEACHER);

  const [wordOfDay, setWordOfDay] = useState<string>('');
  const [wordCountry, setWordCountry] = useState<string>('');
  const [isTranslated, setIsTranslated] = useState(false);
  const [isWordLoading, setIsWordLoading] = useState(false);

  const [motivation, setMotivation] = useState<string>('');
  const [isMotivationLoading, setIsMotivationLoading] = useState(false);

  // Code Astro specific state
  const [codeContent, setCodeContent] = useState(''); 
  const [isPreviewing, setIsPreviewing] = useState(false);

  // Study Generator specific state
  const [studySet, setStudySet] = useState<{ summary: string; flashcards: any[]; quiz: any[] } | null>(null);
  const [selectedFile, setSelectedFile] = useState<{ data: string; mimeType: string; name: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [activeStudyTab, setActiveStudyTab] = useState<'summary' | 'flashcards' | 'quiz'>('summary');
  const [currentFlashcard, setCurrentFlashcard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);

  const [isDyslexiaMode, setIsDyslexiaMode] = useState(() => localStorage.getItem('tsai-dyslexia') === 'true');
  const [isStPatricksMode, setIsStPatricksMode] = useState(true);
  const [eggs, setEggs] = useState(() => Number(localStorage.getItem('tsai-eggs') || 0));
  const [coins, setCoins] = useState(() => Number(localStorage.getItem('tsai-coins') || 0));
  const [pendingCoins, setPendingCoins] = useState(0);
  const [isPremium, setIsPremium] = useState(() => localStorage.getItem('tsai-premium') === 'true');
  const [isVerified, setIsVerified] = useState(() => localStorage.getItem('tsai-verified') === 'true');
  const [luckMultiplier, setLuckMultiplier] = useState(() => Number(localStorage.getItem('tsai-luck-multiplier') || 1));
  const [pets, setPets] = useState<Pet[]>(() => JSON.parse(localStorage.getItem('tsai-pets') || '[]'));
  const [multiplierEndTime, setMultiplierEndTime] = useState(() => Number(localStorage.getItem('tsai-multiplier-end') || 0));
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    const saved = localStorage.getItem('tsai-leaderboard');
    return saved ? JSON.parse(saved) : [];
  });
  const [isHatching, setIsHatching] = useState(false);
  const [hatchedPets, setHatchedPets] = useState<Pet[]>([]);
  const [luckyMessage, setLuckyMessage] = useState<string | null>(null);
  const [adminClickCount, setAdminClickCount] = useState(0);
  const [shopStock, setShopStock] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('tsai-shop-stock');
    return saved ? JSON.parse(saved) : { 'premium-access': 10000, 'golden-egg-bundle': 10000 };
  });

  const [nickname, setNickname] = useState(() => localStorage.getItem('tsai-nickname') || '');
  const [profilePic, setProfilePic] = useState(() => localStorage.getItem('tsai-profile-pic') || '');
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [adminKeepOpen, setAdminKeepOpen] = useState(false);
  const [adminCommandInput, setAdminCommandInput] = useState('');
  const [announcement, setAnnouncement] = useState(() => localStorage.getItem('tsai-announcement') || '');
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [customAdminCommands, setCustomAdminCommands] = useState<{label: string, cmd: string}[]>(() => {
    const saved = localStorage.getItem('tsai-custom-admin-cmds');
    return saved ? JSON.parse(saved) : [];
  });
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());

  useEffect(() => {
    localStorage.setItem('tsai-eggs', eggs.toString());
    localStorage.setItem('tsai-coins', coins.toString());
    localStorage.setItem('tsai-pets', JSON.stringify(pets));
    localStorage.setItem('tsai-leaderboard', JSON.stringify(leaderboard));
  }, [eggs, coins, pets, leaderboard]);

  useEffect(() => {
    localStorage.setItem('tsai-custom-admin-cmds', JSON.stringify(customAdminCommands));
  }, [customAdminCommands]);

  useEffect(() => {
    localStorage.setItem('tsai-announcement', announcement);
  }, [announcement]);

  // Passive income logic
  useEffect(() => {
    localStorage.setItem('tsai-multiplier-end', String(multiplierEndTime));
  }, [multiplierEndTime]);

  useEffect(() => {
    localStorage.setItem('tsai-premium', String(isPremium));
  }, [isPremium]);

  useEffect(() => {
    localStorage.setItem('tsai-verified', String(isVerified));
  }, [isVerified]);

  // Global Announcement Sync
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'announcements', 'global'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.active) {
          setAnnouncement(data.text);
          setIsAnnouncementModalOpen(true);
        } else {
          setAnnouncement('');
          setIsAnnouncementModalOpen(false);
        }
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    localStorage.setItem('tsai-luck-multiplier', String(luckMultiplier));
  }, [luckMultiplier]);

  const incomePerSecond = useMemo(() => {
    let income = 0;
    pets.forEach(pet => {
      switch (pet.rarity) {
        case 'Legendary': income += 10; break;
        case 'Epic': income += 4; break;
        case 'Rare': income += 2; break;
        case 'Uncommon': income += 1; break;
        default: income += 0.5; break;
      }
    });
    return income;
  }, [pets]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (pets.length === 0) return;
      
      let currentIncome = incomePerSecond;
      
      // Apply multiplier if active
      if (Date.now() < multiplierEndTime) {
        currentIncome *= 2;
      }
      
      setPendingCoins(prev => prev + currentIncome);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [pets.length, multiplierEndTime, incomePerSecond]);

  const collectCoins = () => {
    if (pendingCoins <= 0) return;
    setCoins(prev => prev + pendingCoins);
    setPendingCoins(0);
    setLuckyMessage(`💰 Collected ${pendingCoins.toLocaleString()} coins from your pets!`);
    setTimeout(() => setLuckyMessage(''), 3000);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.key) return;
      const key = e.key.toLowerCase();
      setKeysPressed(prev => {
        const next = new Set(prev);
        next.add(key);
        
        // Check for m + a
        if (next.has('m') && next.has('a') && userEmail === ADMIN_EMAIL) {
          setIsAdminPanelOpen(true);
        }
        
        return next;
      });
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.key) return;
      const key = e.key.toLowerCase();
      setKeysPressed(prev => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [userEmail]);

  const hatchAllEggs = () => {
    if (eggs <= 0) return;
    
    setIsHatching(true);
    const newPets: Pet[] = [];
    // New logic: 1 egg = 0 pets, 2 eggs = 1 pet, 3 eggs = 2 pets, etc.
    let petsToHatch = Math.max(0, eggs - 1);
    
    for (let i = 0; i < petsToHatch; i++) {
      const roll = Math.random() * 100;
      let pet: Pet | null = null;

      if (roll <= 1 * luckMultiplier) { // 1% Rainbow (boosted by luck)
        pet = { id: `pet-${Date.now()}-${i}`, type: PetType.RAINBOW, name: 'Rainbow Pet', rarity: 'Legendary', chance: 1, acquiredAt: Date.now() };
      } else if (roll <= 5 * luckMultiplier) { // 4% Gold
        pet = { id: `pet-${Date.now()}-${i}`, type: PetType.POT_OF_GOLD, name: 'Gold Pet', rarity: 'Epic', chance: 4, acquiredAt: Date.now() };
      } else if (roll <= 15 * luckMultiplier) { // 10% Star
        pet = { id: `pet-${Date.now()}-${i}`, type: PetType.LUCKY_STAR, name: 'Star Pet', rarity: 'Rare', chance: 10, acquiredAt: Date.now() };
      } else if (roll <= 25 * luckMultiplier) { // 10% Clover
        pet = { id: `pet-${Date.now()}-${i}`, type: PetType.LUCKY_CLOVER, name: 'Clover Pet', rarity: 'Rare', chance: 10, acquiredAt: Date.now() };
      } else if (roll <= 75) { // 50% Leprechaun
        pet = { id: `pet-${Date.now()}-${i}`, type: PetType.LEPRECHAUN, name: 'Leprechaun Pet', rarity: 'Uncommon', chance: 50, acquiredAt: Date.now() };
      }
      
      if (pet) newPets.push(pet);
    }

    setHatchedPets(newPets);
    
    // Animation delay
    setTimeout(() => {
      setPets(prev => [...prev, ...newPets]);
      setEggs(0);
      setIsHatching(false);
      
      if (newPets.length > 0) {
        setLuckyMessage(`🍀 Incredible! You hatched ${newPets.length} new pets!`);
      } else {
        setLuckyMessage("☘️ Your luck is growing! Keep searching for pets!");
      }
      
      // Auto-hide message after 10 seconds
      setTimeout(() => setLuckyMessage(''), 10000);
      
      // Update leaderboard
      updateLeaderboard(pets.length + newPets.length, [...pets, ...newPets]);
    }, 3000);
  };

  useEffect(() => {
    localStorage.setItem('tsai-shop-stock', JSON.stringify(shopStock));
  }, [shopStock]);

  const updateLeaderboard = (count: number, allPets: Pet[], currentCoins: number = coins) => {
    const currentUserEntry: LeaderboardEntry = {
      id: 'user-current',
      username: nickname || getUsername(userEmail),
      eggs: eggs,
      petsCount: count,
      rareItems: allPets.filter(p => p.rarity === 'Legendary' || p.rarity === 'Epic').map(p => p.name),
      score: count * 100 + allPets.filter(p => p.rarity === 'Legendary' || p.rarity === 'Epic').length * 500 + currentCoins,
      coins: currentCoins,
      isPremium: isPremium
    };
    
    setLeaderboard(prev => {
      const filtered = prev.filter(e => e.id !== 'user-current');
      return [...filtered, currentUserEntry];
    });
  };

  const getEggReward = (rarity: string) => {
    switch (rarity) {
      case 'Legendary': return 10;
      case 'Epic': return 5;
      case 'Rare': return 2;
      default: return 1;
    }
  };

  const handleDeletePet = (petId: string) => {
    const petToDelete = pets.find(p => p.id === petId);
    if (!petToDelete) return;

    const reward = getEggReward(petToDelete.rarity);
    setPets(prev => prev.filter(p => p.id !== petId));
    setEggs(prev => prev + reward);
    setLuckyMessage(`♻️ Released ${petToDelete.name} and received ${reward} egg${reward > 1 ? 's' : ''}!`);
    setTimeout(() => setLuckyMessage(''), 10000);
    
    // Update leaderboard after state change (using functional update or local calc)
    const newPetsList = pets.filter(p => p.id !== petId);
    updateLeaderboard(newPetsList.length, newPetsList);
  };

  const handleDeleteAllPets = () => {
    let totalReward = 0;
    pets.forEach(pet => {
      totalReward += getEggReward(pet.rarity);
    });

    setPets([]);
    setEggs(prev => prev + totalReward);
    setLuckyMessage(`♻️ Released all pets and received ${totalReward} eggs!`);
    setTimeout(() => setLuckyMessage(''), 10000);
    updateLeaderboard(0, []);
  };

  const handleBuyShopItem = (item: any) => {
    if (coins < item.cost) {
      setLuckyMessage(`❌ Insufficient funds! You need ${item.cost.toLocaleString()} coins.`);
      setTimeout(() => setLuckyMessage(''), 5000);
      return;
    }

    if (item.stock !== undefined && (shopStock[item.id] || 0) <= 0) {
      setLuckyMessage(`❌ Out of stock! This item is no longer available.`);
      setTimeout(() => setLuckyMessage(''), 5000);
      return;
    }
    
    const newCoins = coins - item.cost;
    setCoins(newCoins);

    if (item.stock !== undefined) {
      setShopStock(prev => ({
        ...prev,
        [item.id]: (prev[item.id] || 10000) - 1
      }));
    }
    
    if (item.type === 'multiplier') {
      const now = Date.now();
      const currentEnd = multiplierEndTime > now ? multiplierEndTime : now;
      setMultiplierEndTime(currentEnd + (3600 * 1000)); // Add 1 hour
      setLuckyMessage(`🚀 Booster Activated! ${item.amount}x Coins for 1 hour!`);
    } else if (item.type === 'premium') {
      setIsPremium(true);
      setLuckyMessage(`👑 WELCOME TO THE ELITE. Premium Access Unlocked!`);
    } else if (item.type === 'luck') {
      setLuckMultiplier(prev => prev + 0.5);
      setLuckyMessage(`🍀 Luck Charm acquired! Your hatch rates have increased!`);
    } else if (item.type === 'luck_mega') {
      setLuckMultiplier(prev => prev + 2.0);
      setLuckyMessage(`🌈 RAINBOW CHARM! Your hatch rates are now legendary!`);
    } else {
      setEggs(prev => prev + item.amount);
      setLuckyMessage(`🛍️ Purchased ${item.amount} eggs for ${item.cost.toLocaleString()} coins!`);
    }
    
    setTimeout(() => setLuckyMessage(''), 10000);
    updateLeaderboard(pets.length, pets, newCoins);
  };

  const recognitionRef = useRef<any>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const viewRef = useRef(view);
  const activeTabRef = useRef(activeTab);
  const sessionRef = useRef(0);

  useEffect(() => {
    localStorage.setItem('tsai-dyslexia', String(isDyslexiaMode));
    if (isDyslexiaMode) {
      document.body.classList.add('dyslexia-mode');
    } else {
      document.body.classList.remove('dyslexia-mode');
    }
  }, [isDyslexiaMode]);

  useEffect(() => {
    localStorage.setItem('tsai-st-patrick', String(isStPatricksMode));
    if (isStPatricksMode) {
      document.body.classList.add('st-patrick-mode');
    } else {
      document.body.classList.remove('st-patrick-mode');
    }
  }, [isStPatricksMode]);

  useEffect(() => {
    viewRef.current = view;
    activeTabRef.current = activeTab;
  }, [view, activeTab]);

  useEffect(() => {
    const saved = localStorage.getItem('tsai-history');
    if (saved) setHistory(JSON.parse(saved));
    const savedGrade = localStorage.getItem('tsai-grade');
    if (savedGrade) setGrade(savedGrade);
    const savedPersonality = localStorage.getItem('tsai-personality') as PersonalityType;
    if (savedPersonality) setPersonality(savedPersonality);

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }

    const speechInterval = setInterval(() => {
      setIsSpeaking(window.speechSynthesis.speaking);
    }, 200);

    return () => {
      clearInterval(speechInterval);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const speak = useCallback((text: string, options: { rate?: number; gender?: 'male' | 'female' } = {}) => {
    const { rate = 0.9, gender = 'female' } = options;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      // Remove markdown-style characters but keep punctuation for natural pauses
      const sanitizedText = text.replace(/[*_#`]/g, '').replace(/\s+/g, ' ').trim();
      if (!sanitizedText) return;

      // Split into sentences for better rhythm and explicit pauses
      const sentences = sanitizedText.split(/(?<=[.!?])\s+/);
      const voices = window.speechSynthesis.getVoices();
      
      let voice;
      if (gender === 'male') {
        voice = voices.find(v => 
          (v.name.includes('Male') || v.name.includes('Guy') || v.name.includes('Daniel') || v.name.includes('Alex')) && v.lang.startsWith('en')
        );
      } else {
        voice = voices.find(v => 
          (v.name.includes('Female') || v.name.includes('Samantha')) && v.lang.startsWith('en')
        );
      }

      sentences.forEach((sentence, index) => {
        const utterance = new SpeechSynthesisUtterance(sentence.trim());
        if (voice) utterance.voice = voice;
        utterance.rate = rate;
        utterance.pitch = 1.0;
        
        if (index === 0) {
          utterance.onstart = () => setIsSpeaking(true);
        }
        if (index === sentences.length - 1) {
          utterance.onend = () => setIsSpeaking(false);
          utterance.onerror = () => setIsSpeaking(false);
        }
        
        window.speechSynthesis.speak(utterance);
      });
    }
  }, []);

  useEffect(() => {
    sessionRef.current += 1;
    stopSpeaking();
  }, [view, activeTab, stopSpeaking]);

  const fetchWordOfDay = async (country?: string) => {
    setIsWordLoading(true);
    setIsTranslated(false);
    try {
      const targetCountry = country || wordCountry || "international linguistic archive";
      const prompt = `Give me a beautiful word from ${targetCountry}. Only provide the response in the specified format without extra chatter.`;
      const res = await getGeminiResponse(prompt, ToolType.WORD, grade, personality, (t) => setWordOfDay(t), undefined, isPremium);
      setWordOfDay(res.text);
    } catch (e) {
      setWordOfDay("Archive momentarily unavailable.");
    } finally {
      setIsWordLoading(false);
    }
  };

  const fetchMotivation = async () => {
    setIsMotivationLoading(true);
    try {
      const prompt = "Provide a high-level motivational insight for an elite strategic mind.";
      const res = await getGeminiResponse(prompt, ToolType.MOTIVATION, grade, personality, (t) => setMotivation(t), undefined, isPremium);
      setMotivation(res.text);
    } catch (e) {
      setMotivation("Excellence is the only objective.");
    } finally {
      setIsMotivationLoading(false);
    }
  };

  useEffect(() => {
    const checkBan = () => {
      const now = Date.now();
      // Admin bypass: never be banned
      if (userEmail === ADMIN_EMAIL) {
        setIsBanned(false);
        setBanTimeRemaining(0);
        return;
      }

      if (banUntil > now) {
        setIsBanned(true);
        setBanTimeRemaining(Math.ceil((banUntil - now) / 1000));
      } else {
        setIsBanned(false);
        setBanTimeRemaining(0);
      }
    };
    checkBan();
    const interval = setInterval(checkBan, 1000);
    return () => clearInterval(interval);
  }, [banUntil, userEmail]);

  useEffect(() => {
    if (!examDate) return;
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(examDate).getTime();
      const difference = target - now;
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          mins: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          secs: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [examDate]);

  const triggerBan = () => {
    const end = Date.now() + 3 * 60 * 1000;
    setBanUntil(end);
    localStorage.setItem('tsai-ban-until', end.toString());
    speak("Inappropriate language detected. Session protocol suspended. Please maintain standards of excellence.", { rate: 0.85, gender: 'male' });
  };

  const containsForbidden = (text: string) => {
    if (!text) return false;
    const lower = text.toLowerCase();
    return FORBIDDEN_WORDS.some(word => lower.includes(word));
  };

  const cancelBan = () => {
    setBanUntil(0);
    localStorage.removeItem('tsai-ban-until');
    setIsBanned(false);
    setBanTimeRemaining(0);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      const data = base64.split(',')[1];
      setSelectedFile({
        data,
        mimeType: file.type,
        name: file.name
      });
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const getUsername = (email: string) => email.split('@')[0];

  const handleProfilePicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePic(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setEmailError('');
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!email.trim()) {
      setEmailError('Identity verification required');
      return;
    }
    if (!gmailRegex.test(email)) {
      setEmailError('Gmail Identity required');
      return;
    }
    if (email && (DUMB_EMAILS.includes(email.toLowerCase()) || email.toLowerCase().includes('test') || email.toLowerCase().includes('example'))) {
      setEmailError('Invalid identity detected');
      return;
    }
    setAuthLoading(true);
    setTimeout(() => {
      setAuthLoading(false);
      setUserEmail(email);
      localStorage.setItem('tsai-nickname', nickname);
      localStorage.setItem('tsai-profile-pic', profilePic);
      setView(ViewState.HOME);
      fetchWordOfDay();
      fetchMotivation();
    }, 1000);
  };

  const handleLogout = () => {
    setUserEmail('');
    setEmail('');
    setView(ViewState.AUTH);
    window.speechSynthesis.cancel();
  };

  const handleGradeChange = (newGrade: string) => {
    setGrade(newGrade);
    localStorage.setItem('tsai-grade', newGrade);
    if (view === ViewState.HOME) {
      fetchWordOfDay();
      fetchMotivation();
    }
  };

  const handleCloverQuestComplete = (correct: boolean) => {
    if (correct) {
      // Give Eggs (1 or 2 randomly)
      const reward = Math.random() > 0.5 ? 2 : 1;
      setEggs(prev => prev + reward);
      setLuckyMessage(`🍀 Knowledge is Gold! ${reward} Egg${reward > 1 ? 's' : ''} added to your stash!`);
      setTimeout(() => setLuckyMessage(''), 10000);
      
      // Update local leaderboard entry for current user
      const currentUserEntry: LeaderboardEntry = {
        id: 'user-current',
        username: getUsername(userEmail),
        eggs: eggs + 3,
        petsCount: pets.length,
        rareItems: pets.filter(p => p.rarity === 'Legendary' || p.rarity === 'Epic').map(p => p.name),
        score: (eggs + 3) * 10 + pets.length * 100 + coins,
        coins: coins
      };
      
      setLeaderboard(prev => {
        const filtered = prev.filter(e => e.id !== 'user-current');
        return [...filtered, currentUserEntry];
      });

    } else {
      setLuckyMessage("☘️ The past remains a mystery... No eggs this time!");
    }
    setTimeout(() => setLuckyMessage(null), 5000);
    setView(ViewState.HOME);
  };
  const handlePersonalityChange = (newPers: PersonalityType) => {
    setPersonality(newPers);
    localStorage.setItem('tsai-personality', newPers);
    if (view === ViewState.HOME) {
      fetchWordOfDay();
      fetchMotivation();
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('tsai-history');
  };

  const handleSaveExam = () => {
    const days = parseFloat(tempDays) || 0;
    const targetDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    const dateStr = targetDate.toISOString();
    setExamName(tempExamName);
    setExamDate(dateStr);
    localStorage.setItem('tsai-exam-name', tempExamName);
    localStorage.setItem('tsai-exam-date', dateStr);
    setIsEditingExam(false);
  };

  const parsedWord = useMemo(() => {
    if (!wordOfDay) return null;
    const lines = wordOfDay.split('\n').map(l => l.trim()).filter(l => l);
    const wordLine = lines.find(l => l.startsWith('#')) || '';
    const wordMatch = wordLine.match(/#\s*(.*?)\s*\((.*?)\)/);
    
    return {
      word: wordMatch ? wordMatch[1] : (wordLine.replace('#', '').trim() || 'Insight'),
      origin: wordMatch ? wordMatch[2] : (lines.find(l => l && l.toLowerCase().includes('origin'))?.split(':')?.slice(1).join(':').trim() || 'Global'),
      pronunciation: lines.find(l => l && l.toLowerCase().includes('pronunciation'))?.split(':')?.slice(1).join(':').trim() || '',
      definition: lines.find(l => l && l.toLowerCase().includes('definition'))?.split(':')?.slice(1).join(':').trim() || 'Connecting to archive...',
    };
  }, [wordOfDay]);

  const parsedMotivation = useMemo(() => {
    if (!motivation) return null;
    const lines = motivation.split('\n').map(l => l.trim()).filter(l => l);
    return {
      title: lines.find(l => l.startsWith('#'))?.replace('#', '').trim() || 'Directive',
      quote: lines.find(l => l.startsWith('"'))?.replace(/"/g, '').trim() || 'Excellence is a choice.',
      commentary: lines.find(l => l.startsWith('-'))?.replace('-', '').trim() || 'Maintain focus.'
    };
  }, [motivation]);

  const handleSubmit = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const queryToUse = customQuery || input;

    // Admin Commands
    if (userEmail === ADMIN_EMAIL && queryToUse.startsWith('/')) {
      const parts = queryToUse.trim().split(/\s+/);
      const command = parts[0].toLowerCase();

      // /give [target?] [amount] [item]
      // /ungive [target?] [amount] [item]
      if (command === '/give' || command === '/ungive') {
        let target = 'me';
        let amount = 0;
        let item = '';

        if (parts.length === 3) {
          // /give [amount] [item]
          amount = parseInt(parts[1]);
          item = parts[2].toLowerCase();
        } else if (parts.length >= 4) {
          // /give [target] [amount] [item]
          target = parts[1];
          amount = parseInt(parts[2]);
          item = parts[3].toLowerCase();
        }

        if (!isNaN(amount) && (item === 'egg' || item === 'eggs' || item === 'coin' || item === 'coins')) {
          const isGive = command === '/give';
          const change = isGive ? amount : -amount;
          const isEgg = item.startsWith('egg');

          if (target.toLowerCase() === 'me' || target === nickname || target === getUsername(userEmail)) {
            if (isEgg) {
              setEggs(prev => Math.max(0, prev + change));
            } else {
              setCoins(prev => Math.max(0, prev + change));
            }
            setLuckyMessage(`🎁 Admin: ${isGive ? 'Added' : 'Removed'} ${amount} ${item} ${isGive ? 'to' : 'from'} your stash!`);
          } else {
            // Target someone else in the leaderboard
            setLeaderboard(prev => prev.map(entry => {
              if (entry.username === target || entry.id === target) {
                if (isEgg) {
                  const newEggs = Math.max(0, entry.eggs + change);
                  return { ...entry, eggs: newEggs, score: newEggs * 10 + entry.petsCount * 100 + (entry.coins || 0) };
                } else {
                  const newCoins = Math.max(0, (entry.coins || 0) + change);
                  return { ...entry, coins: newCoins, score: entry.eggs * 10 + entry.petsCount * 100 + newCoins };
                }
              }
              return entry;
            }));
            setLuckyMessage(`🎁 Admin: ${isGive ? 'Added' : 'Removed'} ${amount} ${item} ${isGive ? 'to' : 'from'} ${target}'s stash!`);
          }
          
          setTimeout(() => setLuckyMessage(''), 5000);
          setInput('');
          setAdminCommandInput('');
          if (!adminKeepOpen) setIsAdminPanelOpen(false);
          return;
        }
      }

      // /reseteggs
      if (command === '/reseteggs') {
        setEggs(0);
        setLuckyMessage(`🎁 Admin: Eggs reset to 0`);
        setTimeout(() => setLuckyMessage(''), 5000);
        setAdminCommandInput('');
        if (!adminKeepOpen) setIsAdminPanelOpen(false);
        return;
      }

      // /seteggs [amount]
      if (command === '/seteggs' && parts.length >= 2) {
        const amount = parseInt(parts[1]);
        if (!isNaN(amount)) {
          setEggs(amount);
          setLuckyMessage(`🎁 Admin: Set eggs to ${amount}`);
          setTimeout(() => setLuckyMessage(''), 5000);
          setInput('');
          setAdminCommandInput('');
          if (!adminKeepOpen) setIsAdminPanelOpen(false);
          return;
        }
      }

      // /ban [nickname]
      if (command === '/ban' && parts.length >= 2) {
        const target = parts[1];
        setLeaderboard(prev => prev.map(entry => {
          if (entry.username === target || entry.id === target) {
            return { ...entry, isBanned: true };
          }
          return entry;
        }));
        setLuckyMessage(`🚫 Admin: Banned ${target}`);
        setTimeout(() => setLuckyMessage(''), 5000);
        setInput('');
        setAdminCommandInput('');
        if (!adminKeepOpen) setIsAdminPanelOpen(false);
        return;
      }

      // /unban [nickname]
      if (command === '/unban' && parts.length >= 2) {
        const target = parts[1];
        setLeaderboard(prev => prev.map(entry => {
          if (entry.username === target || entry.id === target) {
            return { ...entry, isBanned: false };
          }
          return entry;
        }));
        setLuckyMessage(`✅ Admin: Unbanned ${target}`);
        setTimeout(() => setLuckyMessage(''), 5000);
        setInput('');
        setAdminCommandInput('');
        if (!adminKeepOpen) setIsAdminPanelOpen(false);
        return;
      }

      // /verify [nickname]
      if (command === '/verify' && parts.length >= 2) {
        const target = parts[1];
        if (target.toLowerCase() === 'me' || target === nickname || target === getUsername(userEmail)) {
          setIsVerified(true);
          setLuckyMessage(`✅ Admin: You are now VERIFIED!`);
        } else {
          setLeaderboard(prev => prev.map(entry => {
            if (entry.username === target || entry.id === target) {
              return { ...entry, isVerified: true };
            }
            return entry;
          }));
          setLuckyMessage(`✅ Admin: Verified ${target}`);
        }
        setTimeout(() => setLuckyMessage(''), 5000);
        setInput('');
        setAdminCommandInput('');
        if (!adminKeepOpen) setIsAdminPanelOpen(false);
        return;
      }

      // /unverify [nickname]
      if (command === '/unverify' && parts.length >= 2) {
        const target = parts[1];
        if (target.toLowerCase() === 'me' || target === nickname || target === getUsername(userEmail)) {
          setIsVerified(false);
          setLuckyMessage(`✅ Admin: Your verification has been removed.`);
        } else {
          setLeaderboard(prev => prev.map(entry => {
            if (entry.username === target || entry.id === target) {
              return { ...entry, isVerified: false };
            }
            return entry;
          }));
          setLuckyMessage(`✅ Admin: Unverified ${target}`);
        }
        setTimeout(() => setLuckyMessage(''), 5000);
        setInput('');
        setAdminCommandInput('');
        if (!adminKeepOpen) setIsAdminPanelOpen(false);
        return;
      }

      // /hatch
      if (command === '/hatch') {
        hatchAllEggs();
        setAdminCommandInput('');
        if (!adminKeepOpen) setIsAdminPanelOpen(false);
        return;
      }

      // /clearhistory
      if (command === '/clearhistory') {
        clearHistory();
        setLuckyMessage(`🧹 Admin: History cleared`);
        setTimeout(() => setLuckyMessage(''), 5000);
        setAdminCommandInput('');
        if (!adminKeepOpen) setIsAdminPanelOpen(false);
        return;
      }

      // /resetall
      if (command === '/resetall') {
        setEggs(0);
        setCoins(0);
        setPets([]);
        setLeaderboard(prev => prev.filter(e => e.id !== 'user-current'));
        
        localStorage.removeItem('tsai-eggs');
        localStorage.removeItem('tsai-coins');
        localStorage.removeItem('tsai-pets');
        
        setLuckyMessage(`🧹 Admin: Total Reset Executed. You have been removed from the leaderboard.`);
        setTimeout(() => setLuckyMessage(''), 5000);
        setAdminCommandInput('');
        if (!adminKeepOpen) setIsAdminPanelOpen(false);
        return;
      }

      // /announce [message]
      if (command === '/announce' && parts.length >= 2) {
        const msg = parts.slice(1).join(' ');
        
        // Global Announcement Sync via Firestore
        setDoc(doc(db, 'announcements', 'global'), {
          text: msg,
          sender: nickname || getUsername(userEmail),
          timestamp: Date.now(),
          active: true
        }).catch(err => console.error("Firebase Error:", err));

        setLuckyMessage(`📢 Admin: Global Announcement sent!`);
        
        // Auto-clear announcement after 5 seconds
        setTimeout(() => {
          setDoc(doc(db, 'announcements', 'global'), {
            active: false
          }, { merge: true }).catch(err => console.error("Firebase Error:", err));
        }, 5000);

        setTimeout(() => setLuckyMessage(''), 5000);
        setInput('');
        setAdminCommandInput('');
        if (!adminKeepOpen) setIsAdminPanelOpen(false);
        return;
      }

      // /clearannouncement
      if (command === '/clearannouncement') {
        setDoc(doc(db, 'announcements', 'global'), {
          active: false
        }, { merge: true }).catch(err => console.error("Firebase Error:", err));
        
        setLuckyMessage(`📢 Admin: Global Announcement cleared!`);
        setTimeout(() => setLuckyMessage(''), 5000);
        setAdminCommandInput('');
        if (!adminKeepOpen) setIsAdminPanelOpen(false);
        return;
      }

      // /giveall
      if (command === '/giveall') {
        setEggs(prev => prev + 10000);
        setCoins(prev => prev + 10000000);
        setLuckyMessage(`🎁 Admin: Massive Resource Injection Executed`);
        setTimeout(() => setLuckyMessage(''), 5000);
        setAdminCommandInput('');
        if (!adminKeepOpen) setIsAdminPanelOpen(false);
        return;
      }
    }

    if (!queryToUse.trim() && !selectedFile && !loading && !isBanned) return;
    if (loading || isBanned) return;
    
    if (containsForbidden(queryToUse)) {
      triggerBan();
      return;
    }
    setLoading(true);
    setResponse('');
    setSources([]);
    const currentSession = sessionRef.current;
    try {
      const result = await getGeminiResponse(
        queryToUse, 
        activeTab, 
        grade, 
        personality, 
        (t) => {
          if (sessionRef.current === currentSession) {
            setResponse(t);
          }
        },
        selectedFile ? { data: selectedFile.data, mimeType: selectedFile.mimeType } : undefined,
        isPremium
      );
      
      if (sessionRef.current !== currentSession) return;

      if (activeTab === ToolType.STUDY) {
        try {
          const parsed = JSON.parse(result.text);
          setStudySet(parsed);
          setActiveStudyTab('summary');
        } catch (e) {
          console.error("Failed to parse study set JSON", e);
        }
      }

      setResponse(result.text);
      setSources(result.sources || []);
      
      // Only speak if the user is still on the same tool and view
      if (viewRef.current === ViewState.TOOL && activeTabRef.current === activeTab) {
        if (personality === PersonalityType.SOCRATIC) {
          speak(result.text);
        } else if (activeTab === ToolType.MATH) {
          const lines = result.text.split('\n');
          const finalAnswerLine = lines.reverse().find(line => line && line.toLowerCase().includes('final answer'));
          speak(finalAnswerLine || lines[0] || result.text);
        } else if (activeTab !== ToolType.MOTIVATION) {
          speak(result.text);
        }
      }
      
      const newItem: HistoryItem = { id: Date.now().toString(), type: activeTab, query: queryToUse, response: result.text, timestamp: Date.now() };
      const updated = [newItem, ...history].slice(0, 50);
      setHistory(updated);
      localStorage.setItem('tsai-history', JSON.stringify(updated));
    } catch (err) {
      setResponse("Archives accessible signal low. Retrying connection...");
    } finally {
      setLoading(false);
    }
  };

  const openTool = (type: ToolType) => {
    setActiveTab(type);
    setView(ViewState.TOOL);
    setResponse('');
    setSources([]);
    setStudySet(null);
    setSelectedFile(null);
    setInput('');
    setIsPreviewing(false); 
    if (type === ToolType.FACT) {
      const q = "Provide a high-level general knowledge fact.";
      setTimeout(() => handleSubmit(undefined, q), 100);
    } else if (type === ToolType.MOTIVATION) {
      const q = "Provide a high-level motivational insight.";
      setTimeout(() => handleSubmit(undefined, q), 100);
    }
  };

  const lineNumbers = useMemo(() => {
    const lines = codeContent.split('\n').length;
    return Array.from({ length: lines || 1 }, (_, i) => i + 1);
  }, [codeContent]);

  if (isBanned) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center relative">
        <BackgroundEffect density={30} theme={isStPatricksMode ? 'st-patrick' : 'default'} />
        
        {userEmail === ADMIN_EMAIL && (
          <button 
            onClick={cancelBan}
            className="fixed top-6 right-6 z-[100] glass-panel px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-amber-600 hover:bg-amber-50 transition-all active:scale-95 flex items-center gap-2 border-amber-200"
          >
            <X className="w-3 h-3" /> Cancel Timeout
          </button>
        )}

        <div className="z-50 glass-panel p-8 sm:p-12 rounded-[2rem] sm:rounded-[3rem] shadow-2xl max-w-md w-full">
          <div className="w-16 h-16 sm:w-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse"><Ban className="w-8 h-8 text-amber-600" /></div>
          <h2 className="text-2xl sm:text-4xl font-black ai-title-text uppercase tracking-tighter premium-font">PROTOCOL SUSPENDED</h2>
          <div className="bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 mb-6 mt-4">
            <p className="text-[9px] text-slate-400 font-black uppercase mb-1 tracking-widest">Restoring In</p>
            <div className="text-3xl sm:text-5xl font-black text-amber-600 tabular-nums">{Math.floor(banTimeRemaining / 60)}:{String(banTimeRemaining % 60).padStart(2, '0')}</div>
          </div>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed">Inappropriate language detected. Maintain excellence.</p>
        </div>
      </div>
    );
  }

  if (view === ViewState.AUTH) {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 overflow-hidden">
        <BackgroundEffect density={40} theme={isStPatricksMode ? 'st-patrick' : 'default'} />
        <div className="z-30 w-full max-w-md animate-in fade-in zoom-in-95 duration-700">
          <div className="glass-panel p-6 sm:p-12 rounded-[2rem] sm:rounded-[3rem] text-center shadow-2xl relative">
            <div className="absolute -top-6 sm:-top-10 left-1/2 -translate-x-1/2 bg-white p-3 sm:p-4 rounded-full shadow-lg border border-slate-200"><Diamond className="w-6 h-6 text-amber-500" /></div>
            <h1 className="text-5xl sm:text-8xl ai-title-text premium-font mb-1 sm:mb-2 mt-4 sm:mt-6">TSAI</h1>
            <p className="text-slate-400 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em] mb-6 sm:mb-10">Premium Intelligence Gateway</p>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative group text-left">
                <label className="block text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-4">Elite Identity</label>
                <div className={`flex items-center bg-white border ${emailError ? 'border-red-500' : 'border-slate-200'} p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl transition-all focus-within:ring-4 focus-within:ring-amber-50`}>
                  <Mail className={`w-4 h-4 sm:w-5 h-5 mr-3 ${emailError ? 'text-red-400' : 'text-slate-300'}`} />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@gmail.com" className="bg-transparent w-full text-sm font-medium text-slate-900 outline-none" autoFocus />
                </div>
                {emailError && <div className="flex items-center gap-1.5 mt-2 ml-4 text-red-400 text-[9px] font-bold uppercase">{emailError}</div>}
              </div>

              <div className="relative group text-left">
                <label className="block text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-4">Nickname</label>
                <div className="flex items-center bg-white border border-slate-200 p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl transition-all focus-within:ring-4 focus-within:ring-amber-50">
                  <User className="w-4 h-4 sm:w-5 h-5 mr-3 text-slate-300" />
                  <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="Your Nickname" className="bg-transparent w-full text-sm font-medium text-slate-900 outline-none" />
                </div>
              </div>

              <div className="relative group text-left">
                <label className="block text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-4">Profile Picture</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center overflow-hidden relative group/avatar">
                    {profilePic ? (
                      <img src={profilePic} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-6 h-6 text-slate-300" />
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleProfilePicUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center">
                      <FileUp className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">Click to upload avatar</p>
                    <p className="text-[7px] text-slate-300 uppercase tracking-widest mt-1">Supports PNG, JPG</p>
                  </div>
                </div>
              </div>

              <button type="submit" disabled={authLoading} className="w-full premium-button-gold p-4 sm:p-5 rounded-2xl sm:rounded-3xl font-bold transition-all active:scale-95 disabled:opacity-50 mt-2 text-sm sm:text-base">
                {authLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Initialize Connection"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative flex flex-col text-slate-600 antialiased overflow-x-hidden ${isStPatricksMode ? 'bg-[#0a2e1a]' : 'silver-white-bg'}`}>
      <BackgroundEffect density={50} theme={isStPatricksMode ? 'st-patrick' : 'default'} />
      
      <AnimatePresence>
        {isHatching && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-green-950/90 backdrop-blur-2xl flex flex-col items-center justify-center text-center p-10"
          >
            <motion.div
              animate={{ 
                rotate: [0, -10, 10, -10, 10, 0],
                scale: [1, 1.1, 1, 1.1, 1],
                y: [0, -20, 0, -20, 0]
              }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="relative"
            >
              <div className="text-9xl mb-8">🥚</div>
              <motion.div 
                animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Sparkles className="w-32 h-32 text-yellow-400" />
              </motion.div>
            </motion.div>
            <h2 className="text-4xl sm:text-6xl font-black text-white premium-font tracking-tighter mt-8 animate-pulse">HATCHING ALL EGGS...</h2>
            <p className="text-green-400 font-black uppercase tracking-widest mt-4">May the luck of the Irish be with you!</p>
          </motion.div>
        )}
      </AnimatePresence>

      {isStPatricksMode && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[80] flex items-center gap-4 bg-green-600/20 backdrop-blur-md px-6 py-3 rounded-full border border-green-500/30 shadow-2xl">
          <div className="flex items-center gap-2 border-r border-white/10 pr-4">
            <span className="text-xl">🥚</span>
            <div className="flex flex-col">
              <span className="text-white font-black premium-font text-[10px] leading-none">{eggs} Eggs</span>
              {eggs > 0 && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setView(ViewState.PETS);
                    setTimeout(() => hatchAllEggs(), 100);
                  }}
                  className="text-amber-400 font-black text-[8px] uppercase tracking-widest hover:text-amber-300 transition-colors animate-pulse"
                >
                  Hatch Now!
                </button>
              )}
            </div>
          </div>
          <button 
            onClick={() => setView(ViewState.PETS)}
            className="flex items-center gap-2 border-r border-white/10 pr-4 hover:scale-105 transition-transform"
          >
            <Dog className="w-5 h-5 text-blue-400" />
            <span className="text-white font-black premium-font">{pets.length} Pets</span>
          </button>
          <div className="flex flex-col gap-1 border-r border-white/10 pr-4">
            <button 
              onClick={() => setView(ViewState.LEADERBOARD)}
              className="flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-white font-black premium-font text-[10px] leading-none">Rank #{leaderboard.findIndex(e => e.id === 'user-current') + 1 || '?'}</span>
            </button>
            <button 
              onClick={() => setView(ViewState.SHOP)}
              className="flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <ShoppingBag className="w-4 h-4 text-amber-500" />
              <span className="text-white font-black premium-font text-[10px] leading-none">Shop</span>
            </button>
          </div>
          
          <StatsBar 
            coins={coins}
            pendingCoins={pendingCoins}
            multiplierEndTime={multiplierEndTime}
            onCollect={collectCoins}
          />
        </div>
      )}
      <div className="fixed top-3 right-3 sm:top-8 sm:right-8 z-[80] animate-in slide-in-from-right-4 duration-500">
        <div className="glass-panel px-3 py-2 sm:px-6 sm:py-4 rounded-[1.25rem] sm:rounded-[2rem] shadow-xl border-slate-200 flex items-center gap-3">
          <div className="flex flex-col items-end">
            <p 
              onClick={() => {
                if (userEmail === ADMIN_EMAIL) {
                  const next = adminClickCount + 1;
                  if (next >= 5) {
                    setIsAdminPanelOpen(true);
                    setAdminClickCount(0);
                  } else {
                    setAdminClickCount(next);
                  }
                }
              }}
              className="text-[7px] sm:text-[10px] font-black text-amber-600 uppercase tracking-widest leading-tight cursor-pointer select-none"
            >
              Verified
            </p>
            <div className="flex items-center gap-1.5">
              <h4 className="text-[10px] sm:text-sm font-bold text-slate-800 tracking-tight truncate max-w-[80px] sm:max-w-none">{nickname || getUsername(userEmail)}</h4>
              {isVerified && (
                <BadgeCheck className="w-4 h-4 text-[#0095f6] fill-white" />
              )}
            </div>
          </div>
          <div className="w-7 h-7 sm:w-10 sm:h-10 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center shadow-sm border border-slate-200 overflow-hidden">
            {profilePic ? (
              <img src={profilePic} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <User className="w-3.5 h-3.5 sm:w-5 h-5" />
            )}
          </div>
          {userEmail === ADMIN_EMAIL && (
            <button 
              onClick={() => setIsAdminPanelOpen(true)}
              className="p-2 sm:p-2.5 bg-white text-amber-500 rounded-xl sm:rounded-2xl hover:bg-amber-50 transition-all active:scale-90 border border-slate-200"
              title="Admin Panel"
            >
              <Settings className="w-3.5 h-3.5 sm:w-5 h-5" />
            </button>
          )}
          <button onClick={handleLogout} className="p-2 sm:p-2.5 bg-amber-500 text-white rounded-xl sm:rounded-2xl hover:bg-amber-600 transition-all active:scale-90 border border-amber-400 shadow-lg shadow-amber-500/20">
            <LogOut className="w-3.5 h-3.5 sm:w-5 h-5" />
          </button>
        </div>
      </div>

      <header className="z-10 px-4 py-8 sm:py-12 sm:pt-24 flex flex-col items-center">
        <h1 className="text-5xl sm:text-8xl md:text-9xl ai-title-text premium-font select-none mb-1">TSAI</h1>
        <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <p className="text-slate-400 text-[8px] sm:text-[11px] font-bold uppercase tracking-[0.3em]">Advanced Intelligence Core</p>
            <Sparkles className="w-4 h-4 text-amber-500" />
        </div>
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 w-full max-w-2xl px-2">
          <div className="flex items-center gap-2 bg-amber-500 border border-amber-400 px-3 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg shadow-amber-500/20 backdrop-blur-xl transition-all hover:bg-amber-600">
            <GraduationCap className="w-3 h-3 text-white" />
            <select value={grade} onChange={(e) => handleGradeChange(e.target.value)} className="bg-transparent text-white text-[10px] sm:text-sm font-bold outline-none cursor-pointer">
              {GRADES.map(g => <option key={g} value={g} className="text-slate-800">{g}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 bg-amber-500 border border-amber-400 px-3 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg shadow-amber-500/20 backdrop-blur-xl transition-all hover:bg-amber-600">
            <UserCheck className="w-3 h-3 text-white" />
            <select value={personality} onChange={(e) => handlePersonalityChange(e.target.value as PersonalityType)} className="bg-transparent text-white text-[10px] sm:text-sm font-bold outline-none cursor-pointer">
              {PERSONALITIES.map(p => <option key={p} value={p} className="text-slate-800">{p}</option>)}
            </select>
          </div>
        </div>
      </header>

      <main className="flex-1 z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 pb-24 sm:pb-32">
        {view === ViewState.HOME ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 sm:space-y-8 max-w-5xl mx-auto"
          >
            {isStPatricksMode && (
              <div className="flex justify-center mb-4 animate-bounce">
                <div className="relative">
                  <span className="text-6xl sm:text-8xl">🏺</span>
                  <span className="absolute -top-4 -right-4 text-4xl sm:text-6xl animate-pulse">🌈</span>
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex gap-1">
                    <span className="text-xl">🪙</span>
                    <span className="text-xl">🪙</span>
                    <span className="text-xl">🪙</span>
                  </div>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-4 sm:gap-8">
              <div className="lg:col-span-2 glass-panel p-6 rounded-[2rem] border-2 border-green-500/30 bg-green-900/20 transition-all flex flex-col sm:flex-row items-center justify-between group overflow-hidden relative gap-6">
                <div className="flex items-center gap-6 relative z-10">
                  <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Clover className="w-8 h-8 text-green-400 animate-pulse" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-2xl sm:text-3xl font-black text-white premium-font">CLOVER QUEST</h3>
                    <p className="text-green-200/60 text-xs font-bold uppercase tracking-widest">Test your luck & earn eggs</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 relative z-10 w-full sm:w-auto">
                  {eggs > 0 && (
                    <button 
                      onClick={hatchAllEggs}
                      className="flex-grow sm:flex-none flex items-center justify-center gap-2 bg-amber-500 text-white px-4 py-2.5 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20 animate-pulse"
                    >
                      <Zap className="w-3.5 h-3.5" /> Hatch All
                    </button>
                  )}
                  <button 
                    onClick={() => setView(ViewState.LEADERBOARD)}
                    className="flex-grow sm:flex-none flex items-center justify-center gap-2 bg-white/10 text-white px-4 py-2.5 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-white/20 transition-all"
                  >
                    <Trophy className="w-3.5 h-3.5 text-yellow-400" /> Leaderboard
                  </button>
                  <button 
                    onClick={() => setView(ViewState.PETS)}
                    className="flex-grow sm:flex-none flex items-center justify-center gap-2 bg-white/10 text-white px-4 py-2.5 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-white/20 transition-all"
                  >
                    <Dog className="w-3.5 h-3.5 text-blue-400" /> Pets
                  </button>
                  <button 
                    onClick={() => setView(ViewState.BUGS)}
                    className="flex-grow sm:flex-none flex items-center justify-center gap-2 bg-white/10 text-white px-4 py-2.5 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-white/20 transition-all"
                  >
                    <Bug className="w-3.5 h-3.5" /> Bugs
                  </button>
                  <button 
                    onClick={() => setView(ViewState.CLOVER_QUEST)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-green-400 group-hover:gap-4 transition-all"
                  >
                    Play Now <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-green-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform" />
              </div>
              <div className="glass-panel p-6 sm:p-10 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-xl overflow-hidden relative group flex flex-col justify-between min-h-[280px] sm:min-h-[320px]">
                <div className="absolute top-0 right-0 w-48 h-48 bg-slate-50 rounded-full -translate-y-24 translate-x-24 blur-3xl opacity-30"></div>
                <div className="flex flex-col items-center gap-4 sm:gap-6 relative z-10 py-2 sm:py-4">
                  <div className="flex flex-col text-center w-full">
                    <div className="flex items-center justify-center gap-1.5 mb-2 sm:mb-3">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <span className="text-[10px] sm:text-[12px] font-black uppercase tracking-[0.3em] text-slate-400">Target ETA</span>
                    </div>
                    {isEditingExam ? (
                      <div className="flex flex-col gap-2.5 mt-1 sm:mt-2 animate-in fade-in slide-in-from-left-2 w-full max-w-xs mx-auto">
                        <input type="text" value={tempExamName} onChange={(e) => setTempExamName(e.target.value)} className="bg-white border border-slate-200 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-900 outline-none" />
                        <div className="flex gap-2">
                          <input type="number" min="1" value={tempDays} onChange={(e) => setTempDays(e.target.value)} className="flex-1 bg-white border border-slate-200 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-900" />
                          <button onClick={handleSaveExam} className="premium-button-gold px-4 py-2 rounded-xl"><Check className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center group/title">
                        <h2 className="text-xl sm:text-4xl font-black ai-title-text premium-font tracking-tight flex items-center gap-2 mb-0.5 sm:mb-1">
                          {examName}
                          <button onClick={() => setIsEditingExam(true)} className="opacity-0 group-hover/title:opacity-100 p-1.5 hover:bg-slate-50 rounded-lg transition-all"><Edit2 className="w-3.5 h-3.5 text-slate-300" /></button>
                        </h2>
                        <p className="text-slate-400 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em]">{examDate ? `ETA ${new Date(examDate).toLocaleDateString(undefined, { dateStyle: 'long' })}` : 'Objective Counter'}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 sm:gap-8 justify-center py-2">
                    {[{ label: 'DAYS', value: timeLeft.days }, { label: 'HOURS', value: timeLeft.hours }, { label: 'MINS', value: timeLeft.mins }].map((unit, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div className="w-16 h-16 sm:w-24 bg-white border border-slate-200 rounded-[1.25rem] sm:rounded-[2rem] flex items-center justify-center shadow-sm mb-2 transform group-hover:translate-y-[-4px] transition-all">
                          <span className="text-xl sm:text-4xl font-black ai-title-text premium-font">{unit.value.toString().padStart(2, '0')}</span>
                        </div>
                        <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">{unit.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {!examDate && !isEditingExam && (<button onClick={() => setIsEditingExam(true)} className="absolute inset-0 bg-slate-50/20 backdrop-blur-[1px] flex items-center justify-center text-slate-400 font-black uppercase tracking-[0.2em] text-xs sm:text-sm hover:bg-slate-100/50 transition-all z-20"><Calendar className="w-4 h-4 mr-3" /> Set Assessment</button>)}
              </div>
              
              <div className="flex flex-col gap-4 sm:gap-6">
                <div className="glass-panel p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-xl flex flex-col justify-between relative group overflow-hidden flex-1">
                  <div className="relative z-10 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-slate-400">Linguistic Insight</span>
                      </div>
                      <input type="text" placeholder="Archive..." value={wordCountry} onChange={(e) => setWordCountry(e.target.value)} className="bg-transparent text-[8px] sm:text-[10px] font-bold text-slate-600 placeholder:text-slate-300 outline-none w-16 sm:w-20 border-b border-slate-100" />
                    </div>
                    {isWordLoading ? (
                      <div className="py-8 sm:py-12 flex flex-col items-center gap-2"><Loader2 className="w-6 h-6 text-amber-500 animate-spin" /></div>
                    ) : parsedWord ? (
                      <div className="animate-in fade-in">
                        {!isTranslated ? (
                          <div className="min-w-0">
                            <h3 className="text-2xl sm:text-3xl font-black ai-title-text premium-font leading-tight mb-1">{parsedWord.word}</h3>
                            <p className="text-[10px] text-slate-400 italic mb-4">{parsedWord.pronunciation} • {parsedWord.origin}</p>
                          </div>
                        ) : (
                          <div className="py-2 animate-in fade-in">
                            <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] text-amber-600 mb-0.5">Translation</p>
                            <p className="text-lg sm:text-2xl font-black text-slate-900 leading-tight">{parsedWord.definition}</p>
                          </div>
                        )}
                        <div className="mt-4 flex gap-2">
                          <button onClick={() => fetchWordOfDay()} disabled={isWordLoading} className="flex-1 py-2.5 rounded-xl text-[8px] sm:text-[10px] font-black uppercase tracking-widest premium-button-silver flex items-center justify-center gap-2">
                            <RefreshCw className={`w-3 h-3 ${isWordLoading ? 'animate-spin' : ''}`} /> Switch Word
                          </button>
                          <button onClick={() => setIsTranslated(!isTranslated)} className={`flex-1 py-2.5 rounded-xl text-[8px] sm:text-[10px] font-black uppercase tracking-widest transition-all ${isTranslated ? 'premium-button-silver' : 'premium-button-gold'}`}>
                            {isTranslated ? "Show Original" : "Translate to English"}
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="glass-panel p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-xl relative overflow-hidden flex-1">
                  <div className="relative z-10">
                    <div className="flex items-center gap-1.5 mb-3">
                      <Star className="w-3.5 h-3.5 text-amber-600" />
                      <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-slate-400">Directive</span>
                    </div>
                    {isMotivationLoading ? (
                      <div className="py-6 sm:py-8 flex flex-col items-center"><Loader2 className="w-5 h-5 text-amber-500 animate-spin" /></div>
                    ) : parsedMotivation ? (
                      <div className="animate-in fade-in">
                        <h4 className="text-[8px] sm:text-[10px] font-black ai-title-text uppercase mb-1">{parsedMotivation.title}</h4>
                        <p className="text-base sm:text-lg font-black text-slate-900 premium-font italic leading-tight mb-2">"{parsedMotivation.quote}"</p>
                      </div>
                    ) : null}
                  </div>
                  <button onClick={() => fetchMotivation()} disabled={isMotivationLoading} className="mt-2 text-[8px] sm:text-[9px] font-black uppercase text-amber-600 hover:text-amber-700 transition-colors flex items-center gap-1.5 ml-auto">REFRESH <RefreshCw className="w-3 h-3" /></button>
                </div>
              </div>
            </div>

            <ToolGrid 
              onOpenTool={openTool}
              onOpenShop={() => setView(ViewState.SHOP)}
            />
          </motion.div>
        ) : view === ViewState.TALES ? (
          <div className="fixed inset-0 z-[100] bg-black overflow-hidden flex flex-col">
            <div className="absolute inset-0 opacity-40">
              <div className="absolute inset-0 bg-gradient-to-b from-amber-900/20 to-black"></div>
              <div className="absolute top-[20%] left-[10%] w-[40vw] h-[40vw] bg-amber-600/20 rounded-full blur-[120px] animate-pulse"></div>
              <div className="absolute bottom-[10%] right-[5%] w-[50vw] h-[50vw] bg-orange-900/20 rounded-full blur-[150px] animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10 flex flex-col h-full">
              <header className="p-6 sm:p-10 flex items-center justify-between">
                <button 
                  onClick={() => setView(ViewState.HOME)}
                  className="group flex items-center gap-3 text-white/60 hover:text-white transition-all"
                >
                  <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white/50 transition-all">
                    <ChevronLeft className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">Return to Hub</span>
                </button>
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Immersive Mode</span>
                    <span className="text-[8px] text-white/40 uppercase tracking-widest">Atmospheric Narrator</span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-amber-500" />
                  </div>
                </div>
              </header>

              <main className="flex-1 overflow-y-auto px-6 sm:px-10 pb-20 scrollbar-hide">
                <div className="max-w-4xl mx-auto pt-10 sm:pt-20">
                  <div className="mb-12 sm:mb-20">
                    <h1 className="text-6xl sm:text-9xl font-black text-white premium-font leading-[0.85] tracking-tighter mb-6">
                      TALES<span className="text-amber-500">.</span>
                    </h1>
                    <p className="text-white/40 text-sm sm:text-xl max-w-xl leading-relaxed">
                      Where logic meets imagination. Narrate your curriculum into cinematic stories that stick.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-12">
                    <div className="space-y-6">
                      <div className="relative group">
                        <textarea
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          placeholder="What story shall we weave today? (e.g., The French Revolution as a space opera)"
                          className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-8 sm:p-12 text-white text-xl sm:text-3xl font-medium focus:ring-4 focus:ring-amber-500/20 outline-none placeholder:text-white/10 transition-all min-h-[200px] sm:min-h-[300px] resize-none"
                        />
                        <button 
                          onClick={() => {
                            setActiveTab(ToolType.STORY);
                            handleSubmit();
                          }}
                          disabled={loading || !input.trim()}
                          className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 p-4 sm:p-6 rounded-full bg-amber-500 text-black hover:bg-amber-400 transition-all shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed group-hover:scale-110"
                        >
                          <Send className="w-6 h-6 sm:w-8 sm:h-8" />
                        </button>
                      </div>
                    </div>

                    {response && (
                      <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000">
                        <div className="p-8 sm:p-16 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-3xl relative">
                          <div className="absolute top-8 right-8 flex gap-3">
                            {isSpeaking ? (
                              <button onClick={stopSpeaking} className="p-4 rounded-2xl bg-amber-500 text-black animate-pulse"><Square className="w-5 h-5 fill-current" /></button>
                            ) : (
                              <button onClick={() => speak(response)} className="p-4 rounded-2xl bg-white/10 text-white hover:bg-white/20 transition-all"><Volume2 className="w-5 h-5" /></button>
                            )}
                          </div>
                          <div className="prose prose-invert prose-lg sm:prose-2xl max-w-none">
                            <div className="markdown-body text-white/80 leading-relaxed font-serif italic">
                              <Markdown>{response}</Markdown>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </main>
            </div>
          </div>
        ) : view === ViewState.BUGS ? (
          <BugsPage onBack={() => setView(ViewState.HOME)} />
        ) : view === ViewState.LEADERBOARD || view === ViewState.SHOP ? (
          <div className="max-w-4xl mx-auto space-y-12 pb-20">
            <Leaderboard 
              entries={leaderboard} 
              onBack={() => setView(ViewState.HOME)} 
              onOpenShop={() => {
                document.getElementById('shop-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
            <div id="shop-section" className="border-t border-white/10 pt-12">
              <Shop 
                coins={coins}
                multiplierEndTime={multiplierEndTime}
                isPremium={isPremium}
                shopStock={shopStock}
                onBack={() => setView(ViewState.HOME)}
                onBuyItem={handleBuyShopItem}
              />
            </div>
          </div>
        ) : view === ViewState.PETS ? (
          <PetDisplay 
            pets={pets} 
            eggs={eggs}
            coins={coins}
            pendingCoins={pendingCoins}
            isHatching={isHatching}
            onHatchAll={hatchAllEggs}
            onBack={() => setView(ViewState.HOME)} 
            onDeletePet={handleDeletePet}
            onDeleteAllPets={handleDeleteAllPets}
            onCollect={collectCoins}
          />
        ) : view === ViewState.CLOVER_QUEST ? (
          <CloverQuest 
            grade={grade}
            eggs={eggs}
            onHatchAll={hatchAllEggs}
            onComplete={handleCloverQuestComplete} 
            onClose={() => setView(ViewState.HOME)} 
          />
        ) : (
          <div className="flex flex-col gap-6 sm:gap-8 animate-in fade-in slide-in-from-right-4 duration-500 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <button onClick={() => setView(ViewState.HOME)} className="premium-button-silver p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 font-bold shrink-0">
                <ChevronLeft className="w-4 h-4" /> <span>Back to Hub</span>
              </button>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                <div className="px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-xl border border-slate-200 bg-white/80 text-slate-400 text-[8px] sm:text-[10px] font-black uppercase whitespace-nowrap"><span className="truncate">{grade}</span></div>
                <div className="px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-xl border border-slate-200 bg-white/80 text-slate-400 text-[8px] sm:text-[10px] font-black uppercase whitespace-nowrap"><span className="truncate">{personality}</span></div>
                <div className="px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-xl border border-amber-200 bg-white text-slate-800 font-black text-[8px] sm:text-[10px] uppercase shadow-sm">{activeTab}</div>
              </div>
            </div>

            {activeTab === ToolType.CODING ? (
              <div className="flex flex-col gap-4 animate-in fade-in duration-700">
                <div className="glass-panel overflow-hidden rounded-[1.5rem] sm:rounded-[2.5rem] shadow-2xl relative min-h-[600px] flex border border-slate-200 bg-[#fefefe]">
                  
                  {/* VS Code Inspired Sidebar */}
                  <div className="w-12 sm:w-16 bg-[#f3f3f3] border-r border-slate-200 flex flex-col items-center py-6 gap-6 shrink-0">
                    <Files className="w-5 h-5 sm:w-6 sm:h-6 text-[#858585] cursor-pointer hover:text-amber-600 transition-colors" />
                    <Search className="w-5 h-5 sm:w-6 sm:h-6 text-[#858585] cursor-pointer hover:text-amber-600 transition-colors" />
                    <Layout className="w-5 h-5 sm:w-6 sm:h-6 text-[#858585] cursor-pointer hover:text-amber-600 transition-colors" />
                    <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-[#858585] cursor-pointer mt-auto mb-2" />
                  </div>

                  <div className="flex-1 flex flex-col relative">
                    {!isPreviewing ? (
                      <>
                        {/* Editor Header */}
                        <div className="h-10 bg-[#f3f3f3] border-b border-slate-200 flex items-center px-4 justify-between">
                          <div className="flex items-center gap-1 bg-white h-full px-4 border-r border-slate-200">
                            <Code2 className="w-3.5 h-3.5 text-amber-600" />
                            <span className="text-[10px] font-bold text-slate-600">index.html</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => setCodeContent('')} 
                              className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                              title="Reset Forge"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => setIsPreviewing(true)} 
                              className="premium-button-gold px-5 py-1.5 rounded-lg text-[10px] font-black uppercase flex items-center gap-2 shadow-sm"
                            >
                              <Play className="w-3 h-3 fill-current" /> Run Forge
                            </button>
                          </div>
                        </div>

                        {/* Editor Content Area */}
                        <div className="flex-1 flex bg-white font-mono text-sm sm:text-base relative group">
                          {/* Line Numbers gutter */}
                          <div className="w-10 sm:w-14 bg-[#f8f8f8] border-r border-slate-100 flex flex-col items-end py-4 pr-3 text-[#afafaf] select-none text-[11px] leading-[1.6]">
                            {lineNumbers.map(num => (
                              <div key={num} className="h-[1.6em]">{num}</div>
                            ))}
                          </div>
                          {/* Main Textarea */}
                          <textarea 
                            ref={editorRef}
                            value={codeContent} 
                            onChange={(e) => setCodeContent(e.target.value)}
                            placeholder="Start writing excellence from line 1..."
                            className="flex-1 p-4 bg-transparent text-slate-800 outline-none resize-none leading-[1.6] custom-scrollbar"
                            spellCheck={false}
                            autoFocus
                          />
                        </div>
                      </>
                    ) : (
                      <div className="flex-1 bg-white relative animate-in zoom-in-95 duration-500">
                        {/* Back to Code Button - Top Right Overlay */}
                        <button 
                          onClick={() => setIsPreviewing(false)} 
                          className="absolute top-4 right-4 z-50 bg-white/90 backdrop-blur-md border border-slate-200 p-3 rounded-2xl shadow-xl flex items-center gap-2 text-slate-600 hover:text-amber-600 hover:bg-white transition-all active:scale-95 font-black uppercase text-[10px] tracking-widest"
                        >
                          <ArrowLeft className="w-4 h-4" /> Back to Forge
                        </button>
                        <iframe 
                          title="Forge Result"
                          srcDoc={codeContent}
                          className="w-full h-full border-none"
                          sandbox="allow-scripts"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : activeTab === ToolType.STUDY ? (
              <div className="flex flex-col gap-6 animate-in fade-in duration-700">
                {!studySet ? (
                  <div className="glass-panel p-8 sm:p-16 rounded-[2rem] sm:rounded-[3rem] shadow-2xl flex flex-col items-center text-center max-w-3xl mx-auto w-full">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-amber-50 rounded-[2rem] flex items-center justify-center mb-8 shadow-inner">
                      <FileUp className="w-10 h-10 sm:w-12 sm:h-12 text-amber-600" />
                    </div>
                    <h2 className="text-3xl sm:text-5xl font-black ai-title-text premium-font mb-4">Study Set Architect</h2>
                    <p className="text-slate-400 text-sm sm:text-lg font-medium max-w-lg mb-10 leading-relaxed">
                      Transform static materials into interactive mastery tools. Upload a photo of your notes or a PDF to begin.
                    </p>
                    
                    <div className="w-full max-w-md">
                      <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-200 rounded-[2rem] cursor-pointer hover:bg-slate-50 transition-all group relative overflow-hidden">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 relative z-10">
                          <Files className="w-8 h-8 text-slate-300 group-hover:text-amber-500 transition-colors mb-2" />
                          <p className="text-xs sm:text-sm font-bold text-slate-400 group-hover:text-slate-600">
                            {selectedFile ? selectedFile.name : "Drop notes or click to browse"}
                          </p>
                          {selectedFile && (
                            <button 
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedFile(null); }}
                              className="mt-2 text-[8px] font-black uppercase text-red-500 hover:text-red-600 transition-colors"
                            >
                              Clear File
                            </button>
                          )}
                          <p className="text-[10px] text-slate-300 mt-1 uppercase tracking-widest font-black">Images or PDF supported</p>
                        </div>
                        <input type="file" className="hidden" onChange={handleFileChange} accept="image/*,application/pdf" />
                        {isUploading && (
                          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-20">
                            <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                          </div>
                        )}
                      </label>
                    </div>

                    <div className="mt-10 w-full max-w-md">
                      <div className="relative group">
                        <input 
                          type="text" 
                          value={input} 
                          onChange={(e) => setInput(e.target.value)}
                          placeholder="Specific focus area? (Optional)"
                          className="w-full bg-slate-50 border border-slate-100 p-4 sm:p-6 rounded-2xl sm:rounded-3xl text-slate-900 text-sm sm:text-base font-medium focus:ring-4 focus:ring-amber-50 outline-none placeholder:text-slate-300 transition-all"
                        />
                      </div>
                      <button 
                        onClick={() => handleSubmit()}
                        disabled={loading || (!selectedFile && !input.trim())}
                        className="w-full mt-4 py-5 sm:py-6 premium-button-gold rounded-2xl sm:rounded-3xl font-black text-xs sm:text-sm uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50"
                      >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                        Generate Study Set
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between glass-panel p-2 rounded-2xl sm:rounded-3xl shadow-lg max-w-2xl mx-auto w-full">
                      <button 
                        onClick={() => setActiveStudyTab('summary')}
                        className={`flex-1 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-[9px] sm:text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeStudyTab === 'summary' ? 'premium-button-gold shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
                      >
                        <Files className="w-4 h-4" /> Summary
                      </button>
                      <button 
                        onClick={() => setActiveStudyTab('flashcards')}
                        className={`flex-1 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-[9px] sm:text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeStudyTab === 'flashcards' ? 'premium-button-gold shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
                      >
                        <BrainCircuit className="w-4 h-4" /> Flashcards
                      </button>
                      <button 
                        onClick={() => setActiveStudyTab('quiz')}
                        className={`flex-1 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-[9px] sm:text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeStudyTab === 'quiz' ? 'premium-button-gold shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
                      >
                        <BookOpenCheck className="w-4 h-4" /> Quiz
                      </button>
                    </div>

                    <div className="max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                      {activeStudyTab === 'summary' && (
                        <div className="glass-panel p-8 sm:p-12 rounded-[2rem] sm:rounded-[3rem] shadow-2xl">
                          <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center"><Files className="w-5 h-5 text-amber-600" /></div>
                            <div>
                              <h3 className="text-xl sm:text-2xl font-black ai-title-text premium-font">Simplified Summary</h3>
                              <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Base Understanding Protocol</p>
                            </div>
                          </div>
                          <div className="prose prose-slate max-w-none prose-p:text-slate-600 prose-p:leading-relaxed prose-p:text-lg sm:prose-p:text-xl prose-p:font-medium">
                            {studySet.summary}
                          </div>
                          <div className="mt-10 pt-8 border-t border-slate-100 flex justify-end">
                            <button onClick={() => setActiveStudyTab('flashcards')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-600 hover:gap-4 transition-all">
                              Next: Flashcards <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}

                      {activeStudyTab === 'flashcards' && (
                        <div className="flex flex-col items-center gap-8">
                          <div 
                            onClick={() => setIsFlipped(!isFlipped)}
                            className="w-full max-w-xl aspect-[4/3] relative cursor-pointer group perspective-1000"
                          >
                            <div className={`relative w-full h-full transition-all duration-700 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                              {/* Front */}
                              <div className="absolute inset-0 backface-hidden glass-panel rounded-[2rem] sm:rounded-[3rem] shadow-2xl flex flex-col items-center justify-center p-10 text-center border-2 border-slate-100">
                                <span className="absolute top-8 left-10 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Concept</span>
                                <h3 className="text-2xl sm:text-4xl font-black text-slate-800 premium-font leading-tight">
                                  {studySet.flashcards[currentFlashcard]?.front}
                                </h3>
                                <div className="absolute bottom-8 flex items-center gap-2 text-[9px] font-black text-amber-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Eye className="w-3 h-3" /> Click to reveal
                                </div>
                              </div>
                              {/* Back */}
                              <div className="absolute inset-0 backface-hidden rotate-y-180 glass-panel rounded-[2rem] sm:rounded-[3rem] shadow-2xl flex flex-col items-center justify-center p-10 text-center border-2 border-amber-100 bg-amber-50/30">
                                <span className="absolute top-8 left-10 text-[10px] font-black text-amber-400 uppercase tracking-[0.3em]">Explanation</span>
                                <p className="text-lg sm:text-2xl font-medium text-slate-700 leading-relaxed">
                                  {studySet.flashcards[currentFlashcard]?.back}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-6">
                            <button 
                              disabled={currentFlashcard === 0}
                              onClick={() => { setCurrentFlashcard(prev => prev - 1); setIsFlipped(false); }}
                              className="p-4 rounded-full glass-panel shadow-lg hover:scale-110 transition-all disabled:opacity-30"
                            >
                              <ChevronLeft className="w-6 h-6" />
                            </button>
                            <div className="px-6 py-2 rounded-full bg-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                              {currentFlashcard + 1} / {studySet.flashcards.length}
                            </div>
                            <button 
                              disabled={currentFlashcard === studySet.flashcards.length - 1}
                              onClick={() => { setCurrentFlashcard(prev => prev + 1); setIsFlipped(false); }}
                              className="p-4 rounded-full glass-panel shadow-lg hover:scale-110 transition-all disabled:opacity-30"
                            >
                              <ChevronRight className="w-6 h-6" />
                            </button>
                          </div>
                        </div>
                      )}

                      {activeStudyTab === 'quiz' && (
                        <div className="glass-panel p-8 sm:p-12 rounded-[2rem] sm:rounded-[3rem] shadow-2xl">
                          <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center"><BookOpenCheck className="w-5 h-5 text-amber-600" /></div>
                              <div>
                                <h3 className="text-xl sm:text-2xl font-black ai-title-text premium-font">Mastery Quiz</h3>
                                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Precision Assessment</p>
                              </div>
                            </div>
                            {showQuizResults && (
                              <button onClick={() => { setQuizAnswers({}); setShowQuizResults(false); }} className="text-[9px] font-black uppercase text-amber-600 hover:underline">Reset</button>
                            )}
                          </div>

                          <div className="space-y-10">
                            {studySet.quiz.map((q, idx) => (
                              <div key={idx} className="space-y-4">
                                <h4 className="text-lg sm:text-xl font-black text-slate-800 flex gap-3">
                                  <span className="text-amber-500">{idx + 1}.</span> {q.question}
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {q.options.map((opt, optIdx) => {
                                    const isSelected = quizAnswers[idx] === opt;
                                    const isCorrect = opt === q.answer;
                                    let style = "border-slate-100 hover:border-amber-200 hover:bg-slate-50";
                                    if (showQuizResults) {
                                      if (isCorrect) style = "border-emerald-500 bg-emerald-50 text-emerald-700";
                                      else if (isSelected) style = "border-rose-500 bg-rose-50 text-rose-700";
                                      else style = "opacity-50 border-slate-100";
                                    } else if (isSelected) {
                                      style = "border-amber-500 bg-amber-50 text-amber-700";
                                    }

                                    return (
                                      <button 
                                        key={optIdx}
                                        disabled={showQuizResults}
                                        onClick={() => setQuizAnswers(prev => ({ ...prev, [idx]: opt }))}
                                        className={`p-4 rounded-2xl border-2 text-left font-bold text-sm sm:text-base transition-all flex items-center justify-between group ${style}`}
                                      >
                                        {opt}
                                        {showQuizResults && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                                        {showQuizResults && isSelected && !isCorrect && <X className="w-5 h-5 text-rose-500" />}
                                      </button>
                                    );
                                  })}
                                </div>
                                {showQuizResults && (
                                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 animate-in fade-in duration-500">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Explanation</p>
                                    <p className="text-sm font-medium text-slate-600">{q.explanation}</p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>

                          {!showQuizResults && (
                            <button 
                              onClick={() => setShowQuizResults(true)}
                              disabled={Object.keys(quizAnswers).length < studySet.quiz.length}
                              className="w-full mt-12 py-5 sm:py-6 premium-button-gold rounded-2xl sm:rounded-3xl font-black text-xs sm:text-sm uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50"
                            >
                              Submit Assessment
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="relative group flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="relative flex-1 group">
                    <input 
                      type="text" 
                      value={input} 
                      disabled={loading} 
                      autoFocus 
                      onChange={(e) => setInput(e.target.value)} 
                      onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} 
                      placeholder={activeTab === ToolType.STORY ? "Construct narrative..." : activeTab === ToolType.MATH ? `Process equation...` : activeTab === ToolType.SCIENCE ? "Analyze objective..." : activeTab === ToolType.VOICE_CONCEPT ? "Speak your thoughts or type ramblings..." : `Consult Archive...`} 
                      className="w-full bg-white border border-slate-200 p-5 sm:p-8 rounded-[1.25rem] sm:rounded-[2rem] text-slate-900 text-base sm:text-xl font-medium focus:ring-4 focus:ring-amber-50 outline-none placeholder:text-slate-300 transition-all shadow-xl backdrop-blur-md pr-12 sm:pr-40" 
                    />
                    <div className="absolute right-2 top-2 sm:right-4 sm:top-1/2 sm:-translate-y-1/2 flex items-center gap-1.5">
                      <button onClick={toggleListening} className={`p-2 sm:p-3.5 rounded-lg sm:rounded-[1.25rem] transition-all shadow-lg flex items-center justify-center ${isListening ? 'bg-amber-500 text-white animate-pulse' : 'bg-slate-50 text-slate-400 border border-slate-200'}`}>
                        {isListening ? <MicOff className="w-5 h-5 sm:w-7 h-7" /> : <Mic className="w-5 h-5 sm:w-7 h-7" />}
                      </button>
                      <button onClick={() => handleSubmit()} disabled={loading || !input.trim()} className="p-2 sm:p-3.5 premium-button-gold rounded-lg sm:rounded-[1.25rem] active:scale-95 transition-all">
                        {loading ? <Loader2 className="w-5 h-5 sm:w-7 h-7 animate-spin" /> : <SendHorizontal className="w-5 h-5 sm:w-7 h-7" />}
                      </button>
                    </div>
                  </div>
                </div>
                <ResponseView content={response} loading={loading} sources={sources} onSpeak={() => { if (activeTab === ToolType.MATH) { const lines = response.split('\n'); const finalAnswerLine = lines.reverse().find(line => line && line.toLowerCase().includes('final answer')); speak(finalAnswerLine || response); } else { speak(response); } }} onStopSpeak={stopSpeaking} isSpeaking={isSpeaking} />
              </>
            )}
          </div>
        )}
      </main>

      <div className="fixed bottom-4 left-4 sm:bottom-10 sm:left-10 z-[70] flex flex-col gap-3">
        {luckyMessage && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-panel p-4 rounded-2xl border-l-4 border-green-500 bg-green-900/40 text-white text-xs font-bold shadow-2xl mb-2 max-w-xs"
          >
            {luckyMessage}
          </motion.div>
        )}
      </div>

      <div className="fixed top-24 right-4 z-[70]">
        <button 
          onClick={() => setIsDyslexiaMode(!isDyslexiaMode)}
          className={`p-3 sm:p-4 rounded-full shadow-2xl transition-all active:scale-95 flex items-center gap-2 font-black uppercase text-[9px] tracking-widest ${isDyslexiaMode ? 'bg-black text-white' : 'glass-panel text-slate-600 hover:bg-slate-50'}`}
          title="Toggle Dyslexia Mode"
        >
          <Accessibility className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">{isDyslexiaMode ? 'Dyslexia Mode: ON' : 'Dyslexia Mode'}</span>
        </button>
      </div>

      <div className="fixed left-0 top-1/2 -translate-y-1/2 z-[60] flex flex-col gap-2">
        <button 
          onClick={() => {
            setInput('');
            setResponse('');
            setView(ViewState.TALES);
          }}
          className="group bg-black text-white p-4 sm:p-6 rounded-r-[2rem] sm:rounded-r-[3rem] shadow-2xl flex flex-col items-center gap-4 hover:pr-10 sm:hover:pr-12 transition-all active:scale-95 border-y border-r border-white/10"
          title="Open Immersive Tales"
        >
          <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500" />
          <span className="[writing-mode:vertical-lr] text-[9px] sm:text-[11px] font-black uppercase tracking-[0.3em] py-2">Tales</span>
        </button>
      </div>

      <div className="fixed bottom-4 right-4 sm:bottom-10 sm:right-10 z-[70] flex flex-col items-end gap-3">
        {showHistory && (
          <div className="glass-panel w-[calc(100vw-2rem)] sm:w-80 max-h-[60vh] rounded-[1.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-300 border-slate-200">
            <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-white/50">
              <h3 className="text-[10px] font-black uppercase tracking-widest ai-title-text premium-font flex items-center gap-2">
                <History className="w-4 h-4 text-amber-500" /> Session Logs
              </h3>
              <div className="flex gap-2">
                <button onClick={clearHistory} className="p-1.5 hover:bg-slate-100 text-slate-400 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                <button onClick={() => setShowHistory(false)} className="p-1.5 hover:bg-slate-100 text-slate-400 rounded-lg transition-colors"><X className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar">
              {history.length === 0 ? (
                <p className="text-slate-400 text-xs italic text-center py-12">No current logs.</p>
              ) : (
                history.map((item) => (
                  <div key={item.id} className="bg-white p-3 rounded-xl border border-slate-100 hover:border-amber-400 transition-all shadow-sm">
                    <div className="flex justify-between items-start mb-1.5">
                      <span className="text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase bg-slate-50 border border-slate-100">{item.type}</span>
                      <span className="text-[8px] text-slate-300">{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-[10px] font-bold ai-title-text premium-font line-clamp-1">{item.query}</p>
                    <p className="text-[9px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">{item.response}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        <button onClick={() => setShowHistory(!showHistory)} className={`p-4 sm:p-6 rounded-full transition-all shadow-2xl border active:scale-90 ${showHistory ? 'premium-button-gold border-amber-500' : 'bg-white border-slate-200 text-slate-400 hover:text-amber-600'}`}>
          <History className={`w-5 h-5 sm:w-8 h-8 ${showHistory ? 'rotate-180' : ''} transition-transform`} />
        </button>
      </div>
      
      <footer className="p-4 sm:p-12 flex justify-center fixed bottom-0 left-0 right-0 pointer-events-none">
        <p className="text-[7px] sm:text-[10px] font-black tracking-[0.4em] sm:tracking-[1.2em] ai-title-text opacity-30 uppercase select-none">TSAI PREMIUM INTELLIGENCE CORE</p>
      </footer>

      <AnimatePresence>
        {isAdminPanelOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                className="glass-panel w-full max-w-lg p-8 rounded-[2.5rem] border-amber-500/50 relative"
              >
              <button 
                onClick={() => setIsAdminPanelOpen(false)}
                className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
              
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-amber-500 rounded-2xl">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white premium-font tracking-tight">ADMIN COMMAND PANEL</h2>
                  <p className="text-amber-500/60 text-[10px] font-black uppercase tracking-widest">Elite Access Only</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="relative">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-4">Execute Command</label>
                  <div className="flex items-center bg-white/5 border border-white/10 p-4 rounded-3xl focus-within:ring-2 focus-within:ring-amber-500/50 transition-all">
                    <Code2 className="w-5 h-5 mr-3 text-amber-500" />
                    <input 
                      type="text" 
                      value={adminCommandInput} 
                      onChange={(e) => setAdminCommandInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSubmit(undefined, adminCommandInput)}
                      placeholder="/give 100 egg" 
                      className="bg-transparent w-full text-white font-bold outline-none"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl">
                  <p className="text-amber-500 text-[10px] font-black uppercase tracking-widest mb-2">Available Commands</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-[10px] font-bold text-slate-300">
                    <li>• <code className="text-amber-400">/give [nick] [qty] egg</code></li>
                    <li>• <code className="text-amber-400">/ungive [nick] [qty] egg</code></li>
                    <li>• <code className="text-amber-400">/seteggs [qty]</code></li>
                    <li>• <code className="text-amber-400">/ban [nick]</code></li>
                    <li>• <code className="text-amber-400">/unban [nick]</code></li>
                    <li>• <code className="text-amber-400">/hatch</code></li>
                    <li>• <code className="text-amber-400">/clearhistory</code></li>
                    <li>• <code className="text-amber-400">/resetall</code></li>
                    <li>• <code className="text-amber-400">/giveall</code></li>
                    <li>• <code className="text-amber-400">/announce [msg]</code></li>
                    <li>• <code className="text-amber-400">/clearannouncement</code></li>
                    <li>• <code className="text-amber-400">/verify [nick]</code></li>
                    <li>• <code className="text-amber-400">/unverify [nick]</code></li>
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => handleSubmit(undefined, '/give 1000 egg')}
                    className="p-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-amber-500 hover:bg-amber-500/10 transition-all"
                  >
                    +1000 Eggs
                  </button>
                  <button 
                    onClick={() => handleSubmit(undefined, '/give 1000000 coin')}
                    className="p-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-amber-500 hover:bg-amber-500/10 transition-all"
                  >
                    +1M Coins
                  </button>
                  <button 
                    onClick={() => handleSubmit(undefined, '/hatch')}
                    className="p-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-green-500 hover:bg-green-500/10 transition-all"
                  >
                    Hatch All
                  </button>
                  <button 
                    onClick={() => handleSubmit(undefined, '/resetall')}
                    className="p-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-all"
                  >
                    Reset All
                  </button>
                  <button 
                    onClick={() => handleSubmit(undefined, isVerified ? '/unverify me' : '/verify me')}
                    className={`p-3 border rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isVerified ? 'bg-blue-500/10 border-blue-500/30 text-blue-500 hover:bg-blue-500/20' : 'bg-white/5 border-white/10 text-amber-500 hover:bg-amber-500/10'}`}
                  >
                    {isVerified ? 'Unverify Me' : 'Verify Me'}
                  </button>
                  <button 
                    onClick={() => {
                      const msg = prompt('Enter announcement message:');
                      if (msg) handleSubmit(undefined, `/announce ${msg}`);
                    }}
                    className="p-3 bg-amber-500/20 border border-amber-500/40 rounded-2xl text-[10px] font-black uppercase tracking-widest text-amber-500 hover:bg-amber-500/30 transition-all"
                  >
                    Send Announcement
                  </button>
                  {customAdminCommands.map((c, i) => (
                    <div key={i} className="relative group">
                      <button 
                        onClick={() => handleSubmit(undefined, c.cmd)}
                        className="w-full p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-[10px] font-black uppercase tracking-widest text-amber-400 hover:bg-amber-500/20 transition-all truncate pr-8"
                      >
                        {c.label}
                      </button>
                      <button 
                        onClick={() => setCustomAdminCommands(prev => prev.filter((_, idx) => idx !== i))}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="bg-white/5 border border-white/10 p-4 rounded-3xl space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Create Custom Command</p>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      id="custom-cmd-label"
                      placeholder="Label (e.g. Max Luck)" 
                      className="bg-white/5 border border-white/10 p-3 rounded-xl text-[10px] font-bold text-white outline-none flex-1"
                    />
                    <input 
                      type="text" 
                      id="custom-cmd-input"
                      placeholder="Command (e.g. /give 100 egg)" 
                      className="bg-white/5 border border-white/10 p-3 rounded-xl text-[10px] font-bold text-white outline-none flex-1"
                    />
                    <button 
                      onClick={() => {
                        const label = (document.getElementById('custom-cmd-label') as HTMLInputElement).value;
                        const cmd = (document.getElementById('custom-cmd-input') as HTMLInputElement).value;
                        if (label && cmd) {
                          setCustomAdminCommands(prev => [...prev, { label, cmd }]);
                          (document.getElementById('custom-cmd-label') as HTMLInputElement).value = '';
                          (document.getElementById('custom-cmd-input') as HTMLInputElement).value = '';
                        }
                      }}
                      className="p-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between px-4 py-2 bg-white/5 rounded-2xl border border-white/10">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Keep Panel Open</span>
                  <button 
                    onClick={() => setAdminKeepOpen(!adminKeepOpen)}
                    className={`w-10 h-5 rounded-full transition-all relative ${adminKeepOpen ? 'bg-amber-500' : 'bg-slate-700'}`}
                  >
                    <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${adminKeepOpen ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>

                <button 
                  onClick={() => handleSubmit(undefined, adminCommandInput)}
                  className="w-full premium-button-gold p-5 rounded-3xl font-black uppercase tracking-widest text-sm"
                >
                  Execute Protocol
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Announcement Board */}
      <AnimatePresence>
        {isAnnouncementModalOpen && announcement && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[400] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 40 }}
              className="glass-panel w-full max-w-2xl p-12 rounded-[3rem] border-amber-500/50 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
              
              <div className="mb-8 flex justify-center">
                <div className="p-4 bg-amber-500 rounded-3xl shadow-2xl shadow-amber-500/40 animate-bounce">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
              </div>

              <p className="text-2xl font-bold text-white leading-relaxed mb-10">
                <span className="inline-flex items-center gap-2 mr-3 align-middle">
                  <span className="text-amber-500 font-black uppercase tracking-widest text-lg">{nickname || getUsername(userEmail)}</span>
                  <BadgeCheck className="w-6 h-6 text-[#0095f6] fill-white" />
                  <span className="text-slate-400 font-bold text-lg">:</span>
                </span>
                {announcement}
              </p>

              <button 
                onClick={() => setIsAnnouncementModalOpen(false)}
                className="premium-button-gold px-12 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:scale-105 transition-transform"
              >
                Acknowledge
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Corner Announcement Ticker */}
      <AnimatePresence>
        {!isAnnouncementModalOpen && announcement && (
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            className="fixed bottom-6 left-6 z-[350] max-w-xs"
          >
            <button 
              onClick={() => setIsAnnouncementModalOpen(true)}
              className="glass-panel p-4 rounded-2xl border-amber-500/30 bg-black/40 backdrop-blur-md flex items-center gap-4 group hover:bg-amber-500/10 transition-all"
            >
              <div className="p-2 bg-amber-500 rounded-lg group-hover:rotate-12 transition-transform">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="text-left overflow-hidden">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <p className="text-[8px] font-black text-amber-500 uppercase tracking-widest">{nickname || getUsername(userEmail)}</p>
                  <BadgeCheck className="w-3 h-3 text-[#0095f6] fill-white" />
                </div>
                <p className="text-xs font-bold text-white truncate w-40">{announcement}</p>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;