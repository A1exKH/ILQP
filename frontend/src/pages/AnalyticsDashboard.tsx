import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import type { DashboardResponse } from '../types';

export default function AnalyticsDashboard() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard analytics on mount
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await API.get<DashboardResponse>('/analytics/dashboard', {
          params: { userId: 'guest_user' }, // Adjust userId as auth expands
        });
        setDashboard(response.data);
      } catch (err: any) {
        setError('Failed to load analytics dashboard. Please check your backend connection.');
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-6">
        <h2 className="text-xl font-bold text-red-400 mb-2">Error</h2>
        <p className="text-slate-400 mb-4">{error || 'No analytics data available'}</p>
        <button 
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition"
        >
          Return Home
        </button>
      </div>
    );
  }

  // Format time helper (seconds -> minutes & seconds)
  const formatTime = (totalSeconds: number) => {
    if (totalSeconds < 60) return `${totalSeconds.toFixed(0)}s`;
    const mins = Math.floor(totalSeconds / 60);
    const secs = (totalSeconds % 60).toFixed(0);
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Top Header & Navigation */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Learning Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">Track your progress, scores, and category mastery over time.</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sm font-medium rounded-xl transition"
          >
            Back to Decks
          </button>
        </div>

        {/* 3 Summary Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          
          {/* Card 1: Total Quizzes */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Total Quizzes Taken</span>
            <div className="text-3xl font-extrabold text-indigo-400 mt-2">
              {dashboard.totalQuizzesTaken}
            </div>
            <p className="text-xs text-slate-500 mt-1">Completed across all decks</p>
          </div>

          {/* Card 2: Average Score */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Average Score</span>
            <div className="text-3xl font-extrabold text-emerald-400 mt-2">
              {dashboard.averageScore}%
            </div>
            <p className="text-xs text-slate-500 mt-1">Overall accuracy rate</p>
          </div>

          {/* Card 3: Total Time Spent */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Time Invested</span>
            <div className="text-3xl font-extrabold text-sky-400 mt-2">
              {formatTime(dashboard.totalTimeSpentSeconds)}
            </div>
            <p className="text-xs text-slate-500 mt-1">Total active quiz time</p>
          </div>

        </div>

        {/* Category Mastery Breakdown Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
          <h2 className="text-xl font-bold mb-6">Category Mastery Breakdown</h2>

          {dashboard.categoryMastery.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              <p>No quiz attempts recorded yet. Take a quiz to see your mastery breakdown!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {dashboard.categoryMastery.map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold capitalize text-slate-200">{item.category}</span>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span>{item.quizzesTaken} {item.quizzesTaken === 1 ? 'quiz' : 'quizzes'} taken</span>
                      <span className="font-bold text-indigo-400">{item.averagePercentage}% avg</span>
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full transition-all duration-500 rounded-full"
                      style={{ width: `${Math.min(item.averagePercentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}