import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import type { Question, DeckCreatePayload } from '../types';

export default function DeckCreate() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [tagsInput, setTagsInput] = useState('');

  // Questions dynamic state
  const [questions, setQuestions] = useState<Question[]>([
    { prompt: '', options: ['', ''], correctOptionIndex: 0, explanation: '' }
  ]);

  const [submitting, setSubmitting] = useState(false);

  // Add a new question block
  const handleAddQuestion = () => {
    setQuestions([...questions, { prompt: '', options: ['', ''], correctOptionIndex: 0, explanation: '' }]);
  };

  // Remove a question block
  const handleRemoveQuestion = (qIndex: number) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter((_, idx) => idx !== qIndex));
  };

  // Update question field
  const handleQuestionChange = (qIndex: number, field: keyof Question, value: any) => {
    const updated = [...questions];
    updated[qIndex] = { ...updated[qIndex], [field]: value };
    setQuestions(updated);
  };

  // Update option text inside a specific question
  const handleOptionChange = (qIndex: number, optIndex: number, text: string) => {
    const updated = [...questions];
    const newOptions = [...updated[qIndex].options];
    newOptions[optIndex] = text;
    updated[qIndex].options = newOptions;
    setQuestions(updated);
  };

  const handleAddOption = (qIndex: number) => {
    const updated = [...questions];
    if (updated[qIndex].options.length < 5) {
      updated[qIndex].options.push('');
      setQuestions(updated);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !category || questions.length === 0) {
      alert('Please fill out the title, category, and at least one question.');
      return;
    }

    setSubmitting(true);
    try {
      const payload: DeckCreatePayload = {
        title,
        description,
        category: category.toLowerCase().trim(),
        difficulty,
        tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
        questions
      };

      await API.post('/decks', payload);
      alert('Quiz deck created successfully!');
      navigate('/');
    } catch (err: any) {
      alert('Error creating deck. Check console or backend logs.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Create New Quiz Deck</h1>
            <p className="text-slate-400 text-sm mt-1">Design custom questions and options for your learning platform.</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sm font-medium rounded-xl transition"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Deck Metadata Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
            <h2 className="text-lg font-semibold text-indigo-400">1. Deck Metadata</h2>
            
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Deck Title</label>
              <input 
                type="text" 
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Advanced TypeScript & Generics"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Category</label>
                <input 
                  type="text" 
                  required
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  placeholder="e.g. typescript"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={e => setDifficulty(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Description</label>
              <textarea 
                rows={2}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Briefly describe what this quiz covers..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Tags (Comma-separated)</label>
              <input 
                type="text" 
                value={tagsInput}
                onChange={e => setTagsInput(e.target.value)}
                placeholder="react, frontend, hooks"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Questions Builder Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">2. Questions ({questions.length})</h2>
              <button
                type="button"
                onClick={handleAddQuestion}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl transition"
              >
                + Add Another Question
              </button>
            </div>

            {questions.map((q, qIndex) => (
              <div key={qIndex} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4 relative">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-indigo-400 uppercase">Question #{qIndex + 1}</span>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(qIndex)}
                      className="text-xs text-red-400 hover:text-red-300 transition"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Prompt</label>
                  <input
                    type="text"
                    required
                    value={q.prompt}
                    onChange={e => handleQuestionChange(qIndex, 'prompt', e.target.value)}
                    placeholder="Enter question prompt..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Options */}
                <div className="space-y-2">
                  <label className="block text-xs text-slate-400">Options (Select the correct radio index)</label>
                  {q.options.map((opt, optIndex) => (
                    <div key={optIndex} className="flex items-center gap-3">
                      <input
                        type="radio"
                        name={`correct-${qIndex}`}
                        checked={q.correctOptionIndex === optIndex}
                        onChange={() => handleQuestionChange(qIndex, 'correctOptionIndex', optIndex)}
                        title="Mark as correct answer"
                        className="w-4 h-4 text-indigo-600 bg-slate-950 border-slate-800 focus:ring-indigo-500"
                      />
                      <input
                        type="text"
                        required
                        value={opt}
                        onChange={e => handleOptionChange(qIndex, optIndex, e.target.value)}
                        placeholder={`Option ${optIndex + 1}`}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  ))}
                  {q.options.length < 5 && (
                    <button
                      type="button"
                      onClick={() => handleAddOption(qIndex)}
                      className="text-xs text-indigo-400 hover:text-indigo-300 mt-1 block"
                    >
                      + Add Option
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Explanation (Optional)</label>
                  <input
                    type="text"
                    value={q.explanation || ''}
                    onChange={e => handleQuestionChange(qIndex, 'explanation', e.target.value)}
                    placeholder="Why is this answer correct?"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-sm font-semibold rounded-2xl transition shadow-xl shadow-indigo-600/20"
          >
            {submitting ? 'Publishing Deck...' : 'Publish Quiz Deck'}
          </button>

        </form>
      </div>
    </div>
  );
}