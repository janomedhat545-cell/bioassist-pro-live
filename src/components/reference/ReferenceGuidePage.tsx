import React, { useState, useMemo } from 'react';
import {
  Dna,
  Search,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  ExternalLink,
  BotMessageSquare,
  Sparkles,
  Layers,
  BookOpen,
  HelpCircle,
  Scissors,
  CheckCircle2,
  XCircle,
  X,
  ArrowRight,
  ShieldAlert,
  AlertTriangle,
} from 'lucide-react';
import {
  ReferenceTopic,
  ReferenceCategory,
  DifficultyLevel,
  PageId,
} from '../../types';
import { REFERENCE_TOPICS } from '../../data/referenceData';

interface ReferenceGuidePageProps {
  onNavigate: (page: PageId, extra?: { topicId?: string; prompt?: string }) => void;
  savedTopicIds: Set<string>;
  onToggleBookmark: (topicId: string) => void;
  selectedTopic: ReferenceTopic | null;
  onSelectTopic: (topic: ReferenceTopic | null) => void;
}

export const ReferenceGuidePage: React.FC<ReferenceGuidePageProps> = ({
  onNavigate,
  savedTopicIds,
  onToggleBookmark,
  selectedTopic,
  onSelectTopic,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [activeInteractiveTool, setActiveInteractiveTool] = useState<
    'none' | 'simulator' | 'repair' | 'flashcards' | 'quiz'
  >('none');

  const categories: string[] = [
    'All',
    'CRISPR Fundamentals',
    'Genetic Engineering',
    'Molecular Biology',
    'DNA Repair',
    'Gene Expression',
    'Cancer Research',
    'Laboratory Techniques',
    'Safety and Ethics',
  ];

  // Filter topics
  const filteredTopics = useMemo(() => {
    return REFERENCE_TOPICS.filter((t) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.shortDefinition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.coreMechanism.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat =
        selectedCategory === 'All' || t.category === selectedCategory;

      const matchesDiff =
        selectedDifficulty === 'All' || t.difficulty === selectedDifficulty;

      return matchesSearch && matchesCat && matchesDiff;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty]);

  // Flashcards state
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Curated Flashcards list from terminology
  const flashcardsList = useMemo(() => {
    const list: { term: string; definition: string; category: string }[] = [];
    REFERENCE_TOPICS.forEach((t) => {
      t.commonTerminology.forEach((term) => {
        list.push({
          term: term.term,
          definition: term.definition,
          category: t.category,
        });
      });
    });
    return list;
  }, []);

  // Knowledge Quiz state
  const QUIZ_QUESTIONS = [
    {
      question: 'Which sequence motif on the non-target DNA strand is required for SpCas9 binding prior to DNA unwinding?',
      options: ['5\'-TTTV-3\'', '5\'-NGG-3\'', '5\'-GAATTC-3\'', '5\'-AAGCTT-3\''],
      correct: 1,
      explanation: 'SpCas9 scans the genome for a 5\'-NGG-3\' Protospacer Adjacent Motif (PAM). Target cleavage occurs ~3 bp upstream of this motif.',
    },
    {
      question: 'Which DNA repair pathway typically generates insertions or deletions (indels) leading to frameshift gene knockouts?',
      options: ['Homology-Directed Repair (HDR)', 'Non-Homologous End Joining (NHEJ)', 'Base Excision Repair (BER)', 'Mismatch Repair (MMR)'],
      correct: 1,
      explanation: 'NHEJ directly ligates broken DNA ends without a donor template, frequently introducing small indels that cause frameshift knockouts.',
    },
    {
      question: 'How do Cytosine Base Editors (CBEs) convert C•G base pairs to T•A without double-strand DNA breaks?',
      options: ['Using DNA polymerase proofreading', 'Deaminating cytidine to uridine with a deaminase and nCas9 nickase', 'Using reverse transcriptase to synthesize flaps', 'Homologous recombination with ssODN'],
      correct: 1,
      explanation: 'CBEs fuse a cytidine deaminase to Cas9 nickase and a uracil glycosylase inhibitor (UGI), converting C to U (read as T) without double-strand breaks.',
    },
    {
      question: 'According to Knudson’s two-hit hypothesis, why are tumor suppressor genes generally recessive in tumorigenesis?',
      options: ['One mutated allele suffices to gain oncogenic signaling', 'Both alleles must undergo loss-of-function inactivation to lose cell-cycle control', 'They are strictly located on the Y-chromosome', 'They only mutate in viral infections'],
      correct: 1,
      explanation: 'Tumor suppressor genes (e.g., TP53, RB1) require inactivation of both alleles (two hits) before tumor-suppressive restraint is lost.',
    },
  ];

  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleSelectQuizOption = (index: number) => {
    if (selectedQuizOption !== null) return;
    setSelectedQuizOption(index);
    if (index === QUIZ_QUESTIONS[currentQuizIndex].correct) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuizQuestion = () => {
    setSelectedQuizOption(null);
    if (currentQuizIndex + 1 < QUIZ_QUESTIONS.length) {
      setCurrentQuizIndex((prev) => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedQuizOption(null);
    setQuizScore(0);
    setQuizCompleted(false);
  };

  // Interactive CRISPR Simulator state
  const [pamMatch, setPamMatch] = useState<'NGG' | 'NGA' | 'TTT'>('NGG');
  const [spacerMatch, setSpacerMatch] = useState<'100%' | 'seed_mismatch' | 'distal_mismatch'>('100%');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#12304A] dark:text-white flex items-center gap-2.5">
            <Dna className="w-6 h-6 text-[#16A6A1]" />
            <span>CRISPR & Genetic Engineering Guide</span>
          </h2>
          <p className="text-xs text-[#68778A] dark:text-[#94A3B8] mt-1">
            Understand gene editing, genetic engineering tools, and molecular mechanisms through concise scientific explanations.
          </p>
        </div>

        {/* Quick action: Interactive learning drawer switch */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveInteractiveTool(activeInteractiveTool === 'simulator' ? 'none' : 'simulator')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              activeInteractiveTool === 'simulator'
                ? 'bg-[#16A6A1] text-white border-[#16A6A1]'
                : 'bg-white dark:bg-[#112234] border-[#E1E8EF] dark:border-[#1E344D] text-[#12304A] dark:text-white hover:bg-slate-50'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>CRISPR Simulator</span>
          </button>

          <button
            onClick={() => setActiveInteractiveTool(activeInteractiveTool === 'repair' ? 'none' : 'repair')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              activeInteractiveTool === 'repair'
                ? 'bg-[#16A6A1] text-white border-[#16A6A1]'
                : 'bg-white dark:bg-[#112234] border-[#E1E8EF] dark:border-[#1E344D] text-[#12304A] dark:text-white hover:bg-slate-50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>NHEJ vs HDR</span>
          </button>

          <button
            onClick={() => setActiveInteractiveTool(activeInteractiveTool === 'flashcards' ? 'none' : 'flashcards')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              activeInteractiveTool === 'flashcards'
                ? 'bg-[#16A6A1] text-white border-[#16A6A1]'
                : 'bg-white dark:bg-[#112234] border-[#E1E8EF] dark:border-[#1E344D] text-[#12304A] dark:text-white hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Biotech Flashcards</span>
          </button>

          <button
            onClick={() => setActiveInteractiveTool(activeInteractiveTool === 'quiz' ? 'none' : 'quiz')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              activeInteractiveTool === 'quiz'
                ? 'bg-[#16A6A1] text-white border-[#16A6A1]'
                : 'bg-white dark:bg-[#112234] border-[#E1E8EF] dark:border-[#1E344D] text-[#12304A] dark:text-white hover:bg-slate-50'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Knowledge Check</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* INTERACTIVE LEARNING DRAWER 1: CRISPR SIMULATOR */}
      {/* ======================================================== */}
      {activeInteractiveTool === 'simulator' && (
        <div className="bg-[#12304A] text-white rounded-2xl p-5 border border-[#16A6A1]/40 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Scissors className="w-5 h-5 text-[#B8F2D0]" />
              <h3 className="text-sm font-bold text-white">
                Interactive CRISPR-Cas9 Target Cleavage Simulator
              </h3>
            </div>
            <button
              onClick={() => setActiveInteractiveTool('none')}
              className="text-xs text-slate-400 hover:text-white"
            >
              Close
            </button>
          </div>

          <p className="text-xs text-slate-300">
            Simulate how PAM motif recognition and guide RNA complementarity dictate SpCas9 cleavage at a genomic locus.
          </p>

          {/* Interactive controls */}
          <div className="flex flex-wrap gap-4 text-xs">
            <div>
              <span className="block text-slate-300 mb-1 font-semibold">PAM Motif (5'-3'):</span>
              <div className="flex gap-2">
                {(['NGG', 'NGA', 'TTT'] as const).map((pam) => (
                  <button
                    key={pam}
                    onClick={() => setPamMatch(pam)}
                    className={`px-3 py-1.5 rounded-lg font-mono font-bold transition-all ${
                      pamMatch === pam
                        ? 'bg-[#16A6A1] text-white shadow-xs'
                        : 'bg-white/10 text-slate-300 hover:bg-white/20'
                    }`}
                  >
                    {pam} {pam === 'NGG' ? '(SpCas9 canonical)' : '(Non-canonical)'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="block text-slate-300 mb-1 font-semibold">Guide RNA Complementarity:</span>
              <div className="flex gap-2">
                {[
                  { id: '100%', label: '100% Perfect Match' },
                  { id: 'seed_mismatch', label: 'Seed Region Mismatch (pos 1-8)' },
                  { id: 'distal_mismatch', label: 'Distal Mismatch (pos 18-20)' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSpacerMatch(s.id as any)}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      spacerMatch === s.id
                        ? 'bg-[#16A6A1] text-white shadow-xs'
                        : 'bg-white/10 text-slate-300 hover:bg-white/20'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Graphical DNA / sgRNA strand schematic */}
          <div className="p-4 rounded-xl bg-[#091724] border border-white/10 font-mono text-xs overflow-x-auto space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[#68778A] text-[10px] w-24">Target DNA (5'-3'):</span>
              <div className="flex gap-1 tracking-widest text-slate-200">
                <span className="text-slate-400">5'-</span>
                <span className={spacerMatch === 'distal_mismatch' ? 'text-amber-400 font-bold underline' : ''}>
                  ATC GAT
                </span>
                <span> CGC TAA </span>
                <span className={spacerMatch === 'seed_mismatch' ? 'text-rose-400 font-bold underline' : ''}>
                  CGG ACC GC
                </span>
                <span className="text-[#B8F2D0] font-bold bg-[#16A6A1]/30 px-1 rounded">
                  {pamMatch === 'NGG' ? 'AGG' : pamMatch === 'NGA' ? 'AGA' : 'TTT'} (PAM)
                </span>
                <span className="text-slate-400">-3'</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#68778A] text-[10px] w-24">Guide sgRNA (3'-5'):</span>
              <div className="flex gap-1 tracking-widest text-[#B8F2D0]">
                <span className="text-slate-400">3'-</span>
                <span>TAG CTA</span>
                <span> GCG ATT </span>
                <span>GCC TGG CG</span>
                <span className="text-slate-500 font-normal"> [tracrRNA scaffold]</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2 text-[11px]">
              <span className="text-[#68778A] text-[10px] w-24">Cleavage Status:</span>
              {pamMatch === 'NGG' && spacerMatch === '100%' && (
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  EFFICIENT DOUBLE-STRAND BREAK (HNH & RuvC domains cleave 3 bp upstream of PAM)
                </span>
              )}
              {pamMatch !== 'NGG' && (
                <span className="text-rose-400 font-bold flex items-center gap-1.5">
                  <XCircle className="w-4 h-4" />
                  NO CLEAVAGE: SpCas9 requires canonical 5'-NGG-3' PAM to initiate DNA unwinding.
                </span>
              )}
              {pamMatch === 'NGG' && spacerMatch === 'seed_mismatch' && (
                <span className="text-rose-400 font-bold flex items-center gap-1.5">
                  <XCircle className="w-4 h-4" />
                  NO CLEAVAGE: Mismatch in proximal PAM-seed region (pos 1-8) halts R-loop conformation.
                </span>
              )}
              {pamMatch === 'NGG' && spacerMatch === 'distal_mismatch' && (
                <span className="text-amber-400 font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  PARTIAL OFF-TARGET CLEAVAGE: SpCas9 tolerates distal 5' mismatches, risking off-target cuts!
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* INTERACTIVE LEARNING DRAWER 2: NHEJ vs HDR COMPARATOR */}
      {/* ======================================================== */}
      {activeInteractiveTool === 'repair' && (
        <div className="bg-white dark:bg-[#112234] border border-[#E1E8EF] dark:border-[#1E344D] rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E1E8EF] dark:border-[#1E344D]">
            <h3 className="text-sm font-bold text-[#12304A] dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#16A6A1]" />
              <span>DNA Double-Strand Break Repair: NHEJ vs HDR</span>
            </h3>
            <button
              onClick={() => setActiveInteractiveTool('none')}
              className="text-xs text-[#68778A] hover:text-[#12304A] dark:hover:text-white"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* NHEJ Card */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0E1A27] border border-[#E1E8EF] dark:border-[#1E344D] space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#12304A] dark:text-white">
                  Non-Homologous End Joining (NHEJ)
                </h4>
                <span className="text-[10px] text-amber-600 font-semibold bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded">
                  Error-Prone Knockout
                </span>
              </div>
              <p className="text-[11px] text-[#68778A] dark:text-[#94A3B8] leading-relaxed">
                Direct ligation of severed DNA ends without a donor template. Operates across all cell cycle phases (G0, G1, S, G2).
              </p>
              <div className="text-[11px] space-y-1 font-mono text-[#243447] dark:text-slate-300">
                <p>• Protein Machinery: Ku70/80, DNA-PKcs, Artemis, Ligase IV</p>
                <p>• Typical Outcome: 1-15 bp Indels causing frameshift disruption</p>
                <p>• Efficiency: Predominant in mammalian cells (&gt;70%)</p>
              </div>
            </div>

            {/* HDR Card */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0E1A27] border border-[#E1E8EF] dark:border-[#1E344D] space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#12304A] dark:text-white">
                  Homology-Directed Repair (HDR)
                </h4>
                <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                  Precise Gene Knock-In
                </span>
              </div>
              <p className="text-[11px] text-[#68778A] dark:text-[#94A3B8] leading-relaxed">
                High-fidelity template-dependent repair. Active only during late S and G2 phases when sister chromatids exist.
              </p>
              <div className="text-[11px] space-y-1 font-mono text-[#243447] dark:text-slate-300">
                <p>• Protein Machinery: MRN complex, CtIP, RPA, RAD51</p>
                <p>• Typical Outcome: Error-free sequence insertion or single base fix</p>
                <p>• Efficiency: Low in mammalian cells (5-20%; absent in G0 neurons)</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* INTERACTIVE LEARNING DRAWER 3: FLASHCARDS */}
      {/* ======================================================== */}
      {activeInteractiveTool === 'flashcards' && (
        <div className="bg-white dark:bg-[#112234] border border-[#E1E8EF] dark:border-[#1E344D] rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E1E8EF] dark:border-[#1E344D]">
            <h3 className="text-sm font-bold text-[#12304A] dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#16A6A1]" />
              <span>Biotechnology Flashcard Review ({flashcardIndex + 1} of {flashcardsList.length})</span>
            </h3>
            <button
              onClick={() => setActiveInteractiveTool('none')}
              className="text-xs text-[#68778A] hover:text-[#12304A] dark:hover:text-white"
            >
              Close
            </button>
          </div>

          {/* Flashcard container */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full max-w-lg mx-auto min-h-[160px] p-6 rounded-2xl bg-gradient-to-br from-[#12304A] to-[#16A6A1] text-white flex flex-col items-center justify-center text-center cursor-pointer shadow-md hover:shadow-lg transition-transform hover:scale-[1.01]"
          >
            <span className="text-[10px] text-[#B8F2D0] uppercase tracking-wider font-semibold mb-2">
              {isFlipped ? 'Definition' : 'Biotech Concept (Click to flip)'}
            </span>

            <p className="text-base sm:text-lg font-bold">
              {isFlipped
                ? flashcardsList[flashcardIndex]?.definition
                : flashcardsList[flashcardIndex]?.term}
            </p>

            <span className="text-[11px] text-slate-200/80 mt-3">
              Category: {flashcardsList[flashcardIndex]?.category}
            </span>
          </div>

          {/* Next / Previous controls */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setIsFlipped(false);
                setFlashcardIndex((prev) => (prev > 0 ? prev - 1 : flashcardsList.length - 1));
              }}
              className="px-4 py-2 rounded-xl bg-[#F7FAFC] dark:bg-[#0E1A27] border border-[#E1E8EF] dark:border-[#1E344D] text-xs font-semibold text-[#12304A] dark:text-white hover:bg-slate-100"
            >
              ← Previous Card
            </button>
            <button
              onClick={() => {
                setIsFlipped(false);
                setFlashcardIndex((prev) => (prev + 1 < flashcardsList.length ? prev + 1 : 0));
              }}
              className="px-4 py-2 rounded-xl bg-[#16A6A1] text-white text-xs font-semibold hover:bg-[#118480]"
            >
              Next Card →
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* INTERACTIVE LEARNING DRAWER 4: KNOWLEDGE CHECK QUIZ */}
      {/* ======================================================== */}
      {activeInteractiveTool === 'quiz' && (
        <div className="bg-white dark:bg-[#112234] border border-[#E1E8EF] dark:border-[#1E344D] rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E1E8EF] dark:border-[#1E344D]">
            <h3 className="text-sm font-bold text-[#12304A] dark:text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#16A6A1]" />
              <span>Biotechnology Knowledge Check</span>
            </h3>
            <button
              onClick={() => setActiveInteractiveTool('none')}
              className="text-xs text-[#68778A] hover:text-[#12304A] dark:hover:text-white"
            >
              Close
            </button>
          </div>

          {!quizCompleted ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[#68778A]">
                <span>Question {currentQuizIndex + 1} of {QUIZ_QUESTIONS.length}</span>
                <span>Current Score: {quizScore}</span>
              </div>

              <h4 className="text-sm font-bold text-[#12304A] dark:text-white">
                {QUIZ_QUESTIONS[currentQuizIndex].question}
              </h4>

              <div className="space-y-2">
                {QUIZ_QUESTIONS[currentQuizIndex].options.map((opt, idx) => {
                  const isSelected = selectedQuizOption === idx;
                  const isCorrect = idx === QUIZ_QUESTIONS[currentQuizIndex].correct;
                  let btnStyle = 'border-[#E1E8EF] dark:border-[#1E344D] hover:bg-slate-50 dark:hover:bg-[#1A2E44]';

                  if (selectedQuizOption !== null) {
                    if (isCorrect) {
                      btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200';
                    } else if (isSelected) {
                      btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectQuizOption(idx)}
                      disabled={selectedQuizOption !== null}
                      className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {selectedQuizOption !== null && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      )}
                      {selectedQuizOption !== null && isSelected && !isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {selectedQuizOption !== null && (
                <div className="p-3 rounded-xl bg-[#F7FAFC] dark:bg-[#0E1A27] border border-[#E1E8EF] dark:border-[#1E344D] text-xs space-y-1">
                  <span className="font-bold text-[#12304A] dark:text-white">Scientific Rationale:</span>
                  <p className="text-[#68778A] dark:text-slate-300">
                    {QUIZ_QUESTIONS[currentQuizIndex].explanation}
                  </p>
                  <button
                    onClick={handleNextQuizQuestion}
                    className="mt-2 px-4 py-1.5 rounded-lg bg-[#16A6A1] text-white text-xs font-semibold hover:bg-[#118480]"
                  >
                    {currentQuizIndex + 1 < QUIZ_QUESTIONS.length ? 'Next Question →' : 'View Results'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="py-6 text-center space-y-3">
              <h4 className="text-base font-bold text-[#12304A] dark:text-white">
                Knowledge Check Completed!
              </h4>
              <p className="text-xs text-[#68778A]">
                You scored {quizScore} out of {QUIZ_QUESTIONS.length} ({Math.round((quizScore / QUIZ_QUESTIONS.length) * 100)}%).
              </p>
              <button
                onClick={handleResetQuiz}
                className="px-4 py-2 rounded-xl bg-[#16A6A1] text-white text-xs font-semibold hover:bg-[#118480]"
              >
                Retake Quiz
              </button>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* SEARCH AND CATEGORY FILTERS */}
      {/* ======================================================== */}
      <div className="space-y-3">
        {/* Search bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#68778A]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search CRISPR, Cas9, guide RNA, plasmids, DNA repair, oncogenes…"
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#112234] border border-[#E1E8EF] dark:border-[#1E344D] rounded-xl text-xs text-[#243447] dark:text-white placeholder-[#68778A] focus:outline-none focus:ring-2 focus:ring-[#16A6A1]/40 shadow-2xs"
          />
        </div>

        {/* Category filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#12304A] text-white dark:bg-[#16A6A1] shadow-2xs'
                  : 'bg-white dark:bg-[#112234] border border-[#E1E8EF] dark:border-[#1E344D] text-[#68778A] dark:text-[#94A3B8] hover:text-[#12304A] dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* REFERENCE CARDS GRID */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTopics.map((topic) => {
          const isSaved = savedTopicIds.has(topic.id);
          return (
            <div
              key={topic.id}
              className="bg-white dark:bg-[#112234] border border-[#E1E8EF] dark:border-[#1E344D] rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header with Title and Bookmark */}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold text-[#12304A] dark:text-white">
                    {topic.title}
                  </h3>
                  <button
                    onClick={() => onToggleBookmark(topic.id)}
                    aria-label={isSaved ? `Remove bookmark for ${topic.title}` : `Bookmark ${topic.title}`}
                    className="p-1 rounded-lg text-[#68778A] hover:text-[#16A6A1] transition-colors flex-shrink-0"
                  >
                    {isSaved ? (
                      <BookmarkCheck className="w-4 h-4 text-[#16A6A1]" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Single sentence definition */}
                <p className="text-xs text-[#68778A] dark:text-[#94A3B8] line-clamp-2 leading-relaxed">
                  {topic.shortDefinition}
                </p>

                {/* Metadata discipline: clean unboxed text */}
                <div className="flex items-center gap-2 text-[11px] text-[#68778A] font-medium pt-1">
                  <span className="text-[#16A6A1] dark:text-[#20C2BC]">{topic.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{topic.difficulty}</span>
                </div>
              </div>

              {/* Read More button */}
              <button
                onClick={() => onSelectTopic(topic)}
                className="mt-4 w-full py-2 px-3 rounded-xl bg-[#F7FAFC] hover:bg-[#E1E8EF] dark:bg-[#0E1A27] dark:hover:bg-[#1A2E44] text-[#12304A] dark:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Read More</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {filteredTopics.length === 0 && (
        <div className="py-12 text-center bg-white dark:bg-[#112234] border border-[#E1E8EF] dark:border-[#1E344D] rounded-2xl p-6">
          <p className="text-sm font-semibold text-[#12304A] dark:text-white">
            No matching reference topics found.
          </p>
          <p className="text-xs text-[#68778A] mt-1">
            Try adjusting your search query or reset the category filter.
          </p>
        </div>
      )}

      {/* ======================================================== */}
      {/* DETAILED TOPIC VIEW MODAL / DRAWER */}
      {/* ======================================================== */}
      {selectedTopic && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white dark:bg-[#112234] border border-[#E1E8EF] dark:border-[#1E344D] rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-[#E1E8EF] dark:border-[#1E344D] flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[11px] text-[#16A6A1] font-semibold">
                  <span>{selectedTopic.category}</span>
                  <span>·</span>
                  <span>{selectedTopic.difficulty} Level</span>
                </div>
                <h3 className="text-lg font-bold text-[#12304A] dark:text-white">
                  {selectedTopic.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleBookmark(selectedTopic.id)}
                  className="p-1.5 rounded-lg border border-[#E1E8EF] dark:border-[#1E344D] text-[#68778A] hover:text-[#16A6A1]"
                  title="Bookmark"
                >
                  {savedTopicIds.has(selectedTopic.id) ? (
                    <BookmarkCheck className="w-4 h-4 text-[#16A6A1]" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => onSelectTopic(null)}
                  className="p-1.5 rounded-lg text-[#68778A] hover:text-[#12304A] dark:hover:text-white hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 p-5 overflow-y-auto space-y-5 text-xs">
              {/* Definition */}
              <div>
                <h4 className="font-bold text-[#12304A] dark:text-white text-xs uppercase tracking-wider mb-1.5">
                  Definition & Overview
                </h4>
                <p className="text-[#243447] dark:text-slate-300 leading-relaxed text-xs">
                  {selectedTopic.definition}
                </p>
              </div>

              {/* Core Mechanism */}
              <div className="p-3.5 rounded-xl bg-[#F7FAFC] dark:bg-[#0E1A27] border border-[#E1E8EF] dark:border-[#1E344D] space-y-1.5">
                <h4 className="font-bold text-[#12304A] dark:text-white text-xs uppercase tracking-wider">
                  Core Biological Mechanism
                </h4>
                <p className="text-[#243447] dark:text-slate-300 leading-relaxed text-xs">
                  {selectedTopic.coreMechanism}
                </p>
              </div>

              {/* Molecular Components */}
              <div>
                <h4 className="font-bold text-[#12304A] dark:text-white text-xs uppercase tracking-wider mb-1.5">
                  Key Molecular Components
                </h4>
                <ul className="list-disc pl-4 space-y-1 text-[#243447] dark:text-slate-300">
                  {selectedTopic.molecularComponents.map((comp, idx) => (
                    <li key={idx}>{comp}</li>
                  ))}
                </ul>
              </div>

              {/* Scientific Significance */}
              <div>
                <h4 className="font-bold text-[#12304A] dark:text-white text-xs uppercase tracking-wider mb-1.5">
                  Scientific Significance & Applications
                </h4>
                <p className="text-[#243447] dark:text-slate-300 leading-relaxed">
                  {selectedTopic.scientificSignificance}
                </p>
              </div>

              {/* Common Terminology */}
              <div>
                <h4 className="font-bold text-[#12304A] dark:text-white text-xs uppercase tracking-wider mb-1.5">
                  Common Terminology
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedTopic.commonTerminology.map((term, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#16273B] border border-[#E1E8EF] dark:border-[#1E344D]"
                    >
                      <span className="font-bold text-[#12304A] dark:text-white font-mono">
                        {term.term}:
                      </span>{' '}
                      <span className="text-[#68778A] dark:text-slate-300">
                        {term.definition}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Educational Examples */}
              <div>
                <h4 className="font-bold text-[#12304A] dark:text-white text-xs uppercase tracking-wider mb-1.5">
                  Educational Laboratory Example
                </h4>
                <p className="text-[#243447] dark:text-slate-300 leading-relaxed">
                  {selectedTopic.educationalExamples}
                </p>
              </div>

              {/* Limitations & Misconceptions */}
              <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-1.5">
                <h4 className="font-bold text-amber-900 dark:text-amber-300 text-xs flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                  <span>Limitations, Misconceptions & Biosafety</span>
                </h4>
                <ul className="list-disc pl-4 space-y-1 text-amber-900 dark:text-amber-200/90 text-[11px]">
                  {selectedTopic.limitationsAndMisconceptions.map((lim, idx) => (
                    <li key={idx}>{lim}</li>
                  ))}
                </ul>
              </div>

              {/* Suggested Questions for AI */}
              <div className="p-3.5 rounded-xl bg-teal-50/60 dark:bg-teal-950/20 border border-[#16A6A1]/30 space-y-2">
                <span className="font-bold text-[#12304A] dark:text-white text-xs flex items-center gap-1.5">
                  <BotMessageSquare className="w-3.5 h-3.5 text-[#16A6A1]" />
                  <span>Ask BioAssist AI about this topic</span>
                </span>
                <div className="space-y-1.5">
                  {selectedTopic.suggestedAiQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        onSelectTopic(null);
                        onNavigate('chat', { prompt: q });
                      }}
                      className="w-full text-left p-2 rounded-lg bg-white dark:bg-[#112234] border border-[#E1E8EF] dark:border-[#1E344D] text-[#12304A] dark:text-slate-200 hover:text-[#16A6A1] hover:border-[#16A6A1] text-xs transition-colors flex items-center justify-between"
                    >
                      <span>"{q}"</span>
                      <ArrowRight className="w-3 h-3 text-[#16A6A1] flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Verified Sources */}
              <div className="pt-2 border-t border-[#E1E8EF] dark:border-[#1E344D] space-y-1">
                <span className="text-[10px] text-[#68778A] font-semibold uppercase tracking-wider">
                  Traceable Scientific Literature & Sources
                </span>
                {selectedTopic.sources.map((src, idx) => (
                  <p key={idx} className="text-[11px] text-[#68778A] italic">
                    • {src.title} ({src.source}, {src.year}){src.doi ? ` · DOI: ${src.doi}` : ''}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
