import React, { useState, useEffect } from 'react';
import { Timer, CheckCircle2, XCircle, AlertTriangle, Trophy, ArrowRight, RotateCcw, X, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DrillQuestion, DrillRecord, InventoryItem } from '../../types';
import { generateFireDrillQuestions } from '../../utils/sampleData';
import { recordDrillResult } from '../../utils/storage';

interface FireDrillModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: InventoryItem[];
  onDrillComplete: (record: DrillRecord) => void;
  userId?: string;
}

export const FireDrillModal: React.FC<FireDrillModalProps> = ({
  isOpen,
  onClose,
  items,
  onDrillComplete,
  userId,
}) => {
  if (!isOpen) return null;

  const [questions, setQuestions] = useState<DrillQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [scoreCount, setScoreCount] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(45);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());

  // Initialize drill questions on open
  useEffect(() => {
    const generated = generateFireDrillQuestions(items);
    setQuestions(generated);
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setScoreCount(0);
    setSecondsRemaining(45);
    setIsFinished(false);
    setStartTime(Date.now());
  }, [items, isOpen]);

  // Countdown timer
  useEffect(() => {
    if (isFinished || secondsRemaining <= 0) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishDrill();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isFinished, secondsRemaining]);

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null) return; // Prevent changing after selection
    setSelectedOption(idx);
    setShowExplanation(true);

    const currentQ = questions[currentIndex];
    if (idx === currentQ.correctOptionIndex) {
      setScoreCount((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      finishDrill();
    }
  };

  const finishDrill = () => {
    setIsFinished(true);
    const durationSec = Math.round((Date.now() - startTime) / 1000);
    const totalQ = questions.length || 1;
    const finalScore = Math.round((scoreCount / totalQ) * 100);

    const record: DrillRecord = {
      id: `drill-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      totalQuestions: totalQ,
      correctAnswers: scoreCount,
      score: finalScore,
      durationSec,
      accuracyPercent: finalScore,
    };

    recordDrillResult(record, userId);
    onDrillComplete(record);

    // Confetti effect if high score
    if (finalScore >= 60) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const currentQ = questions[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-md animate-in fade-in duration-200">
      <div
        style={{
          background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(254, 250, 244, 0.94) 100%)',
          boxShadow: '0 25px 60px -15px rgba(245, 158, 11, 0.25), 0 35px 70px -20px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.95)',
        }}
        className="rounded-[36px] w-full max-w-2xl border-2 border-white p-6 sm:p-8 relative overflow-hidden text-[#1e293b] shadow-2xl"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#ebdccb]/70 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#fee2e2] to-[#ffedd5] text-[#e11d48] flex items-center justify-center border border-[#fecdd3] shadow-xs">
              <Timer className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-display font-black text-xl text-[#1e293b]">Family Fire Drill</h3>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#fef3c7] text-[#b45309] border border-[#fde68a]">
                  Live Drill
                </span>
              </div>
              <p className="text-xs text-[#64748b] font-medium">Timed Rehearsal from Unlocked Inventory</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Live Countdown Badge */}
            {!isFinished && (
              <div
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-black flex items-center space-x-1.5 border shadow-xs ${
                  secondsRemaining < 15
                    ? 'bg-[#fee2e2] text-[#be123c] border-[#fca5a5] animate-pulse'
                    : 'bg-[#f8f4ed] text-[#475569] border-[#e2d7c7]'
                }`}
              >
                <span>⏳ {secondsRemaining}s</span>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#94a3b8] hover:text-[#1e293b] hover:bg-[#f1ebe1] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {!isFinished && currentQ ? (
          /* Question View */
          <div>
            {/* Progress Header */}
            <div className="flex items-center justify-between text-xs mb-3">
              <span className="font-mono font-bold text-[#b45309] px-2.5 py-1 rounded-full bg-[#fef3c7] border border-[#fde68a]">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="text-[#64748b] font-semibold">Category: {currentQ.relatedCategory}</span>
            </div>

            {/* Question Prompt */}
            <h4 className="font-display font-black text-lg sm:text-xl text-[#1e293b] mb-6 leading-snug">
              {currentQ.prompt}
            </h4>

            {/* Options List */}
            <div className="space-y-3 mb-6">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.correctOptionIndex;

                let btnStyle = 'bg-white/90 border-[#e2d7c7] hover:border-[#f59e0b] hover:bg-white text-[#1e293b] shadow-xs';
                if (showExplanation) {
                  if (isCorrect) {
                    btnStyle = 'bg-[#dcfce7] border-[#86efac] text-[#15803d] font-bold ring-2 ring-[#16a34a]/30';
                  } else if (isSelected) {
                    btnStyle = 'bg-[#ffe4e6] border-[#fda4af] text-[#be123c] font-bold';
                  } else {
                    btnStyle = 'bg-[#f8f4ed]/60 border-[#e2d7c7] text-[#94a3b8] opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    disabled={showExplanation}
                    className={`w-full p-4 rounded-2xl border-2 text-left text-sm font-semibold transition flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {showExplanation && isCorrect && <CheckCircle2 className="w-4 h-4 text-[#16a34a] flex-shrink-0 ml-2" />}
                    {showExplanation && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-[#e11d48] flex-shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation & Next */}
            {showExplanation && (
              <div className="p-4 rounded-2xl bg-[#f8f4ed] border border-[#e2d7c7] mb-6 space-y-2 animate-in fade-in duration-150">
                <div className="flex items-center space-x-1.5 text-xs font-black uppercase tracking-wider text-[#0284c7]">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Verified from Family Inventory:</span>
                </div>
                <p className="text-xs text-[#475569] font-medium leading-relaxed">{currentQ.explanation}</p>
              </div>
            )}

            {showExplanation && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="px-7 py-3 rounded-full bg-gradient-to-r from-[#f59e0b] via-[#ea580c] to-[#d97706] hover:brightness-105 active:scale-[0.99] text-white font-extrabold text-xs flex items-center space-x-2 transition shadow-[0_10px_25px_rgba(234,88,12,0.38)]"
                >
                  <span>{currentIndex + 1 < questions.length ? 'Next Question' : 'View Results'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Finished Screen with Score */
          <div className="text-center py-6">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#fef3c7] to-[#fed7aa] text-[#ea580c] flex items-center justify-center mx-auto mb-4 border-2 border-white shadow-[0_15px_30px_rgba(234,88,12,0.25)]">
              <Trophy className="w-10 h-10 text-[#ea580c]" />
            </div>

            <span className="text-xs font-black uppercase tracking-wider text-[#b45309] px-3 py-1 rounded-full bg-[#fef3c7] border border-[#fde68a] mb-2 inline-block">
              Fire Drill Completed
            </span>

            <h3 className="font-display font-black text-3xl sm:text-4xl text-[#1e293b] mb-2">
              {Math.round((scoreCount / (questions.length || 1)) * 100)}% Drill Accuracy
            </h3>

            <p className="text-xs sm:text-sm text-[#64748b] font-medium max-w-md mx-auto mb-6 leading-relaxed">
              Your family guardian answered <strong className="text-[#15803d] font-bold">{scoreCount} of {questions.length}</strong> questions correctly in {45 - secondsRemaining} seconds.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setQuestions(generateFireDrillQuestions(items));
                  setCurrentIndex(0);
                  setSelectedOption(null);
                  setShowExplanation(false);
                  setScoreCount(0);
                  setSecondsRemaining(45);
                  setIsFinished(false);
                  setStartTime(Date.now());
                }}
                className="px-6 py-3 rounded-full bg-[#f1ebe1] hover:bg-[#e7decb] text-[#475569] text-xs font-bold flex items-center space-x-2 border border-[#dfd4c4] transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Drill</span>
              </button>

              <button
                onClick={onClose}
                className="px-7 py-3 rounded-full bg-gradient-to-r from-[#f59e0b] via-[#ea580c] to-[#d97706] hover:brightness-105 active:scale-[0.99] text-white text-xs font-extrabold flex items-center space-x-2 transition shadow-[0_10px_25px_rgba(234,88,12,0.38)]"
              >
                <span>View Full Readiness Score</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
