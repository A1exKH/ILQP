import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import type { Deck, AttemptResponse } from '../types';

export default function QuizTaker() {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();

  const [deck, setDeck] = useState<Deck | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Quiz interactive state
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  
  // Submission result state
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [result, setResult] = useState<AttemptResponse | null>(null);

  // 1. Fetch Deck Data on Mount
  useEffect(() => {
    async function fetchDeckDetails() {
      try {
        const response = await API.get<Deck>(`/decks/${deckId}`);
        setDeck(response.data);
        // Initialize answer array with -1 (unanswered)
        setSelectedAnswers(new Array(response.data.questions.length).fill(-1));
        setStartTime(Date.now());
      } catch (err: any) {
        setError('Failed to load quiz deck. Please check your backend connection.');
      } finally {
        setLoading(false);
      }
    }
    fetchDeckDetails();
  }, [deckId]);

  // Handle option selection
  const handleSelectOption = (optionIndex: number) => {
    const updated = [...selectedAnswers];
    updated[currentIndex] = optionIndex;
    setSelectedAnswers(updated);
  };

  // Handle navigation
  const handleNext = () => {
    if (deck && currentIndex < deck.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Handle Quiz Submission
  const handleSubmitQuiz = async () => {
    if (!deck) return;
    const completionTimeMs = Date.now() - startTime;
    setSubmitting(true);

    try {
      const payload = {
        deckId: deck.id,
        userId: 'guest_user', // Replace with auth user ID later if needed
        answers: selectedAnswers,
        completionTimeMs: completionTimeMs,
      };

      const response = await API.post<AttemptResponse>('/attempts', payload);
      setResult(response.data);
    } catch (err: any) {
      alert('Error submitting quiz attempt. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !deck) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-6">
        <h2 className="text-xl font-bold text-red-400 mb-2">Error</h2>
        <p className="text-slate-400 mb-4">{error || 'Deck not found'}</p>
        <button 
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition"
        >
          Return Home
        </button>
      </div>
    );
  }

  // ==========================================
  // RENDER RESULTS SCREEN UPON SUBMISSION
  // ==========================================
  if (result) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-500/10 text-indigo-400 rounded-full mb-4 text-2xl font-bold">
            {result.percentage}%
          </div>
          <h2 className="text-2xl font-bold mb-1">Quiz Completed!</h2>
          <p className="text-slate-400 text-sm mb-6">Here is how you performed on <span className="text-white font-medium">{deck.title}</span></p>
          
          <div className="space-y-3 bg-slate-950/50 rounded-xl p-4 mb-6 text-left border border-slate-800/60">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Score:</span>
              <span className="font-semibold text-emerald-400">{result.score} / {result.totalQuestions}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Accuracy:</span>
              <span className="font-semibold">{result.percentage}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Time Taken:</span>
              <span className="font-semibold">{(result.completionTimeMs / 1000).toFixed(1)}s</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate('/')}
              className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 font-medium rounded-xl transition text-sm"
            >
              Back to Decks
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 font-medium rounded-xl transition text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = deck.questions[currentIndex];
  const progressPercent = ((currentIndex + 1) / deck.questions.length) * 100;

  // ==========================================
  // RENDER ACTIVE QUIZ QUESTION SCREEN
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center py-10 px-4">
      <div className="max-w-2xl w-full">
        {/* Header & Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs uppercase tracking-wider text-indigo-400 font-semibold">{deck.category} • {deck.difficulty}</span>
            <span className="text-xs text-slate-400 font-medium">Question {currentIndex + 1} of {deck.questions.length}</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl mb-6">
          <h2 className="text-xl font-semibold mb-6 text-slate-100 leading-snug">
            {currentQ.prompt}
          </h2>

          <div className="space-y-3">
            {currentQ.options.map((option, optIdx) => {
              const isSelected = selectedAnswers[currentIndex] === optIdx;
              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full text-left p-4 rounded-xl border transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500 text-white'
                      : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <span className="text-sm font-medium">{option}</span>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'border-indigo-400 bg-indigo-500' : 'border-slate-700'}`}>
                    {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-sm font-medium rounded-xl transition"
          >
            Previous
          </button>

          {currentIndex < deck.questions.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-sm font-medium rounded-xl transition shadow-lg shadow-indigo-600/20"
            >
              Next Question
            </button>
          ) : (
            <button
              onClick={handleSubmitQuiz}
              disabled={submitting}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-sm font-medium rounded-xl transition shadow-lg shadow-emerald-600/20 flex items-center gap-2"
            >
              {submitting ? 'Grading Quiz...' : 'Submit Quiz'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}