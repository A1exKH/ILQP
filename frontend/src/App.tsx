import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import QuizTaker from './pages/QuizTaker';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import DeckCreate from './pages/DeckCreate';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<DeckCreate />} />
        <Route path="/quiz/:deckId" element={<QuizTaker />} />
        <Route path="/dashboard" element={<AnalyticsDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}