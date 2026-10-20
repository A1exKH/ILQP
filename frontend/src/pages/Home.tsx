import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import type { Deck } from '../types';

export default function Home() {
  const navigate = useNavigate();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDecks() {
      try {
        const response = await API.get<Deck[]>('/decks');
        setDecks(response.data);
      } catch (err: any) {
        setError('Failed to load quiz decks. Please verify your FastAPI backend is running.');
      } finally {
        setLoading(false);
      }
    }
    fetchDecks();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header & Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
              Interactive Learning & Quiz Platform
            </h1>
            <p className="text-slate-400 text-sm mt-1">Select a deck below to start a quiz, or manage your learning activity.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-sm font-medium rounded-xl transition shadow-lg"
            >
              📊 View Dashboard
            </button>
            <button
              onClick={() => navigate('/create')}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-sm font-medium rounded-xl transition shadow-lg shadow-indigo-600/20"
            >
              + Create New Deck
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Decks Grid */}
        {decks.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 border border-slate-800/80 rounded-2xl">
            <h3 className="text-lg font-medium text-slate-300 mb-2">No quiz decks found</h3>
            <p className="text-slate-500 text-sm mb-6">Get started by seeding your database or creating your first custom deck!</p>
            <button
              onClick={() => navigate('/create')}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-sm font-medium rounded-xl transition"
            >
              Create Deck
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {decks.map((deck) => (
              <div 
                key={deck.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition shadow-xl group"
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-semibold rounded-full uppercase tracking-wider">
                      {deck.category}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {deck.difficulty}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-100 group-hover:text-indigo-300 transition mb-2">
                    {deck.title}
                  </h3>
                  
                  <p className="text-slate-400 text-sm line-clamp-2 mb-6">
                    {deck.description || 'No description provided.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    {deck.questions.length} {deck.questions.length === 1 ? 'Question' : 'Questions'}
                  </span>
                  <button
                    onClick={() => navigate(`/quiz/${deck.id}`)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold rounded-lg transition shadow-md shadow-indigo-600/20"
                  >
                    Start Quiz →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}